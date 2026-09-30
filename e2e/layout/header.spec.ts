/**
 * Site header layout across widths × locales: single row, no horizontal
 * overflow, working mobile menu, section aria-current. Functional asserts
 * (not pixels) so wrapping regressions fail on any OS.
 */
import { test, expect, type Page } from "@playwright/test";

const LOCALES = ["de", "en", "fr", "it"] as const;
const WIDTHS = [320, 375, 479, 480, 768, 1024, 1199, 1200, 1280] as const;
/** One header row = 44px controls + 2 × 12px padding + 1px border, plus slack. */
const MAX_SINGLE_ROW_HEIGHT = 80;
const DESKTOP_NAV_MIN = 1200;
const HEADER_CTA_MIN = 480;

async function load(page: Page, path: string, width: number): Promise<void> {
  await page.setViewportSize({ width, height: 800 });
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
}

for (const lang of LOCALES) {
  for (const width of WIDTHS) {
    test(`${lang} @ ${width}px: single-row header, no overflow`, async ({ page }) => {
      await load(page, `/${lang}/`, width);
      const header = page.locator("header").first();

      const height = (await header.boundingBox())!.height;
      expect(height, "header wrapped onto more than one row").toBeLessThanOrEqual(
        MAX_SINGLE_ROW_HEIGHT,
      );

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow, "horizontal page overflow").toBeLessThanOrEqual(0);

      const mainNav = page.locator("header > div > nav").first();
      const menuToggle = header.locator("summary");
      const headerCta = page.locator(`header > div > a[href="/${lang}/website-check/"]`);

      if (width >= DESKTOP_NAV_MIN) {
        await expect(mainNav).toBeVisible();
        await expect(menuToggle).toBeHidden();
      } else {
        await expect(mainNav).toBeHidden();
        await expect(menuToggle).toBeVisible();
      }

      if (width >= HEADER_CTA_MIN) {
        await expect(headerCta).toBeVisible();
      } else {
        await expect(headerCta).toBeHidden();
      }
    });
  }
}

for (const width of [320, 375, 768] as const) {
  test(`mobile menu @ ${width}px opens full width below the header`, async ({ page }) => {
    await load(page, "/fr/", width);
    const header = page.locator("header").first();
    await header.locator("summary").click();

    const panel = header.locator("details[open] > div");
    await expect(panel).toBeVisible();

    const headerBox = (await header.boundingBox())!;
    const panelBox = (await panel.boundingBox())!;
    expect(panelBox.x).toBeLessThanOrEqual(0.5);
    expect(panelBox.width).toBeGreaterThanOrEqual(width - 1);
    expect(panelBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height - 1);

    const mainLinks = panel
      .getByRole("navigation", { name: "Navigation principale" })
      .getByRole("link");
    await expect(mainLinks).toHaveCount(4);
    for (const link of await mainLinks.all()) {
      await expect(link).toBeVisible();
    }
    await expect(
      panel.getByRole("navigation", { name: "Langues" }).getByRole("link"),
    ).toHaveCount(4);

    const panelCta = panel.locator('a[href="/fr/website-check/"]');
    if (width < HEADER_CTA_MIN) {
      await expect(panelCta).toBeVisible();
    } else {
      await expect(panelCta).toBeHidden();
    }

    // Closing restores the single-row header.
    await header.locator("summary").click();
    await expect(panel).toBeHidden();
  });
}

test("aria-current: page on section index, true inside the section", async ({ page }) => {
  await load(page, "/de/guides/", 1280);
  const guidesLink = page
    .locator("header > div > nav")
    .getByRole("link", { name: "Leitfäden" });
  await expect(guidesLink).toHaveAttribute("aria-current", "page");

  await load(page, "/de/ndsg-ai-basics/", 1280);
  await expect(guidesLink).toHaveAttribute("aria-current", "true");

  await load(page, "/de/impressum/", 1280);
  await expect(guidesLink).not.toHaveAttribute("aria-current");
});

test("mobile menu closes after navigating to a section", async ({ page }) => {
  await load(page, "/de/", 375);
  const header = page.locator("header").first();
  await header.locator("summary").click();
  await header
    .locator("details[open]")
    .getByRole("navigation", { name: "Hauptnavigation" })
    .getByRole("link", { name: "Leitfäden" })
    .click();
  await expect(page).toHaveURL(/\/de\/guides\/$/);
  await expect(header.locator("details")).not.toHaveAttribute("open");
});
