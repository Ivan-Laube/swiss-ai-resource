import { z } from "zod";

import type { Locale } from "@/i18n/config";

const httpsUrl = z.url().refine(
  (value) => value.startsWith("https://"),
  { message: "URL must be an absolute https:// URL" },
);

const kebabId = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
  message: "Must be kebab-case (e.g. us-hosted-llm-ndsg, q1, out-likely)",
});

const nonEmptyString = z.string().min(1);

/**
 * DE required. EN/FR/IT are optional at the Zod layer so partial drafts parse,
 * but launch trees must supply all four locales (enforced in `assertFullLocales`).
 */
export const localizedStringSchema = z
  .object({
    de: nonEmptyString,
    en: nonEmptyString.optional(),
    fr: nonEmptyString.optional(),
    it: nonEmptyString.optional(),
  })
  .strict();

export type LocalizedString = z.infer<typeof localizedStringSchema>;

export function pickLocalized(
  value: LocalizedString,
  locale: Locale,
): string {
  return value[locale] ?? value.de;
}

export const verdicts = [
  "likely",
  "unlikely",
  "unclear",
  "depends",
] as const;
export type Verdict = (typeof verdicts)[number];

export const ruleSourceSchema = z.object({
  title: nonEmptyString,
  url: httpsUrl,
});

export type RuleSource = z.infer<typeof ruleSourceSchema>;

const answerSchema = z.object({
  id: kebabId,
  label: localizedStringSchema,
  next: kebabId,
});

export type RuleAnswer = z.infer<typeof answerSchema>;

const questionNodeSchema = z.object({
  type: z.literal("question"),
  prompt: localizedStringSchema,
  help: localizedStringSchema.optional(),
  answers: z.array(answerSchema).min(2),
});

const outcomeNodeSchema = z.object({
  type: z.literal("outcome"),
  verdict: z.enum(verdicts),
  summary: localizedStringSchema,
  caveats: z.array(localizedStringSchema).min(1),
  sources: z.array(ruleSourceSchema).min(1),
  related_pages: z.array(kebabId).default([]),
});

export const ruleNodeSchema = z.discriminatedUnion("type", [
  questionNodeSchema,
  outcomeNodeSchema,
]);

export type RuleNode = z.infer<typeof ruleNodeSchema>;
export type QuestionNode = z.infer<typeof questionNodeSchema>;
export type OutcomeNode = z.infer<typeof outcomeNodeSchema>;

export const decisionTreeSchema = z.object({
  id: kebabId,
  version: z.number().int().positive(),
  title: localizedStringSchema,
  description: localizedStringSchema,
  start: kebabId,
  nodes: z.record(kebabId, ruleNodeSchema),
});

export type DecisionTree = z.infer<typeof decisionTreeSchema>;

export function parseDecisionTree(data: unknown): DecisionTree {
  return decisionTreeSchema.parse(data);
}
