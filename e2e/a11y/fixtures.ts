/**
 * Shared helpers for R51 axe accessibility scans.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";
import type { Result } from "axe-core";
import {
  gotoStable,
  listVisualRoutes,
  needsTurnstile,
  test,
  visualPath,
  type VisualRoute,
} from "../visual/fixtures";

export {
  expect,
  gotoStable,
  listVisualRoutes,
  needsTurnstile,
  test,
  visualPath,
};
export type { VisualRoute };

const A11Y_LOCALE = "de" as const;

/** Locale used for axe route coverage (structure is locale-independent). */
export { A11Y_LOCALE };

/** Dedicated 404 path so NotFoundView is scanned (not in listVisualRoutes). */
export const A11Y_404_ROUTE: VisualRoute = {
  id: "404",
  segment: "__a11y-missing__",
};

function formatViolations(violations: Result[]): string {
  if (violations.length === 0) return "no violations";
  return violations
    .map((v) => {
      const nodes = v.nodes
        .slice(0, 5)
        .map((n) => `    - ${n.target.join(" ")}: ${n.failureSummary ?? ""}`)
        .join("\n");
      return `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))\n${nodes}`;
    })
    .join("\n\n");
}

/** Fail the test if axe reports any serious or critical violations. */
export async function expectNoSeriousAxeViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .exclude("[data-turnstile-host]")
    .analyze();

  const bad = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );

  expect(bad, formatViolations(bad)).toEqual([]);
}
