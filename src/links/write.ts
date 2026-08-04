import fs from "node:fs";
import path from "node:path";

import { SNAPSHOTS_DIR } from "@/snapshot";

import { buildLinksBrief } from "./brief";
import { linksReportSchema, type LinksReport } from "./schema";

export const LINKS_REPORT_PATH = path.join(SNAPSHOTS_DIR, "_links.json");
export const LINKS_DIR = path.join(SNAPSHOTS_DIR, "_links");
export const LINKS_BRIEF_PATH = path.join(LINKS_DIR, "brief.md");

export function ensureLinksDirs(): void {
  fs.mkdirSync(LINKS_DIR, { recursive: true });
}

export function writeLinksReport(report: LinksReport): {
  reportPath: string;
  briefPath: string;
} {
  const parsed = linksReportSchema.parse(report);
  ensureLinksDirs();

  fs.writeFileSync(
    LINKS_REPORT_PATH,
    `${JSON.stringify(parsed, null, 2)}\n`,
    "utf8",
  );

  const brief = buildLinksBrief(parsed);
  fs.writeFileSync(LINKS_BRIEF_PATH, brief, "utf8");

  return {
    reportPath: LINKS_REPORT_PATH,
    briefPath: LINKS_BRIEF_PATH,
  };
}
