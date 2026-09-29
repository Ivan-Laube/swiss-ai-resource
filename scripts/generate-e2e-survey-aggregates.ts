/**
 * One-shot: generate e2e/fixtures/survey-aggregates.populated.json
 * Run: npx tsx scripts/generate-e2e-survey-aggregates.ts
 */
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { aggregateResponses } from "../src/survey/aggregates";
import { parseSurvey } from "../src/survey/schema";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const survey = parseSurvey(
  JSON.parse(readFileSync(join(root, "data", "survey-questions.json"), "utf8")),
);

type Profile = {
  size: string;
  spend: string;
  sector: string;
  maturity: string;
  tools: string[];
  use: string[];
  host: string;
  gov: string[];
  eu: string;
  block: string[];
  vendor: string[];
};

const profiles: Profile[] = [
  {
    size: "1-9",
    spend: "1-100",
    sector: "legal-fiduciary",
    maturity: "individual-ad-hoc",
    tools: ["chatgpt"],
    use: ["content"],
    host: "switzerland",
    gov: ["none"],
    eu: "no-eu",
    block: ["cost", "skills"],
    vendor: ["price", "hosting-region"],
  },
  {
    size: "10-49",
    spend: "101-500",
    sector: "ict-software",
    maturity: "sanctioned-tools",
    tools: ["chatgpt", "microsoft-copilot", "deepl"],
    use: ["coding", "translation"],
    host: "eu-eea",
    gov: ["usage-policy", "business-dpa"],
    eu: "deployer-eu-customers",
    block: ["data-protection"],
    vendor: ["fits-existing-stack", "dpa-terms"],
  },
  {
    size: "50-249",
    spend: "501-2000",
    sector: "finance-insurance",
    maturity: "piloting-custom",
    tools: ["azure-openai", "claude"],
    use: ["analysis", "knowledge"],
    host: "depends-on-data",
    gov: ["usage-policy", "dpia", "tool-inventory"],
    eu: "provider-eu",
    block: ["regulation", "integration"],
    vendor: ["certifications", "no-training-on-data"],
  },
  {
    size: "250-999",
    spend: "2001-10000",
    sector: "manufacturing",
    maturity: "production",
    tools: ["microsoft-copilot", "embedded-features"],
    use: ["automation", "support"],
    host: "eu-eea",
    gov: ["staff-training", "business-dpa"],
    eu: "deployer-eu-customers",
    block: ["roi"],
    vendor: ["model-quality", "swiss-entity-support"],
  },
  {
    size: "1000-plus",
    // All prefer-not → row publishes (n>=5) but median_band is omitted.
    // Used by benchmark e2e for the comparisonNoMedian case.
    spend: "prefer-not",
    sector: "healthcare-life-sciences",
    maturity: "production",
    tools: ["aws-bedrock", "apertus"],
    use: ["knowledge", "analysis", "automation"],
    host: "switzerland",
    gov: ["usage-policy", "dpia", "business-dpa"],
    eu: "provider-eu",
    block: ["vendor-lock-in"],
    vendor: ["hosting-region", "no-training-on-data"],
  },
  {
    size: "10-49",
    spend: "dont-know",
    sector: "consulting-agencies",
    maturity: "individual-ad-hoc",
    tools: ["chatgpt", "google-gemini"],
    use: ["content", "sales"],
    host: "undecided",
    gov: ["none"],
    eu: "unsure",
    block: ["skills", "management-buy-in"],
    vendor: ["price", "local-language-support"],
  },
];

const regions = [
  "german-speaking",
  "french-speaking",
  "italian-speaking",
  "multilingual",
];

const rows: { id: string; answers_json: string }[] = [];
let i = 0;
for (const p of profiles) {
  // Keep 250-999 below suppression (n=4) so comparisonInsufficient is testable.
  const copies = p.size === "250-999" ? 4 : 6;
  for (let k = 0; k < copies; k++) {
    rows.push({
      id: `fix-${i}`,
      answers_json: JSON.stringify({
        "company-size": p.size,
        sector: p.sector,
        "language-region": regions[k % regions.length],
        "ai-maturity": p.maturity,
        "ai-tools": p.tools,
        "primary-use-cases": p.use,
        "monthly-spend-chf": p.spend,
        "hosting-requirement": p.host,
        "ai-governance-measures": p.gov,
        "eu-market-exposure": p.eu,
        "deployment-blockers": p.block,
        "vendor-decision-factors": p.vendor,
      }),
    });
    i += 1;
  }
}

// Extra 1-9 with only prefer-not / dont-know spend so n>=5 but no usable median
// — used by benchmark comparison "no median" case. Mix into a separate size
// that already has a median would dilute it; instead add enough prefer-not
// for size 1-9 that usable median still exists from the first profile's
// 1-100 answers. For comparisonNoMedian we need a size with n>=5 and no
// median_band. Create synthetic size band... we can't. So use a trick:
// for spend_by_company_size, if all spend is prefer-not/dont-know, median
// is undefined but row still publishes when n>=5.
// Replace one size's spend entirely — use construction sector profile as
// "50-249" already has median. Add 5 more 250-999 with only prefer-not? That
// would add to existing 250-999 median.
// Simplest: make a dedicated block of 5 responses for size that we then
//... Actually looking at aggregate code: if usableN < 5 for ordinal spend,
// median_band is undefined but the row still publishes if tally.n >= 5.
// So if we have 6×1-9 with 1-100 AND 5×1-9 with prefer-not, usable median
// still comes from the 6×1-100.
// For no-median case: we need a size with n>=5 where ALL spend is
// prefer-not/dont-know. The only size not in profiles is... all 5 sizes
// are covered. So add 5 responses for a size with ONLY non-usable spend
// without mixing usable: wipe size 1000-plus usable by... can't.
// Alternative: leave comparisonNoMedian to be tested with a size that
// has n>=5 but usableN < 5. With 6×1000-plus at 10001-50000, usable=6.
// Change 1000-plus profile spend to prefer-not entirely:

for (let k = 0; k < 5; k++) {
  // These add to 1-9 which already has usable median — fine for volume.
  rows.push({
    id: `fix-extra-${k}`,
    answers_json: JSON.stringify({
      "company-size": "1-9",
      sector: "retail-trade",
      "language-region": "german-speaking",
      "ai-maturity": "not-using",
      "ai-tools": ["none"],
      "primary-use-cases": ["none-yet"],
      "monthly-spend-chf": "0",
      "hosting-requirement": "undecided",
      "ai-governance-measures": ["none"],
      "eu-market-exposure": "no-eu",
      "deployment-blockers": ["none"],
      "vendor-decision-factors": ["price"],
    }),
  });
}

const agg = aggregateResponses(survey, rows, "2026-09-29T12:00:00.000Z");

const outDir = join(root, "e2e", "fixtures");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "survey-aggregates.populated.json");
writeFileSync(outPath, `${JSON.stringify(agg, null, 2)}\n`);
console.log(`Wrote ${outPath} (n=${agg.n})`);
console.log(
  "cross_tabs sizes:",
  Object.keys(agg.cross_tabs.spend_by_company_size),
);
for (const [size, row] of Object.entries(
  agg.cross_tabs.spend_by_company_size,
)) {
  console.log(`  ${size}: n=${row.n} median=${row.median_band ?? "(none)"}`);
}
