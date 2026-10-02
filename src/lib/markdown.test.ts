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

describe("renderMarkdown explicit heading anchors", () => {
  it("uses the {#anchor} as id and strips the marker from the heading", () => {
    const { html, headings } = renderMarkdown(
      "## Transparenz und *Information* {#transparenz}\n\nText",
    );
    assert.deepEqual(headings, [
      { level: 2, text: "Transparenz und Information", id: "transparenz" },
    ]);
    assert.ok(
      html.includes('<h2 id="transparenz">Transparenz und <em>Information</em></h2>'),
    );
    assert.ok(!html.includes("{#"));
  });

  it("keeps generated ids for headings without a marker", () => {
    const { headings } = renderMarkdown("## Wer ist betroffen?\n\n### Details {#details}");
    assert.deepEqual(
      headings.map((h) => h.id),
      ["wer-ist-betroffen", "details"],
    );
  });

  it("does not hand an explicit anchor to an earlier generated heading", () => {
    const { headings } = renderMarkdown("## Hinweis\n\n## Disclaimer {#hinweis}");
    assert.deepEqual(
      headings.map((h) => h.id),
      ["hinweis-2", "hinweis"],
    );
  });

  it("rejects anchors reserved for the page shell", () => {
    assert.throws(() => renderMarkdown("## Quellen {#main}"), /reserved/);
  });
});

describe("renderMarkdown download: links", () => {
  it("resolves to the Word download in the page language", () => {
    const md = "[Vorlage](download:ai-policy-template)";
    assert.ok(renderMarkdown(md).html.includes('href="/downloads/ai-policy-template-de.docx"'));
    assert.ok(
      renderMarkdown(md, { locale: "fr" }).html.includes('href="/downloads/ai-policy-template-fr.docx"'),
    );
  });

  it("fails on an unknown template id", () => {
    assert.throws(() => renderMarkdown("[x](download:nope)"), /Unknown download "nope"/);
  });
});
