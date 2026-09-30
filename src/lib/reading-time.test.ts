import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { readingTimeMinutes } from "./reading-time";

describe("readingTimeMinutes", () => {
  it("returns at least 1 for short text", () => {
    assert.equal(readingTimeMinutes("hello world"), 1);
    assert.equal(readingTimeMinutes(""), 1);
  });

  it("rounds words ÷ 200", () => {
    const words = Array.from({ length: 300 }, () => "word").join(" ");
    assert.equal(readingTimeMinutes(words), 2);
  });
});
