/**
 * R51: axe accessibility scans for all public routes × light/dark.
 * Colour scheme comes from the `a11y-*` Playwright projects.
 */
import {
  A11Y_LOCALE,
  expectNoSeriousAxeViolations,
  gotoStable,
  listVisualRoutes,
  needsTurnstile,
  test,
  visualPath,
} from "./fixtures";

/** Includes 404 via VISUAL_404_ROUTE in listVisualRoutes. */
const routes = listVisualRoutes(A11Y_LOCALE);

test.describe(`a11y routes (${A11Y_LOCALE})`, () => {
  for (const route of routes) {
    test(`${route.id}`, async ({ page, prepareVisual }) => {
      await prepareVisual();
      await gotoStable(page, visualPath(A11Y_LOCALE, route), {
        waitForTurnstile: needsTurnstile(route),
      });
      await expectNoSeriousAxeViolations(page);
    });
  }
});
