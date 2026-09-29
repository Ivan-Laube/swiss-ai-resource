import { test, expect } from "../fixtures/test";
import { LOCALES, copy, type Locale } from "../fixtures/messages";

for (const lang of LOCALES) {
  test.describe(`page load (${lang})`, () => {
    test(`renders localized chrome and Turnstile widget`, async ({
      websiteCheck,
      page,
    }) => {
      const m = copy[lang as Locale];
      await websiteCheck.gotoWebsiteCheck(lang);

      await expect(page.locator("main")).toHaveAttribute("lang", lang);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(m.title);
      await expect(page.getByText(m.lead, { exact: true })).toBeVisible();
      await expect(page.getByLabel(m.urlLabel)).toBeVisible();
      await expect(page.locator("#website-check-url")).toBeVisible();
      await expect(
        page.getByText(m.turnstileLabel, { exact: true }),
      ).toBeVisible();
      await expect(page.getByText(m.disclaimer, { exact: true })).toBeVisible();

      const submit = page.getByRole("button", { name: m.submit });
      // Stub issues token asynchronously — wait until enabled.
      await expect(submit).toBeEnabled({ timeout: 5_000 });

      expect(websiteCheck.turnstileScriptCount).toBe(1);
      const calls = await websiteCheck.turnstileCalls();
      const renders = calls.filter((c) => c.method === "render");
      expect(renders.length).toBe(1);
      const renderArgs = renders[0]!.args[0] as {
        action?: string;
        sitekey?: string;
      };
      expect(renderArgs.action).toBe("website-scan");
      expect(renderArgs.sitekey).toBe("1x00000000000000000000AA");

      await websiteCheck.assertNoCspOrConsoleErrors();
    });
  });
}

test.describe("submit gate", () => {
  test.use({ turnstileMode: "manual" });

  test("submit stays disabled until Turnstile issues a token", async ({
    websiteCheck,
    page,
  }) => {
    const m = copy.en;
    await websiteCheck.gotoWebsiteCheck("en");
    const submit = page.getByRole("button", { name: m.submit });
    await expect(submit).toBeDisabled();
    await websiteCheck.issueTurnstileToken();
    await expect(submit).toBeEnabled();
  });
});
