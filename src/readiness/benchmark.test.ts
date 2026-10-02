import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { SurveyAggregates } from "@/survey/aggregates";

import { benchmarkSelection, readinessBenchmarks } from "./benchmark";
import { getReadinessCheck } from "./load";

const check = getReadinessCheck();

function aggregates(questions: SurveyAggregates["questions"]): SurveyAggregates {
  return {
    survey_id: "test",
    survey_version: 1,
    generated_at: null,
    n: 39,
    questions,
    cross_tabs: { spend_by_company_size: {} },
  };
}

describe("readinessBenchmarks", () => {
  it("computes shares from published counts", () => {
    const b = readinessBenchmarks(
      check,
      aggregates({
        "ai-governance-measures": { n: 39, counts: { "usage-policy": 18, "business-dpa": 16, dpia: 12 } },
        "eu-market-exposure": { n: 39, counts: { unsure: 6 } },
      }),
    );
    assert.deepEqual(b, {
      "usage-policy": 46,
      "accounts-dpa": 41,
      "risk-assessment": 31,
      "eu-exposure": 15,
    });
  });

  it("shows nothing below the suppression threshold or for unpublished counts", () => {
    assert.deepEqual(
      readinessBenchmarks(check, aggregates({ "ai-governance-measures": { n: 4, counts: {} } })),
      {},
    );
    assert.deepEqual(readinessBenchmarks(check, aggregates({})), {});
  });
});

describe("benchmarkSelection", () => {
  const benchmarks = { "usage-policy": 46, "accounts-dpa": 41, "risk-assessment": 31, "eu-exposure": 15 };
  const order = check.questions.map((q) => q.id);

  it("prefers the user's gaps in next-step order", () => {
    assert.deepEqual(
      benchmarkSelection(benchmarks, ["accounts-dpa", "data-location", "tool-approval", "usage-policy", "risk-assessment"], order),
      ["accounts-dpa", "usage-policy", "risk-assessment"],
    );
  });

  it("fills up with other benchmarked questions when there are few gaps", () => {
    assert.deepEqual(benchmarkSelection(benchmarks, [], order), [
      "accounts-dpa",
      "usage-policy",
      "risk-assessment",
    ]);
  });
});
