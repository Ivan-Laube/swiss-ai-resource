import { test, expect } from "../fixtures/test";
import { copy } from "../fixtures/messages";
import { fullReport } from "../fixtures/scan-results";

const m = copy.en;

type ErrorCase = {
  name: string;
  setup: (wc: {
    mockScanResult: (
      result: unknown,
      status?: number,
      delayMs?: number,
    ) => void;
    mockScanAbort: () => void;
    mockScan: (handler: (route: import("@playwright/test").Route) => Promise<void>) => void;
  }) => void;
  expected: string;
};

const cases: ErrorCase[] = [
  {
    name: "400 → errorBadUrl",
    setup: (wc) => wc.mockScanResult({ error: "bad url" }, 400),
    expected: m.errorBadUrl,
  },
  {
    name: "403 → errorTurnstile",
    setup: (wc) =>
      wc.mockScanResult({ error: "Turnstile verification failed" }, 403),
    expected: m.errorTurnstile,
  },
  {
    name: "429 → errorRateLimit",
    setup: (wc) => wc.mockScanResult({ error: "Too many requests" }, 429),
    expected: m.errorRateLimit,
  },
  {
    name: "502 → errorUpstream",
    setup: (wc) => wc.mockScanResult({ error: "Upstream fetch failed" }, 502),
    expected: m.errorUpstream,
  },
  {
    name: "504 → errorUpstream",
    setup: (wc) =>
      wc.mockScanResult({ error: "Timed out fetching target" }, 504),
    expected: m.errorUpstream,
  },
  {
    name: "500 → errorServer",
    setup: (wc) => wc.mockScanResult({ error: "boom" }, 500),
    expected: m.errorServer,
  },
  {
    name: "200 malformed (ok missing) → errorServer",
    setup: (wc) =>
      wc.mockScanResult(
        { url: "https://example.ch/", findings: [] } as never,
        200,
      ),
    expected: m.errorServer,
  },
  {
    name: "200 malformed (findings not array) → errorServer",
    setup: (wc) =>
      wc.mockScan(async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json; charset=utf-8",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
          body: JSON.stringify({
            ok: true,
            url: "https://example.ch/",
            finalUrl: "https://example.ch/",
            static_scan_incomplete: false,
            findings: "nope",
          }),
        });
      }),
    expected: m.errorServer,
  },
  {
    name: "network abort → errorNetwork",
    setup: (wc) => wc.mockScanAbort(),
    expected: m.errorNetwork,
  },
];

test.describe("scan error mapping", () => {
  for (const c of cases) {
    test(c.name, async ({ websiteCheck, page }) => {
      c.setup(websiteCheck);
      await websiteCheck.gotoWebsiteCheck("en");
      await expect(page.getByRole("button", { name: m.submit })).toBeEnabled();

      await page.locator("#website-check-url").fill("https://example.ch/");
      await page.getByRole("button", { name: m.submit }).click();

      await expect(websiteCheck.formAlert()).toHaveText(c.expected);

      const calls = await websiteCheck.turnstileCalls();
      expect(calls.some((call) => call.method === "reset")).toBe(true);

      // After reset, token is cleared → submit disabled until a new token
      await expect(page.getByRole("button", { name: m.submit })).toBeDisabled();
      await websiteCheck.issueTurnstileToken();
      await expect(page.getByRole("button", { name: m.submit })).toBeEnabled({
        timeout: 5_000,
      });

      // Retry succeeds
      websiteCheck.mockScanResult(fullReport());
      await page.getByRole("button", { name: m.submit }).click();
      await expect(page.locator('[aria-live="polite"]')).toBeVisible();
    });
  }
});
