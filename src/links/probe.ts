import {
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

function isSuccessStatus(status: number): boolean {
  return status >= 200 && status < 300;
}

async function fetchStatus(
  url: string,
  method: "HEAD" | "GET",
): Promise<{ status: number; finalUrl: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/pdf,*/*;q=0.8",
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
    const get = await fetchStatus(url, "GET");
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
