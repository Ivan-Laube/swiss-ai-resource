import { z } from "zod";

const isoDate = z.iso.date();

const httpsUrl = z.url().refine(
  (value) => value.startsWith("https://"),
  { message: "URL must be an absolute https:// URL" },
);

export const certifications = [
  "iso_27001",
  "soc_2",
  "finma_relevant",
  "other",
] as const;
export type Certification = (typeof certifications)[number];

export const pricingTiers = [
  "free",
  "usage",
  "subscription",
  "enterprise",
  "contact",
] as const;
export type PricingTier = (typeof pricingTiers)[number];

const vendorId = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Vendor id must be kebab-case (e.g. openai, swisscom-ai)",
  });

/**
 * Per-claim cell: either a verified value with source, or both null (unverified).
 * Never invent a value without a source_url.
 */
export function sourcedValueSchema<T>(valueSchema: z.ZodType<T>) {
  const cellSchema = z.object({
    value: z.union([valueSchema, z.null()]),
    source_url: z.union([httpsUrl, z.null()]),
  });

  return cellSchema.refine(
    (data) =>
      (data.value === null && data.source_url === null) ||
      (data.value !== null && data.source_url !== null),
    {
      message:
        "value and source_url must both be set (verified) or both null (unverified)",
      path: ["source_url"],
    },
  );
}

export type SourcedValue<T> = {
  value: T | null;
  source_url: string | null;
};

export const vendorSchema = z.object({
  id: vendorId,
  name: z.string().min(1),
  website: httpsUrl,
  last_checked: isoDate,
  hosting_regions: sourcedValueSchema(z.array(z.string().min(1))),
  swiss_hosting: sourcedValueSchema(z.boolean()),
  eu_hosting: sourcedValueSchema(z.boolean()),
  dpa_url: sourcedValueSchema(httpsUrl),
  training_opt_out: sourcedValueSchema(z.boolean()),
  certifications: sourcedValueSchema(z.array(z.enum(certifications))),
  pricing_tier: sourcedValueSchema(z.enum(pricingTiers)),
  swiss_entity: sourcedValueSchema(z.boolean()),
  eu_entity: sourcedValueSchema(z.boolean()),
});

export type Vendor = z.infer<typeof vendorSchema>;

export const vendorsFileSchema = z.array(vendorSchema);

export function parseVendor(data: unknown): Vendor {
  return vendorSchema.parse(data);
}

/** Parse the root vendors.json array. Does not enforce unique ids (loader does). */
export function parseVendorsFile(data: unknown): Vendor[] {
  return vendorsFileSchema.parse(data);
}
