import { z } from "@/lib/zod";

import {
  localizedStringSchema,
  pickLocalized,
  type LocalizedString,
} from "@/rules/schema";

export { localizedStringSchema, pickLocalized, type LocalizedString };

const kebabId = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
  message: "Must be kebab-case (e.g. company-size, 10-49, 1000-plus)",
});

export const surveyInputs = ["single", "multi", "text"] as const;
export type SurveyInput = (typeof surveyInputs)[number];

export const surveyOptionSchema = z
  .object({
    id: kebabId,
    label: localizedStringSchema,
  })
  .strict();

export type SurveyOption = z.infer<typeof surveyOptionSchema>;

const surveyQuestionBaseSchema = z.object({
  id: kebabId,
  prompt: localizedStringSchema,
  help: localizedStringSchema.optional(),
  required: z.boolean(),
  aggregate: z.boolean(),
});

const choiceQuestionSchema = surveyQuestionBaseSchema
  .extend({
    input: z.enum(["single", "multi"]),
    options: z.array(surveyOptionSchema).min(2),
    /** Cap multi-select selections (ignored for single). */
    max_select: z.number().int().positive().optional(),
    /**
     * When true, shuffle nominal options per session (client-side).
     * Ordinal scales should leave this unset/false.
     * Options with ids `other`, `none`, or `none-yet` stay pinned last.
     */
    shuffle_options: z.boolean().optional(),
  })
  .strict();

const textQuestionSchema = surveyQuestionBaseSchema
  .extend({
    input: z.literal("text"),
    max_length: z.number().int().positive().optional(),
  })
  .strict();

export const surveyQuestionSchema = z.discriminatedUnion("input", [
  choiceQuestionSchema,
  textQuestionSchema,
]);

export type SurveyQuestion = z.infer<typeof surveyQuestionSchema>;
export type SurveyChoiceQuestion = z.infer<typeof choiceQuestionSchema>;
export type SurveyTextQuestion = z.infer<typeof textQuestionSchema>;

export const surveySchema = z
  .object({
    id: kebabId,
    version: z.number().int().positive(),
    estimated_minutes: z.number().int().positive(),
    title: localizedStringSchema,
    description: localizedStringSchema,
    questions: z.array(surveyQuestionSchema).min(10).max(14),
  })
  .strict()
  .superRefine((survey, ctx) => {
    for (const question of survey.questions) {
      if (question.input !== "multi") continue;
      if (question.max_select === undefined) continue;
      if (question.max_select > question.options.length) {
        ctx.addIssue({
          code: "custom",
          message: `Question "${question.id}": max_select exceeds option count`,
          path: ["questions"],
        });
      }
    }
  });

export type Survey = z.infer<typeof surveySchema>;

export function parseSurvey(data: unknown): Survey {
  return surveySchema.parse(data);
}
