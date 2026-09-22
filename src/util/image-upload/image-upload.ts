'use client';

import type { ApiClient } from '../../api-client';

import {
  getImageFormat,
  MAX_PASTED_IMAGE_BYTES,
  type UploadedImage,
  type UploadPastedImage,
} from '../editor-image';

export interface PastedImageUploaderOptions {
  api: ApiClient;
  importEndpoint?: string;
  maxWidth?: number;
}

function measureImage(file: Blob, signal: AbortSignal, maxWidth: number) {
  return new Promise<Omit<UploadedImage, 'src'>>((resolve, reject) => {
    signal.throwIfAborted();

    const image = new Image();
    const objectURL = URL.createObjectURL(file);

    const cleanup = () => {
      clearTimeout(timeout);
      signal.removeEventListener('abort', abort);
      image.onload = null;
      image.onerror = null;
      image.src = '';
      URL.revokeObjectURL(objectURL);
    };

    const fail = (message: string) => {
      cleanup();
      reject(new Error(message));
    };

    const abort = () => fail('Image upload was canceled.');

    const timeout = setTimeout(
      () => fail('Reading the image timed out.'),
      15_000,
    );

    signal.addEventListener('abort', abort, { once: true });

    image.onload = () => {
      const { naturalWidth, naturalHeight } = image;

      if (
        !naturalWidth ||
        !naturalHeight ||
        naturalWidth * naturalHeight > 40_000_000
      ) {
        fail(
          'The image is corrupted or too large. Use an image with no more than 40 million pixels.',
        );
        return;
      }

      const width = Math.min(naturalWidth, maxWidth);

      cleanup();

      resolve({
        width,
        height: Math.max(1, Math.round((width * naturalHeight) / naturalWidth)),
        originalWidth: naturalWidth,
      });
    };

    image.onerror = () => fail('Unable to read the image file.');

    image.src = objectURL;
  });
}

async function sourceToBlob(
  source: File | string,
  signal: AbortSignal,
  options: PastedImageUploaderOptions,
): Promise<Blob> {
  if (source instanceof File) return source;

  if (/^(data:|blob:)/i.test(source)) {
    if (source.length > MAX_PASTED_IMAGE_BYTES * 1.4) {
      throw new Error('Images must be no larger than 50 MiB.');
    }

    const response = await fetch(source, { signal });

    if (!response.ok)
      throw new Error('Unable to read the image file from the clipboard.');

    return response.blob();
  }

  const url = new URL(source);

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Unsupported image URL.');
  }

  const headers = new Headers();
  const token = options.api.getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');
  const response = await fetch(
    options.importEndpoint ?? '/api/editor/import-image',
    {
      method: 'POST',
      credentials: 'same-origin',
      headers,
      body: JSON.stringify({ url: url.href }),
      signal,
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new Error(body?.message || 'Failed to fetch the external image.');
  }

  return response.blob();
}

export function createPastedImageUploader(
  options: PastedImageUploaderOptions,
): UploadPastedImage {
  return async (source, signal) => {
    const blob = await sourceToBlob(source, signal, options);

    if (!blob.size || blob.size > MAX_PASTED_IMAGE_BYTES) {
      throw new Error('Images must be no larger than 50 MiB.');
    }

    const format = getImageFormat(
      new Uint8Array(await blob.slice(0, 12).arrayBuffer()),
    );

    if (!format) {
      throw new Error('Only PNG, JPEG, GIF, and WebP images are supported.');
    }

    const size = await measureImage(blob, signal, options.maxWidth ?? 829);
    const file = new File([blob], `pasted-image.${format.extension}`, {
      type: format.type,
    });
    const key = `${crypto.randomUUID()}.${format.extension}`;

    signal.throwIfAborted();

    const response = await options.api.media.getUploadPresignURL(
      {
        contentType: file.type,
        length: file.size,
        key,
      },
      signal,
    );

    if (!response.ok) {
      throw new Error(
        'Failed to obtain an upload URL. Check your login status.',
      );
    }

    const uploadURL: unknown = await response.json();

    if (typeof uploadURL !== 'string') {
      throw new Error('Invalid upload URL.');
    }

    signal.throwIfAborted();

    const uploaded = await fetch(uploadURL, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
      signal,
    });

    if (!uploaded.ok) {
      throw new Error(
        'Failed to upload the image to temporary storage. Please try again.',
      );
    }

    return { src: options.api.media.cdnTemp(key), ...size };
  };
}
