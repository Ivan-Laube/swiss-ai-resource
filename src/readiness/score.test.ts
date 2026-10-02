import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getReadinessCheck } from "./load";
import { scoreReadiness, type Answers } from "./score";

// Runs against the real data/readiness-check.json, so a data change that
// alters scoring shows up here as a readable diff. The worked examples are
// the ones signed off in docs/ai-readiness-check-draft.md (section 5.5).
const check = getReadinessCheck();
const Q = check.questions.map((q) => q.id); // Q1..Q12 in draft order
const OPTION = { 0: "gap", 1: "partly", 2: "covered", na: "na" } as const;

/** Answers in draft notation: [Q1, …, Q12] as 0 | 1 | 2 | "na". */
function answers(
  scored: (0 | 1 | 2 | "na")[],
  security: Record<string, 0 | 1 | 2 | "na"> = {
    "agent-access": "na",
    "fraud-verification": 2,
  },
): Answers {
  assert.equal(scored.length, Q.length);
  const result: Record<string, string> = {};
  scored.forEach((value, i) => (result[Q[i]] = OPTION[value]));
  for (const [id, value] of Object.entries(security)) {
    result[id] = OPTION[value];
  }
  return result;
}

const q = (n: number) => Q[n - 1];
const ids = (steps: { id: string }[]) => steps.map((s) => s.id);

describe("worked examples (draft 5.5)", () => {
  it("small Treuhand with free accounts and no rules: 20, getting started", () => {
    const r = scoreReadiness(check, answers([1, 0, 0, 0, 0, 1, 1, "na", 0, "na", 1, 0]));
    assert.equal(r.points, 4);
    assert.equal(r.max, 20);
    assert.equal(r.score, 20);
    assert.equal(r.tier, "getting-started");
    assert.equal(r.lowered, false);
    assert.deepEqual(r.redFlags, [q(3)]);
    assert.deepEqual(ids(r.top), [q(3), q(4), q(2)]);
  });

  it("machine maker with EU customers: 73, in progress, Q6 raised to medium", () => {
    const r = scoreReadiness(check, answers([2, 2, 2, 2, 2, 1, 1, "na", 1, 0, 2, 1]));
    assert.equal(r.score, 73);
    assert.equal(r.tier, "in-progress");
    assert.equal(r.lowered, false); // already at the cap: banner, no downgrade text
    assert.deepEqual(ids(r.top), [q(10), q(6), q(7)]);
  });

  it("recruiting agency, 86 but AI screens applicants: lowered to in progress", () => {
    const r = scoreReadiness(check, answers([2, 2, 2, 2, 2, 2, 2, 0, 2, "na", 2, 1]));
    assert.equal(r.score, 86);
    assert.equal(r.scoreTier, "well-set-up");
    assert.equal(r.tier, "in-progress");
    assert.equal(r.lowered, true);
    assert.deepEqual(ids(r.top), [q(8), q(12)]);
  });
});

describe("rules", () => {
  it("Q6 stays low without EU exposure", () => {
    // Q6 and Q12 both at 1 point; low weight ties, question order decides.
    const r = scoreReadiness(check, answers([2, 2, 2, 2, 2, 1, 2, "na", 2, "na", 2, 1]));
    assert.deepEqual(
      r.nextSteps.map((s) => [s.id, s.priority]),
      [
        [q(6), 1],
        [q(12), 1],
      ],
    );
  });

  it("all answers 2: well set up, no steps", () => {
    const r = scoreReadiness(check, answers([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]));
    assert.equal(r.score, 100);
    assert.equal(r.tier, "well-set-up");
    assert.deepEqual(r.nextSteps, []);
    assert.deepEqual(r.dimensions.map((d) => d.score), [100, 100, 100, 100, 100, 100]);
  });

  it("tier boundaries come from the data", () => {
    // 15/20 = 75 → well set up; 7/18 = 38.9 → 39 → getting started
    const high = scoreReadiness(check, answers([2, 2, "na", 1, 1, 1, 2, 1, 2, "na", 2, 1]));
    assert.equal(high.score, 75);
    assert.equal(high.tier, "well-set-up");
    const low = scoreReadiness(check, answers([1, 1, "na", 1, 1, 1, 1, "na", 0, "na", 0, 1]));
    assert.equal(low.score, 39);
    assert.equal(low.tier, "getting-started");
  });

  it("refuses incomplete answers", () => {
    const a = { ...answers([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]) };
    delete (a as Record<string, string>)[q(5)];
    assert.throws(() => scoreReadiness(check, a), /Unanswered questions: usage-policy/);
  });

  it("FINMA profile answers add links and a note", () => {
    const all2 = answers([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
    const yes = scoreReadiness(check, all2, { finma: "yes" });
    assert.deepEqual(yes.extraLinks, ["guide:finma-ai-expectations"]);
    assert.deepEqual(yes.profileNotes, ["finma"]);
    assert.deepEqual(scoreReadiness(check, all2, { finma: "no" }).extraLinks, []);
  });
});

describe("security initial assessment", () => {
  const all2 = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2] as const;

  it("no acting AI tools: S2 hidden, note shown, level from S3", () => {
    const r = scoreReadiness(check, answers([...all2], { "agent-access": "na", "fraud-verification": 1 }));
    assert.equal(r.security.noneCanAct, true);
    assert.deepEqual(
      r.security.areas.map((a) => a.status),
      ["not_relevant", "not_relevant", "partly"],
    );
    assert.equal(r.security.level, "medium");
    assert.deepEqual(r.security.steps, ["fraud-verification"]);
  });

  it("S2 must be answered once S1 says tools can act", () => {
    assert.throws(
      () => scoreReadiness(check, answers([...all2], { "agent-access": 2, "fraud-verification": 2 })),
      /untrusted-input/,
    );
  });

  it("all safeguards in place: low", () => {
    const r = scoreReadiness(
      check,
      answers([...all2], { "agent-access": 2, "untrusted-input": 2, "fraud-verification": 2 }),
    );
    assert.equal(r.security.level, "low");
    assert.deepEqual(r.security.steps, []);
  });

  it("high level puts the first security gap into the main steps after red flags", () => {
    const r = scoreReadiness(
      check,
      answers([2, 2, 0, 2, 2, 2, 2, "na", 2, "na", 2, 1], {
        "agent-access": 1,
        "untrusted-input": 0,
        "fraud-verification": 0,
      }),
    );
    assert.equal(r.security.level, "high");
    assert.deepEqual(
      r.top.map((s) => `${s.kind}:${s.id}`),
      [`question:${q(3)}`, "security:untrusted-input", `question:${q(12)}`],
    );
    // The security block keeps all its own steps.
    assert.deepEqual(r.security.steps, ["agent-access", "untrusted-input", "fraud-verification"]);
  });
});
