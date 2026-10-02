import {
  NA,
  type Condition,
  type ReadinessCheck,
  type ReadinessQuestion,
  type SecurityQuestion,
  type Severity,
} from "./schema";

/**
 * Scoring engine for the readiness check. Pure and client-safe: it reads
 * the check definition and the answers, and returns ids and numbers only.
 * The UI looks up texts in the definition. All rules (points, tiers, red
 * flags, weights, security levels) come from data/readiness-check.json.
 */

/** question id → chosen option id (`na` for not applicable). */
export type Answers = Readonly<Record<string, string>>;

export function conditionHolds(condition: Condition, answers: Answers): boolean {
  const value = answers[condition.question];
  if (value === undefined) {
    return false;
  }
  return condition.is ? condition.is.includes(value) : !condition.is_not?.includes(value);
}

type AnyQuestion = ReadinessQuestion | SecurityQuestion;

/** Whether a question is shown, given the answers so far. */
export function isVisible(question: AnyQuestion, answers: Answers): boolean {
  return question.show_if ? conditionHolds(question.show_if, answers) : true;
}

/** Points for a question, or null when hidden, unanswered or N/A. */
function pointsFor(question: AnyQuestion, answers: Answers): 0 | 1 | 2 | null {
  if (!isVisible(question, answers)) {
    return null;
  }
  const option = question.options.find((o) => o.id === answers[question.id]);
  return option ? option.points : null;
}

/** Visible questions that still need an answer (profile included). */
export function missingAnswers(
  check: ReadinessCheck,
  answers: Answers,
  profile: Answers,
): string[] {
  const missing = check.profile.filter((p) => !profile[p.id]).map((p) => p.id);
  for (const q of [...check.questions, ...check.security.questions]) {
    if (isVisible(q, answers) && !answers[q.id]) {
      missing.push(q.id);
    }
  }
  return missing;
}

export function effectiveSeverity(question: ReadinessQuestion, answers: Answers): Severity {
  const override = question.severity_overrides.find((o) => conditionHolds(o.when, answers));
  return override ? override.severity : question.severity;
}

export type NextStep = {
  kind: "question" | "security";
  id: string;
  redFlag: boolean;
  /** Severity weight × (2 − points); 0 for security steps. */
  priority: number;
};

export type SecurityArea = {
  id: string;
  status: "covered" | "partly" | "gap" | "not_relevant";
};

export type ReadinessResult = {
  /** 0–100 over applicable questions, rounded. */
  score: number;
  points: number;
  max: number;
  dimensions: { id: string; score: number | null; points: number; max: number }[];
  /** Tier the score alone gives. */
  scoreTier: string;
  /** Tier shown (capped when a red flag is set). */
  tier: string;
  lowered: boolean;
  /** Question ids answered with their red-flag option, in question order. */
  redFlags: string[];
  /** All steps in display order; the first `top` are the headline steps. */
  nextSteps: NextStep[];
  top: NextStep[];
  security: {
    level: string;
    areas: SecurityArea[];
    /** Security question ids scoring below 2, in question order. */
    steps: string[];
    noneCanAct: boolean;
  };
  /** Links added to every step by profile answers (e.g. FINMA). */
  extraLinks: string[];
  /** Profile ids whose `add_links.note` applies. */
  profileNotes: string[];
};

function tierFor(check: ReadinessCheck, score: number): string {
  const tier = check.tiers.find((t) => score >= t.min && score <= t.max);
  if (!tier) {
    throw new Error(`No tier covers score ${score}`);
  }
  return tier.id;
}

