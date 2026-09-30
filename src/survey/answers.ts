import { z } from "@/lib/zod";

import type { Survey, SurveyQuestion } from "./schema";

export const surveyLocales = ["de", "en", "fr", "it"] as const;
export type SurveyLocale = (typeof surveyLocales)[number];

/**
 * Questions where a designated exclusive option cannot combine with others.
 * Value is the exclusive option id (`none` or `none-yet`).
 */
export const exclusiveNoneQuestionIds = [
  "ai-tools",
  "deployment-blockers",
  "primary-use-cases",
  "ai-governance-measures",
] as const;

/** Exclusive option id for a question, if any. */
export function exclusiveOptionId(questionId: string): string | null {
  if (questionId === "primary-use-cases") return "none-yet";
  if (
    (exclusiveNoneQuestionIds as readonly string[]).includes(questionId)
  ) {
    return "none";
  }
  return null;
}

const emailSchema = z
  .string()
  .trim()
  .min(1)
  .max(320)
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Invalid email format" });

/**
 * Wire payload for POST /submit (form chrome + answers).
 * `website` is the honeypot — bots fill it; humans leave it empty.
 */
export const surveyIntakeSchema = z
  .object({
    survey_id: z.string().min(1),
    survey_version: z.number().int().positive(),
    locale: z.enum(surveyLocales),
    answers: z.record(
      z.string(),
      z.union([z.string(), z.array(z.string()), z.null()]),
    ),
    email: z.union([emailSchema, z.literal(""), z.null()]).optional(),
    report_opt_in: z.boolean().optional().default(false),
    website: z.string().optional().default(""),
    turnstile_token: z.string().min(1),
  })
  .strict();

export type SurveyIntake = z.infer<typeof surveyIntakeSchema>;

export type AnswerValue = string | string[];

export type ValidateAnswersResult =
  | { ok: true; answers: Record<string, AnswerValue> }
  | { ok: false; error: string };

function optionIds(question: SurveyQuestion): Set<string> {
  if (question.input === "text") return new Set();
  return new Set(question.options.map((o) => o.id));
}

function assertExclusiveNone(
  questionId: string,
  selected: string[],
): string | null {
  const exclusive = exclusiveOptionId(questionId);
  if (!exclusive) return null;
  if (selected.includes(exclusive) && selected.length > 1) {
    return `Question "${questionId}": option "${exclusive}" cannot be combined with other options`;
  }
  return null;
}

function assertMaxSelect(
  question: SurveyQuestion,
  selected: string[],
): string | null {
  if (question.input !== "multi") return null;
  const max = question.max_select;
  if (max === undefined) return null;
  const exclusive = exclusiveOptionId(question.id);
  // Exclusive-none alone is always allowed even if max_select is set.
  if (exclusive && selected.length === 1 && selected[0] === exclusive) {
    return null;
  }
  if (selected.length > max) {
    return `Question "${question.id}": at most ${max} options may be selected`;
  }
  return null;
}

/**
 * Validate answer map against a survey instrument.
 * Returns normalized answers (only known question ids) or an error message.
 */
export function validateAnswers(
  survey: Survey,
  raw: Record<string, unknown>,
): ValidateAnswersResult {
  const normalized: Record<string, AnswerValue> = {};
  const seen = new Set<string>();

  for (const question of survey.questions) {
    seen.add(question.id);
    const value = raw[question.id];

    if (value === undefined || value === null) {
      if (question.required) {
        return { ok: false, error: `Missing required answer for "${question.id}"` };
      }
      continue;
    }

    if (question.input === "single") {
      if (typeof value !== "string" || value.length === 0) {
        return {
          ok: false,
          error: `Question "${question.id}" expects a single option id string`,
        };
      }
      const allowed = optionIds(question);
      if (!allowed.has(value)) {
        return {
          ok: false,
          error: `Question "${question.id}": unknown option "${value}"`,
        };
      }
      normalized[question.id] = value;
      continue;
    }

    if (question.input === "multi") {
      if (!Array.isArray(value) || value.length === 0) {
        return {
          ok: false,
          error: `Question "${question.id}" expects a non-empty array of option ids`,
        };
      }
      if (!value.every((v) => typeof v === "string" && v.length > 0)) {
        return {
          ok: false,
          error: `Question "${question.id}": all selections must be non-empty strings`,
        };
      }
      const allowed = optionIds(question);
      const unique = [...new Set(value)];
      for (const id of unique) {
        if (!allowed.has(id)) {
          return {
            ok: false,
            error: `Question "${question.id}": unknown option "${id}"`,
          };
        }
      }
      const exclusiveErr = assertExclusiveNone(question.id, unique);
      if (exclusiveErr) return { ok: false, error: exclusiveErr };
      const maxErr = assertMaxSelect(question, unique);
      if (maxErr) return { ok: false, error: maxErr };
      normalized[question.id] = unique;
      continue;
    }

    // text
    if (question.input !== "text") {
      return {
        ok: false,
        error: `Question "${question.id}": unsupported input type`,
      };
    }
    if (typeof value !== "string") {
      return {
        ok: false,
        error: `Question "${question.id}" expects a string`,
      };
    }
    const max = question.max_length;
    if (max !== undefined && value.length > max) {
      return {
        ok: false,
        error: `Question "${question.id}" exceeds max_length ${max}`,
      };
    }
    if (question.required && value.trim().length === 0) {
      return { ok: false, error: `Missing required answer for "${question.id}"` };
    }
    normalized[question.id] = value;
  }

  for (const key of Object.keys(raw)) {
    if (!seen.has(key)) {
      return { ok: false, error: `Unknown answer key "${key}"` };
    }
  }

  return { ok: true, answers: normalized };
}

export type ValidateIntakeResult =
  | {
      ok: true;
      intake: SurveyIntake;
      answers: Record<string, AnswerValue>;
      email: string | null;
    }
  | { ok: false; error: string; status: 400 };

/**
 * Parse and validate a full intake body against the survey instrument.
 * Does not check Turnstile or honeypot side effects.
 */
export function validateIntake(
  survey: Survey,
  body: unknown,
): ValidateIntakeResult {
  const parsed = surveyIntakeSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const path = first?.path?.length ? first.path.join(".") : "body";
    const message = first?.message ?? "Invalid intake payload";
    return { ok: false, error: `${path}: ${message}`, status: 400 };
  }

  const intake = parsed.data;

  if (intake.survey_id !== survey.id) {
    return {
      ok: false,
      error: `survey_id must be "${survey.id}"`,
      status: 400,
    };
  }
  if (intake.survey_version !== survey.version) {
    return {
      ok: false,
      error: `survey_version must be ${survey.version}`,
      status: 400,
    };
  }

  const answersResult = validateAnswers(survey, intake.answers);
  if (!answersResult.ok) {
    return { ok: false, error: answersResult.error, status: 400 };
  }

  const emailRaw = intake.email;
  const email =
    emailRaw === undefined || emailRaw === null || emailRaw === ""
      ? null
      : emailRaw;

  return {
    ok: true,
    intake,
    answers: answersResult.answers,
    email,
  };
}

/** True when the honeypot field is filled (treat as bot; do not persist). */
export function isHoneypotTriggered(website: string | undefined): boolean {
  return typeof website === "string" && website.trim().length > 0;
}
