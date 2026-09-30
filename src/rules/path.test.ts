import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  formatAnswerHash,
  longestQuestionCount,
  parseAnswerHash,
  replayPath,
} from "./path";
import type { DecisionTree } from "./schema";

const tree: DecisionTree = {
  id: "sample-tool",
  version: 1,
  title: { de: "Sample" },
  description: { de: "Desc" },
  start: "q1",
  nodes: {
    q1: {
      type: "question",
      prompt: { de: "Q1?" },
      answers: [
        { id: "no", label: { de: "Nein" }, next: "out-a" },
        { id: "yes", label: { de: "Ja" }, next: "q2" },
      ],
    },
    q2: {
      type: "question",
      prompt: { de: "Q2?" },
      answers: [
        { id: "a", label: { de: "A" }, next: "out-b" },
        { id: "b", label: { de: "B" }, next: "out-c" },
      ],
    },
    "out-a": {
      type: "outcome",
      verdict: "likely",
      summary: { de: "A" },
      caveats: [{ de: "c" }],
      sources: [{ title: "S", url: "https://example.com" }],
      related_pages: [],
    },
    "out-b": {
      type: "outcome",
      verdict: "unlikely",
      summary: { de: "B" },
      caveats: [{ de: "c" }],
      sources: [{ title: "S", url: "https://example.com" }],
      related_pages: [],
    },
    "out-c": {
      type: "outcome",
      verdict: "depends",
      summary: { de: "C" },
      caveats: [{ de: "c" }],
      sources: [{ title: "S", url: "https://example.com" }],
      related_pages: [],
    },
  },
};

describe("parseAnswerHash", () => {
  it("treats missing and empty hash as start", () => {
    assert.deepEqual(parseAnswerHash(""), { ok: true, ids: [] });
    assert.deepEqual(parseAnswerHash("#"), { ok: true, ids: [] });
    assert.deepEqual(parseAnswerHash("#a="), { ok: true, ids: [] });
  });

  it("parses dotted answer ids", () => {
    assert.deepEqual(parseAnswerHash("#a=yes.a"), {
      ok: true,
      ids: ["yes", "a"],
    });
  });

  it("rejects non-a hashes and bad ids", () => {
    assert.deepEqual(parseAnswerHash("#url=https://x"), { ok: false });
    assert.deepEqual(parseAnswerHash("#a=Yes"), { ok: false });
    assert.deepEqual(parseAnswerHash("#a=yes..a"), { ok: false });
  });
});

describe("formatAnswerHash", () => {
  it("formats empty and non-empty paths", () => {
    assert.equal(formatAnswerHash([]), "");
    assert.equal(formatAnswerHash(["yes", "a"]), "#a=yes.a");
  });
});

describe("replayPath", () => {
  it("replays a valid path to an outcome", () => {
    const result = replayPath(tree, ["yes", "a"]);
    assert.equal(result.ok, true);
    if (!result.ok) {
      return;
    }
    assert.equal(result.currentId, "out-b");
    assert.equal(result.steps.length, 2);
    assert.equal(result.steps[0]?.answerId, "yes");
    assert.equal(result.steps[1]?.answerId, "a");
  });

  it("rejects unknown answer ids", () => {
    assert.deepEqual(replayPath(tree, ["maybe"]), { ok: false });
    assert.deepEqual(replayPath(tree, ["no", "a"]), { ok: false });
  });
});

describe("longestQuestionCount", () => {
  it("counts the longest question chain from a node", () => {
    assert.equal(longestQuestionCount(tree, "q1"), 2);
    assert.equal(longestQuestionCount(tree, "q2"), 1);
    assert.equal(longestQuestionCount(tree, "out-a"), 0);
  });
});
