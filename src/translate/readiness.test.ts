import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  applyTranslations,
  collectStrings,
  parseReadinessTranslation,
  stringsToTranslate,
} from "./readiness";

const data = {
  title: { de: "KI-Check", en: "AI check" },
  questions: [
    { id: "q1", prompt: { de: "Frage?", en: "Question?", fr: "Question ?" }, points: 2 },
    { id: "q2", statement: { de: "{pct} % haben das.", en: "{pct}% have it." } },
  ],
};

describe("readiness translation", () => {
  it("collects every LocalizedString with a stable id", () => {
    assert.deepEqual(
      collectStrings(data).map((e) => e.id),
      ["title", "questions.0.prompt", "questions.1.statement"],
    );
  });

  it("selects missing strings, and changed ones when the previous file is given", () => {
    const now = collectStrings(data);
    assert.deepEqual(stringsToTranslate(now, "fr").map((e) => e.id), ["title", "questions.1.statement"]);
    // DE of questions.0.prompt changed; EN and FR still hold the old translation.
    const before = collectStrings({
      ...data,
      questions: [{ prompt: { de: "Alte Frage?", en: "Question?", fr: "Question ?" } }, data.questions[1]],
    });
    assert.deepEqual(
      stringsToTranslate(now, "fr", before).map((e) => e.id),
      ["title", "questions.0.prompt", "questions.1.statement"],
    );
    assert.deepEqual(stringsToTranslate(now, "en", before).map((e) => e.id), ["questions.0.prompt"]);
  });

  it("never overwrites a translation updated in the same change, nor fills present ones of new strings", () => {
    const now = collectStrings(data);
    const before = collectStrings({
      ...data,
      // EN was updated together with DE; title is new in this change.
      questions: [{ prompt: { de: "Alte Frage?", en: "Old question?", fr: "Question ?" } }, data.questions[1]],
      title: undefined,
    });
    assert.deepEqual(stringsToTranslate(now, "en", before).map((e) => e.id), []);
    assert.deepEqual(stringsToTranslate(now, "fr", before).map((e) => e.id), [
      "title",
      "questions.0.prompt",
      "questions.1.statement",
    ]);
  });

  it("rejects lost placeholders, missing or extra ids and HTML", () => {
    const batch = collectStrings(data).slice(1);
    assert.throws(
      () =>
        parseReadinessTranslation(
          JSON.stringify({ "questions.0.prompt": "<b>Q</b>", "questions.1.statement": "Beaucoup l'ont.", x: "?" }),
          batch,
        ),
      (error: Error) => {
        assert.match(error.message, /questions\.0\.prompt: contains HTML/);
        assert.match(error.message, /questions\.1\.statement: placeholders \{pct\} not kept/);
        assert.match(error.message, /unexpected ids: x/);
        return true;
      },
    );
  });

  it("applies translations in de, en, fr, it key order", () => {
    const copy = structuredClone(data);
    const batch = stringsToTranslate(collectStrings(copy), "it");
    applyTranslations(copy, "it", batch, Object.fromEntries(batch.map((e) => [e.id, `[it] ${e.de}`])));
    assert.deepEqual(Object.keys(copy.questions[0].prompt!), ["de", "en", "fr", "it"]);
    assert.equal((copy.questions[1].statement as Record<string, string>).it, "[it] {pct} % haben das.");
  });
});
