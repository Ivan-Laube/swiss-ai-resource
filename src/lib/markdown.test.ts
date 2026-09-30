import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { renderMarkdown } from "./markdown";

describe("renderMarkdown heading ids", () => {
  it("never reuses page-shell ids such as the skip-link target", () => {
    const { html, headings } = renderMarkdown("## Main\n\n## Sources heading");
    assert.deepEqual(
      headings.map((h) => h.id),
      ["main-2", "sources-heading-2"],
    );
    assert.ok(!html.includes('id="main"'));
  });
});
