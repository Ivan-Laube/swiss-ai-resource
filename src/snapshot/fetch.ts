export const FETCH_TIMEOUT_MS = 30_000;
export const FETCH_SIZE_CAP_BYTES = 5 * 1024 * 1024;
export const FETCH_DELAY_MS = 400;
export const FETCH_RETRY_DELAY_MS = 2_000;
/** Delay between EUR-Lex-style HTTP 202 soft-challenge retries. */
export const FETCH_202_RETRY_DELAY_MS = 3_000;
/** Extra attempts after the first 202 (total attempts = 1 + this). */
export const FETCH_202_MAX_EXTRA_ATTEMPTS = 2;

export const USER_AGENT =
  "SwissAI-ResourceBot/1.0 (+https://github.com/Ivan-Laube/swiss-ai-resource)";

/** Browser-like UA used only as a second attempt when the bot profile is blocked. */
export const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

export type FetchAttempt = "bot" | "browser";

export type FetchResult = {
  body: Buffer;
  httpStatus: number;
  contentType: string | null;
  finalUrl: string;
  attempt: FetchAttempt;
};

export class FetchError extends Error {
  readonly httpStatus: number | null;

  constructor(message: string, httpStatus: number | null = null) {
    super(message);
    this.name = "FetchError";
    this.httpStatus = httpStatus;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Polite delay between sequential source fetches. */
export async function delayBetweenFetches(): Promise<void> {
  await sleep(FETCH_DELAY_MS);
}

function botHeaders(): Record<string, string> {
  return {
    "User-Agent": USER_AGENT,
    Accept: "text/html,application/xhtml+xml,application/pdf,*/*;q=0.8",
  };
}

function browserHeaders(): Record<string, string> {
  return {
    "User-Agent": BROWSER_USER_AGENT,
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,application/json,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,de;q=0.8",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
  };
}

function shouldRetryWithBrowser(error: FetchError): boolean {
  if (
    error.httpStatus === 403 ||
    error.httpStatus === 202 ||
    error.httpStatus === 429
  ) {
    return true;
  }
  return error.message.startsWith("Timed out after");
}

/** Merge Set-Cookie headers into a Cookie request header value. */
export function mergeSetCookieHeaders(
  existingCookie: string | undefined,
  setCookieHeaders: string[],
): string {
  const jar = new Map<string, string>();

  if (existingCookie) {
    for (const pair of existingCookie.split(";")) {
      const trimmed = pair.trim();
      const eq = trimmed.indexOf("=");
      if (eq <= 0) {
        continue;
      }
      jar.set(trimmed.slice(0, eq), trimmed.slice(eq + 1));
    }
  }

  for (const setCookie of setCookieHeaders) {
    const first = setCookie.split(";")[0]?.trim();
    if (!first) {
      continue;
    }
    const eq = first.indexOf("=");
    if (eq <= 0) {
      continue;
    }
    jar.set(first.slice(0, eq), first.slice(eq + 1));
  }

  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

function collectSetCookies(response: Response): string[] {
  // undici/Node may expose getSetCookie(); fall back to single header.
  const headers = response.headers as Headers & {
    getSetCookie?: () => string[];
  };
  if (typeof headers.getSetCookie === "function") {
    return headers.getSetCookie();
  }
  const single = response.headers.get("set-cookie");
  return single ? [single] : [];
}

async function readCappedBody(
  response: Response,
): Promise<Buffer> {
  const contentLength = response.headers.get("content-length");
  if (contentLength !== null) {
    const declared = Number(contentLength);
    if (Number.isFinite(declared) && declared > FETCH_SIZE_CAP_BYTES) {
      throw new FetchError(
        `Response Content-Length ${declared} exceeds ${FETCH_SIZE_CAP_BYTES} byte cap`,
        response.status,
      );
    }
  }

  const arrayBuffer = await response.arrayBuffer();
  if (arrayBuffer.byteLength > FETCH_SIZE_CAP_BYTES) {
    throw new FetchError(
      `Response body ${arrayBuffer.byteLength} bytes exceeds ${FETCH_SIZE_CAP_BYTES} byte cap`,
      response.status,
    );
  }

  return Buffer.from(arrayBuffer);
}

/**
 * GET with timeout/size cap. On HTTP 202 (soft challenge), wait and retry the
 * same URL up to FETCH_202_MAX_EXTRA_ATTEMPTS times, forwarding Set-Cookie.
 */
async function fetchOnce(
  url: string,
  baseHeaders: Record<string, string>,
  attempt: FetchAttempt,
): Promise<FetchResult> {
  let cookie = baseHeaders.Cookie;
  let lastStatus: number | null = null;

  for (
    let challengeAttempt = 0;
    challengeAttempt <= FETCH_202_MAX_EXTRA_ATTEMPTS;
    challengeAttempt += 1
  ) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const headers: Record<string, string> = { ...baseHeaders };
    if (cookie) {
      headers.Cookie = cookie;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers,
      });

      lastStatus = response.status;
      const setCookies = collectSetCookies(response);
      if (setCookies.length > 0) {
        cookie = mergeSetCookieHeaders(cookie, setCookies);
      }

      if (response.status === 202) {
        if (challengeAttempt < FETCH_202_MAX_EXTRA_ATTEMPTS) {
          // Drain body so the connection can close cleanly, then retry.
          await response.arrayBuffer().catch(() => undefined);
          await sleep(FETCH_202_RETRY_DELAY_MS);
          continue;
        }
        throw new FetchError(
          `HTTP 202 Accepted after ${FETCH_202_MAX_EXTRA_ATTEMPTS + 1} attempts`,
          202,
        );
      }

      if (response.status !== 200) {
        throw new FetchError(
          `HTTP ${response.status} ${response.statusText}`,
          response.status,
        );
      }

      const body = await readCappedBody(response);
      return {
        body,
        httpStatus: response.status,
        contentType: response.headers.get("content-type"),
        finalUrl: response.url || url,
        attempt,
      };
    } catch (error) {
      if (error instanceof FetchError) {
        throw error;
      }
      if (error instanceof Error && error.name === "AbortError") {
        throw new FetchError(`Timed out after ${FETCH_TIMEOUT_MS}ms`);
      }
      const message = error instanceof Error ? error.message : String(error);
      throw new FetchError(message, lastStatus);
    } finally {
      clearTimeout(timer);
    }
  }

  throw new FetchError(
    `HTTP 202 Accepted after ${FETCH_202_MAX_EXTRA_ATTEMPTS + 1} attempts`,
    202,
  );
}

/**
 * GET a URL with timeout, redirect following, and response size cap.
 * First attempt uses the honest bot User-Agent; on 403/202/429/timeout,
 * retries once with a browser-like header profile. HTTP 202 responses are
 * retried with cookie forwarding before escalating to the browser profile.
 * Throws FetchError on non-200, timeout, or oversized body.
 */
export async function fetchSource(url: string): Promise<FetchResult> {
  try {
    return await fetchOnce(url, botHeaders(), "bot");
  } catch (error) {
    if (!(error instanceof FetchError) || !shouldRetryWithBrowser(error)) {
      throw error;
    }
    await sleep(FETCH_RETRY_DELAY_MS);
    return fetchOnce(url, browserHeaders(), "browser");
  }
}
