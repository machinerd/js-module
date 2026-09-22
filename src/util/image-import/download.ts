import { lookup } from 'node:dns/promises';
import { get as httpGet } from 'node:http';
import { get as httpsGet } from 'node:https';
import { BlockList, isIP, type LookupFunction } from 'node:net';
import { MAX_PASTED_IMAGE_BYTES, getImageFormat } from '../editor-image';
import {
  IMAGE_DOWNLOAD_BLOCKED_IPV4,
  IMAGE_DOWNLOAD_BLOCKED_IPV6,
  IMAGE_DOWNLOAD_PUBLIC_IPV6,
} from './network-ranges';

const blocked = new BlockList();
for (const [address, prefix] of IMAGE_DOWNLOAD_BLOCKED_IPV4) {
  blocked.addSubnet(address, prefix, 'ipv4');
}
for (const [address, prefix] of IMAGE_DOWNLOAD_BLOCKED_IPV6) {
  blocked.addSubnet(address, prefix, 'ipv6');
}

const globalIPv6 = new BlockList();
for (const [address, prefix] of IMAGE_DOWNLOAD_PUBLIC_IPV6) {
  globalIPv6.addSubnet(address, prefix, 'ipv6');
}

function isPublicAddress(address: string) {
  const family = isIP(address);

  if (family === 4) return !blocked.check(address, 'ipv4');

  return (
    family === 6 &&
    globalIPv6.check(address, 'ipv6') &&
    !blocked.check(address, 'ipv6')
  );
}

function validateURL(value: string) {
  const url = new URL(value);
  const hostname = url.hostname.replace(/^\[|\]$/g, '');

  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    (isIP(hostname) && !isPublicAddress(hostname))
  ) {
    throw new Error('This image URL is not allowed.');
  }

  return url;
}

const publicLookup: LookupFunction = (hostname, options, callback) => {
  lookup(hostname, { all: true }).then(
    (addresses) => {
      if (
        !addresses.length ||
        addresses.some(({ address }) => !isPublicAddress(address))
      ) {
        callback(new Error('This image URL is not allowed.'), '');
        return;
      }

      if (options.all) callback(null, addresses);
      else callback(null, addresses[0].address, addresses[0].family);
    },
    () =>
      callback(new Error('Unable to resolve the image server address.'), ''),
  );
};

type Download =
  { bytes: Buffer; redirect?: never } | { redirect: string; bytes?: never };

function download(url: URL, signal: AbortSignal): Promise<Download> {
  return new Promise((resolve, reject) => {
    const get = url.protocol === 'https:' ? httpsGet : httpGet;
    const request = get(
      url,
      {
        agent: false,
        signal,
        lookup: publicLookup,
        maxHeaderSize: 16 * 1024,
        headers: {
          Accept: 'image/png,image/jpeg,image/gif,image/webp',
          'Accept-Encoding': 'identity',
          'User-Agent': 'Komachine-Editor-Image-Import/1.0',
        },
      },
      (response) => {
        response.on('error', reject);
        const status = response.statusCode ?? 0;

        if (
          [301, 302, 303, 307, 308].includes(status) &&
          response.headers.location
        ) {
          resolve({ redirect: response.headers.location });
          response.destroy();
          return;
        }

        if (status !== 200) {
          reject(
            new Error(
              'Unable to fetch the image from the source website. Please upload it as a file.',
            ),
          );
          response.destroy();
          return;
        }

        if (
          Number(response.headers['content-length']) > MAX_PASTED_IMAGE_BYTES
        ) {
          reject(new Error('Images must be no larger than 50 MiB.'));
          response.destroy();
          return;
        }

        const chunks: Buffer[] = [];
        let length = 0;

        response.on('data', (chunk: Buffer) => {
          length += chunk.length;

          if (length > MAX_PASTED_IMAGE_BYTES) {
            reject(new Error('Images must be no larger than 50 MiB.'));
            response.destroy();

            return;
          }

          chunks.push(chunk);
        });

        response.on('end', () => resolve({ bytes: Buffer.concat(chunks) }));
      },
    );
    request.on('error', () =>
      reject(
        new Error(
          signal.aborted
            ? 'The image download timed out or the request was canceled.'
            : 'Failed to fetch the image. Please upload it as a file.',
        ),
      ),
    );
  });
}

export async function downloadEditorImage(value: string, signal: AbortSignal) {
  let url = validateURL(value);

  for (let redirects = 0; redirects <= 3; redirects++) {
    const result = await download(url, signal);

    if (result.redirect !== undefined) {
      url = validateURL(new URL(result.redirect, url).href);
      continue;
    }

    const format = getImageFormat(result.bytes);

    if (!format) {
      throw new Error('Only PNG, JPEG, GIF, and WebP images are supported.');
    }

    return { bytes: result.bytes, ...format };
  }

  throw new Error('The image URL has too many redirects.');
}
