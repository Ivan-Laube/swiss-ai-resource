import { localizedStringSchema } from "@/rules/schema";
import { z } from "@/lib/zod";

/**
 * AI readiness self-check (T45–T51). Everything the check says and scores
 * lives in `data/readiness-check.json`; the engine (`score.ts`) only reads
 * it, so rewording, re-weighting or adding a question is a data edit.
 * How to change the check: data/README.md#readiness-check.
 */

const kebabId = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
  message: "Must be kebab-case (e.g. accounts-dpa)",
});

export const severities = ["high", "medium", "low"] as const;
export type Severity = (typeof severities)[number];

/** Option id used for "not applicable" answers. */
export const NA = "na";

/**
 * Where a next step points. Prefixed so one list can mix destinations:
 * - `guide:<slug>` or `guide:<slug>#<anchor>` — a guide page or section
 * - `tool:<id>` — a decision tool under data/rules/
 * - `site:<page>` — another site page (see SITE_PAGES)
 * - `download:<id>` — a generated download (see DOWNLOADS)
 */
export const linkSchema = z
  .string()
  .regex(/^(guide|tool|site|download):[a-z0-9#-]+$/, {
    message: "Must be guide:<ref>, tool:<id>, site:<page> or download:<id>",
  });

/** Site pages a next step may link to, with their path below /<locale>/. */
export const SITE_PAGES = { vendors: "vendors/" } as const;

/**
 * Generated downloads (T49–T50): Markdown source per locale under
 * `content/templates/<id>/`, published at `path` below the site root.
 */
export const DOWNLOADS = {
  "ai-policy-template": { path: "downloads/ai-policy-template-{locale}.docx" },
} as const;

/** A link whose target is not built yet; allowed only while `status` is draft. */
const pendingLinkSchema = z
  .object({ link: linkSchema, task: z.string().regex(/^T\d+$/) })
  .strict();

/** Condition on an earlier answer (`is` / `is_not`: option ids, may include "na"). */
export const conditionSchema = z
  .object({
    question: kebabId,
    is: z.array(kebabId).min(1).optional(),
    is_not: z.array(kebabId).min(1).optional(),
  })
  .strict()
  .refine((c) => (c.is === undefined) !== (c.is_not === undefined), {
    message: "Use exactly one of is / is_not",
  });

export type Condition = z.infer<typeof conditionSchema>;

const scoredOptionSchema = z
  .object({
    id: kebabId,
    points: z.union([z.literal(0), z.literal(1), z.literal(2)]),
    label: localizedStringSchema,
  })
  .strict();

const naOptionSchema = z
  .object({ id: z.literal(NA), label: localizedStringSchema })
  .strict();

/** Fields shared by scored and security questions. */
const questionBase = {
  id: kebabId,
  prompt: localizedStringSchema,
  help: localizedStringSchema.optional(),
  options: z.array(scoredOptionSchema).length(3),
  na_option: naOptionSchema.optional(),
  /** Shown only when this holds; hidden questions count as not applicable. */
  show_if: conditionSchema.optional(),
  action: localizedStringSchema,
  links: z.array(linkSchema).default([]),
  pending_links: z.array(pendingLinkSchema).default([]),
  /** Legal references, for reviewers; not shown in the UI. */
  legal_hooks: z.array(z.string().min(1)).default([]),
};

const questionSchema = z
  .object({
    ...questionBase,
    dimension: kebabId,
    severity: z.enum(severities),
    /** First matching override wins (e.g. Q6 becomes medium with EU exposure). */
    severity_overrides: z
      .array(z.object({ when: conditionSchema, severity: z.enum(severities) }).strict())
      .default([]),
    /** Answering this option caps the tier and leads the next steps. */
    red_flag: z
      .object({ option: kebabId, topic: localizedStringSchema })
      .strict()
      .optional(),
    /**
     * Survey aggregate to compare with (T48): share of respondents who chose
     * `option` in `field`. `statement` must contain {pct}, e.g.
     * "{pct} % der befragten Unternehmen haben eine KI-Nutzungsrichtlinie."
     */
    survey_benchmark: z
      .object({ field: kebabId, option: kebabId, statement: localizedStringSchema })
      .strict()
      .optional(),
  })
  .strict();

export type ReadinessQuestion = z.infer<typeof questionSchema>;

