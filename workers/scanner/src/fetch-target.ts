/** Guarded outbound fetch for scanner targets (T34 + T35 HEAD/redirect probe). */

import {
  FETCH_TIMEOUT_MS,
  type ScanBudget,
} from "./scan-budget";
import { assertSafeScanUrl } from "./url-guard";

export { FETCH_TIMEOUT_MS } from "./scan-budget";

export const FETCH_SIZE_CAP_BYTES = 2 * 1024 * 1024;
export const MAX_REDIRECTS = 5;

const REQUEST_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (compatible; SwissAI-Scanner/1.0; +https://github.com/Ivan-Laube/swiss-ai-resource)",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "de,en;q=0.9,fr;q=0.8,it;q=0.7",
};

export type FetchTargetResult = {
  finalUrl: string;
  status: number;
  headers: Headers;
  body: string;
  byteLength: number;
  contentType: string | null;
};

export type HeadTargetResult = {
  finalUrl: string;
  status: number;
  headers: Headers;
};

export type FetchTargetErrorKind =
  | "blocked"
  | "timeout"
  | "oversized"
  | "upstream"
  | "redirects";

export class FetchTargetError extends Error {
  readonly kind: FetchTargetErrorKind;
  readonly httpStatus: number | null;

  constructor(
    kind: FetchTargetErrorKind,
    message: string,
    httpStatus: number | null = null,
  ) {
    super(message);
    this.name = "FetchTargetError";
    this.kind = kind;
    this.httpStatus = httpStatus;
  }
}

function isRedirectStatus(status: number): boolean {
  return (
    status === 301 ||
    status === 302 ||
    status === 303 ||
    status === 307 ||
    status === 308
  );
}

function isAbortError(error: unknown, signal: AbortSignal): boolean {
  return (
    (error instanceof Error && error.name === "AbortError") || signal.aborted
  );
}

function timeoutError(): FetchTargetError {
  return new FetchTargetError(
    "timeout",
    `Timed out after ${FETCH_TIMEOUT_MS}ms`,
  );
}

