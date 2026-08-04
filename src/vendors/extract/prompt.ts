import {
  certifications,
  pricingTiers,
  type Vendor,
} from "../schema";
import {
  vendorClaimFields,
  type ExtractSourceInput,
} from "./schema";

export type VendorExtractPrompt = {
  system: string;
  user: string;
};

const DEFAULT_TEXT_MAX_CHARS = 12_000;

function truncateText(text: string, max = DEFAULT_TEXT_MAX_CHARS): {
  text: string;
  truncated: boolean;
} {
  if (text.length <= max) {
    return { text, truncated: false };
  }
  return {
    text: `${text.slice(0, max)}\n\n… truncated …`,
    truncated: true,
  };
}

function systemRules(): string {
  return [
    "You extract structured vendor comparison-table claims from vendor trust/DPA/product pages.",
    "Only propose fields when the snapshot text clearly supports the value.",
    "If uncertain, omit the field entirely — do not invent, guess, or clear existing cells.",
    "Never change vendor identity (id, name, website).",
    "",
    "Claim fields you may set:",
    `- hosting_regions: string[] region labels (e.g. CH, EU, US)`,
    `- swiss_hosting / eu_hosting: boolean`,
    `- dpa_url: https:// URL of the DPA document when clearly identified`,
    `- training_opt_out: boolean (customer data used for training opt-out available)`,
    `- certifications: subset of [${certifications.join(", ")}]`,
    `- pricing_tier: one of [${pricingTiers.join(", ")}]`,
    `- swiss_entity / eu_entity: boolean`,
    "",
    "Each proposed field must be a sourced cell:",
    '{ "value": <T>, "source_url": "<one of the provided source URLs>" }',
    "source_url MUST be exactly one of the Evidence source URLs listed in the user message.",
    "",
    "Respond with JSON only. No markdown fences, no commentary.",
    `Schema: { "fields": { ...optional claim fields... }, "rationale": string, "confidence": "low" | "medium" | "high" (optional) }`,
    `Allowed field keys: ${vendorClaimFields.join(", ")}`,
  ].join("\n");
}

export function buildVendorExtractPrompt(options: {
  vendor: Vendor;
  sources: ExtractSourceInput[];
}): VendorExtractPrompt {
  const { vendor, sources } = options;

  const currentClaims: Record<string, unknown> = {};
  for (const field of vendorClaimFields) {
    currentClaims[field] = vendor[field];
  }

  const evidenceBlocks: string[] = [];
  for (const source of sources) {
    const { text, truncated } = truncateText(source.text);
    evidenceBlocks.push(
      [
        `### Source \`${source.id}\``,
        `URL: ${source.url}`,
        truncated ? "Note: snapshot text truncated for length." : "",
        "Snapshot text:",
        "---",
        text,
        "---",
      ]
        .filter((line) => line !== "")
        .join("\n"),
    );
  }

  const user = [
    `Vendor id: ${vendor.id}`,
    `Name: ${vendor.name}`,
    `Website: ${vendor.website}`,
    `Current last_checked: ${vendor.last_checked}`,
    "",
    "Current claim cells (JSON):",
    JSON.stringify(currentClaims, null, 2),
    "",
    "Evidence sources (use these URLs only for source_url):",
    ...sources.map((s) => `- ${s.id}: ${s.url}`),
    "",
    ...evidenceBlocks,
  ].join("\n");

  return {
    system: systemRules(),
    user,
  };
}

export function buildVendorExtractFixJsonPrompt(
  originalUser: string,
  invalidResponse: string,
): VendorExtractPrompt {
  return {
    system: systemRules(),
    user: [
      originalUser,
      "",
      "Your previous response was not valid JSON matching the schema.",
      "Return corrected JSON only. Omit fields without clear evidence.",
      "",
      "Previous response:",
      invalidResponse,
    ].join("\n"),
  };
}
