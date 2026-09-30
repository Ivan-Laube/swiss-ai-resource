import { listGuidePages } from "@/content";
import { getVendors } from "@/vendors";

/**
 * Latest source-check date across published DE guides (`last_verified`)
 * and all vendors (`last_checked`). ISO `YYYY-MM-DD`, or null if none.
 */
export function getLastSourceCheckDate(): string | null {
  const guideDates = listGuidePages("de").map(
    (page) => page.frontmatter.last_verified,
  );
  const vendorDates = getVendors().map((vendor) => vendor.last_checked);

  const all = [...guideDates, ...vendorDates];
  if (all.length === 0) {
    return null;
  }

  return all.reduce((max, date) => (date > max ? date : max));
}
