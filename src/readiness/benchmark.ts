import type { SurveyAggregates } from "@/survey/aggregates";
import { SURVEY_SUPPRESSION_THRESHOLD } from "@/survey/aggregates";

import type { ReadinessCheck } from "./schema";

/** Share of surveyed companies per readiness question id (0–100, rounded). */
export type ReadinessBenchmarks = Record<string, number>;

/**
 * Survey shares for the questions that have a `survey_benchmark` (T48).
 * A question gets a value only when its survey question has at least
 * SURVEY_SUPPRESSION_THRESHOLD answers and the option's count is published
 * (aggregates already drop counts below the threshold, so a missing count
 * means "too few to show", never zero).
 */
export function readinessBenchmarks(
  check: ReadinessCheck,
  aggregates: SurveyAggregates,
): ReadinessBenchmarks {
  const out: ReadinessBenchmarks = {};
  for (const q of check.questions) {
    if (!q.survey_benchmark) {
      continue;
    }
    const { field, option } = q.survey_benchmark;
    const aggregate = aggregates.questions[field];
    const count = aggregate?.counts[option];
    if (!aggregate || aggregate.n < SURVEY_SUPPRESSION_THRESHOLD || count === undefined) {
      continue;
    }
    out[q.id] = Math.round((count / aggregate.n) * 100);
  }
  return out;
}

/**
 * Up to `max` question ids to compare, the user's own gaps first (in next-step
 * order), then other benchmarked questions in question order.
 */
export function benchmarkSelection(
  benchmarks: ReadinessBenchmarks,
  gapOrder: readonly string[],
  questionOrder: readonly string[],
  max = 3,
): string[] {
  const ordered = [...gapOrder, ...questionOrder.filter((id) => !gapOrder.includes(id))];
  return ordered.filter((id) => id in benchmarks).slice(0, max);
}
