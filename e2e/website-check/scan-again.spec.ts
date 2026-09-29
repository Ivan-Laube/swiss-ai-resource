import { test, expect } from "../fixtures/test";
import { copy } from "../fixtures/messages";
import { fullReport } from "../fixtures/scan-results";

const m = copy.en;

test.describe("scan again", () => {
  test("returns to form, re-renders Turnstile, keeps URL input, clears errors", async ({
    websiteCheck,
    page,
  }) => {
    // First provoke an error, then succeed, then scan again
    websiteCheck.mockScanResult({ error: "Too many requests" }, 429);
    await websiteCheck.gotoWebsiteCheck("en");
    await expect(page.getByRole("button", { name: m.submit })).toBeEnabled();

    await page.locator("#website-check-url").fill("https://example.ch/path");
    await page.getByRole("button", { name: m.submit }).click();
    await expect(websiteCheck.formAlert()).toHaveText(m.errorRateLimit);

    // Succeed on next attempt
    websiteCheck.mockScanResult(fullReport());
    await websiteCheck.issueTurnstileToken();
    await expect(page.getByRole("button", { name: m.submit })).toBeEnabled();
    await page.getByRole("button", { name: m.submit }).click();
    await expect(page.locator('[aria-live="polite"]')).toBeVisible();

    const callsBefore = await websiteCheck.turnstileCalls();
    const rendersBefore = callsBefore.filter((c) => c.method === "render").length;

    await page.getByRole("button", { name: m.scanAgain }).click();

    // Form is back
    await expect(page.locator("#website-check-url")).toBeVisible();
    // Documents current behavior: URL input keeps previous value
    await expect(page.locator("#website-check-url")).toHaveValue(
      "https://example.ch/path",
    );
    // Error cleared
    await expect(websiteCheck.formAlert()).toHaveCount(0);

    // Fresh widget render
    await expect(page.getByRole("button", { name: m.submit })).toBeEnabled({
      timeout: 5_000,
    });
    const callsAfter = await websiteCheck.turnstileCalls();
    const rendersAfter = callsAfter.filter((c) => c.method === "render").length;
    expect(rendersAfter).toBeGreaterThan(rendersBefore);
  });
});
