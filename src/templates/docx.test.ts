import assert from "node:assert/strict";
import { describe, it } from "node:test";

import JSZip from "jszip";

import { markdownToDocx } from "./docx";
import { PLACEHOLDER_RE, listTemplateIds, readTemplate, templateLocales } from "./load";

const META = { title: "T", footer: "F" };

async function documentXml(markdown: string): Promise<string> {
  const zip = await JSZip.loadAsync(await markdownToDocx(markdown, META));
  const file = zip.file("word/document.xml");
  assert.ok(file, "word/document.xml missing");
  return file.async("string");
}

describe("markdownToDocx", () => {
  it("highlights [placeholders] and keeps the text", async () => {
    const xml = await documentXml("Bei **[Firmenname]** gilt diese Richtlinie.");
    assert.match(xml, /<w:highlight w:val="yellow"\/>[\s\S]*?\[Firmenname\]/);
    assert.match(xml, /gilt diese Richtlinie\./);
  });

  it("does not highlight Markdown links", async () => {
    const xml = await documentXml("Siehe [aicompliant.ch](https://aicompliant.ch).");
    assert.doesNotMatch(xml, /w:highlight/);
  });

  it("renders headings, lists, tables and the guidance box", async () => {
    const xml = await documentXml(
      [
        "# Titel",
        "",
        "> Hinweis",
        ">",
        "> - Punkt",
        "",
        "## Abschnitt",
        "",
        "1. Erstens",
        "2. Zweitens",
        "",
        "| A | B |",
        "|---|---|",
        "| a | b |",
        "",
        "---",
      ].join("\n"),
    );
    assert.match(xml, /w:val="Title"/);
    assert.match(xml, /w:val="Heading1"/);
    assert.match(xml, /<w:numPr>/);
    assert.match(xml, /<w:tbl>/);
    assert.match(xml, /w:fill="EEF2F7"/);
  });

  it("drops empty Markdown table header rows", async () => {
    const xml = await documentXml("| | |\n|---|---|\n| Version | [1.0] |\n");
    assert.equal(xml.match(/<w:tr[ >]/g)?.length, 1);
  });

  it("fails loudly on unsupported Markdown", async () => {
    await assert.rejects(markdownToDocx("<div>raw</div>\n", META), /Unsupported Markdown block/);
  });
});

describe("templates", () => {
  for (const id of listTemplateIds()) {
    for (const locale of templateLocales(id)) {
      it(`${id}/${locale} converts and keeps every placeholder`, async () => {
        const markdown = readTemplate(id, locale);
        const xml = await documentXml(markdown);
        const text = xml.replace(/<[^>]+>/g, "");
        const expected = markdown.match(PLACEHOLDER_RE)?.length ?? 0;
        assert.ok(expected > 0);
        assert.equal(text.match(PLACEHOLDER_RE)?.length, expected);
      });
    }
  }
});
