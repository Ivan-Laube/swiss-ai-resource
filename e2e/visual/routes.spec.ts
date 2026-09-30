/**
 * R50: full-page visual snapshots for all public routes × de/fr.
 * Viewport and colour scheme come from the `visual-*` Playwright projects.
 */
import {
  expect,
  gotoStable,
  listVisualRoutes,
  maskLocators,
  needsTurnstile,
  test,
  visualPath,
  VISUAL_LOCALES,
} from "./fixtures";

for (const lang of VISUAL_LOCALES) {
  const routes = listVisualRoutes(lang);

  test.describe(`visual routes (${lang})`, () => {
    for (const route of routes) {
      test(`${route.id}`, async ({ page, prepareVisual }) => {
        await prepareVisual();
        await gotoStable(page, visualPath(lang, route), {
          waitForTurnstile: needsTurnstile(route),
        });

        await expect(page).toHaveScreenshot(`${lang}-${route.id}.png`, {
          fullPage: true,
          mask: maskLocators(page),
        });
      });
    }
  });
}
