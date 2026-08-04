/** Lightweight HTML helpers for the scanner heuristic engine (T35). */

export type ExtractedAnchor = {
  href: string;
  text: string;
};

const ANCHOR_RE = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
const HREF_RE = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i;
const TAG_RE = /<[^>]+>/g;
const WS_RE = /\s+/g;

function stripTags(html: string): string {
  return html.replace(TAG_RE, " ").replace(WS_RE, " ").trim();
}

/**
 * Extract `<a href>` anchors with stripped link text from an HTML document.
 */
export function extractAnchors(html: string): ExtractedAnchor[] {
  const anchors: ExtractedAnchor[] = [];
  ANCHOR_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = ANCHOR_RE.exec(html)) !== null) {
    const attrs = match[1] ?? "";
    const inner = match[2] ?? "";
    const hrefMatch = HREF_RE.exec(attrs);
    if (!hrefMatch) continue;
    const href = (hrefMatch[1] ?? hrefMatch[2] ?? hrefMatch[3] ?? "").trim();
    if (!href || href.startsWith("javascript:") || href.startsWith("mailto:")) {
      continue;
    }
    anchors.push({ href, text: stripTags(inner) });
  }
  return anchors;
}

/**
 * Case-insensitive substring match of a pattern against haystack.
 */
export function includesIgnoreCase(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

/**
 * Find the first anchor whose text or href matches any locale pattern.
 * Patterns are tried in locale order de → en → fr → it.
 */
export function findMatchingAnchor(
  anchors: ExtractedAnchor[],
  patterns: { de: string[]; en: string[]; fr: string[]; it: string[] },
  baseUrl: string,
): {
  anchor: ExtractedAnchor;
  absoluteHref: string;
  locale: string;
  pattern: string;
} | null {
  const locales = ["de", "en", "fr", "it"] as const;

  for (const locale of locales) {
    for (const pattern of patterns[locale]) {
      for (const anchor of anchors) {
        if (
          includesIgnoreCase(anchor.text, pattern) ||
          includesIgnoreCase(anchor.href, pattern)
        ) {
          let absoluteHref: string;
          try {
            absoluteHref = new URL(anchor.href, baseUrl).href;
          } catch {
            continue;
          }
          return {
            anchor,
            absoluteHref,
            locale,
            pattern,
          };
        }
      }
    }
  }
  return null;
}
