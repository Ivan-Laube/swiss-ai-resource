import { z } from "zod";

import type { Locale } from "@/i18n/config";

export const volatilities = ["stable", "moderate", "fast"] as const;
export type Volatility = (typeof volatilities)[number];

export const translationStatuses = [
  "canonical",
  "draft",
  "reviewed",
] as const;
export type TranslationStatus = (typeof translationStatuses)[number];

const isoDate = z.iso.date();

const httpsUrl = z.url().refine(
  (value) => value.startsWith("https://"),
  { message: "Source URL must be an absolute https:// URL" },
);

export const contentSourceSchema = z.object({
  title: z.string().min(1),
  url: httpsUrl,
});

export type ContentSource = z.infer<typeof contentSourceSchema>;

const contentFrontmatterBaseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  last_verified: isoDate,
  volatility: z.enum(volatilities),
  translation_status: z.enum(translationStatuses),
  reviewed_by: z.string().min(1).nullable().default(null),
  review_date: isoDate.nullable().default(null),
  review_scope: z.string().min(1).nullable().default(null),
  sources: z.array(contentSourceSchema).min(1),
});

function reviewFieldsComplete(data: {
  reviewed_by: string | null;
  review_date: string | null;
  review_scope: string | null;
}): boolean {
  const fields = [data.reviewed_by, data.review_date, data.review_scope];
  const setCount = fields.filter((value) => value != null).length;
  return setCount === 0 || setCount === 3;
}

/** Frontmatter shape without locale-specific translation_status rules. */
export const contentFrontmatterSchema = contentFrontmatterBaseSchema.refine(
  reviewFieldsComplete,
  {
    message:
      "reviewed_by, review_date, and review_scope must all be set together, or all null",
    path: ["reviewed_by"],
  },
);

export type ContentFrontmatter = z.infer<typeof contentFrontmatterSchema>;

export function parseContentFrontmatter(
  data: unknown,
  locale: Locale,
): ContentFrontmatter {
  const parsed = contentFrontmatterSchema.parse(data);

  if (locale === "de" && parsed.translation_status !== "canonical") {
    throw new Error(
      `DE content must use translation_status: "canonical" (got "${parsed.translation_status}")`,
    );
  }

  if (locale !== "de" && parsed.translation_status === "canonical") {
    throw new Error(
      `${locale.toUpperCase()} content cannot use translation_status: "canonical" (use "draft" or "reviewed")`,
    );
  }

  return parsed;
}
