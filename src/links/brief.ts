import type { LinksReport } from "./schema";

function monthLabel(isoDate: string): string {
  return isoDate.slice(0, 7);
}

export function buildLinksIssueTitle(checkedAt: string): string {
  const date = checkedAt.slice(0, 10);
  return `Broken links (${monthLabel(date)})`;
}

/** Editorial brief for broken published citation URLs. */
export function buildLinksBrief(report: LinksReport): string {
  const date = report.checked_at.slice(0, 10);
  const broken = report.results.filter((r) => !r.ok);

  const lines: string[] = [
    `# Broken links (${monthLabel(date)})`,
    "",
    "Automated T21 dead-link check from the monthly source job.",
    "Fix or replace unreachable citation URLs on published surfaces.",
    "Does **not** bump `last_verified` or clear lawyer review badges.",
    "",
    `Checked **${report.summary.total}** unique URL(s): **${report.summary.ok}** ok, **${report.summary.broken}** broken.`,
    `(Reused ${report.summary.reused} from T15 run report; probed ${report.summary.probed}.)`,
    "",
  ];

  if (broken.length === 0) {
    lines.push("_No broken links._", "");
    return `${lines.join("\n")}\n`;
  }

  lines.push("## Broken URLs", "");

  for (const result of broken) {
    lines.push(`### ${result.url}`);
    lines.push("");
    lines.push(
      `- **Status:** ${result.http_status ?? "n/a"}${result.error ? ` — ${result.error}` : ""}`,
    );
    lines.push(
      `- **Reused from T15:** ${result.reused_from_run ? "yes" : "no"}`,
    );
    lines.push("- **Cited from:**");
    for (const source of result.sources) {
      lines.push(`  - \`${source.kind}\` \`${source.id}\``);
    }
    lines.push("");
  }

  lines.push(
    "## Editor checklist",
    "",
    "- [ ] Open each URL (or its replacement) and confirm it is the intended source",
    "- [ ] Update content frontmatter / body, `data/vendors.json`, or `data/rules/*.json` as needed",
    "- [ ] Do not bump `last_verified` solely because a link was fixed",
    "",
  );

  return `${lines.join("\n")}\n`;
}
