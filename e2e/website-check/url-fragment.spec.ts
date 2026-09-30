import { test, expect, E2E_TURNSTILE_TOKEN } from "../fixtures/test";
import { copy } from "../fixtures/messages";
import { fullReport } from "../fixtures/scan-results";

const m = copy.de;

test.describe("homepage #url= handoff", () => {
  test("home Quick-Check navigates with fragment and auto-scans", async ({
    websiteCheck,
    page,
  }) => {
    let capturedBody: unknown = null;

    await websiteCheck.install();
    websiteCheck.mockScan(async (route) => {
      capturedBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json; charset=utf-8",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify(fullReport()),
      });
    });

    await page.goto("/de/", { waitUntil: "domcontentloaded" });
    const panel = page.locator("aside").filter({
      has: page.getByRole("heading", { name: "Website Quick-Check" }),
    });
    await expect(panel).toHaveAttribute("data-hydrated", "true");

    await panel.locator('input[name="url"]').fill("example.ch");
    await panel.getByRole("button", { name: "Website prüfen" }).click();

    await page.waitForURL(/\/de\/website-check\//);
    // Soft/full nav may race past the prefilled form into the report.
    await expect(page.locator('[aria-live="polite"]')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(m.scannedUrl, { exact: true })).toBeVisible();
    await expect(
      page.getByText("https://example.ch/", { exact: true }),
    ).toBeVisible();

    expect(capturedBody).toEqual({
      url: "https://example.ch/",
      turnstile_token: E2E_TURNSTILE_TOKEN,
    });
    expect(websiteCheck.scanRequestCount).toBeGreaterThan(0);

    await expect.poll(() => new URL(page.url()).hash).toBe("");
  });

  test("external #url= link prefills but does not auto-scan", async ({
    websiteCheck,
    page,
  }) => {
    await websiteCheck.install();
    websiteCheck.mockScan(async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json; charset=utf-8",
        body: JSON.stringify(fullReport()),
      });
    });

    // No homepage handoff mark in sessionStorage → a link from anywhere else.
    const hitsBefore = websiteCheck.scanRequestCount;
    await page.goto("/de/website-check/#url=https%3A%2F%2Fexample.ch", {
      waitUntil: "domcontentloaded",
    });

    await expect(page.locator('input[name="url"]')).toHaveValue(
      "https://example.ch/",
    );
    await expect.poll(() => new URL(page.url()).hash).toBe("");
    // Give a would-be auto-scan time to fire, then assert it didn't.
    await page.waitForTimeout(1_000);
    expect(websiteCheck.scanRequestCount).toBe(hitsBefore);
    await expect(page.getByText(m.scannedUrl, { exact: true })).toHaveCount(0);
  });

  test("invalid #url= shows validation and does not POST", async ({
    websiteCheck,
    page,
  }) => {
    await websiteCheck.install();
    websiteCheck.mockScan(async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json; charset=utf-8",
        body: JSON.stringify(fullReport()),
      });
    });

    const hitsBefore = websiteCheck.scanRequestCount;
    await page.goto("/de/website-check/#url=ftp%3A%2F%2Fx", {
      waitUntil: "domcontentloaded",
    });

    await expect(websiteCheck.formAlert()).toHaveText(m.errorBadUrl);
    expect(websiteCheck.scanRequestCount).toBe(hitsBefore);
    await expect.poll(() => new URL(page.url()).hash).toBe("");
  });
});
