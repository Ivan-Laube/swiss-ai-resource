const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const UPSTREAM_TIMEOUT_MS = 5000;
const RETRY_ON_STATUSES = new Set([500, 502, 503, 504]);

export type TurnstileResult =
  | { ok: true }
  | { ok: false; reason: "missing_secret" | "rejected" | "upstream_error" };

interface SiteverifyResponse {
  success: boolean;
  "error-codes"?: string[];
}

/**
 * Verify a Turnstile token via Cloudflare siteverify.
 * Retries once on transient 5xx / network failures.
 */
export async function verifyTurnstile(
  secret: string | undefined,
  token: string,
  remoteip?: string,
): Promise<TurnstileResult> {
  if (!secret) {
    return { ok: false, reason: "missing_secret" };
  }

  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (remoteip) body.append("remoteip", remoteip);

  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await fetchWithTimeout(SITEVERIFY_URL, body, UPSTREAM_TIMEOUT_MS);
      if (result.status >= 200 && result.status < 300) {
        const data = (await result.json()) as SiteverifyResponse;
        return data.success
          ? { ok: true }
          : { ok: false, reason: "rejected" };
      }
      if (!RETRY_ON_STATUSES.has(result.status) || attempt === 1) {
        return { ok: false, reason: "upstream_error" };
      }
    } catch (err) {
      lastErr = err;
      if (attempt === 1) break;
    }
  }

  void lastErr;
  return { ok: false, reason: "upstream_error" };
}

async function fetchWithTimeout(
  url: string,
  body: FormData,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      method: "POST",
      body,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}
