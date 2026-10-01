import {
  BROWSER_USER_AGENT,
  FETCH_TIMEOUT_MS,
  FetchError,
  USER_AGENT,
} from "@/snapshot";

export type ProbeResult = {
  ok: boolean;
  httpStatus: number | null;
  error?: string;
  finalUrl: string;
};

const GET_FALLBACK_STATUSES = new Set([403, 404, 405, 501]);

/**
 * URLs that load in a real browser but answer 403 to automated clients (WAF / TLS
 * fingerprinting). A 403 on these is treated as reachable. Add an entry only after
 * opening the URL manually; record the date.
 */
const BOT_BLOCKED_VERIFIED: ReadonlyMap<string, string> = new Map([
  [
    "https://www.consilium.europa.eu/en/press/press-releases/2026/06/29/artificial-intelligence-council-gives-final-green-light-to-simplify-and-streamline-rules/",
    "2026-10-01",
  ],
  ["https://openai.com/", "2026-10-01"],
]);

function isSuccessStatus(status: number): boolean {
  return status >= 200 && status < 300;
}

async function fetchStatus(
  url: string,
  method: "HEAD" | "GET",
  browser = false,
): Promise<{ status: number; finalUrl: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": browser ? BROWSER_USER_AGENT : USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/pdf,*/*;q=0.8",
        ...(browser ? { "Accept-Language": "en-US,en;q=0.9,de;q=0.8" } : {}),
      },
    });

    if (method === "GET" && response.body) {
      await response.body.cancel().catch(() => {
        /* ignore cancel errors */
      });
    }

    return {
      status: response.status,
      finalUrl: response.url || url,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new FetchError(`Timed out after ${FETCH_TIMEOUT_MS}ms`);
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new FetchError(message);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Probe URL reachability: HEAD first, GET fallback on 403/404/405/501 or HEAD failure.
 * Success = final HTTP status 200–299.
 */
export async function probeUrl(url: string): Promise<ProbeResult> {
  let headError: FetchError | null = null;

  try {
    const head = await fetchStatus(url, "HEAD");
    if (isSuccessStatus(head.status)) {
      return {
        ok: true,
        httpStatus: head.status,
        finalUrl: head.finalUrl,
      };
    }
    if (!GET_FALLBACK_STATUSES.has(head.status)) {
      return {
        ok: false,
        httpStatus: head.status,
        error: `HTTP ${head.status}`,
        finalUrl: head.finalUrl,
      };
    }
  } catch (error) {
    headError =
      error instanceof FetchError
        ? error
        : new FetchError(error instanceof Error ? error.message : String(error));
  }

  try {
    let get = await fetchStatus(url, "GET");
    if (get.status === 403) {
      get = await fetchStatus(url, "GET", true);
    }
    if (get.status === 403 && BOT_BLOCKED_VERIFIED.has(url)) {
      return { ok: true, httpStatus: get.status, finalUrl: get.finalUrl };
    }
    if (isSuccessStatus(get.status)) {
      return {
        ok: true,
        httpStatus: get.status,
        finalUrl: get.finalUrl,
      };
    }
    return {
      ok: false,
      httpStatus: get.status,
      error: `HTTP ${get.status}`,
      finalUrl: get.finalUrl,
    };
  } catch (error) {
    const getError =
      error instanceof FetchError
        ? error
        : new FetchError(error instanceof Error ? error.message : String(error));
    const message = headError
      ? `HEAD failed (${headError.message}); GET failed (${getError.message})`
      : getError.message;
    return {
      ok: false,
      httpStatus: getError.httpStatus,
      error: message,
      finalUrl: url,
    };
  }
}
