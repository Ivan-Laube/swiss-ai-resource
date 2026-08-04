import { getContentPage } from "@/content";
import type { Source } from "@/sources";

export type ClassificationPrompt = {
  system: string;
  user: string;
};

function systemRules(): string {
  return [
    "You are a Swiss AI compliance maintainer reviewing changes to tracked source pages (regulators, vendors, guidance).",
    "Classify each diff as cosmetic or material for whether dependent site content may need updating.",
    "",
    "COSMETIC examples:",
    "- Typos, whitespace, punctuation-only edits",
    "- Navigation, footer, cookie-banner, or boilerplate text",
    "- Layout-only reordering with no substantive meaning change",
    "- Timestamp or 'last updated' footer with no legal/vendor substance change",
    "",
    "MATERIAL examples:",
    "- Obligations, duties, prohibitions, or enforcement guidance changed",
    "- Dates, deadlines, timelines, or effective dates changed",
    "- Definitions, scope, applicability, or risk classifications changed",
    "- Pricing, hosting regions, data residency, DPA/training terms changed",
    "- Certifications, compliance claims, or product capabilities changed",
    "- Sections added or removed that affect dependent compliance or vendor content",
    "",
    "When uncertain, classify as material.",
    "",
    "Respond with JSON only. No markdown fences, no commentary.",
    'Schema: { "classification": "cosmetic" | "material", "rationale": string, "confidence": "low" | "medium" | "high" (optional) }',
  ].join("\n");
}

function formatDependentPages(source: Source): string {
  if (source.dependent_pages.length === 0) {
    return [
      "No cornerstone compliance pages are linked to this source.",
      "Classify whether vendor/comparison-table facts (hosting, DPA, pricing, certifications) materially changed.",
    ].join("\n");
  }

  const lines = ["Dependent DE cornerstone pages:"];
  for (const slug of source.dependent_pages) {
    const page = getContentPage("de", slug);
    lines.push(`- slug: ${slug}`);
    lines.push(`  title: ${page.frontmatter.title}`);
    lines.push(`  description: ${page.frontmatter.description}`);
    lines.push(`  volatility: ${page.frontmatter.volatility}`);
  }
  return lines.join("\n");
}

export function buildClassificationPrompt(options: {
  source: Source;
  patch: string;
  diffTruncated: boolean;
}): ClassificationPrompt {
  const { source, patch, diffTruncated } = options;

  const user = [
    `Source id: ${source.id}`,
    `Title: ${source.title}`,
    `URL: ${source.url}`,
    `Category: ${source.category}`,
    "",
    formatDependentPages(source),
    "",
    diffTruncated
      ? "Note: the unified diff below was truncated for length; classify from visible hunks and bias toward material if key context may be missing."
      : "",
    "",
    "Unified diff:",
    "---",
    patch,
    "---",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return {
    system: systemRules(),
    user,
  };
}

export function buildFixJsonPrompt(
  originalUser: string,
  invalidResponse: string,
): ClassificationPrompt {
  return {
    system: systemRules(),
    user: [
      originalUser,
      "",
      "Your previous response was not valid JSON matching the schema.",
      "Return corrected JSON only.",
      "",
      "Previous response:",
      invalidResponse,
    ].join("\n"),
  };
}
