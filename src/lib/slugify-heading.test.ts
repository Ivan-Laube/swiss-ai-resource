import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createHeadingSlugger } from "./slugify-heading";

describe("createHeadingSlugger", () => {
  it("expands German umlauts and ß", () => {
    const slugify = createHeadingSlugger();
    assert.equal(slugify("Überprüfung und Öffnung"), "ueberpruefung-und-oeffnung");
    assert.equal(slugify("Maßnahme"), "massnahme");
  });

  it("strips other diacritics", () => {
    const slugify = createHeadingSlugger();
    assert.equal(slugify("Café résumé"), "cafe-resume");
  });

  it("dedupes within a document", () => {
    const slugify = createHeadingSlugger();
    assert.equal(slugify("Sources"), "sources");
    assert.equal(slugify("Sources"), "sources-2");
    assert.equal(slugify("Sources"), "sources-3");
  });

  it("avoids reserved ids", () => {
    const slugify = createHeadingSlugger(["sources-heading"]);
    assert.equal(slugify("Sources heading"), "sources-heading-2");
  });

  it("falls back for empty-ish text", () => {
    const slugify = createHeadingSlugger();
    assert.equal(slugify("???"), "section");
    assert.equal(slugify("!!!"), "section-2");
  });
});