function scoreSecurity(check: ReadinessCheck, answers: Answers): ReadinessResult["security"] {
  const areas: SecurityArea[] = [];
  const applicable: number[] = [];
  const steps: string[] = [];

  for (const q of check.security.questions) {
    const points = pointsFor(q, answers);
    if (points === null) {
      areas.push({ id: q.id, status: "not_relevant" });
      continue;
    }
    applicable.push(points);
    areas.push({ id: q.id, status: (["gap", "partly", "covered"] as const)[points] });
    if (points < 2) {
      steps.push(q.id);
    }
  }

  const rule = applicable.includes(0)
    ? "any-zero"
    : applicable.includes(1)
      ? "no-zero-some-one"
      : "all-two";
  const level = check.security.levels.find((l) => l.rule === rule);
  if (!level) {
    throw new Error(`No security level for rule ${rule}`);
  }

  return {
    level: level.id,
    areas,
    steps,
    noneCanAct: conditionHolds(check.security.none_can_act.when, answers),
  };
}

/** Score a complete set of answers. Throws if a visible question is unanswered. */
export function scoreReadiness(
  check: ReadinessCheck,
  answers: Answers,
  profile: Answers = {},
): ReadinessResult {
  const missing = missingAnswers(check, answers, profile).filter(
    (id) => !check.profile.some((p) => p.id === id),
  );
  if (missing.length > 0) {
    throw new Error(`Unanswered questions: ${missing.join(", ")}`);
  }

  const order = check.questions.map((q) => q.id);
  const dimensions = check.dimensions.map((d) => ({ id: d.id, points: 0, max: 0 }));
  const candidates: NextStep[] = [];
  const redFlags: string[] = [];
  let points = 0;
  let max = 0;

  for (const q of check.questions) {
    const p = pointsFor(q, answers);
    if (p === null) {
      continue;
    }
    const dim = dimensions.find((d) => d.id === q.dimension);
    if (dim) {
      dim.points += p;
      dim.max += 2;
    }
    points += p;
    max += 2;

    const redFlag = q.red_flag !== undefined && answers[q.id] === q.red_flag.option;
    if (redFlag) {
      redFlags.push(q.id);
    }
    if (p < 2) {
      candidates.push({
        kind: "question",
        id: q.id,
        redFlag,
        priority: check.next_steps.weights[effectiveSeverity(q, answers)] * (2 - p),
      });
    }
  }

  const score = max === 0 ? 0 : Math.round((points / max) * 100);
  const scoreTier = tierFor(check, score);
  const tierIndex = (id: string) => check.tiers.findIndex((t) => t.id === id);
  const capped =
    redFlags.length > 0 && tierIndex(scoreTier) > tierIndex(check.red_flags.cap_tier);
  const tier = capped ? check.red_flags.cap_tier : scoreTier;

  // Red flags first (question order), then priority, then question order.
  candidates.sort(
    (a, b) =>
      Number(b.redFlag) - Number(a.redFlag) ||
      (a.redFlag ? 0 : b.priority - a.priority) ||
      order.indexOf(a.id) - order.indexOf(b.id),
  );

  const security = scoreSecurity(check, answers);
  const nextSteps = [...candidates];
  if (security.level === check.security.promote_on_level) {
    const firstGap = check.security.questions.find((q) => pointsFor(q, answers) === 0);
    if (firstGap) {
      nextSteps.splice(redFlags.length, 0, {
        kind: "security",
        id: firstGap.id,
        redFlag: false,
        priority: 0,
      });
    }
  }

  const extraLinks: string[] = [];
  const profileNotes: string[] = [];
  for (const p of check.profile) {
    if (p.add_links && p.add_links.when.includes(profile[p.id] ?? "")) {
      extraLinks.push(...p.add_links.links);
      profileNotes.push(p.id);
    }
  }

  return {
    score,
    points,
    max,
    dimensions: dimensions.map((d) => ({
      ...d,
      score: d.max === 0 ? null : Math.round((d.points / d.max) * 100),
    })),
    scoreTier,
    tier,
    lowered: capped,
    redFlags,
    nextSteps,
    top: nextSteps.slice(0, check.next_steps.top),
    security,
    extraLinks,
    profileNotes,
  };
}

export { NA };
