import { z } from "zod";

const httpsUrl = z.url().refine(
  (value) => value.startsWith("https://"),
  { message: "URL must be an absolute https:// URL" },
);

const kebabId = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Id must be kebab-case (e.g. edoeb-home, openai-dpa)",
  });

export const categories = [
  "regulator",
  "vendor",
  "guidance",
  "other",
] as const;
export type Category = (typeof categories)[number];

export const sourceSchema = z.object({
  id: kebabId,
  title: z.string().min(1),
  url: httpsUrl,
  selector: z.string().min(1),
  dependent_pages: z.array(z.string().min(1)),
  category: z.enum(categories),
  vendor_id: kebabId.nullable(),
  /** Alternate https URLs tried after the primary when fetch/extract fails (T38). */
  fallback_urls: z.array(httpsUrl).default([]),
});

export type Source = z.infer<typeof sourceSchema>;

export const sourcesFileSchema = z.object({
  sources: z.array(sourceSchema),
});

export type SourcesFile = z.infer<typeof sourcesFileSchema>;

export function parseSource(data: unknown): Source {
  return sourceSchema.parse(data);
}

/** Parse the root sources.json object. Does not enforce unique ids (loader does). */
export function parseSourcesFile(data: unknown): SourcesFile {
  return sourcesFileSchema.parse(data);
}
