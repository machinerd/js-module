export const MAX_PASTED_IMAGE_BYTES = 50 * 1024 * 1024;
export const PASTED_IMAGE_TAG = 'pasted-image';
export const PASTED_IMAGE_SAVE_MESSAGE =
  'Wait for image uploads to finish before saving. Retry or delete any failed images.';

export function hasUnresolvedPastedImages(html?: string | null) {
  return /<pasted-image(?:\s|>)/i.test(html ?? '');
}

export function getImageFormat(bytes: Uint8Array) {
  const matches = (values: number[], offset = 0) =>
    values.every((value, index) => bytes[offset + index] === value);

  if (matches([137, 80, 78, 71, 13, 10, 26, 10])) {
    return { type: 'image/png', extension: 'png' };
  }
  if (matches([255, 216, 255])) {
    return { type: 'image/jpeg', extension: 'jpg' };
  }
  if (matches([71, 73, 70, 56, 55, 97]) || matches([71, 73, 70, 56, 57, 97])) {
    return { type: 'image/gif', extension: 'gif' };
  }
  if (matches([82, 73, 70, 70]) && matches([87, 69, 66, 80], 8)) {
    return { type: 'image/webp', extension: 'webp' };
  }
  return null;
}

export interface UploadedImage {
  src: string;
  width: number;
  height: number;
  originalWidth: number;
}

export type UploadPastedImage = (
  source: File | string,
  signal: AbortSignal,
) => Promise<UploadedImage>;
