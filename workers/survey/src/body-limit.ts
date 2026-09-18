/** Bound request body size before/while parsing JSON (T-review fix #4). */

/** Survey intake: up to 12 answers (some multi-select) + email + Turnstile token. */
export const MAX_SUBMIT_BODY_BYTES = 32 * 1024;

export class BodyTooLargeError extends Error {
  constructor(maxBytes: number) {
    super(`Request body exceeds ${maxBytes} bytes`);
    this.name = "BodyTooLargeError";
  }
}

/**
 * Parse a request body as JSON, rejecting early on an oversized
 * Content-Length and enforcing the same cap on the actual stream so a
 * missing or understated Content-Length cannot bypass the limit.
 */
export async function readJsonWithLimit(
  request: Request,
  maxBytes: number,
): Promise<unknown> {
  const contentLength = request.headers.get("Content-Length");
  if (contentLength !== null) {
    const declared = Number(contentLength);
    if (Number.isFinite(declared) && declared > maxBytes) {
      throw new BodyTooLargeError(maxBytes);
    }
  }

  if (!request.body) {
    return undefined;
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw new BodyTooLargeError(maxBytes);
      }
      chunks.push(value);
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {
      // already released / cancelled
    }
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const text = new TextDecoder("utf-8", { fatal: false }).decode(merged);
  return JSON.parse(text) as unknown;
}
