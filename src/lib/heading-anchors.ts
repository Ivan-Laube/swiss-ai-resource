import { marked, type Tokens } from "marked";

/**
 * Explicit, language-independent heading anchors in content Markdown:
 *
 *   ## Transparenz und Information {#transparenz}
 *
 * The marker is stripped from the rendered heading and its value becomes the
 * heading id, so `/de/…#transparenz` and `/fr/…#transparenz` both work and
 * survive rewording. Only h2/h3 may carry one (they are the TOC levels).
 */

/** Lowercase kebab-case, starting with a letter. */
export const HEADING_ANCHOR_RE = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

/** Trailing `{#…}` marker; the id itself is validated separately. */
const MARKER_RE = /\s*\{#([^{}]*)\}\s*$/;

export type HeadingAnchor = {
  anchor: string;
  depth: number;
  text: string;
};

/** Split a heading's source text into display text and explicit anchor. */
export function splitHeadingAnchor(text: string): {
  text: string;
  anchor: string | null;
} {
  const match = MARKER_RE.exec(text);
  if (!match) {
    return { text, anchor: null };
  }
  return { text: text.slice(0, match.index), anchor: match[1] };
}

/** Anchors in `expected` but not `actual` (missing) and the reverse (extra). */
export function diffHeadingAnchors(
  expected: readonly string[],
  actual: readonly string[],
): { missing: string[]; extra: string[] } {
  const want = new Set(expected);
  const have = new Set(actual);
  return {
    missing: expected.filter((a) => !have.has(a)),
    extra: actual.filter((a) => !want.has(a)),
  };
}

/**
 * Explicit anchors of a Markdown document, in order. Throws if a marker is
 * malformed, sits on a heading other than h2/h3, or repeats an anchor.
 * Headings inside code blocks are ignored (they are not heading tokens).
 */
export function listHeadingAnchors(markdown: string): HeadingAnchor[] {
  const anchors: HeadingAnchor[] = [];
  const seen = new Set<string>();

  marked.walkTokens(marked.lexer(markdown), (token) => {
    if (token.type !== "heading") {
      return;
    }
    const { depth, text: raw } = token as Tokens.Heading;
    const { text, anchor } = splitHeadingAnchor(raw);
    if (anchor === null) {
      return;
    }

    const label = `"${"#".repeat(depth)} ${raw}"`;
    if (!HEADING_ANCHOR_RE.test(anchor)) {
      throw new Error(
        `Invalid heading anchor {#${anchor}} in ${label}: use lowercase kebab-case starting with a letter`,
      );
    }
    if (depth !== 2 && depth !== 3) {
      throw new Error(
        `Heading anchor {#${anchor}} in ${label}: only h2 and h3 headings may carry an anchor`,
      );
    }
    if (seen.has(anchor)) {
      throw new Error(`Duplicate heading anchor {#${anchor}} in ${label}`);
    }
    seen.add(anchor);
    anchors.push({ anchor, depth, text });
  });

  return anchors;
}
