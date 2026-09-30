import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { counselReviewComplete } from "./schema";

describe("counselReviewComplete", () => {
  it("is false when all fields are null", () => {
    assert.equal(
      counselReviewComplete({
        reviewed_by: null,
        review_date: null,
        review_scope: null,
      }),
      false,
    );
  });

  it("is false when only some fields are set", () => {
    assert.equal(
      counselReviewComplete({
        reviewed_by: "Counsel",
        review_date: "2026-01-01",
        review_scope: null,
      }),
      false,
    );
  });

  it("is true when all three fields are set", () => {
    assert.equal(
      counselReviewComplete({
        reviewed_by: "Counsel",
        review_date: "2026-01-01",
        review_scope: "Guides only",
      }),
      true,
    );
  });
});
