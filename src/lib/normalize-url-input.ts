/**
 * Normalize a user-entered website URL for the Quick-Check.
 * Adds https:// when no scheme is present. Returns null if invalid,
 * not http(s), or the hostname has no dot (e.g. "localhost").
 */
export function normalizeUrlInput(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  // "host:port[/…]" looks like a scheme to the check below; prefix it.
  const isHostPort = /^[^\s/:]+:\d+(?:[/?#]|$)/.test(trimmed);
  const hasScheme =
    !isHostPort && /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed);
  const withScheme = hasScheme ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withScheme);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    // Public sites only: a bare "beispiel" or "localhost" is a typo here.
    if (!parsed.hostname.includes(".")) {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}
