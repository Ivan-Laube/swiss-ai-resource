import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test, expect } from "../fixtures/test";
import { benchmarkCopy } from "../fixtures/messages";
import { parseSurvey, pickLocalized } from "../../src/survey/schema";
import { parseSurveyAggregates } from "../../src/survey/aggregates";

const survey = parseSurvey(
  JSON.parse(
    readFileSync(join(process.cwd(), "data", "survey-questions.json"), "utf8"),
  ),
);
const aggregates = parseSurveyAggregates(
  JSON.parse(
    readFileSync(
      join(process.cwd(), "e2e", "fixtures", "survey-aggregates.populated.json"),
      "utf8",
    ),
  ),
);

test.describe("benchmark populated", () => {
  test("no rendered count is below suppression threshold", async ({
    surveyPage,
    page,
  }) => {
    await surveyPage.gotoBenchmark("en");

    const metas = page.locator("section ul li").filter({
      hasText: /\d+\s·\s[\d.]+%/,
    });
    const count = await metas.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const text = await metas.nth(i).innerText();
      const match = text.match(/(\d+)\s·\s([\d.]+)%/);
      expect(match).toBeTruthy();
      expect(Number(match![1])).toBeGreaterThanOrEqual(5);
    }
  });

  test("percentages equal count / question n", async ({ surveyPage, page }) => {
    await surveyPage.gotoBenchmark("en");

    for (const [questionId, aggregate] of Object.entries(
      aggregates.questions,
    )) {
      const published = Object.entries(aggregate.counts);
      if (published.length === 0) continue;

      const heading = page.locator(`#q-${questionId}`);
      await expect(heading).toBeVisible();
      const card = page.locator(`section:has(#q-${questionId})`);

      for (const [optionId, count] of published) {
        const expectedPercent =
          Math.round((count / aggregate.n) * 1000) / 10;
        const question = survey.questions.find((q) => q.id === questionId);
        if (!question || question.input === "text") continue;
        const option = question.options.find((o) => o.id === optionId);
        if (!option) continue;
        const label = pickLocalized(option.label, "en");
        const row = card.locator("li").filter({ hasText: label });
        await expect(row).toContainText(`${count} · ${expectedPercent}%`);
      }
    }
  });

  test("option order follows the instrument", async ({ surveyPage, page }) => {
    await surveyPage.gotoBenchmark("en");

    for (const question of survey.questions) {
      if (question.input === "text" || !question.aggregate) continue;
      const aggregate = aggregates.questions[question.id];
      if (!aggregate || Object.keys(aggregate.counts).length === 0) continue;

      const expectedLabels = question.options
        .filter((o) => aggregate.counts[o.id] !== undefined)
        .map((o) => pickLocalized(o.label, "en"));

      const card = page.locator(`section:has(#q-${question.id})`);
      const labels: string[] = [];
      const items = card.locator("li");
      const n = await items.count();
      for (let i = 0; i < n; i++) {
        const text = await items.nth(i).innerText();
        const labelLine = text.split("\n")[0]?.trim() ?? "";
        const cleaned = labelLine.replace(/\s+\d+\s·\s[\d.]+%$/, "").trim();
        labels.push(cleaned);
      }
      expect(labels).toEqual(expectedLabels);
    }
  });

  test("comparison dropdown covers median, no-median, and insufficient", async ({
    surveyPage,
    page,
  }) => {
    const m = benchmarkCopy.en;
    await surveyPage.gotoBenchmark("en");

    await surveyPage.selectCompanySize("10-49");
    await expect(
      page.getByText(m.comparisonMedianLabel, { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("status")).toContainText("CHF 251–1,000");

    await surveyPage.selectCompanySize("1000-plus");
    await expect(
      page.getByText(m.comparisonNoMedian, { exact: true }),
    ).toBeVisible();

    await surveyPage.selectCompanySize("250-999");
    await expect(
      page.getByText(m.comparisonInsufficient, { exact: true }),
    ).toBeVisible();
  });
});
