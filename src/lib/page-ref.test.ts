import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { PAGE_REF_RE, pageRefHref, parsePageRef } from "./page-ref";

describe("page refs", () => {
  it("accepts slugs with an optional section anchor", () => {
    for (const ok of ["ndsg-ai-basics", "ndsg-ai-basics#transparenz", "a#art-19"]) {
      assert.ok(PAGE_REF_RE.test(ok), ok);
    }
    for (const bad of ["Ndsg", "ndsg#", "ndsg#1abc", "ndsg#a#b", "/de/ndsg/", "ndsg#Trans"]) {
      assert.ok(!PAGE_REF_RE.test(bad), bad);
    }
  });

  it("parses and builds site paths", () => {
    assert.deepEqual(parsePageRef("ndsg-ai-basics"), { slug: "ndsg-ai-basics", anchor: null });
    assert.equal(
      pageRefHref("fr", parsePageRef("ndsg-ai-basics#transparenz")),
      "/fr/ndsg-ai-basics/#transparenz",
    );
    assert.equal(pageRefHref("de", parsePageRef("ndsg-ai-basics")), "/de/ndsg-ai-basics/");
  });
});
