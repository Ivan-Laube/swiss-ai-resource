/**
 * Shared helpers for R50 visual snapshots.
 */
import { expect, type Locator, type Page } from "@playwright/test";
import { test as base } from "../fixtures/test";
import {
  listVisualRoutes,
  needsTurnstile,
  visualPath,
  VISUAL_LOCALES,
  type VisualLocale,
  type VisualRoute,
} from "./routes";

export { expect, listVisualRoutes, needsTurnstile, visualPath, VISUAL_LOCALES };
export type { VisualLocale, VisualRoute };

/** Locators whose pixels are masked (dates, copyright year, Turnstile). */
export function maskLocators(page: Page): Locator[] {
  return [
    page.locator("time"),
    page.locator("[data-visual-mask]"),
    page.locator("[data-turnstile-host]"),
  ];
}

export async function gotoStable(
  page: Page,
  path: string,
  options: { waitForTurnstile?: boolean } = {},
): Promise<void> {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("main")).toBeVisible();

  // Client islands flip data-hydrated after useEffect — wait so CSS/layout match baselines.
  const hydrated = page.locator("[data-hydrated]");
  if ((await hydrated.count()) > 0) {
    await expect(hydrated.first()).toHaveAttribute("data-hydrated", "true");
  }

  if (options.waitForTurnstile) {
    await expect
      .poll(async () => {
        const calls = await page.evaluate(() => window.__turnstileCalls ?? []);
        return calls.filter((c) => c.method === "render").length;
      })
      .toBeGreaterThan(0);
    // Stub callback enables the submit button; wait so that state is in the shot.
    const submit = page.locator('form button[type="submit"]');
    if ((await submit.count()) > 0) {
      await expect(submit.first()).toBeEnabled({ timeout: 5_000 });
    }
  }

  // Hide scrollbars (width differs by platform/theme and flakes full-page shots).
  await page.addStyleTag({
    content: `
      * { scrollbar-width: none !important; }
      *::-webkit-scrollbar { width: 0 !important; height: 0 !important; display: none !important; }
    `,
  });
  await page.evaluate(() => {
    (document.activeElement as HTMLElement | null)?.blur?.();
    window.scrollTo(0, 0);
  });

  // Allow paints after fonts / hydration / Turnstile settle.
  await new Promise((resolve) => setTimeout(resolve, 250));
}

type VisualFixtures = {
  /** Installs third-party guard + Turnstile stub (configured export). */
  prepareVisual: () => Promise<void>;
};

export const test = base.extend<VisualFixtures>({
  prepareVisual: async ({ websiteCheck }, use) => {
    await use(async () => {
      await websiteCheck.install();
    });
  },
});
