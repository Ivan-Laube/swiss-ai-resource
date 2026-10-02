import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { listHeadingAnchors, splitHeadingAnchor } from "./heading-anchors";

describe("splitHeadingAnchor", () => {
  it("splits a trailing marker off the heading text", () => {
    assert.deepEqual(splitHeadingAnchor("Transparenz {#transparenz}"), {
      text: "Transparenz",
      anchor: "transparenz",
    });
  });

  it("leaves headings without a marker unchanged", () => {
    assert.deepEqual(splitHeadingAnchor("Wer ist betroffen?"), {
      text: "Wer ist betroffen?",
      anchor: null,
    });
  });
});

describe("listHeadingAnchors", () => {
  it("lists explicit anchors in document order", () => {
    const md = "## A {#first}\n\ntext\n\n### B {#second}\n\n## C\n";
    assert.deepEqual(
      listHeadingAnchors(md).map((a) => [a.anchor, a.depth, a.text]),
      [
        ["first", 2, "A"],
        ["second", 3, "B"],
      ],
    );
  });

  it("ignores markers inside code blocks", () => {
    assert.deepEqual(listHeadingAnchors("```\n## Not a heading {#x}\n```\n"), []);
  });

  it("rejects malformed anchors", () => {
    assert.throws(() => listHeadingAnchors("## A {#Bad_Id}"), /Invalid heading anchor/);
    assert.throws(() => listHeadingAnchors("## A {#}"), /Invalid heading anchor/);
  });

  it("rejects anchors on headings other than h2/h3", () => {
    assert.throws(() => listHeadingAnchors("#### A {#deep}"), /only h2 and h3/);
  });

  it("rejects duplicate anchors", () => {
    assert.throws(() => listHeadingAnchors("## A {#same}\n\n## B {#same}"), /Duplicate/);
  });
});
