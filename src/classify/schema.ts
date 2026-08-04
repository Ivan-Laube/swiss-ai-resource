import { z } from "zod";

export const llmClassificationSchema = z.object({
  classification: z.enum(["cosmetic", "material"]),
  rationale: z.string().min(1),
  confidence: z.enum(["low", "medium", "high"]).optional(),
});

export type LlmClassification = z.infer<typeof llmClassificationSchema>;

export const diffStatsSchema = z.object({
  additions: z.number().int().nonnegative(),
  deletions: z.number().int().nonnegative(),
  hunks: z.number().int().nonnegative(),
});

export const sourceClassificationSchema = z.object({
  id: z.string(),
  status: z.enum(["classified", "baseline", "skipped", "failed"]),
  classification: z.enum(["cosmetic", "material"]).nullable(),
  rationale: z.string().nullable(),
  confidence: z.enum(["low", "medium", "high"]).nullable().optional(),
  dependent_pages: z.array(z.string()),
  diff_stats: diffStatsSchema.nullable().optional(),
  diff_truncated: z.boolean().optional(),
  error: z.string().optional(),
});

export type SourceClassification = z.infer<typeof sourceClassificationSchema>;

export const classifySummarySchema = z.object({
  material: z.number().int().nonnegative(),
  cosmetic: z.number().int().nonnegative(),
  baseline: z.number().int().nonnegative(),
  skipped: z.number().int().nonnegative(),
  failed: z.number().int().nonnegative(),
});

export const classifyReportSchema = z.object({
  classified_at: z.string(),
  dry_run: z.boolean(),
  model: z.string(),
  sources: z.array(sourceClassificationSchema),
  summary: classifySummarySchema,
});

export type ClassifyReport = z.infer<typeof classifyReportSchema>;
