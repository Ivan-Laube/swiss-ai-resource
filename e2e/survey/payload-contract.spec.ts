import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test, expect, E2E_TURNSTILE_TOKEN } from "../fixtures/test";
import { surveyCopy } from "../fixtures/messages";
import { parseSurvey } from "../../src/survey/schema";
import { validateIntake } from "../../src/survey/answers";

const survey = parseSurvey(
  JSON.parse(
    readFileSync(join(process.cwd(), "data", "survey-questions.json"), "utf8"),
  ),
);

test.describe("survey payload contract", () => {
  test("submitted body passes validateIntake and matches chrome fields", async ({
    surveyPage,
    page,
  }) => {
    const m = surveyCopy.en;
    await surveyPage.gotoSurvey("en");
    await surveyPage.fillValidAnswers();

    await page.getByLabel(m.emailLabel).fill("pilot@example.ch");
    await page.getByText(m.reportOptInLabel, { exact: true }).click();

    await surveyPage.submitForm();
    await expect(page.getByText(m.success, { exact: true })).toBeVisible();
    await expect(page.getByText(m.successOptIn, { exact: true })).toBeVisible();

    const body = surveyPage.lastCapturedBody();
    const validated = validateIntake(survey, body);
    expect(validated.ok, validated.ok ? "" : validated.error).toBe(true);

    const intake = body as {
      survey_id: string;
      survey_version: number;
      locale: string;
      email: string | null;
      report_opt_in: boolean;
      website: string;
      turnstile_token: string;
    };
    expect(intake.survey_id).toBe(survey.id);
    expect(intake.survey_version).toBe(survey.version);
    expect(intake.locale).toBe("en");
    expect(intake.email).toBe("pilot@example.ch");
    expect(intake.report_opt_in).toBe(true);
    expect(intake.website).toBe("");
    expect(intake.turnstile_token).toBe(E2E_TURNSTILE_TOKEN);
  });

  test("blank email is sent as null and opt-in message is hidden", async ({
    surveyPage,
    page,
  }) => {
    const m = surveyCopy.en;
    await surveyPage.gotoSurvey("en");
    await surveyPage.fillValidAnswers();
    await surveyPage.submitForm();

    await expect(page.getByText(m.success, { exact: true })).toBeVisible();
    await expect(
      page.getByText(m.successOptIn, { exact: true }),
    ).toHaveCount(0);

    const body = surveyPage.lastCapturedBody() as {
      email: string | null;
      report_opt_in: boolean;
    };
    expect(body.email).toBeNull();
    expect(body.report_opt_in).toBe(false);
  });
});
