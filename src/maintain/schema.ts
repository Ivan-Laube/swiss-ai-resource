import { z } from "zod";

export const actPageActionSchema = z.object({
  slug: z.string().min(1),
  source_ids: z.array(z.string().min(1)),
  reason: z.enum(["unchanged", "material"]),
});

export type ActPageAction = z.infer<typeof actPageActionSchema>;

export const actVendorBumpSchema = z.object({
  vendor_id: z.string().min(1),
  source_ids: z.array(z.string().min(1)),
  reason: z.enum(["unchanged"]),
});

export type ActVendorBump = z.infer<typeof actVendorBumpSchema>;

export const actVendorMaterialSchema = z.object({
  vendor_id: z.string().min(1),
  source_ids: z.array(z.string().min(1)),
  fields_changed: z.array(z.string().min(1)),
  extract_error: z.string().optional(),
  rationale: z.string().nullable().optional(),
});

export type ActVendorMaterial = z.infer<typeof actVendorMaterialSchema>;

export const actReportSchema = z.object({
  acted_at: z.string().min(1),
  dry_run: z.boolean(),
  verified_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  bumped: z.array(actPageActionSchema),
  material: z.array(actPageActionSchema),
  skipped_slugs: z.array(z.string().min(1)),
  bumped_files: z.array(z.string().min(1)),
  material_files: z.array(z.string().min(1)),
  brief_path: z.string().nullable(),
  vendors_bumped: z.array(actVendorBumpSchema),
  vendors_material: z.array(actVendorMaterialSchema),
  vendors_skipped: z.array(z.string().min(1)),
  vendor_files: z.array(z.string().min(1)),
  summary: z.object({
    bumped: z.number().int().nonnegative(),
    material: z.number().int().nonnegative(),
    skipped: z.number().int().nonnegative(),
    bumped_files: z.number().int().nonnegative(),
    material_files: z.number().int().nonnegative(),
    vendors_bumped: z.number().int().nonnegative(),
    vendors_material: z.number().int().nonnegative(),
    vendors_skipped: z.number().int().nonnegative(),
    vendor_files: z.number().int().nonnegative(),
  }),
});

export type ActReport = z.infer<typeof actReportSchema>;
