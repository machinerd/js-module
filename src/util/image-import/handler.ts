import { downloadEditorImage } from './download';

export interface ImageImportHandlerOptions<T extends Request = Request> {
  authorize: (request: T, signal: AbortSignal) => Promise<Response | null>;
}

const error = (message: string, status: number) =>
  Response.json(
    { message },
    { status, headers: { 'Cache-Control': 'no-store' } },
  );

async function readURL(request: Request, signal: AbortSignal) {
  const reader = request.body?.getReader();

  if (!reader) throw new Error('An image URL is required.');

  const abort = () => {
    void reader.cancel().catch(() => {});
  };

  signal.addEventListener('abort', abort, { once: true });

  const chunks: Uint8Array[] = [];
  let length = 0;

  try {
    while (true) {
      signal.throwIfAborted();

      const { done, value } = await reader.read();

      if (done) break;

      length += value.byteLength;

      if (length > 16 * 1024) throw new Error('The request is too large.');

      chunks.push(value);
    }
  } finally {
    signal.removeEventListener('abort', abort);

    await reader.cancel().catch(() => {});

    reader.releaseLock();
  }

  signal.throwIfAborted();

  const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));

  if (typeof body?.url !== 'string' || !body.url || body.url.length > 8192) {
    throw new Error('A valid image URL is required.');
  }

  return body.url as string;
}

function createHandler<T extends Request = Request>(
  options: ImageImportHandlerOptions<T>,
) {
  let activeDownloads = 0;

  return async function POST(
    request: T,
    externalSignal?: AbortSignal,
  ): Promise<Response> {
    if (!request.headers.get('content-type')?.startsWith('application/json')) {
      return error('A JSON request is required.', 415);
    }

    if (request.headers.get('sec-fetch-site') === 'cross-site') {
      return error('This request is not allowed.', 403);
    }

    if (activeDownloads >= 4)
      return error(
        'Too many images are being processed. Please try again shortly.',
        429,
      );

    activeDownloads++;

    try {
      const signal = AbortSignal.any([
        request.signal,
        ...(externalSignal ? [externalSignal] : []),
        AbortSignal.timeout(25_000),
      ]);

      const denied = await options.authorize(request, signal);
      if (denied) return denied;

      const url = await readURL(request, signal);
      const image = await downloadEditorImage(url, signal);

      return new Response(new Uint8Array(image.bytes), {
        headers: {
          'Content-Type': image.type,
          'Content-Length': String(image.bytes.length),
          'Content-Disposition': `attachment; filename="pasted-image.${image.extension}"`,
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    } catch (cause) {
      return error(
        cause instanceof Error &&
          !['TypeError', 'SyntaxError', 'TimeoutError', 'AbortError'].includes(
            cause.name,
          )
          ? cause.message
          : 'Failed to fetch the image. Check the URL or your login status.',
        400,
      );
    } finally {
      activeDownloads--;
    }
  };
}

export function createImageImportHandler<T extends Request = Request>(
  options: ImageImportHandlerOptions<T>,
) {
  const handler = createHandler(options);
  return (request: T) => handler(request);
}

const importHandler = createHandler({ authorize: async () => null });

export function importEditorImage(request: Request, signal?: AbortSignal) {
  return importHandler(request, signal);
}
