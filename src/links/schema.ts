import { z } from "zod";

export const linkCitationKinds = ["content", "vendor", "rule"] as const;
export type LinkCitationKind = (typeof linkCitationKinds)[number];

export const linkCitationSchema = z.object({
  kind: z.enum(linkCitationKinds),
  id: z.string().min(1),
});

export type LinkCitation = z.infer<typeof linkCitationSchema>;

export const linkResultSchema = z.object({
  url: z.string().min(1),
  ok: z.boolean(),
  http_status: z.number().int().nullable(),
  error: z.string().optional(),
  reused_from_run: z.boolean(),
  sources: z.array(linkCitationSchema).min(1),
});

export type LinkResult = z.infer<typeof linkResultSchema>;

export const linksReportSchema = z.object({
  checked_at: z.string().min(1),
  dry_run: z.boolean(),
  results: z.array(linkResultSchema),
  summary: z.object({
    total: z.number().int().nonnegative(),
    ok: z.number().int().nonnegative(),
    broken: z.number().int().nonnegative(),
    reused: z.number().int().nonnegative(),
    probed: z.number().int().nonnegative(),
  }),
});

export type LinksReport = z.infer<typeof linksReportSchema>;
