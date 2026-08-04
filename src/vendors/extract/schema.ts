import { z } from "zod";

import {
  certifications,
  pricingTiers,
  sourcedValueSchema,
  type SourcedValue,
  type Vendor,
} from "../schema";

/** Claim fields the monthly job may refresh (never identity fields). */
export const vendorClaimFields = [
  "hosting_regions",
  "swiss_hosting",
  "eu_hosting",
  "dpa_url",
  "training_opt_out",
  "certifications",
  "pricing_tier",
  "swiss_entity",
  "eu_entity",
] as const;

export type VendorClaimField = (typeof vendorClaimFields)[number];

export const vendorClaimFieldSchema = z.enum(vendorClaimFields);

const hostingRegionsCell = sourcedValueSchema(z.array(z.string().min(1)));
const booleanCell = sourcedValueSchema(z.boolean());
const dpaUrlCell = sourcedValueSchema(
  z.url().refine((value) => value.startsWith("https://"), {
    message: "URL must be an absolute https:// URL",
  }),
);
const certificationsCell = sourcedValueSchema(z.array(z.enum(certifications)));
const pricingTierCell = sourcedValueSchema(z.enum(pricingTiers));

/** Partial field patch from the LLM — omit fields with no clear evidence. */
export const llmVendorExtractSchema = z.object({
  fields: z
    .object({
      hosting_regions: hostingRegionsCell.optional(),
      swiss_hosting: booleanCell.optional(),
      eu_hosting: booleanCell.optional(),
      dpa_url: dpaUrlCell.optional(),
      training_opt_out: booleanCell.optional(),
      certifications: certificationsCell.optional(),
      pricing_tier: pricingTierCell.optional(),
      swiss_entity: booleanCell.optional(),
      eu_entity: booleanCell.optional(),
    })
    .default({}),
  rationale: z.string().min(1),
  confidence: z.enum(["low", "medium", "high"]).optional(),
});

export type LlmVendorExtract = z.infer<typeof llmVendorExtractSchema>;

export type VendorFieldPatch = {
  [K in VendorClaimField]?: Vendor[K];
};

export type ExtractVendorResult = {
  fields: VendorFieldPatch;
  fields_changed: VendorClaimField[];
  rationale: string;
  confidence: "low" | "medium" | "high" | null;
  error?: string;
};

export type ExtractSourceInput = {
  id: string;
  url: string;
  text: string;
};

/** Deep-compare sourced cells for equality. */
export function sourcedCellsEqual(
  a: SourcedValue<unknown>,
  b: SourcedValue<unknown>,
): boolean {
  if (a.source_url !== b.source_url) {
    return false;
  }
  if (a.value === null && b.value === null) {
    return true;
  }
  if (Array.isArray(a.value) && Array.isArray(b.value)) {
    const aArr = a.value as unknown[];
    const bArr = b.value as unknown[];
    if (aArr.length !== bArr.length) {
      return false;
    }
    return aArr.every((item, index) => item === bArr[index]);
  }
  return a.value === b.value;
}
