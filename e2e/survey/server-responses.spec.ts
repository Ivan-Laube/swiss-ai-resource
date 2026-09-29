import { test, expect } from "../fixtures/test";
import { surveyCopy } from "../fixtures/messages";

test.describe("survey server response mapping", () => {
  test("201 shows success", async ({ surveyPage, page }) => {
    const m = surveyCopy.en;
    surveyPage.mockSubmitResult({ ok: true, id: "x" }, 201);
    await surveyPage.gotoSurvey("en");
    await surveyPage.fillValidAnswers();
    await surveyPage.submitForm();
    await expect(page.getByText(m.success, { exact: true })).toBeVisible();
  });

  test("204 honeypot-style success still shows success UI", async ({
    surveyPage,
    page,
  }) => {
    const m = surveyCopy.en;
    surveyPage.mockSubmitResult(null, 204);
    await surveyPage.gotoSurvey("en");
    await surveyPage.fillValidAnswers();
    await surveyPage.submitForm();
    await expect(page.getByText(m.success, { exact: true })).toBeVisible();
  });

  test("400 shows validation error and resets Turnstile", async ({
    surveyPage,
  }) => {
    const m = surveyCopy.en;
    surveyPage.mockSubmitResult({ error: "bad" }, 400);
    await surveyPage.gotoSurvey("en");
    await surveyPage.fillValidAnswers();
    await surveyPage.submitForm();
    await expect(surveyPage.formAlert()).toHaveText(m.errorValidation);
    await expect
      .poll(async () => {
        const calls = await surveyPage.turnstileCalls();
        return calls.some((c) => c.method === "reset");
      })
      .toBe(true);
  });

  test("403 shows turnstile error", async ({ surveyPage }) => {
    const m = surveyCopy.en;
    surveyPage.mockSubmitResult({ error: "turnstile" }, 403);
    await surveyPage.gotoSurvey("en");
    await surveyPage.fillValidAnswers();
    await surveyPage.submitForm();
    await expect(surveyPage.formAlert()).toHaveText(m.errorTurnstile);
  });

  test("429 shows rate-limit error", async ({ surveyPage }) => {
    const m = surveyCopy.en;
    surveyPage.mockSubmitResult({ error: "rate" }, 429);
    await surveyPage.gotoSurvey("en");
    await surveyPage.fillValidAnswers();
    await surveyPage.submitForm();
    await expect(surveyPage.formAlert()).toHaveText(m.errorRateLimit);
  });

  test("500 shows server error", async ({ surveyPage }) => {
    const m = surveyCopy.en;
    surveyPage.mockSubmitResult({ error: "boom" }, 500);
    await surveyPage.gotoSurvey("en");
    await surveyPage.fillValidAnswers();
    await surveyPage.submitForm();
    await expect(surveyPage.formAlert()).toHaveText(m.errorServer);
  });

  test("aborted request shows network error", async ({ surveyPage }) => {
    const m = surveyCopy.en;
    surveyPage.mockSubmitAbort();
    await surveyPage.gotoSurvey("en");
    await surveyPage.fillValidAnswers();
    await surveyPage.submitForm();
    await expect(surveyPage.formAlert()).toHaveText(m.errorNetwork);
  });

  test("submit button disables while request is in flight", async ({
    surveyPage,
    page,
  }) => {
    const m = surveyCopy.en;
    surveyPage.mockSubmitResult({ ok: true, id: "x" }, 201, 800);
    await surveyPage.gotoSurvey("en");
    await surveyPage.fillValidAnswers();

    const submit = page.getByRole("button", { name: m.submit });
    await submit.click();
    await expect(
      page.getByRole("button", { name: m.submitting }),
    ).toBeDisabled();
    await expect(page.getByText(m.success, { exact: true })).toBeVisible();
  });
});
