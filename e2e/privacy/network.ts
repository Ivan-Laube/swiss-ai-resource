/**
 * Host allowlist helpers for R52 (no third-party requests).
 */

const IGNORE_SCHEMES = new Set(["data:", "blob:", "about:"]);

export const TURNSTILE_API_HOSTS = new Set([
  "api.aicompliant.ch",
  "challenges.cloudflare.com",
]);

/** Hosts allowed for a page load. Same-origin always; Turnstile/API only on those routes. */
export function allowedHosts(
  pageOriginHost: string,
  turnstileRoute: boolean,
): Set<string> {
  const hosts = new Set<string>([pageOriginHost]);
  if (turnstileRoute) {
    for (const host of TURNSTILE_API_HOSTS) {
      hosts.add(host);
    }
  }
  return hosts;
}

/**
 * Hostname for an HTTP(S) request URL, or null for ignored schemes / invalid URLs.
 */
export function hostFromRequestUrl(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (IGNORE_SCHEMES.has(parsed.protocol)) {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return null;
  }
  return parsed.hostname;
}

/** Hosts present in `seen` but not in `allowed`, sorted for stable failure messages. */
export function unexpectedHosts(
  seen: Iterable<string>,
  allowed: Set<string>,
): string[] {
  const unexpected: string[] = [];
  for (const host of seen) {
    if (!allowed.has(host)) {
      unexpected.push(host);
    }
  }
  return unexpected.sort();
}
