import { test, expect } from "../fixtures/test";
import { copy } from "../fixtures/messages";

test.describe("unconfigured build", () => {
  test("shows unavailable status and does not load Turnstile", async ({
    websiteCheck,
    page,
  }) => {
    const m = copy.en;
    await websiteCheck.gotoWebsiteCheck("en");

    await expect(
      page.getByRole("status").filter({ hasText: m.unavailable }),
    ).toBeVisible();
    await expect(page.locator("#website-check-url")).toHaveCount(0);
    await expect(page.getByRole("button", { name: m.submit })).toHaveCount(0);
    expect(websiteCheck.turnstileScriptCount).toBe(0);
    expect(websiteCheck.scanRequestCount).toBe(0);
  });
});
