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
