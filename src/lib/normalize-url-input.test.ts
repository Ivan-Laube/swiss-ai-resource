import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { normalizeUrlInput } from "./normalize-url-input";

describe("normalizeUrlInput", () => {
  it("adds https:// when no scheme is given", () => {
    assert.equal(normalizeUrlInput("beispiel.ch"), "https://beispiel.ch/");
    assert.equal(
      normalizeUrlInput("www.beispiel.ch/kontakt"),
      "https://www.beispiel.ch/kontakt",
    );
  });

  it("keeps an explicit http(s) scheme", () => {
    assert.equal(normalizeUrlInput("http://beispiel.ch"), "http://beispiel.ch/");
    assert.equal(
      normalizeUrlInput("https://beispiel.ch/?a=1"),
      "https://beispiel.ch/?a=1",
    );
  });

  it("trims surrounding whitespace", () => {
    assert.equal(normalizeUrlInput("  beispiel.ch  "), "https://beispiel.ch/");
  });

  it("treats host:port as a host, not a scheme", () => {
    assert.equal(
      normalizeUrlInput("beispiel.ch:8080"),
      "https://beispiel.ch:8080/",
    );
    assert.equal(
      normalizeUrlInput("beispiel.ch:8080/pfad"),
      "https://beispiel.ch:8080/pfad",
    );
    assert.equal(
      normalizeUrlInput("https://beispiel.ch:8080"),
      "https://beispiel.ch:8080/",
    );
  });

  it("rejects non-http(s) schemes", () => {
    assert.equal(normalizeUrlInput("ftp://beispiel.ch"), null);
    assert.equal(normalizeUrlInput("mailto:x@y.ch"), null);
    assert.equal(normalizeUrlInput("javascript:alert(1)"), null);
  });

  it("rejects hostnames without a dot", () => {
    assert.equal(normalizeUrlInput("beispiel"), null);
    assert.equal(normalizeUrlInput("localhost:3000"), null);
    assert.equal(normalizeUrlInput("http://localhost"), null);
  });

  it("rejects empty input", () => {
    assert.equal(normalizeUrlInput(""), null);
    assert.equal(normalizeUrlInput("   "), null);
  });
});
