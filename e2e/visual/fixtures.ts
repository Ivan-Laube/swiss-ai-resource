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

/** Fixed stand-in for data-dependent text before screenshots (see gotoStable). */
export const VISUAL_TEXT_PLACEHOLDER = "00.00.0000";

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

  // The text swap below must run after React has hydrated those nodes:
  // otherwise hydration sees a text mismatch, client-renders the subtree and
  // puts the real date back. Pages without a data-hydrated island (e.g.
  // impressum) had no wait for that, so the swap raced hydration and
  // de/impressum at 375px flaked when "18. September 2026" wrapped a line.
  // React tags each hydrated DOM node with a __reactFiber$<id> property.
  await page.waitForFunction(() =>
    Array.from(
      document.querySelectorAll<HTMLElement>("time, [data-visual-mask]"),
    ).every((el) => Object.keys(el).some((k) => k.startsWith("__reactFiber$"))),
  );

  // Masking hides pixels but not layout: a longer date ("1. Oktober 2026"
  // vs "10. Juli 2026") wraps differently and changes the page height, so the
  // monthly last_verified bump broke the baselines. Replace the text of every
  // masked leaf (dates, counts, reading times, copyright year) with a fixed
  // placeholder so the layout no longer depends on today's data.
  await page.evaluate((placeholder) => {
    for (const el of document.querySelectorAll<HTMLElement>(
      "time, [data-visual-mask]",
    )) {
      if (el.children.length === 0) {
        el.textContent = placeholder;
      }
    }
  }, VISUAL_TEXT_PLACEHOLDER);

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

  // Fail loudly if anything re-rendered the real data back in.
  const reverted = await page.evaluate(
    (placeholder) =>
      Array.from(
        document.querySelectorAll<HTMLElement>("time, [data-visual-mask]"),
      )
        .filter((el) => el.children.length === 0)
        .map((el) => el.textContent)
        .filter((text) => text !== placeholder),
    VISUAL_TEXT_PLACEHOLDER,
  );
  expect(reverted, "masked text re-rendered after placeholder swap").toEqual([]);
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
