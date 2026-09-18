import type { ContentPage } from "@/content";
import type { Domain, GlossaryTerm } from "@/glossary";
import type { Locale } from "@/i18n/config";

import type { MatchedGlossaryTerm } from "./glossary-match";

export type TranslateTargetLocale = Exclude<Locale, "de">;

export type TranslationPrompt = {
  system: string;
  user: string;
};

const DOMAIN_ORDER: Domain[] = ["dsg", "ai_act", "institutional", "other"];

function formatGlossaryTable(
  terms: MatchedGlossaryTerm[],
  locale: "fr" | "it",
): string {
  if (terms.length === 0) {
    return "(No glossary terms matched in the German source.)";
  }

  const byDomain = new Map<Domain, GlossaryTerm[]>();
  for (const domain of DOMAIN_ORDER) {
    byDomain.set(domain, []);
  }
  for (const term of terms) {
    byDomain.get(term.domain)?.push(term);
  }

  const lines: string[] = [];
  for (const domain of DOMAIN_ORDER) {
    const group = byDomain.get(domain) ?? [];
    if (group.length === 0) {
      continue;
    }
    lines.push(`### Domain: ${domain}`);
    for (const term of group) {
      const target = locale === "fr" ? term.fr : term.it;
      const abbrDe = term.abbreviations?.de;
      const abbrTarget =
        locale === "fr" ? term.abbreviations?.fr : term.abbreviations?.it;
      lines.push(`- id: ${term.id}`);
      lines.push(`  DE: ${term.de}${abbrDe ? ` (${abbrDe})` : ""}`);
      lines.push(
        `  ${locale.toUpperCase()}: ${target}${abbrTarget ? ` (${abbrTarget})` : ""}`,
      );
      if (term.notes) {
        lines.push(`  notes: ${term.notes}`);
      }
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}

function formatEnGlossaryHints(terms: MatchedGlossaryTerm[]): string {
  if (terms.length === 0) {
    return "(No glossary terms matched in the German source.)";
  }

  return terms
    .map((term) => {
      const abbr = term.abbreviations?.de;
      return `- ${term.de}${abbr ? ` (${abbr})` : ""} — on first use, give a conventional English rendering followed by the German term in parentheses`;
    })
    .join("\n");
}

function sharedSystemRules(): string {
  return [
    "You translate Swiss legal/compliance Markdown from German into the target language.",
    "Preserve Markdown structure exactly: headings, lists, emphasis, tables, and links.",
    "Do not invent sources, citations, articles, or facts.",
    "Keep every https:// URL and Fedlex/EUR-Lex citation unchanged.",
    "Do not add a disclaimer beyond what the source already contains.",
    "Do not emit raw HTML tags — use Markdown only (no <script>, <div>, <iframe>, etc.).",
    "Output ONLY a Markdown document with YAML frontmatter containing title and description, then the body.",
    "Frontmatter must use this shape:",
    "---",
    'title: "..."',
    'description: "..."',
    "---",
    "",
    "Do not include last_verified, volatility, translation_status, reviewed_*, or sources — those are filled by the pipeline.",
    "Do not wrap the output in code fences or add commentary before/after the document.",
  ].join("\n");
}

function localeSystemRules(
  locale: TranslateTargetLocale,
  terms: MatchedGlossaryTerm[],
): string {
  if (locale === "en") {
    return [
      "Target language: English.",
      "There is no official English Swiss legal text. Use conventional English legal phrasing.",
      "For each matched glossary term below, on first use write a conventional English rendering with the German term in parentheses (e.g. Federal Act on Data Protection (Bundesgesetz über den Datenschutz)).",
      "Subsequent mentions may use the English form or the German abbreviation when that is conventional (e.g. DSG).",
      "",
      "Matched terms (first-use parentheses required):",
      formatEnGlossaryHints(terms),
    ].join("\n");
  }

  const langName = locale === "fr" ? "French" : "Italian";
  return [
    `Target language: ${langName} (Swiss legal register where applicable).`,
    "You MUST use the exact official FR/IT wording from the glossary table for every matched term and its locale abbreviation.",
    "Never free-translate those labels. If the German source uses an abbreviation, use the matching locale abbreviation from the table when one exists.",
    "",
    "Mandatory glossary (Fedlex / EUR-Lex):",
    formatGlossaryTable(terms, locale),
  ].join("\n");
}

/** Build system + user prompts for one DE page → target locale draft. */
export function buildTranslationPrompt(
  page: ContentPage,
  locale: TranslateTargetLocale,
  terms: MatchedGlossaryTerm[],
): TranslationPrompt {
  const system = `${sharedSystemRules()}\n\n${localeSystemRules(locale, terms)}`;

  const user = [
    `Translate the following German compliance page (slug: ${page.slug}) into ${locale}.`,
    "",
    "---",
    `title: ${JSON.stringify(page.frontmatter.title)}`,
    `description: ${JSON.stringify(page.frontmatter.description)}`,
    "---",
    "",
    page.body,
  ].join("\n");

  return { system, user };
}
