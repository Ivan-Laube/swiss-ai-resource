import fs from "node:fs";

import { classifyReportSchema } from "../src/classify";
import { CLASSIFY_REPORT_PATH } from "../src/snapshot";

try {
  if (!fs.existsSync(CLASSIFY_REPORT_PATH)) {
    console.log("No classify report found; skipping check.");
    process.exit(0);
  }

  const raw = fs.readFileSync(CLASSIFY_REPORT_PATH, "utf8");
  const data = JSON.parse(raw) as unknown;
  const report = classifyReportSchema.parse(data);

  console.log(
    `Classify check passed (${report.sources.length} source${report.sources.length === 1 ? "" : "s"}; material=${report.summary.material}, cosmetic=${report.summary.cosmetic}).`,
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
