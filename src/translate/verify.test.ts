import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { assertDownloadLinksKept } from "./verify";

describe("assertDownloadLinksKept", () => {
  const de = "Siehe [Vorlage](download:ai-policy-template) und [Seite](/de/x/).";

  it("accepts a translation that keeps the download link and translates the text", () => {
    assert.doesNotThrow(() =>
      assertDownloadLinksKept(de, "See [template](download:ai-policy-template) and [page](/en/x/)."),
    );
  });

  it("rejects a dropped or rewritten download link", () => {
    assert.throws(() => assertDownloadLinksKept(de, "See the template."), /changed download: links/);
    assert.throws(
      () => assertDownloadLinksKept(de, "See [template](/downloads/ai-policy-template-en.docx)."),
      /changed download: links/,
    );
  });
});
