import fs from "node:fs";

import { LINKS_REPORT_PATH, linksReportSchema } from "../src/links";

try {
  if (!fs.existsSync(LINKS_REPORT_PATH)) {
    console.log("No links report found; skipping check.");
    process.exit(0);
  }

  const raw = fs.readFileSync(LINKS_REPORT_PATH, "utf8");
  const data = JSON.parse(raw) as unknown;
  const report = linksReportSchema.parse(data);

  console.log(
    [
      `Links check passed (total=${report.summary.total}`,
      `ok=${report.summary.ok}`,
      `broken=${report.summary.broken}`,
      `reused=${report.summary.reused}`,
      `probed=${report.summary.probed}).`,
    ].join(", "),
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
