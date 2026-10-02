/**
 * AI readiness check (T47): answering, scoring via the data-driven engine,
 * red-flag handling, security block and accessibility. Expected values are
 * the signed-off worked examples (docs/ai-readiness-check-draft.md, 5.5).
 */
import AxeBuilder from "@axe-core/playwright";
import { test, expect, type Page } from "@playwright/test";

const PATH = "/de/tools/ai-readiness/";

const QUESTIONS = [
  "inventory",
  "tool-approval",
  "accounts-dpa",
  "data-location",
  "usage-policy",
  "training",
  "transparency",
  "automated-decisions",
  "risk-assessment",
  "eu-exposure",
  "ownership",
  "incidents",
] as const;
const OPTION = { 0: "gap", 1: "partly", 2: "covered", na: "na" } as const;
type Value = keyof typeof OPTION;

async function open(page: Page) {
  await page.goto(PATH, { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-hydrated='true']")).toBeVisible();
}

async function choose(page: Page, name: string, value: string) {
  await page.locator(`input[name="${name}"][value="${value}"]`).check();
}

async function answerAll(
  page: Page,
  scored: Value[],
  security: Partial<Record<string, Value>>,
  profile = { "company-size": "10-49", "ai-maturity": "sanctioned-tools", finma: "no" },
) {
  for (const [id, value] of Object.entries(profile)) {
    await choose(page, `profile-${id}`, value);
  }
  for (const [i, id] of QUESTIONS.entries()) {
    await choose(page, id, OPTION[scored[i]]);
  }
  for (const [id, value] of Object.entries(security)) {
    await choose(page, id, OPTION[value!]);
  }
}

const showResult = (page: Page) => page.getByRole("button", { name: "Ergebnis anzeigen" });
const result = (page: Page) => page.locator("section[aria-labelledby='readiness-result']");

test.describe("readiness check", () => {
  test("result button stays disabled until every question is answered", async ({ page }) => {
    await open(page);
    await expect(showResult(page)).toBeDisabled();
    await expect(page.getByText(/Offen: \d+/)).toBeVisible();
  });

  test("small Treuhand: 20, Am Anfang, red-flag banner, steps Q3 → Q4 → Q2", async ({ page }) => {
    await open(page);
    // S2 only appears once S1 says tools can act.
    await expect(page.locator('input[name="untrusted-input"]')).toHaveCount(0);
    await answerAll(page, [1, 0, 0, 0, 0, 1, 1, "na", 0, "na", 1, 0], {
      "agent-access": "na",
      "fraud-verification": 1,
    });
    await showResult(page).click();

    const r = result(page);
    await expect(page.getByRole("heading", { name: "Ihr Ergebnis" })).toBeFocused();
    await expect(r.getByText("20", { exact: true })).toBeVisible();
    await expect(r.getByText("Am Anfang")).toBeVisible();
    await expect(r.getByText(/Konten und Verträge für sensible Daten weist auf ein konkretes rechtliches Risiko hin/)).toBeVisible();
    const steps = r.locator("ol").first().locator(":scope > li:visible");
    await expect(steps).toHaveCount(3);
    await expect(steps.nth(0)).toContainText("Verlagern Sie Arbeiten mit Personendaten");
    await expect(steps.nth(1)).toContainText("Halten Sie für jedes Tool auf Ihrer Liste fest");
    await expect(steps.nth(2)).toContainText("Legen Sie fest, welche Tools erlaubt sind");
    await expect(r.getByText("Nicht relevant").first()).toBeVisible();
  });

  test("recruiting agency: 86 lowered to Im Aufbau, security gap promoted, section links", async ({ page }) => {
    await open(page);
    await answerAll(
      page,
      [2, 2, 2, 2, 2, 2, 2, 0, 2, "na", 2, 1],
      { "agent-access": 1 },
      { "company-size": "10-49", "ai-maturity": "production", finma: "unsure" },
    );
    await choose(page, "untrusted-input", "gap");
    await choose(page, "fraud-verification", "covered");
    await showResult(page).click();

    const r = result(page);
    await expect(r.getByText("86", { exact: true })).toBeVisible();
    await expect(r.getByText(/Mit 86 Punkten wären Sie eigentlich auf der Stufe Gut aufgestellt/)).toBeVisible();
    await expect(r.getByText(/FINMA-beaufsichtigte Unternehmen/)).toBeVisible();
    const steps = r.locator("ol").first().locator(":scope > li:visible");
    await expect(steps.nth(0)).toContainText("Stellen Sie sicher, dass eine Person");
    await expect(steps.nth(1)).toContainText("Sicherheit");
    await expect(steps.nth(0).getByRole("link").first()).toHaveAttribute(
      "href",
      "/de/ndsg-ai-basics/#human-review",
    );
    await expect(r.getByText("Hoch", { exact: true })).toBeVisible();
  });

  test("change answers keeps them; start over clears them", async ({ page }) => {
    await open(page);
    await answerAll(page, [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], {
      "agent-access": "na",
      "fraud-verification": 2,
    });
    await showResult(page).click();
    await expect(result(page).getByText("Gut aufgestellt")).toBeVisible();

    await page.getByRole("button", { name: "Antworten ändern" }).click();
    await expect(page.locator('input[name="inventory"][value="covered"]')).toBeChecked();

    await showResult(page).click();
    await page.getByRole("button", { name: "Neu beginnen" }).click();
    await expect(page.locator('input[name="inventory"]:checked')).toHaveCount(0);
    await expect(showResult(page)).toBeDisabled();
  });

  test("no serious accessibility violations on questions and result", async ({ page }) => {
    await open(page);
    const scan = async () =>
      (await new AxeBuilder({ page }).analyze()).violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
    expect(await scan()).toEqual([]);

    await answerAll(page, [1, 0, 0, 0, 0, 1, 1, "na", 0, "na", 1, 0], {
      "agent-access": "na",
      "fraud-verification": 1,
    });
    await showResult(page).click();
    await expect(result(page)).toBeVisible();
    expect(await scan()).toEqual([]);
  });
});
