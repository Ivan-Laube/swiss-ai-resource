import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { pageRefProblem, resolvePageLink } from "./refs";

// Runs against the real content/ tree (cwd = repo root, like the validators).
describe("pageRefProblem", () => {
  it("accepts a publishable DE slug", () => {
    assert.equal(pageRefProblem("ndsg-ai-basics"), null);
  });

  it("rejects unknown slugs", () => {
    assert.match(pageRefProblem("no-such-page") ?? "", /unknown DE content slug/);
  });

  it("rejects anchors that are not explicit {#…} anchors on the DE page", () => {
    // A generated heading id is not accepted as a reference target.
    assert.match(
      pageRefProblem("ndsg-ai-basics#wer-ist-betroffen") ?? "",
      /has no heading anchor/,
    );
  });
});

describe("resolvePageLink", () => {
  it("links to the page top when the locale page lacks the anchor", () => {
    const link = resolvePageLink("de", "ndsg-ai-basics#no-such-anchor");
    assert.ok(link);
    assert.equal(link.href, "/de/ndsg-ai-basics/");
    assert.equal(link.section, null);
  });

  it("returns null when the page doesn't exist in the locale", () => {
    assert.equal(resolvePageLink("de", "no-such-page"), null);
  });
});
