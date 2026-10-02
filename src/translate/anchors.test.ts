import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { assertHeadingAnchorsMatch, restoreHeadingAnchors } from "./anchors";

const DE = [
  "## Wer ist betroffen?",
  "",
  "Text.",
  "",
  "## Transparenz und Information {#transparenz}",
  "",
  "### Details zu *Art. 19* {#art-19}",
  "",
  "Mehr.",
  "",
].join("\n");

describe("restoreHeadingAnchors", () => {
  it("leaves a translation that kept every marker unchanged", () => {
    const en = DE.replace("Wer ist betroffen?", "Who is affected?");
    assert.deepEqual(restoreHeadingAnchors(DE, en), { body: en, restored: [] });
  });

  it("puts dropped markers back on the matching headings", () => {
    const en = [
      "## Who is affected?",
      "",
      "Text.",
      "",
      "## Transparency and information",
      "",
      "### Details on *Art. 19*",
      "",
      "More.",
      "",
    ].join("\n");
    const { body, restored } = restoreHeadingAnchors(DE, en);
    assert.deepEqual(restored, ["transparenz", "art-19"]);
    assert.ok(body.includes("## Transparency and information {#transparenz}\n"));
    assert.ok(body.includes("### Details on *Art. 19* {#art-19}\n"));
    assert.ok(body.includes("## Who is affected?\n"));
    assert.ok(body.endsWith("More.\n"));
  });

  it("replaces a translated or invented marker with the DE one", () => {
    const en = DE.replace("{#transparenz}", "{#transparency}").replace(
      "## Wer ist betroffen?",
      "## Who is affected? {#who}",
    );
    const { body, restored } = restoreHeadingAnchors(DE, en);
    assert.deepEqual(restored, ["transparenz"]);
    assert.ok(body.includes("## Transparenz und Information {#transparenz}"));
    assert.ok(body.includes("## Who is affected?\n"));
    assert.ok(!body.includes("{#who}"));
  });

  it("refuses when the heading structure differs and markers are missing", () => {
    const en = "## Transparency\n\nText.\n";
    assert.throws(() => restoreHeadingAnchors(DE, en), /different h2\/h3 structure/);
  });

  it("accepts a different structure when the markers already match", () => {
    const en = "## Transparency {#transparenz}\n\n### Art. 19 {#art-19}\n";
    assert.deepEqual(restoreHeadingAnchors(DE, en).restored, []);
  });
});

describe("assertHeadingAnchorsMatch", () => {
  it("passes when the anchor sets are equal", () => {
    assert.doesNotThrow(() => assertHeadingAnchorsMatch(DE, DE));
  });

  it("names missing and unexpected anchors", () => {
    const en = "## A {#transparenz}\n\n## B {#extra}\n";
    assert.throws(
      () => assertHeadingAnchorsMatch(DE, en),
      /Missing: art-19; unexpected: extra/,
    );
  });
});
