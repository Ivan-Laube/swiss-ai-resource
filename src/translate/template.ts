import { PLACEHOLDER_RE } from "@/templates/load";
import { stripCodeFence } from "@/lib/llm-output";

import type { MatchedGlossaryTerm } from "./glossary-match";
import { localeSystemRules, type TranslateTargetLocale, type TranslationPrompt } from "./prompt";
import { assertNoRawHtmlInTranslation } from "./verify";

/**
 * Translation of downloadable templates (T49): plain Markdown without
 * frontmatter, with `[placeholders]` the reader replaces. Same model and
 * glossary rules as guide pages; structure is checked after translation.
 */
function templateSystemRules(): string {
  return [
    "You translate a Swiss fill-in template (Markdown) from German into the target language.",
    "Preserve Markdown structure exactly: headings, numbering, lists, block quotes, tables (same rows and columns), emphasis, horizontal rules and emoji.",
    "Placeholders are written in square brackets, e.g. [Firmenname] or [TT.MM.JJJJ]. Translate the words inside the brackets, keep the brackets, and keep every placeholder: the output must contain exactly as many bracketed placeholders as the source.",
    "Keep law abbreviations and article numbers as references (e.g. Art. 16–17 DSG, Art. 26 ArGV 3), rendered as is usual in the target language.",
    "Do not invent obligations, sources or facts, and do not add a disclaimer beyond what the source contains.",
    "Do not emit raw HTML tags — Markdown only.",
    "Output ONLY the translated Markdown document. No frontmatter, no code fences, no commentary.",
  ].join("\n");
}

export function buildTemplatePrompt(
  id: string,
  markdown: string,
  locale: TranslateTargetLocale,
  terms: MatchedGlossaryTerm[],
): TranslationPrompt {
  return {
    system: `${templateSystemRules()}\n\n${localeSystemRules(locale, terms)}`,
    user: `Translate the following German template (id: ${id}) into ${locale}.\n\n${markdown}`,
  };
}

const count = (re: RegExp, text: string) => text.match(re)?.length ?? 0;

/**
 * Clean the model output and check it against the German source: no raw
 * HTML, same number of headings, table rows and placeholders. Throws.
 */
export function finishTemplateTranslation(deMarkdown: string, raw: string): string {
  const out = `${stripCodeFence(raw).replace(/^\uFEFF?/, "").trim()}\n`;
  assertNoRawHtmlInTranslation("", "", out);

  const checks: [string, RegExp][] = [
    ["headings", /^#{1,6} /gm],
    ["table rows", /^\|.*\|[ \t]*$/gm],
    ["placeholders", PLACEHOLDER_RE],
  ];
  const problems = checks.flatMap(([label, re]) => {
    const want = count(re, deMarkdown);
    const got = count(re, out);
    return want === got ? [] : [`${label}: DE ${want}, translation ${got}`];
  });
  if (problems.length > 0) {
    throw new Error(`Template translation does not match the German structure (${problems.join("; ")})`);
  }
  return out;
}
