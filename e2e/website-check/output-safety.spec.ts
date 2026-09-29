import { test, expect } from "../fixtures/test";
import { copy } from "../fixtures/messages";
import { xssProbeReport } from "../fixtures/scan-results";

const m = copy.en;
const XSS_PAYLOAD = "<img src=x onerror=window.__xss=1>";

test.describe("output safety", () => {
  test("renders HTML evidence as text without executing it", async ({
    websiteCheck,
    page,
  }) => {
    let dialogFired = false;
    page.on("dialog", async (dialog) => {
      dialogFired = true;
      await dialog.dismiss();
    });

    await page.addInitScript(() => {
      window.__xss = 0;
    });

    websiteCheck.mockScanResult(xssProbeReport());
    await websiteCheck.gotoWebsiteCheck("en");
    await expect(page.getByRole("button", { name: m.submit })).toBeEnabled();
    await page.locator("#website-check-url").fill("https://example.ch/");
    await page.getByRole("button", { name: m.submit }).click();
    await expect(page.locator('[aria-live="polite"]')).toBeVisible();

    // Payload appears as literal text in the evidence list
    await expect(
      page.getByText(XSS_PAYLOAD, { exact: true }).first(),
    ).toBeVisible();

    // No img node created from the payload
    const injectedImages = page.locator(
      'img[src="x"], img[onerror], .evidenceList img',
    );
    await expect(injectedImages).toHaveCount(0);

    const xssFlag = await page.evaluate(() => window.__xss);
    expect(xssFlag === 0 || xssFlag === undefined).toBe(true);
    expect(dialogFired).toBe(false);
  });
});
