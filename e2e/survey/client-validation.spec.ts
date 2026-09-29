import { test, expect } from "../fixtures/test";
import { surveyCopy } from "../fixtures/messages";

test.describe("survey client validation — missing answers", () => {
  test("shows validation error and does not POST", async ({ surveyPage }) => {
    const m = surveyCopy.en;
    await surveyPage.gotoSurvey("en");
    await surveyPage.waitForTurnstileRendered();

    await surveyPage.submitForm();

    await expect(surveyPage.formAlert()).toHaveText(m.errorValidation);
    expect(surveyPage.submitRequestCount).toBe(0);
  });
});

test.describe("survey client validation — missing Turnstile", () => {
  test.use({ turnstileMode: "manual" });

  test("shows turnstile error without issuing token", async ({ surveyPage }) => {
    const m = surveyCopy.en;
    await surveyPage.gotoSurvey("en");
    await surveyPage.fillValidAnswers();
    await surveyPage.submitForm();

    await expect(surveyPage.formAlert()).toHaveText(m.errorTurnstile);
    expect(surveyPage.submitRequestCount).toBe(0);
  });
});
