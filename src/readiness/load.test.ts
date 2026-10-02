import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getReadinessCheck, validateReadinessCheck } from "./load";
import type { ReadinessCheck } from "./schema";

const base = getReadinessCheck();

/** Deep copy of the real check, changed by `edit`, then validated. */
function validateWith(edit: (c: ReadinessCheck) => void): () => string[] {
  const copy = structuredClone(base);
  edit(copy);
  return () => validateReadinessCheck(copy);
}

describe("validateReadinessCheck", () => {
  it("accepts the real data file", () => {
    assert.doesNotThrow(() => validateReadinessCheck(base));
  });

  it("rejects gaps between tiers", () => {
    assert.throws(validateWith((c) => (c.tiers[1].min = 41)), /must start at 40/);
  });

  it("rejects a red flag on an option that doesn't exist", () => {
    assert.throws(
      validateWith((c) => (c.questions[2].red_flag!.option = "nope")),
      /red_flag option "nope" does not exist/,
    );
  });

  it("rejects show_if pointing at a later question", () => {
    assert.throws(
      validateWith((c) => (c.security.questions[0].show_if = { question: "untrusted-input", is: ["na"] })),
      /must refer to an earlier question/,
    );
  });

  it("rejects links to sections that don't exist", () => {
    assert.throws(
      validateWith((c) => c.questions[0].links.push("guide:ndsg-ai-basics#nope")),
      /has no heading anchor \{#nope\}/,
    );
    assert.throws(
      validateWith((c) => c.questions[0].links.push("tool:nope")),
      /unknown decision tool "nope"/,
    );
  });

  it("rejects pending links and missing FR/IT once live", () => {
    const goLiveWithPending = validateWith((c) => {
      c.status = "live";
      // Self-contained: the real data may have no pending links left.
      c.questions[0].pending_links.push({ link: "guide:ndsg-ai-basics#later", task: "T99" });
    });
    assert.throws(goLiveWithPending, (error: Error) => {
      assert.match(error.message, /pending link "guide:ndsg-ai-basics#later" \(T99\) not allowed when live/);
      assert.match(error.message, /title: missing fr, it/);
      return true;
    });
  });

  it("rejects listing a draft check", () => {
    assert.throws(
      validateWith((c) => {
        c.status = "draft";
        c.listed = true;
      }),
      /a draft check can't be listed/,
    );
  });

  it("rejects survey benchmarks that aren't survey options", () => {
    assert.throws(
      validateWith(
        (c) =>
          (c.questions[0].survey_benchmark = {
            field: "ai-governance-measures",
            option: "nope",
            statement: { de: "{pct} %", en: "{pct}%" },
          }),
      ),
      /survey_benchmark ai-governance-measures=nope is not a survey option/,
    );
  });

  it("requires {pct} in benchmark statements", () => {
    assert.throws(
      validateWith((c) => (c.questions[0].survey_benchmark!.statement.en = "Many companies do this.")),
      /survey_benchmark\.statement\.en must contain \{pct\}/,
    );
  });
});
