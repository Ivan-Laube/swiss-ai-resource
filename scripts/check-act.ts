import fs from "node:fs";

import { actReportSchema } from "../src/maintain";
import { ACT_REPORT_PATH } from "../src/snapshot";

try {
  if (!fs.existsSync(ACT_REPORT_PATH)) {
    console.log("No act report found; skipping check.");
    process.exit(0);
  }

  const raw = fs.readFileSync(ACT_REPORT_PATH, "utf8");
  const data = JSON.parse(raw) as unknown;
  const report = actReportSchema.parse(data);

  console.log(
    [
      `Act check passed (bumped=${report.summary.bumped}`,
      `material=${report.summary.material}`,
      `skipped=${report.summary.skipped}`,
      `vendors_bumped=${report.summary.vendors_bumped}`,
      `vendors_material=${report.summary.vendors_material}).`,
    ].join(", "),
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
