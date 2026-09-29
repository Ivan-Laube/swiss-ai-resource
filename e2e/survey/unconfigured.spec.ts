import { test, expect } from "../fixtures/test";
import { surveyCopy } from "../fixtures/messages";

test.describe("survey unconfigured", () => {
  test("shows unavailable status and does not load Turnstile", async ({
    surveyPage,
    page,
  }) => {
    const m = surveyCopy.en;
    await surveyPage.gotoSurvey("en");

    await expect(page.getByRole("status")).toHaveText(m.unavailable);
    expect(surveyPage.turnstileScriptCount).toBe(0);
    await expect(page.locator("fieldset")).toHaveCount(0);
  });
});
