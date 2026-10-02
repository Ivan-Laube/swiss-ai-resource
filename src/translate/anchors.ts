import { marked, type Tokens } from "marked";

import {
  diffHeadingAnchors,
  listHeadingAnchors,
  splitHeadingAnchor,
} from "@/lib/heading-anchors";

type SectionHeading = {
  depth: number;
  raw: string;
  text: string;
  anchor: string | null;
};

/** h2/h3 headings in document order (code blocks excluded). */
function sectionHeadings(markdown: string): SectionHeading[] {
  const headings: SectionHeading[] = [];
  marked.walkTokens(marked.lexer(markdown), (token) => {
    if (token.type !== "heading") {
      return;
    }
    const { depth, raw, text } = token as Tokens.Heading;
    if (depth === 2 || depth === 3) {
      headings.push({ depth, raw, ...splitHeadingAnchor(text) });
    }
  });
  return headings;
}

export type RestoreAnchorsResult = {
  body: string;
  /** Anchors the translation lacked (or had wrong) and that were put back. */
  restored: string[];
};

/**
 * Give a translated body exactly the `{#anchor}` markers of its German
 * source. Translations keep the heading structure, so the n-th DE h2/h3 is
 * the n-th translated h2/h3: its marker is copied over and anything the
 * model invented or dropped is corrected. Throws when the heading structure
 * differs and the markers don't already match, since the anchors can then
 * not be placed safely.
 */
export function restoreHeadingAnchors(
  deBody: string,
  translatedBody: string,
): RestoreAnchorsResult {
  const de = sectionHeadings(deBody);
  const tr = sectionHeadings(translatedBody);
  const deAnchors = de.flatMap((h) => (h.anchor ? [h.anchor] : []));
  const trAnchors = tr.flatMap((h) => (h.anchor ? [h.anchor] : []));

  const sameShape =
    de.length === tr.length && de.every((h, i) => h.depth === tr[i].depth);

  if (!sameShape) {
    const { missing, extra } = diffHeadingAnchors(deAnchors, trAnchors);
    if (missing.length === 0 && extra.length === 0) {
      return { body: translatedBody, restored: [] };
    }
    throw new Error(
      `Cannot restore heading anchors: the translation has a different h2/h3 structure than the German source (DE ${de.length}, translation ${tr.length}). ` +
        `Missing: ${missing.join(", ") || "none"}; unexpected: ${extra.join(", ") || "none"}.`,
    );
  }

  let body = "";
  let rest = translatedBody;
  const restored: string[] = [];

  de.forEach((source, i) => {
    const target = tr[i];
    if (source.anchor === target.anchor) {
      return;
    }
    if (!target.raw.startsWith("#")) {
      throw new Error(
        `Cannot restore heading anchor {#${source.anchor ?? ""}}: "${target.text}" is not an ATX (#) heading`,
      );
    }
    const at = rest.indexOf(target.raw);
    if (at === -1) {
      throw new Error(`Cannot locate translated heading "${target.text}"`);
    }
    const newline = target.raw.endsWith("\n") ? "\n" : "";
    const heading = `${"#".repeat(target.depth)} ${target.text.trim()}${
      source.anchor ? ` {#${source.anchor}}` : ""
    }${newline}`;
    body += rest.slice(0, at) + heading;
    rest = rest.slice(at + target.raw.length);
    if (source.anchor) {
      restored.push(source.anchor);
    }
  });

  return { body: body + rest, restored };
}

/**
 * Refuse a translation whose explicit anchors differ from the German source.
 * Run after `restoreHeadingAnchors`; also guards hand-edited translations.
 */
export function assertHeadingAnchorsMatch(
  deBody: string,
  translatedBody: string,
): void {
  const { missing, extra } = diffHeadingAnchors(
    listHeadingAnchors(deBody).map((a) => a.anchor),
    listHeadingAnchors(translatedBody).map((a) => a.anchor),
  );
  if (missing.length === 0 && extra.length === 0) {
    return;
  }
  throw new Error(
    `Translation heading anchors differ from the German source. Missing: ${
      missing.join(", ") || "none"
    }; unexpected: ${extra.join(", ") || "none"}.`,
  );
}
