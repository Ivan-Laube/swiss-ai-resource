import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { recordUsage, usageOutcome, type UsageDataset } from "./usage-metrics";

function fakeDataset() {
  const points: Parameters<UsageDataset["writeDataPoint"]>[0][] = [];
  const dataset: UsageDataset = {
    writeDataPoint: (event) => {
      points.push(event);
    },
  };
  return { dataset, points };
}

describe("usageOutcome", () => {
  it("maps worker statuses to outcomes", () => {
    assert.equal(usageOutcome(200), "ok");
    assert.equal(usageOutcome(201), "ok");
    assert.equal(usageOutcome(204), "bot_rejected");
    assert.equal(usageOutcome(429), "rate_limited");
    assert.equal(usageOutcome(403), "turnstile_failed");
    assert.equal(usageOutcome(400), "rejected");
    assert.equal(usageOutcome(413), "rejected");
    assert.equal(usageOutcome(502), "upstream_error");
    assert.equal(usageOutcome(504), "upstream_error");
    assert.equal(usageOutcome(500), "error");
  });
});

describe("recordUsage", () => {
  it("writes tool, outcome and status only", () => {
    const { dataset, points } = fakeDataset();
    recordUsage(dataset, "scan", 200);
    assert.deepEqual(points, [
      { indexes: ["scan"], blobs: ["scan", "ok"], doubles: [200] },
    ]);
  });

  it("is a no-op without a binding", () => {
    assert.doesNotThrow(() => recordUsage(undefined, "survey", 201));
  });

  it("never throws when the dataset fails", () => {
    const dataset: UsageDataset = {
      writeDataPoint: () => {
        throw new Error("boom");
      },
    };
    assert.doesNotThrow(() => recordUsage(dataset, "survey", 201));
  });
});
