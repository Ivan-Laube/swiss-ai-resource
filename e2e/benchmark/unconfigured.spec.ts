import { test, expect } from "../fixtures/test";
import { benchmarkCopy } from "../fixtures/messages";

test.describe("benchmark empty (unconfigured build)", () => {
  test("shows empty state with link to survey", async ({
    surveyPage,
    page,
  }) => {
    const m = benchmarkCopy.en;
    await surveyPage.gotoBenchmark("en");

    await expect(
      page.getByRole("heading", { name: m.emptyTitle }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: m.surveyCta }).first(),
    ).toHaveAttribute("href", "/en/survey/");
  });
});
