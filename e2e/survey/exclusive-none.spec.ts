import { test, expect } from "../fixtures/test";
import { surveyCopy } from "../fixtures/messages";

test.describe("exclusive none options", () => {
  test("ai-tools: selecting None clears and disables other options", async ({
    surveyPage,
    page,
  }) => {
    await surveyPage.gotoSurvey("en");
    await surveyPage.waitForTurnstileRendered();

    const chatgpt = page.locator('input[name="ai-tools"][value="chatgpt"]');
    const none = page.locator('input[name="ai-tools"][value="none"]');
    const chatgptLabel = page.locator(
      'label:has(input[name="ai-tools"][value="chatgpt"])',
    );
    const noneLabel = page.locator(
      'label:has(input[name="ai-tools"][value="none"])',
    );

    await chatgptLabel.click();
    await expect(chatgpt).toBeChecked();

    await noneLabel.click();
    await expect(none).toBeChecked();
    await expect(chatgpt).not.toBeChecked();
    await expect(chatgpt).toBeDisabled();

    await noneLabel.click();
    await expect(none).not.toBeChecked();
    await expect(chatgpt).toBeEnabled();
  });

  test("deployment-blockers: None excludes other options in submitted payload", async ({
    surveyPage,
    page,
  }) => {
    const m = surveyCopy.en;
    await surveyPage.gotoSurvey("en");
    await surveyPage.fillValidAnswers({
      "deployment-blockers": ["cost"],
    });

    const noneLabel = page.locator(
      'label:has(input[name="deployment-blockers"][value="none"])',
    );
    await noneLabel.click();
    await expect(
      page.locator('input[name="deployment-blockers"][value="none"]'),
    ).toBeChecked();

    await surveyPage.submitForm();
    await expect(page.getByText(m.success, { exact: true })).toBeVisible();

    const body = surveyPage.lastCapturedBody() as {
      answers: Record<string, string | string[]>;
    };
    expect(body.answers["deployment-blockers"]).toEqual(["none"]);
  });

  test("primary-use-cases none-yet is exclusive", async ({
    surveyPage,
    page,
  }) => {
    await surveyPage.gotoSurvey("en");
    await surveyPage.waitForTurnstileRendered();

    const content = page.locator(
      'input[name="primary-use-cases"][value="content"]',
    );
    const contentLabel = page.locator(
      'label:has(input[name="primary-use-cases"][value="content"])',
    );
    const noneYetLabel = page.locator(
      'label:has(input[name="primary-use-cases"][value="none-yet"])',
    );

    await contentLabel.click();
    await expect(content).toBeChecked();
    await noneYetLabel.click();
    await expect(
      page.locator('input[name="primary-use-cases"][value="none-yet"]'),
    ).toBeChecked();
    await expect(content).not.toBeChecked();
    await expect(content).toBeDisabled();
  });
});
