import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { canonicalContentEquals, extractCanonicalContent } from "./changed-de";

const page = (body: string) => `---\ntitle: "T"\ndescription: "D"\n---\n\n${body}`;

describe("canonical DE change detection", () => {
  it("ignores added or renamed heading anchors", () => {
    const before = extractCanonicalContent(page("## Transparenz\n\nText.\n"));
    const added = extractCanonicalContent(page("## Transparenz {#transparency}\n\nText.\n"));
    const renamed = extractCanonicalContent(page("## Transparenz {#transparenz}\n\nText.\n"));
    assert.ok(canonicalContentEquals(before, added));
    assert.ok(canonicalContentEquals(added, renamed));
  });

  it("still detects prose and heading text changes", () => {
    const before = extractCanonicalContent(page("## Transparenz {#transparency}\n\nText.\n"));
    const heading = extractCanonicalContent(page("## Transparenzpflichten {#transparency}\n\nText.\n"));
    const prose = extractCanonicalContent(page("## Transparenz {#transparency}\n\nMehr Text.\n"));
    assert.ok(!canonicalContentEquals(before, heading));
    assert.ok(!canonicalContentEquals(before, prose));
  });

  it("leaves {#…} text outside headings alone", () => {
    const a = extractCanonicalContent(page("Siehe {#x} im Text.\n"));
    const b = extractCanonicalContent(page("Siehe im Text.\n"));
    assert.ok(!canonicalContentEquals(a, b));
  });
});
