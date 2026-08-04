import { z } from "zod";

import {
  localizedStringSchema,
  pickLocalized,
  type LocalizedString,
} from "@/rules/schema";

export { localizedStringSchema, pickLocalized, type LocalizedString };

const httpsUrl = z
  .url()
  .refine((value) => value.startsWith("https://"), {
    message: "URL must be an absolute https:// URL",
  });

const kebabId = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
  message: "Must be kebab-case (e.g. privacy-policy-link, google-analytics)",
});

const nonEmptyString = z.string().min(1);

/**
 * Detection patterns keyed by locale. Each locale supplies ≥1 non-empty
 * matcher string (link text / anchor keyword). Localized because the same
 * obligation surfaces under different words per language (Impressum /
 * Mentions légales / Note legali). All four locales are required so the
 * scanner works on any Swiss site regardless of its language.
 */
export const localizedPatternsSchema = z
  .object({
    de: z.array(nonEmptyString).min(1),
    en: z.array(nonEmptyString).min(1),
    fr: z.array(nonEmptyString).min(1),
    it: z.array(nonEmptyString).min(1),
  })
  .strict();

export type LocalizedPatterns = z.infer<typeof localizedPatternsSchema>;

/** Article reference plus the official Fedlex/source URL backing the check. */
export const legalBasisSchema = z
  .object({
    reference: nonEmptyString,
    url: httpsUrl,
  })
  .strict();

export type LegalBasis = z.infer<typeof legalBasisSchema>;

export const severities = ["high", "medium", "low", "info"] as const;
export type Severity = (typeof severities)[number];

export const checkMethods = [
  "tls",
  "link",
  "script_signature",
  "response_header",
  "static_scan_flag",
] as const;
export type CheckMethod = (typeof checkMethods)[number];

/**
 * A named third-party service (CMP, tracker, tag manager, SPA framework).
 * `patterns` are locale-independent substrings matched against page HTML,
 * script `src` attributes, and referenced resource URLs.
 */
export const signatureSchema = z
  .object({
    id: kebabId,
    label: nonEmptyString,
    patterns: z.array(nonEmptyString).min(1),
  })
  .strict();

export type Signature = z.infer<typeof signatureSchema>;

/** A response header the engine probes for (name is the lower-cased header). */
export const headerProbeSchema = z
  .object({
    id: kebabId,
    name: nonEmptyString,
    label: nonEmptyString,
  })
  .strict();

export type HeaderProbe = z.infer<typeof headerProbeSchema>;

const checkBaseSchema = z.object({
  id: kebabId,
  title: localizedStringSchema,
  description: localizedStringSchema,
  severity: z.enum(severities),
  legal_basis: legalBasisSchema,
  /** Cornerstone slug to cite (must be a publishable DE slug), or null. */
  related_page: kebabId.nullable(),
});

const tlsCheckSchema = checkBaseSchema
  .extend({
    method: z.literal("tls"),
    /** Also verify a plain-HTTP request redirects to HTTPS. */
    require_https_redirect: z.boolean(),
  })
  .strict();

const linkCheckSchema = checkBaseSchema
  .extend({
    method: z.literal("link"),
    patterns: localizedPatternsSchema,
    /** HEAD-request the matched link to confirm it resolves (not a 4xx/5xx). */
    verify_link: z.boolean(),
  })
  .strict();

const scriptSignatureCheckSchema = checkBaseSchema
  .extend({
    method: z.literal("script_signature"),
    /** True for trackers/loads that imply a cross-border data transfer. */
    implies_data_export: z.boolean(),
    signatures: z.array(signatureSchema).min(1),
  })
  .strict();

const responseHeaderCheckSchema = checkBaseSchema
  .extend({
    method: z.literal("response_header"),
    headers: z.array(headerProbeSchema).min(1),
  })
  .strict();

const staticScanFlagCheckSchema = checkBaseSchema
  .extend({
    method: z.literal("static_scan_flag"),
    /** Signatures whose presence means a static fetch may miss injected scripts. */
    signatures: z.array(signatureSchema).min(1),
  })
  .strict();

export const scannerCheckSchema = z.discriminatedUnion("method", [
  tlsCheckSchema,
  linkCheckSchema,
  scriptSignatureCheckSchema,
  responseHeaderCheckSchema,
  staticScanFlagCheckSchema,
]);

export type ScannerCheck = z.infer<typeof scannerCheckSchema>;
export type TlsCheck = z.infer<typeof tlsCheckSchema>;
export type LinkCheck = z.infer<typeof linkCheckSchema>;
export type ScriptSignatureCheck = z.infer<typeof scriptSignatureCheckSchema>;
export type ResponseHeaderCheck = z.infer<typeof responseHeaderCheckSchema>;
export type StaticScanFlagCheck = z.infer<typeof staticScanFlagCheckSchema>;

export const scannerChecksFileSchema = z
  .object({
    version: z.number().int().positive(),
    checks: z.array(scannerCheckSchema).min(1),
  })
  .strict();

export type ScannerChecksFile = z.infer<typeof scannerChecksFileSchema>;

export function parseScannerChecks(data: unknown): ScannerChecksFile {
  return scannerChecksFileSchema.parse(data);
}
