import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test, expect } from "../fixtures/test";
import { LOCALES, surveyCopy, type Locale } from "../fixtures/messages";

const survey = JSON.parse(
  readFileSync(join(process.cwd(), "data", "survey-questions.json"), "utf8"),
) as {
  version: number;
  questions: { id: string; prompt: Record<string, string> }[];
};

for (const lang of LOCALES) {
  test.describe(`survey page load (${lang})`, () => {
    test(`renders ${survey.questions.length} fieldsets, localized prompts, Turnstile`, async ({
      surveyPage,
      page,
    }) => {
      const m = surveyCopy[lang as Locale];
      await surveyPage.gotoSurvey(lang);

      await expect(page.locator("main")).toHaveAttribute("lang", lang);
      await expect(page.locator("fieldset")).toHaveCount(
        survey.questions.length,
      );

      for (const question of survey.questions) {
        const prompt = question.prompt[lang] ?? question.prompt.en;
        // Legend appends " (Required)" — match the prompt as a substring.
        await expect(page.locator("legend").filter({ hasText: prompt })).toBeVisible();
      }

      await expect(
        page.getByText(m.turnstileLabel, { exact: true }),
      ).toBeVisible();

      await surveyPage.waitForTurnstileRendered();
      await expect
        .poll(() => surveyPage.turnstileScriptCount)
        .toBeGreaterThanOrEqual(1);
      const calls = await surveyPage.turnstileCalls();
      const renders = calls.filter((c) => c.method === "render");
      expect(renders.length).toBeGreaterThanOrEqual(1);
      const renderArgs = renders[0]!.args[0] as {
        action?: string;
        sitekey?: string;
      };
      expect(renderArgs.action).toBe("survey-submit");
      expect(renderArgs.sitekey).toBe("1x00000000000000000000AA");

      await surveyPage.assertNoCspOrConsoleErrors();
    });
  });
}
