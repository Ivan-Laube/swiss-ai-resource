/**
 * Decision-tree interaction: hash state, keyboard walk, locale hash preserve.
 */
import { test, expect } from "@playwright/test";

const TOOL_PATH = "/de/tools/us-hosted-llm-ndsg/";

async function openTool(page: import("@playwright/test").Page, path = TOOL_PATH) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("[data-hydrated='true']")).toBeVisible();
}

test.describe("decision tree", () => {
  test("keyboard walk to outcome updates hash and shows recap", async ({
    page,
  }) => {
    await openTool(page);

    const firstAnswer = page.getByRole("button", { name: "Nein" });
    await firstAnswer.focus();
    await page.keyboard.press("Enter");

    await expect.poll(() => new URL(page.url()).hash).toBe("#a=no");
    await expect(
      page.getByRole("heading", { name: /Eher vertretbar/i }),
    ).toBeVisible();
    await expect(page.getByText("Ihre Antworten")).toBeVisible();
    await expect(page.getByRole("link", { name: "Zur Umfrage" })).toBeVisible();
  });

  test("UI back shortens the hash; browser back restores it", async ({
    page,
  }) => {
    await openTool(page);

    await page.getByRole("button", { name: "Ja" }).click();
    await expect.poll(() => new URL(page.url()).hash).toBe("#a=yes");

    await page.getByRole("button", { name: "Zurück" }).click();
    await expect.poll(() => new URL(page.url()).hash).toBe("");
    await expect(
      page.getByRole("heading", {
        name: "Enthalten Ihre Prompts, Kontext oder Ausgaben Personendaten?",
      }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Ja" }).click();
    await expect.poll(() => new URL(page.url()).hash).toBe("#a=yes");
    await page.goBack();
    await expect.poll(() => new URL(page.url()).hash).toBe("");
  });

  test("invalid hash restarts cleanly", async ({ page }) => {
    await openTool(page, `${TOOL_PATH}#a=not-a-real-answer`);

    await expect.poll(() => new URL(page.url()).hash).toBe("");
    await expect(
      page.getByRole("heading", {
        name: "Enthalten Ihre Prompts, Kontext oder Ausgaben Personendaten?",
      }),
    ).toBeVisible();
  });

  test("locale switch keeps the answer hash", async ({ page }) => {
    await openTool(page, `${TOOL_PATH}#a=no`);
    await expect(
      page.getByRole("heading", { name: /Eher vertretbar/i }),
    ).toBeVisible();

    await page.getByRole("link", { name: "EN", exact: true }).click();
    await page.waitForURL(/\/en\/tools\/us-hosted-llm-ndsg\//);
    await expect.poll(() => new URL(page.url()).hash).toBe("#a=no");
    await expect(
      page.getByRole("heading", { name: /Likely workable/i }),
    ).toBeVisible();
  });

  test("copy link is present when clipboard is available; print does not navigate", async ({
    page,
  }) => {
    await openTool(page, `${TOOL_PATH}#a=no`);
    await expect(
      page.getByRole("heading", { name: /Eher vertretbar/i }),
    ).toBeVisible();

    await expect(page.getByRole("button", { name: "Link kopieren" })).toBeVisible();

    await page.evaluate(() => {
      (window as unknown as { __printCalls: number }).__printCalls = 0;
      window.print = () => {
        (window as unknown as { __printCalls: number }).__printCalls += 1;
      };
    });

    const requests: string[] = [];
    page.on("request", (req) => {
      const host = new URL(req.url()).hostname;
      if (host !== "127.0.0.1" && host !== "localhost") {
        requests.push(req.url());
      }
    });

    await page.getByRole("button", { name: "Drucken / als PDF" }).click();
    expect(
      await page.evaluate(
        () => (window as unknown as { __printCalls: number }).__printCalls,
      ),
    ).toBe(1);
    expect(requests).toEqual([]);
  });
});
