import { z } from "zod";

const httpsUrl = z.url().refine(
  (value) => value.startsWith("https://"),
  { message: "URL must be an absolute https:// URL" },
);

const kebabId = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Id must be kebab-case (e.g. personendaten, hochrisiko-ki-system)",
  });

export const domains = ["dsg", "ai_act", "institutional", "other"] as const;
export type Domain = (typeof domains)[number];

const nonEmptyTerm = z.string().min(1);

export const abbreviationsSchema = z
  .object({
    de: nonEmptyTerm.optional(),
    fr: nonEmptyTerm.optional(),
    it: nonEmptyTerm.optional(),
  })
  .strict();

export type Abbreviations = z.infer<typeof abbreviationsSchema>;

export const glossaryTermSchema = z.object({
  id: kebabId,
  domain: z.enum(domains),
  de: nonEmptyTerm,
  fr: nonEmptyTerm,
  it: nonEmptyTerm,
  abbreviations: abbreviationsSchema.optional(),
  source_url: httpsUrl,
  notes: z.union([z.string().min(1), z.null()]),
});

export type GlossaryTerm = z.infer<typeof glossaryTermSchema>;

export const glossaryFileSchema = z.object({
  terms: z.array(glossaryTermSchema),
});

export type GlossaryFile = z.infer<typeof glossaryFileSchema>;

export function parseGlossaryTerm(data: unknown): GlossaryTerm {
  return glossaryTermSchema.parse(data);
}

/** Parse the root glossary.json object. Does not enforce unique ids (loader does). */
export function parseGlossaryFile(data: unknown): GlossaryFile {
  return glossaryFileSchema.parse(data);
}
