/**
 * Shared Cloudflare Turnstile siteverify for survey + scanner Workers.
 * Validates success and hostname against SITE_ORIGIN (www ↔ apex siblings).
 * Test secrets skip hostname checks so local always-pass keys keep working.
 */

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const UPSTREAM_TIMEOUT_MS = 5000;
const RETRY_ON_STATUSES = new Set([500, 502, 503, 504]);

/** Cloudflare documented always-* test secrets. */
const TEST_SECRETS = new Set([
  "1x0000000000000000000000000000000AA",
  "2x0000000000000000000000000000000AA",
  "3x0000000000000000000000000000000AA",
]);

export type TurnstileResult =
  | { ok: true }
  | {
      ok: false;
      reason:
        | "missing_secret"
        | "rejected"
        | "hostname_mismatch"
        | "action_mismatch"
        | "upstream_error";
    };

interface SiteverifyResponse {
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
}

export type VerifyTurnstileOptions = {
  secret: string | undefined;
  token: string;
  siteOrigin: string;
  /** When set, siteverify `action` must match exactly. */
  expectedAction?: string;
  remoteip?: string;
};

/**
 * Verify a Turnstile token via Cloudflare siteverify.
 * Retries once on transient 5xx / network failures.
 * Rejects tokens minted on hostnames outside SITE_ORIGIN (± www).
 */
export async function verifyTurnstile(
  options: VerifyTurnstileOptions,
): Promise<TurnstileResult> {
  const secret = options.secret?.trim();
  const token = options.token.trim();
  const { siteOrigin, expectedAction, remoteip } = options;
  if (!secret) {
    return { ok: false, reason: "missing_secret" };
  }
  // Site keys are short public values; secrets are longer. Log length only.
  console.log(
    JSON.stringify({
      event: "turnstile_secret_meta",
      secretLen: secret.length,
      looksLikeSiteKey: /^0x4[A-Za-z0-9_-]{20,40}$/.test(secret) && secret.length < 40,
    }),
  );
  if (!token) {
    return { ok: false, reason: "rejected" };
  }

  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      // URL-encoded body (Cloudflare examples); FormData has caused HTTP 400
      // from siteverify on Workers in some runtimes.
      const body = new URLSearchParams();
      body.set("secret", secret);
      body.set("response", token);
      if (remoteip) body.set("remoteip", remoteip);

      const result = await fetchWithTimeout(
        SITEVERIFY_URL,
        body,
        UPSTREAM_TIMEOUT_MS,
      );
      if (result.status >= 200 && result.status < 300) {
        return interpretSiteverify(
          (await result.json()) as SiteverifyResponse,
          secret,
          siteOrigin,
          expectedAction,
        );
      }

      // Some edge cases return 400 with a JSON error payload — treat as reject.
      if (result.status === 400) {
        try {
          const data = (await result.json()) as SiteverifyResponse;
          console.error(
            JSON.stringify({
              event: "turnstile_siteverify_400",
              attempt,
              errorCodes: data["error-codes"] ?? null,
            }),
          );
          return interpretSiteverify(
            data,
            secret,
            siteOrigin,
            expectedAction,
          );
        } catch {
          // fall through
        }
      }

      console.error(
        JSON.stringify({
          event: "turnstile_siteverify_http",
          status: result.status,
          attempt,
        }),
      );
      if (!RETRY_ON_STATUSES.has(result.status) || attempt === 1) {
        return { ok: false, reason: "upstream_error" };
      }
    } catch (err) {
      lastErr = err;
      console.error(
        JSON.stringify({
          event: "turnstile_siteverify_exception",
          attempt,
          error: err instanceof Error ? err.message : String(err),
        }),
      );
      if (attempt === 1) break;
    }
  }

  void lastErr;
  return { ok: false, reason: "upstream_error" };
}

function interpretSiteverify(
  data: SiteverifyResponse,
  secret: string,
  siteOrigin: string,
  expectedAction: string | undefined,
): TurnstileResult {
  if (!data.success) {
    return { ok: false, reason: "rejected" };
  }
  // Test keys always succeed and may omit / invent hostname — skip host check.
  if (!TEST_SECRETS.has(secret)) {
    if (!isAllowedTurnstileHostname(data.hostname, siteOrigin)) {
      return { ok: false, reason: "hostname_mismatch" };
    }
    if (expectedAction !== undefined && data.action !== expectedAction) {
      return { ok: false, reason: "action_mismatch" };
    }
  }
  return { ok: true };
}

/**
 * Exact SITE_ORIGIN hostname, www ↔ apex sibling, or localhost pair when
 * SITE_ORIGIN itself is a local loopback host (dev only).
 */
export function isAllowedTurnstileHostname(
  hostname: string | undefined,
  siteOrigin: string,
): boolean {
  if (!hostname) return false;
  const host = hostname.trim().toLowerCase();
  if (!host) return false;

  try {
    const allowed = new URL(siteOrigin).hostname.toLowerCase();
    if (host === allowed) return true;
    if (host === `www.${allowed}` || allowed === `www.${host}`) return true;

    const localHosts = new Set(["localhost", "127.0.0.1"]);
    if (localHosts.has(allowed) && localHosts.has(host)) return true;

    return false;
  } catch {
    return false;
  }
}

async function fetchWithTimeout(
  url: string,
  body: URLSearchParams,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}