const securityQuestionSchema = z
  .object({ ...questionBase, area: localizedStringSchema })
  .strict();

export type SecurityQuestion = z.infer<typeof securityQuestionSchema>;

const profileQuestionSchema = z
  .object({
    id: kebabId,
    /** Reuse prompt and options of a survey question (single source of wording). */
    from_survey: kebabId.optional(),
    prompt: localizedStringSchema.optional(),
    options: z
      .array(z.object({ id: kebabId, label: localizedStringSchema }).strict())
      .optional(),
    /** Shown before the scored questions when the answer is one of `when`. */
    notes: z
      .array(z.object({ when: z.array(kebabId).min(1), text: localizedStringSchema }).strict())
      .default([]),
    /** Extra links added to every next step when the answer is one of `when`. */
    add_links: z
      .object({
        when: z.array(kebabId).min(1),
        links: z.array(linkSchema).min(1),
        note: localizedStringSchema,
      })
      .strict()
      .optional(),
  })
  .strict()
  .refine((p) => (p.from_survey === undefined) !== (p.prompt === undefined && p.options === undefined), {
    message: "Use either from_survey or prompt + options",
  })
  .refine((p) => p.from_survey !== undefined || (p.prompt && p.options && p.options.length >= 2), {
    message: "prompt and at least two options are required without from_survey",
  });

export type ProfileQuestion = z.infer<typeof profileQuestionSchema>;

const tierSchema = z
  .object({
    id: kebabId,
    min: z.number().int().min(0).max(100),
    max: z.number().int().min(0).max(100),
    label: localizedStringSchema,
    summary: localizedStringSchema,
  })
  .strict();

export const securityLevelRules = ["any-zero", "no-zero-some-one", "all-two"] as const;

const securityLevelSchema = z
  .object({
    id: kebabId,
    rule: z.enum(securityLevelRules),
    label: localizedStringSchema,
    summary: localizedStringSchema,
  })
  .strict();

export const readinessCheckSchema = z
  .object({
    id: kebabId,
    /** Bump when questions, options or scoring change; printed on the result. */
    version: z.number().int().positive(),
    /** `draft`: FR/IT and pending links allowed. `live`: everything complete. */
    status: z.enum(["draft", "live"]),
    title: localizedStringSchema,
    description: localizedStringSchema,
    disclaimer: localizedStringSchema,
    /** "Answers are kept only while this page is open…" (start + print button). */
    session_note: localizedStringSchema,
    profile: z.array(profileQuestionSchema).min(1),
    dimensions: z
      .array(z.object({ id: kebabId, title: localizedStringSchema }).strict())
      .min(1),
    questions: z.array(questionSchema).min(1),
    tiers: z.array(tierSchema).min(2),
    red_flags: z
      .object({
        /** Highest tier a result with any red flag can reach. */
        cap_tier: kebabId,
        /** Shown when the cap lowered the tier. {score}, {tier}, {capped_tier}, {topics}. */
        lowered: localizedStringSchema,
        /** Shown when the tier was already at or below the cap. {topics}. */
        banner: localizedStringSchema,
        /** Joins topics: "A and B". */
        and: localizedStringSchema,
      })
      .strict(),
    next_steps: z
      .object({
        top: z.number().int().positive(),
        weights: z.object({ high: z.number(), medium: z.number(), low: z.number() }).strict(),
      })
      .strict(),
    security: z
      .object({
        title: localizedStringSchema,
        intro: localizedStringSchema,
        not_covered: localizedStringSchema,
        /** Shown when no AI tool can act on its own (first question answered N/A). */
        none_can_act: z.object({ when: conditionSchema, text: localizedStringSchema }).strict(),
        tag: localizedStringSchema,
        statuses: z
          .object({
            covered: localizedStringSchema,
            partly: localizedStringSchema,
            gap: localizedStringSchema,
            not_relevant: localizedStringSchema,
          })
          .strict(),
        levels: z.array(securityLevelSchema).length(3),
        /** With this level, the first security gap also enters the main top steps. */
        promote_on_level: kebabId,
        questions: z.array(securityQuestionSchema).min(1),
      })
      .strict(),
  })
  .strict();

export type ReadinessCheck = z.infer<typeof readinessCheckSchema>;

export function parseReadinessCheck(data: unknown): ReadinessCheck {
  return readinessCheckSchema.parse(data);
}
