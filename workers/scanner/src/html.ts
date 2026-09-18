/** Lightweight HTML helpers for the scanner heuristic engine (T35). */

export type ExtractedAnchor = {
  href: string;
  text: string;
};

/** Only the leading slice is scanned — bounds ReDoS on adversarial pages. */
const MAX_HTML_SCAN_CHARS = 512 * 1024;
/** Hard cap on extracted anchors — link checks only need the first match. */
const MAX_ANCHORS = 2000;
/** Cap open-tag attempts so floods of `<a` without useful closes stay cheap. */
const MAX_OPEN_SCANS = 4000;
/** Max chars between `<a…>` and `</a>`; normal link text is far smaller. */
const MAX_ANCHOR_INNER_CHARS = 8 * 1024;

const OPEN_ANCHOR_RE = /<a\b([^>]*)>/gi;
const HREF_RE = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i;
const TAG_RE = /<[^>]+>/g;
const WS_RE = /\s+/g;

function stripTags(html: string): string {
  return html.replace(TAG_RE, " ").replace(WS_RE, " ").trim();
}

/**
 * Extract `<a href>` anchors with stripped link text from an HTML document.
 *
 * Scans at most the first 512 KiB and stops after 2000 anchors. Closing tags
 * are found with a linear scan (not a lazy `[\s\S]*?`) so unclosed `<a` tags
 * cannot force end-of-string rescans from every opening position.
 */
export function extractAnchors(html: string): ExtractedAnchor[] {
  const slice =
    html.length > MAX_HTML_SCAN_CHARS
      ? html.slice(0, MAX_HTML_SCAN_CHARS)
      : html;

  const anchors: ExtractedAnchor[] = [];
  // Fast reject: no closing tag anywhere in the slice → nothing to extract.
  if (findCloseAnchor(slice, 0, slice.length) === null) {
    return anchors;
  }

  OPEN_ANCHOR_RE.lastIndex = 0;
  let openMatch: RegExpExecArray | null;
  let opensScanned = 0;

  while (
    anchors.length < MAX_ANCHORS &&
    opensScanned < MAX_OPEN_SCANS &&
    (openMatch = OPEN_ANCHOR_RE.exec(slice)) !== null
  ) {
    opensScanned++;
    const attrs = openMatch[1] ?? "";
    const contentStart = OPEN_ANCHOR_RE.lastIndex;
    // Bounded linear scan — avoids lazy-quantifier ReDoS on unclosed tags.
    const closeAt = findCloseAnchor(
      slice,
      contentStart,
      MAX_ANCHOR_INNER_CHARS,
    );
    if (closeAt === null) {
      // Unclosed or oversized inner — skip; lastIndex already past the open.
      continue;
    }

    const hrefMatch = HREF_RE.exec(attrs);
    if (!hrefMatch) {
      OPEN_ANCHOR_RE.lastIndex = closeAt.end;
      continue;
    }
    const href = (hrefMatch[1] ?? hrefMatch[2] ?? hrefMatch[3] ?? "").trim();
    if (!href || href.startsWith("javascript:") || href.startsWith("mailto:")) {
      OPEN_ANCHOR_RE.lastIndex = closeAt.end;
      continue;
    }

    const inner = slice.slice(contentStart, closeAt.start);
    anchors.push({ href, text: stripTags(inner) });
    OPEN_ANCHOR_RE.lastIndex = closeAt.end;
  }

  return anchors;
}

/** Locate the next `</a>` (ASCII case-insensitive) within `maxInner` of `from`. */
function findCloseAnchor(
  html: string,
  from: number,
  maxInner: number,
): { start: number; end: number } | null {
  // Allow the closing tag to begin exactly at from+maxInner (inner length == cap).
  const lastStart = Math.min(html.length - 4, from + maxInner);
  for (let i = from; i <= lastStart; i++) {
    if (html.charCodeAt(i) !== 60 /* < */) continue;
    if (html.charCodeAt(i + 1) !== 47 /* / */) continue;
    const c0 = html.charCodeAt(i + 2);
    const c1 = html.charCodeAt(i + 3);
    // a/A
    if ((c0 !== 97 && c0 !== 65) || (c1 !== 62 /* > */ && !isNameEnd(c1))) {
      continue;
    }
    if (c1 === 62) {
      return { start: i, end: i + 4 };
    }
    // </a ...>
    let j = i + 3;
    while (j < html.length && html.charCodeAt(j) !== 62) j++;
    if (j < html.length) return { start: i, end: j + 1 };
  }
  return null;
}

function isNameEnd(code: number): boolean {
  // whitespace or other attrs rarely appear on closing tags, but allow space/tab/CR/LF
  return code === 32 || code === 9 || code === 10 || code === 13;
}

/**
 * Case-insensitive substring match of a pattern against haystack.
 */
export function includesIgnoreCase(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

type NormalizedAnchor = {
  anchor: ExtractedAnchor;
  textLower: string;
  hrefLower: string;
};

/**
 * Find the first anchor whose text or href matches any locale pattern.
 * Patterns are tried in locale order de → en → fr → it.
 *
 * Anchor text/href and patterns are lowercased once up front so the nested
 * locale × pattern × anchor loops do not re-allocate on every comparison.
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

  const normalized: NormalizedAnchor[] = anchors.map((anchor) => ({
    anchor,
    textLower: anchor.text.toLowerCase(),
    hrefLower: anchor.href.toLowerCase(),
  }));

  const patternsLower: Record<(typeof locales)[number], string[]> = {
    de: patterns.de.map((p) => p.toLowerCase()),
    en: patterns.en.map((p) => p.toLowerCase()),
    fr: patterns.fr.map((p) => p.toLowerCase()),
    it: patterns.it.map((p) => p.toLowerCase()),
  };

  for (const locale of locales) {
    const localePatterns = patterns[locale];
    const localePatternsLower = patternsLower[locale];
    for (let p = 0; p < localePatterns.length; p++) {
      const pattern = localePatterns[p]!;
      const patternLower = localePatternsLower[p]!;
      for (const item of normalized) {
        if (
          item.textLower.includes(patternLower) ||
          item.hrefLower.includes(patternLower)
        ) {
          let absoluteHref: string;
          try {
            absoluteHref = new URL(item.anchor.href, baseUrl).href;
          } catch {
            continue;
          }
          return {
            anchor: item.anchor,
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