async function readBodyCapped(
  response: Response,
  signal: AbortSignal,
): Promise<{ body: string; byteLength: number }> {
  const contentLength = response.headers.get("Content-Length");
  if (contentLength !== null) {
    const declared = Number(contentLength);
    if (Number.isFinite(declared) && declared > FETCH_SIZE_CAP_BYTES) {
      throw new FetchTargetError(
        "oversized",
        `Response Content-Length exceeds ${FETCH_SIZE_CAP_BYTES} bytes`,
      );
    }
  }

  if (!response.body) {
    return { body: "", byteLength: 0 };
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      if (signal.aborted) {
        throw timeoutError();
      }
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      total += value.byteLength;
      if (total > FETCH_SIZE_CAP_BYTES) {
        await reader.cancel();
        throw new FetchTargetError(
          "oversized",
          `Response body exceeds ${FETCH_SIZE_CAP_BYTES} bytes`,
        );
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

  return {
    body: new TextDecoder("utf-8", { fatal: false }).decode(merged),
    byteLength: total,
  };
}

async function resolveRedirect(
  response: Response,
  current: URL,
  redirects: number,
  budget: ScanBudget,
): Promise<{ next: URL; redirects: number }> {
  const location = response.headers.get("Location");
  if (!location) {
    throw new FetchTargetError(
      "upstream",
      "Redirect response missing Location header",
      response.status,
    );
  }
  const nextCount = redirects + 1;
  if (nextCount > MAX_REDIRECTS) {
    throw new FetchTargetError(
      "redirects",
      `Too many redirects (max ${MAX_REDIRECTS})`,
    );
  }

  let next: URL;
  try {
    next = new URL(location, current);
  } catch {
    throw new FetchTargetError(
      "upstream",
      "Redirect Location is not a valid URL",
      response.status,
    );
  }

  const guarded = await assertSafeScanUrl(next.href, budget);
  if (!guarded.ok) {
    if (guarded.timedOut) {
      throw timeoutError();
    }
    throw new FetchTargetError("blocked", guarded.error);
  }
  return { next: guarded.url, redirects: nextCount };
}

async function fetchOnce(
  url: URL,
  method: "GET" | "HEAD",
  signal: AbortSignal,
  extraHeaders?: Record<string, string>,
): Promise<Response> {
  try {
    return await fetch(url.href, {
      method,
      redirect: "manual",
      headers: { ...REQUEST_HEADERS, ...extraHeaders },
      signal,
    });
  } catch (error) {
    if (isAbortError(error, signal)) {
      throw timeoutError();
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new FetchTargetError("upstream", message);
  }
}

/**
 * GET a validated URL using the scan budget signal, 2 MB body cap, and
 * SSRF-safe redirect following.
 */
export async function fetchTarget(
  startUrl: URL,
  budget: ScanBudget,
): Promise<FetchTargetResult> {
  let current = startUrl;
  let redirects = 0;

  while (true) {
    const response = await fetchOnce(current, "GET", budget.signal);

    if (isRedirectStatus(response.status)) {
      const resolved = await resolveRedirect(
        response,
        current,
        redirects,
        budget,
      );
      current = resolved.next;
      redirects = resolved.redirects;
      continue;
    }

    if (response.status < 200 || response.status >= 300) {
      throw new FetchTargetError(
        "upstream",
        `Upstream returned HTTP ${response.status}`,
        response.status,
      );
    }

    const { body, byteLength } = await readBodyCapped(
      response,
      budget.signal,
    );

    return {
      finalUrl: current.href,
      status: response.status,
      headers: response.headers,
      body,
      byteLength,
      contentType: response.headers.get("Content-Type"),
    };
  }
}

/**
 * HEAD (with GET fallback on 405/501) a validated URL. Follows redirects
 * SSRF-safely under the shared scan budget. Does not read response bodies
 * except a zero-length Range GET fallback.
 */
export async function headTarget(
  startUrl: URL,
  budget: ScanBudget,
): Promise<HeadTargetResult> {
  let current = startUrl;
  let redirects = 0;
  let useGetFallback = false;

  while (true) {
    const response = await fetchOnce(
      current,
      useGetFallback ? "GET" : "HEAD",
      budget.signal,
      useGetFallback ? { Range: "bytes=0-0" } : undefined,
    );

    // Some origins reject HEAD — fall back once to a tiny GET.
    if (
      !useGetFallback &&
      (response.status === 405 || response.status === 501)
    ) {
      useGetFallback = true;
      // Drain/cancel any body on the rejected HEAD (usually empty).
      try {
        await response.body?.cancel();
      } catch {
        // ignore
      }
      continue;
    }

    if (isRedirectStatus(response.status)) {
      const resolved = await resolveRedirect(
        response,
        current,
        redirects,
        budget,
      );
      current = resolved.next;
      redirects = resolved.redirects;
      try {
        await response.body?.cancel();
      } catch {
        // ignore
      }
      continue;
    }

    // Accept 2xx and 3xx that aren't redirect statuses we already handled;
    // also accept 206 Partial Content from Range GET fallback.
    if (response.status >= 200 && response.status < 400) {
      try {
        await response.body?.cancel();
      } catch {
        // ignore
      }
      return {
        finalUrl: current.href,
        status: response.status,
        headers: response.headers,
      };
    }

    try {
      await response.body?.cancel();
    } catch {
      // ignore
    }
    throw new FetchTargetError(
      "upstream",
      `Upstream returned HTTP ${response.status}`,
      response.status,
    );
  }
}

export type HttpRedirectProbeResult = {
  redirectsToHttps: boolean;
};

/**
 * Probe whether plain HTTP for the same host/path redirects to HTTPS.
 * Throws FetchTargetError on timeout/blocked/upstream failures.
 */
export async function probeHttpRedirectToHttps(
  httpsFinalUrl: URL,
  budget: ScanBudget,
): Promise<HttpRedirectProbeResult> {
  const httpUrl = new URL(httpsFinalUrl.href);
  httpUrl.protocol = "http:";

  const guarded = await assertSafeScanUrl(httpUrl.href, budget);
  if (!guarded.ok) {
    if (guarded.timedOut) {
      throw timeoutError();
    }
    throw new FetchTargetError("blocked", guarded.error);
  }

  let current = guarded.url;
  let redirects = 0;

  while (true) {
    if (current.protocol === "https:") {
      return { redirectsToHttps: true };
    }

    const response = await fetchOnce(current, "HEAD", budget.signal);

    if (isRedirectStatus(response.status)) {
      const resolved = await resolveRedirect(
        response,
        current,
        redirects,
        budget,
      );
      current = resolved.next;
      redirects = resolved.redirects;
      try {
        await response.body?.cancel();
      } catch {
        // ignore
      }
      if (current.protocol === "https:") {
        return { redirectsToHttps: true };
      }
      continue;
    }

    // HEAD rejected — try GET with Range for redirect Location.
    if (response.status === 405 || response.status === 501) {
      try {
        await response.body?.cancel();
      } catch {
        // ignore
      }
      const getRes = await fetchOnce(current, "GET", budget.signal, {
        Range: "bytes=0-0",
      });
      if (isRedirectStatus(getRes.status)) {
        const resolved = await resolveRedirect(
          getRes,
          current,
          redirects,
          budget,
        );
        current = resolved.next;
        redirects = resolved.redirects;
        try {
          await getRes.body?.cancel();
        } catch {
          // ignore
        }
        if (current.protocol === "https:") {
          return { redirectsToHttps: true };
        }
        continue;
      }
      try {
        await getRes.body?.cancel();
      } catch {
        // ignore
      }
      // Non-redirect response on HTTP → does not redirect to HTTPS.
      return { redirectsToHttps: false };
    }

    try {
      await response.body?.cancel();
    } catch {
      // ignore
    }

    // Got a final HTTP response without upgrading.
    if (current.protocol === "http:") {
      return { redirectsToHttps: false };
    }
    return { redirectsToHttps: current.protocol === "https:" };
  }
}
