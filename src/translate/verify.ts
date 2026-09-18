import type { GlossaryTerm } from "@/glossary";

import type { TranslateTargetLocale } from "./prompt";

export type GlossaryVerifyResult = {
  missing: string[];
  checked: string[];
};

function targetLabel(term: GlossaryTerm, locale: "fr" | "it"): string {
  return locale === "fr" ? term.fr : term.it;
}

function targetAbbreviation(
  term: GlossaryTerm,
  locale: "fr" | "it",
): string | undefined {
  return locale === "fr" ? term.abbreviations?.fr : term.abbreviations?.it;
}

/**
 * After FR/IT write: each matched glossary term must appear as the official
 * `fr`/`it` string and/or its locale abbreviation when one exists.
 */
export function verifyGlossaryTermsInTranslation(
  locale: TranslateTargetLocale,
  title: string,
  description: string,
  body: string,
  terms: GlossaryTerm[],
): GlossaryVerifyResult {
  if (locale === "en") {
    return { missing: [], checked: [] };
  }

  const haystack = `${title}\n${description}\n${body}`;
  const missing: string[] = [];
  const checked: string[] = [];

  for (const term of terms) {
    const label = targetLabel(term, locale);
    const abbr = targetAbbreviation(term, locale);
    const accepted = abbr && abbr !== label ? [label, abbr] : [label];
    checked.push(`${term.id}:${accepted.join("|")}`);

    const found = accepted.some((needle) => haystack.includes(needle));
    if (!found) {
      missing.push(
        `${term.id}: missing ${accepted.map((s) => `"${s}"`).join(" or ")}`,
      );
    }
  }

  return { missing, checked };
}

/** Opening/closing HTML tags that marked would pass through into the page. */
const RAW_HTML_TAG = /<\/?[a-zA-Z][a-zA-Z0-9]*(?:\s[^<>]*)?>/g;

/**
 * Remove fenced (``` / ~~~) and indented code blocks so HTML-looking text
 * inside examples does not trip the raw-HTML guard.
 */
function withoutCodeBlocks(markdown: string): string {
  const noFenced = markdown.replace(
    /^(?:```|~~~)[^\n]*\n[\s\S]*?^(?:```|~~~)[ \t]*$/gm,
    "",
  );
  return noFenced.replace(/^(?: {4}|\t).+$/gm, "");
}

/** Distinct raw HTML tags found outside Markdown code blocks. */
export function findRawHtmlOutsideCode(markdown: string): string[] {
  const matches = withoutCodeBlocks(markdown).match(RAW_HTML_TAG);
  if (!matches) {
    return [];
  }
  return [...new Set(matches)];
}

/**
 * Refuse LLM translations that embed raw HTML. Render-time sanitization in
 * `renderMarkdown` is the last line of defense; this keeps auto-committed
 * `content/{en,fr,it}` free of HTML the model might inject.
 */
export function assertNoRawHtmlInTranslation(
  title: string,
  description: string,
  body: string,
): void {
  const hits = [
    ...findRawHtmlOutsideCode(title),
    ...findRawHtmlOutsideCode(description),
    ...findRawHtmlOutsideCode(body),
  ];
  if (hits.length === 0) {
    return;
  }
  const preview = hits.slice(0, 5).join(", ");
  throw new Error(
    `LLM translation contains raw HTML (refusing to write): ${preview}`,
  );
}
