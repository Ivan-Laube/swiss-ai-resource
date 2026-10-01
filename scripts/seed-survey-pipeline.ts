/**
 * Seed synthetic survey respondents through a local survey Worker, then
 * optionally write aggregates via aggregate-survey.ts.
 *
 * Starts wrangler itself (same pattern as test-survey-worker.ts).
 *
 * Usage:
 *   npx tsx scripts/seed-survey-pipeline.ts [--n 12] [--port 8787] [--write]
 */
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

import { parseSurvey } from "../src/survey/schema";
import surveyJson from "../data/survey-questions.json";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const workerDir = join(root, "workers", "survey");
const wranglerConfig = join(workerDir, "wrangler.jsonc");
const ALWAYS_PASS = "1x0000000000000000000000000000000AA";
const origin = "https://aicompliant.ch";

const args = process.argv.slice(2);
function flagValue(name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx < 0) return undefined;
  return args[idx + 1];
}
const n = Number(flagValue("--n") ?? "12");
const port = Number(flagValue("--port") ?? "8787");
const doWrite = args.includes("--write");
const base = `http://127.0.0.1:${port}`;

const survey = parseSurvey(surveyJson);

const profiles = [
  {
    size: "2-9",
    spend: "1-250",
    sector: "legal-fiduciary",
    maturity: "individual-ad-hoc",
    tools: ["chatgpt"],
    use: ["content"],
    host: "switzerland",
    gov: ["none"],
    eu: "no-eu",
    block: ["cost"],
    vendor: ["price", "hosting-region"],
  },
  {
    size: "10-49",
    spend: "251-1000",
    sector: "ict-software",
    maturity: "sanctioned-tools",
    tools: ["chatgpt", "deepl"],
    use: ["coding"],
    host: "eu-eea",
    gov: ["usage-policy"],
    eu: "deployer-eu-customers",
    block: ["data-protection"],
    vendor: ["fits-existing-stack"],
  },
  {
    size: "50-249",
    spend: "1001-5000",
    sector: "finance-insurance",
    maturity: "piloting-custom",
    tools: ["claude"],
    use: ["analysis"],
    host: "depends-on-data",
    gov: ["dpia"],
    eu: "provider-eu",
    block: ["regulation"],
    vendor: ["certifications"],
  },
  {
    size: "10-49",
    spend: "dont-know",
    sector: "consulting-agencies",
    maturity: "individual-ad-hoc",
    tools: ["google-gemini"],
    use: ["sales"],
    host: "undecided",
    gov: ["none"],
    eu: "unsure",
    block: ["skills"],
    vendor: ["price"],
  },
];

function answersFor(i: number) {
  const p = profiles[i % profiles.length]!;
  const regions = [
    "german-speaking",
    "french-speaking",
    "italian-speaking",
    "multilingual",
  ];
  return {
    "company-size": p.size,
    sector: p.sector,
    "language-region": regions[i % regions.length],
    "ai-maturity": p.maturity,
    "ai-tools": p.tools,
    "primary-use-cases": p.use,
    "monthly-spend-chf": p.spend,
    "spend-outlook-12m": "increase-up-to-50",
    "weekly-ai-users-share": "11-25",
    "hosting-requirement": p.host,
    "ai-governance-measures": p.gov,
    "eu-market-exposure": p.eu,
    "deployment-blockers": p.block,
    "vendor-decision-factors": p.vendor,
  };
}

async function waitForWorker(timeoutMs = 90_000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${base}/nope`, {
        headers: { Origin: origin },
      });
      // Any HTTP response means the Worker process is listening.
      if (res.status > 0) return;
    } catch {
      // not up yet
    }
    await delay(500);
  }
  throw new Error(`Worker not ready at ${base}`);
}

async function main(): Promise<void> {
  console.log(`Seeding n=${n} via ${base}`);
  writeFileSync(
    join(workerDir, ".dev.vars"),
    `TURNSTILE_SECRET_KEY=${ALWAYS_PASS}\n`,
  );

  const migrate = spawnSync(
    process.execPath,
    [
      join(root, "node_modules", "wrangler", "bin", "wrangler.js"),
      "d1",
      "migrations",
      "apply",
      "swiss-ai-survey",
      "--local",
      "-c",
      wranglerConfig,
    ],
    { cwd: root, encoding: "utf8", shell: false },
  );
  if (migrate.status !== 0) {
    console.error(migrate.stderr);
    process.exit(migrate.status ?? 1);
  }
  console.log("Migrations OK");

  // Clear local tables so prior worker-integration runs do not exhaust quotas.
  spawnSync(
    process.execPath,
    [
      join(root, "node_modules", "wrangler", "bin", "wrangler.js"),
      "d1",
      "execute",
      "swiss-ai-survey",
      "--local",
      "-c",
      wranglerConfig,
      "--command",
      "DELETE FROM submission_quotas; DELETE FROM responses; DELETE FROM report_signups;",
    ],
    { cwd: root, encoding: "utf8", shell: false },
  );
  console.log("Cleared local responses/quotas");

  const child: ChildProcess = spawn(
    process.execPath,
    [
      join(root, "node_modules", "wrangler", "bin", "wrangler.js"),
      "dev",
      "-c",
      wranglerConfig,
      "--ip",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    { cwd: root, stdio: ["ignore", "pipe", "pipe"], shell: false },
  );
  let boot = "";
  child.stdout?.on("data", (c: Buffer) => {
    boot += c.toString();
  });
  child.stderr?.on("data", (c: Buffer) => {
    boot += c.toString();
  });

  try {
    await waitForWorker();
    console.log("Worker ready");

    let ok = 0;
    let fail = 0;
    let i = 0;
    let guard = 0;
    while (i < n && guard < n * 5) {
      guard += 1;
      const body = {
        survey_id: survey.id,
        survey_version: survey.version,
        locale: "en",
        answers: answersFor(i),
        email: null,
        report_opt_in: false,
        website: "",
        turnstile_token: "XXXX.DUMMY.TOKEN.XXXX",
      };
      const res = await fetch(`${base}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: origin,
        },
        body: JSON.stringify(body),
      });
      if (res.status === 201) {
        ok += 1;
        i += 1;
        console.log(`seed ${ok}/${n}`);
      } else if (res.status === 429) {
        console.log("rate limited — waiting 15s");
        await delay(15_000);
      } else {
        fail += 1;
        i += 1;
        console.warn(`seed fail -> ${res.status} ${await res.text()}`);
      }
      await delay(13_000);
    }

    console.log(`Seeded ${ok} responses (${fail} failures)`);

    if (doWrite) {
      const agg = spawnSync(
        process.execPath,
        [
          join(root, "node_modules", "tsx", "dist", "cli.mjs"),
          join(root, "scripts", "aggregate-survey.ts"),
          "--local",
          "--write",
        ],
        { cwd: root, stdio: "inherit", shell: false },
      );
      if (agg.status !== 0) process.exit(agg.status ?? 1);
    }

    if (ok === 0) process.exit(1);
  } catch (err) {
    console.error("Boot log:\n", boot);
    throw err;
  } finally {
    child.kill("SIGTERM");
    await delay(1000);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
