/**
 * Response-quality evaluation for the survey instrument.
 *
 * Generates a synthetic respondent population from documented priors (or loads
 * answers_json rows from --from-json), then runs measurable gates. Exits
 * non-zero when a hard gate fails.
 *
 * Usage:
 *   npx tsx scripts/evaluate-survey-instrument.ts
 *   npx tsx scripts/evaluate-survey-instrument.ts --n 300 --seed 42
 *   npx tsx scripts/evaluate-survey-instrument.ts --from-json path/to/rows.json
 *   npx tsx scripts/evaluate-survey-instrument.ts --allow-fail   # report only
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  aggregateResponses,
  COMPANY_SIZE_QUESTION_ID,
  SPEND_QUESTION_ID,
  SURVEY_SUPPRESSION_THRESHOLD,
  type AggregateResponseRow,
} from "../src/survey/aggregates";
import type { AnswerValue } from "../src/survey/answers";
import {
  parseSurvey,
  type Survey,
  type SurveyChoiceQuestion,
} from "../src/survey/schema";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// --- CLI --------------------------------------------------------------------

const args = process.argv.slice(2);
function flagValue(name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx < 0) return undefined;
  return args[idx + 1];
}
const allowFail = args.includes("--allow-fail");
const fromJson = flagValue("--from-json");
const sampleN = Number(flagValue("--n") ?? "300");
const seed = Number(flagValue("--seed") ?? "42");

// --- RNG --------------------------------------------------------------------

function mulberry32(seedValue: number): () => number {
  let t = seedValue >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function pickWeighted(
  rng: () => number,
  weights: Record<string, number>,
): string {
  const entries = Object.entries(weights);
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = rng() * total;
  for (const [id, w] of entries) {
    roll -= w;
    if (roll <= 0) return id;
  }
  return entries[entries.length - 1]![0];
}

function pickMulti(
  rng: () => number,
  weights: Record<string, number>,
  maxSelect: number,
  exclusiveNoneId?: string,
): string[] {
  if (exclusiveNoneId && rng() < (weights[exclusiveNoneId] ?? 0)) {
    return [exclusiveNoneId];
  }
  const candidates = Object.entries(weights).filter(
    ([id]) => id !== exclusiveNoneId,
  );
  const selected: string[] = [];
  for (const [id, w] of candidates) {
    if (rng() < w) selected.push(id);
  }
  if (selected.length === 0 && candidates.length > 0) {
    selected.push(candidates[Math.floor(rng() * candidates.length)]![0]);
  }
  // Cap and shuffle so max_select is respected in synthetic data.
  while (selected.length > maxSelect) {
    selected.splice(Math.floor(rng() * selected.length), 1);
  }
  return selected;
}

// --- Priors (documented assumptions; adjust after pilot) --------------------
/**
 * Priors model a Swiss SME audience visiting an AI-compliance site (biased
 * toward ICT / professional services vs STATENT universe). Weights for
 * multi-select are independent probabilities (not required to sum to 1).
 *
 * BFS STATENT reference (approximate firm-size mix, for representativeness):
 * micro 1–9 ≈ 90%, small 10–49 ≈ 8%, medium 50–249 ≈ 1.5%, large 250+ ≈ 0.5%.
 */
const PRIORS_V3 = {
  "company-size": {
    "1-9": 0.35,
    "10-49": 0.3,
    "50-249": 0.2,
    "250-999": 0.1,
    "1000-plus": 0.05,
  },
  sector: {
    manufacturing: 0.08,
    construction: 0.05,
    "finance-insurance": 0.1,
    "healthcare-life-sciences": 0.08,
    "retail-trade": 0.07,
    "transport-logistics": 0.04,
    "legal-fiduciary": 0.12,
    "consulting-agencies": 0.14,
    "ict-software": 0.22,
    "public-admin": 0.05,
    other: 0.05,
  },
  "language-region": {
    "german-speaking": 0.55,
    "french-speaking": 0.22,
    "italian-speaking": 0.05,
    multilingual: 0.18,
  },
  "ai-maturity": {
    "not-using": 0.12,
    "individual-ad-hoc": 0.32,
    "sanctioned-tools": 0.28,
    "piloting-custom": 0.18,
    production: 0.1,
  },
  "ai-tools": {
    chatgpt: 0.55,
    "microsoft-copilot": 0.35,
    "google-gemini": 0.2,
    claude: 0.15,
    mistral: 0.08,
    deepl: 0.4,
    "azure-openai": 0.12,
    "aws-bedrock": 0.05,
    apertus: 0.06,
    "embedded-features": 0.3,
    "self-hosted-oss": 0.08,
    other: 0.06,
    none: 0.1,
  },
  "primary-use-cases": {
    content: 0.45,
    translation: 0.35,
    coding: 0.25,
    support: 0.2,
    analysis: 0.3,
    knowledge: 0.28,
    automation: 0.22,
    sales: 0.15,
    other: 0.05,
    "none-yet": 0.12,
  },
  "monthly-spend-chf": {
    "0": 0.15,
    "1-100": 0.22,
    "101-500": 0.2,
    "501-2000": 0.15,
    "2001-10000": 0.1,
    "10001-50000": 0.05,
    "50000-plus": 0.02,
    "dont-know": 0.08,
    "prefer-not": 0.03,
  },
  "hosting-requirement": {
    switzerland: 0.22,
    "eu-eea": 0.28,
    "depends-on-data": 0.3,
    any: 0.12,
    undecided: 0.08,
  },
  "ai-governance-measures": {
    "usage-policy": 0.28,
    "staff-training": 0.22,
    "tool-inventory": 0.18,
    dpia: 0.12,
    "business-dpa": 0.25,
    none: 0.35,
  },
  "eu-market-exposure": {
    "provider-eu": 0.12,
    "deployer-eu-customers": 0.28,
    "no-eu": 0.45,
    unsure: 0.15,
  },
  "deployment-blockers": {
    cost: 0.35,
    "data-protection": 0.4,
    skills: 0.3,
    roi: 0.28,
    regulation: 0.25,
    integration: 0.22,
    "management-buy-in": 0.15,
    "vendor-lock-in": 0.12,
    none: 0.1,
    other: 0.05,
  },
  "vendor-decision-factors": {
    price: 0.4,
    "hosting-region": 0.35,
    "dpa-terms": 0.3,
    certifications: 0.22,
    "model-quality": 0.28,
    "local-language-support": 0.18,
    "swiss-entity-support": 0.2,
    "fits-existing-stack": 0.35,
    "no-training-on-data": 0.3,
  },
} as const;

/** v2 priors — intentionally concentrated to surface instrument flaws. */
const PRIORS_V2 = {
  "company-size": {
    "1-9": 0.4,
    "10-49": 0.3,
    "50-249": 0.15,
    "250-999": 0.1,
    "1000-plus": 0.05,
  },
  sector: {
    manufacturing: 0.05,
    construction: 0.03,
    "finance-insurance": 0.08,
    "healthcare-life-sciences": 0.05,
    "retail-trade": 0.05,
    "hospitality-tourism": 0.02,
    "transport-logistics": 0.03,
    "professional-services": 0.35,
    "ict-software": 0.28,
    "public-admin": 0.03,
    other: 0.03,
  },
  "language-region": {
    "german-speaking": 0.65,
    "french-speaking": 0.2,
    "italian-speaking": 0.03,
    multilingual: 0.12,
  },
  "ai-maturity": {
    "not-using": 0.08,
    exploring: 0.55,
    piloting: 0.25,
    production: 0.12,
  },
  "ai-tools": {
    chatgpt: 0.7,
    "microsoft-copilot": 0.35,
    "google-gemini": 0.2,
    claude: 0.15,
    mistral: 0.05,
    deepl: 0.45,
    "azure-openai": 0.1,
    "aws-bedrock": 0.03,
    "swiss-eu-host": 0.05,
    "self-hosted-oss": 0.05,
    other: 0.05,
    none: 0.08,
  },
  "primary-use-cases": {
    content: 0.55,
    translation: 0.4,
    coding: 0.25,
    support: 0.2,
    analysis: 0.3,
    knowledge: 0.25,
    automation: 0.2,
    sales: 0.15,
    other: 0.05,
  },
  "monthly-spend-chf": {
    "0": 0.15,
    "1-500": 0.5,
    "501-2000": 0.2,
    "2001-10000": 0.08,
    "10000-plus": 0.02,
    "prefer-not": 0.05,
  },
  "hosting-requirement": {
    switzerland: 0.25,
    "eu-eea": 0.3,
    any: 0.25,
    undecided: 0.2,
  },
  "personal-data-in-ai": {
    yes: 0.35,
    no: 0.4,
    unsure: 0.25,
  },
  "eu-market-exposure": {
    yes: 0.15,
    no: 0.7,
    unsure: 0.15,
  },
  "deployment-blockers": {
    cost: 0.4,
    "data-protection": 0.45,
    skills: 0.35,
    roi: 0.3,
    regulation: 0.25,
    integration: 0.25,
    "management-buy-in": 0.15,
    "vendor-lock-in": 0.1,
    none: 0.08,
    other: 0.05,
  },
  "vendor-decision-factors": {
    price: 0.5,
    "hosting-region": 0.4,
    "dpa-terms": 0.35,
    certifications: 0.25,
    "model-quality": 0.3,
    "local-language-support": 0.2,
    "swiss-entity-support": 0.25,
  },
} as const;

// BFS STATENT-ish firm-size mix for representativeness reporting
const STATENT_SIZE = {
  "1-9": 0.9,
  "10-49": 0.08,
  "50-249": 0.015,
  "250-999": 0.004,
  "1000-plus": 0.001,
};

const STATENT_REGION = {
  "german-speaking": 0.63,
  "french-speaking": 0.23,
  "italian-speaking": 0.08,
  multilingual: 0.06,
};

// --- Synthetic generation ---------------------------------------------------

type Priors = Record<string, Record<string, number>>;

function selectPriors(survey: Survey): Priors {
  if (survey.version >= 3) return PRIORS_V3 as unknown as Priors;
  return PRIORS_V2 as unknown as Priors;
}

function generateRespondent(
  survey: Survey,
  priors: Priors,
  rng: () => number,
): Record<string, AnswerValue> {
  const answers: Record<string, AnswerValue> = {};
  const maturity = pickWeighted(
    rng,
    priors["ai-maturity"] ?? { "not-using": 1 },
  );
  const notUsing = maturity === "not-using";
  const companySize = pickWeighted(
    rng,
    priors["company-size"] ?? { "10-49": 1 },
  );

  for (const question of survey.questions) {
    if (question.input === "text") continue;
    const qPriors = priors[question.id];
    if (!qPriors) {
      answers[question.id] =
        question.input === "single"
          ? question.options[0]!.id
          : [question.options[0]!.id];
      continue;
    }

    if (question.id === "company-size") {
      answers[question.id] = companySize;
      continue;
    }

    if (question.id === "ai-maturity") {
      answers[question.id] = maturity;
      continue;
    }

    if (question.input === "single") {
      if (question.id === "monthly-spend-chf") {
        answers[question.id] = pickSpendForSize(companySize, qPriors, rng);
      } else {
        answers[question.id] = pickWeighted(rng, qPriors);
      }
      continue;
    }

    const maxSelect =
      "max_select" in question && typeof question.max_select === "number"
        ? question.max_select
        : question.options.length;
    const exclusiveNone =
      question.options.some((o) => o.id === "none") &&
      (question.id === "ai-tools" ||
        question.id === "deployment-blockers" ||
        question.id === "ai-governance-measures")
        ? "none"
        : question.options.some((o) => o.id === "none-yet")
          ? "none-yet"
          : undefined;

    if (notUsing && question.id === "ai-tools") {
      answers[question.id] = ["none"];
      continue;
    }
    if (notUsing && question.id === "primary-use-cases") {
      answers[question.id] =
        exclusiveNone === "none-yet" ? ["none-yet"] : ["other"];
      continue;
    }
    if (notUsing && question.id === "ai-governance-measures") {
      answers[question.id] = ["none"];
      continue;
    }

    answers[question.id] = pickMulti(rng, qPriors, maxSelect, exclusiveNone);
  }

  // Soft consistency: zero spend if tools=none
  const tools = answers["ai-tools"];
  if (Array.isArray(tools) && tools.includes("none")) {
    answers["monthly-spend-chf"] = "0";
  }

  return answers;
}

/** Bias spend upward with company size so cross-tab medians differ. */
function pickSpendForSize(
  size: string,
  base: Record<string, number>,
  rng: () => number,
): string {
  const boost: Record<string, Record<string, number>> = {
    "1-9": {
      "0": 2.5,
      "1-100": 2.2,
      "101-500": 1.2,
      "1-500": 2.5,
      "501-2000": 0.4,
      "2001-10000": 0.15,
      "10001-50000": 0.05,
      "50000-plus": 0.02,
      "10000-plus": 0.05,
    },
    "10-49": {
      "0": 1.2,
      "1-100": 1.5,
      "101-500": 2,
      "1-500": 2,
      "501-2000": 1.5,
      "2001-10000": 0.5,
      "10001-50000": 0.15,
      "50000-plus": 0.05,
      "10000-plus": 0.15,
    },
    "50-249": {
      "0": 0.5,
      "1-100": 0.6,
      "101-500": 1.2,
      "1-500": 1,
      "501-2000": 2,
      "2001-10000": 1.8,
      "10001-50000": 0.6,
      "50000-plus": 0.2,
      "10000-plus": 0.8,
    },
    "250-999": {
      "0": 0.2,
      "1-100": 0.3,
      "101-500": 0.5,
      "1-500": 0.4,
      "501-2000": 1.2,
      "2001-10000": 2.2,
      "10001-50000": 1.5,
      "50000-plus": 0.6,
      "10000-plus": 2,
    },
    "1000-plus": {
      "0": 0.1,
      "1-100": 0.15,
      "101-500": 0.3,
      "1-500": 0.2,
      "501-2000": 0.6,
      "2001-10000": 1.5,
      "10001-50000": 2.2,
      "50000-plus": 1.8,
      "10000-plus": 2.5,
    },
  };
  const multipliers = boost[size] ?? {};
  const adjusted: Record<string, number> = {};
  for (const [id, w] of Object.entries(base)) {
    adjusted[id] = w * (multipliers[id] ?? 1);
  }
  return pickWeighted(rng, adjusted);
}

function generatePopulation(
  survey: Survey,
  n: number,
  seedValue: number,
): Record<string, AnswerValue>[] {
  const rng = mulberry32(seedValue);
  const priors = selectPriors(survey);
  return Array.from({ length: n }, () =>
    generateRespondent(survey, priors, rng),
  );
}

// --- Metrics ----------------------------------------------------------------

type GateResult = {
  id: string;
  hard: boolean;
  pass: boolean;
  detail: string;
};

function shannonEntropyNormalized(counts: number[]): number {
  const total = counts.reduce((a, b) => a + b, 0);
  if (total === 0 || counts.length <= 1) return 0;
  let h = 0;
  for (const c of counts) {
    if (c <= 0) continue;
    const p = c / total;
    h -= p * Math.log2(p);
  }
  const maxH = Math.log2(counts.length);
  return maxH === 0 ? 0 : h / maxH;
}

function optionCounts(
  responses: Record<string, AnswerValue>[],
  questionId: string,
  multi: boolean,
): { n: number; counts: Map<string, number> } {
  const counts = new Map<string, number>();
  let n = 0;
  for (const answers of responses) {
    const value = answers[questionId];
    if (value === undefined) continue;
    n += 1;
    const selected = Array.isArray(value) ? value : [value];
    for (const id of selected) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    if (!multi && selected.length !== 1) {
      // still counted
    }
  }
  return { n, counts };
}

function evaluateGates(
  survey: Survey,
  responses: Record<string, AnswerValue>[],
): GateResult[] {
  const results: GateResult[] = [];
  const choiceQuestions = survey.questions.filter(
    (q): q is SurveyChoiceQuestion => q.input !== "text",
  );

  // Concentration + entropy (single-choice). Skip language-region: Swiss
  // linguistic mix inherently exceeds 60% German-speaking (STATENT ≈ 63%).
  const skipConcentration = new Set(["language-region"]);
  for (const question of choiceQuestions) {
    if (question.input !== "single") continue;
    if (skipConcentration.has(question.id)) continue;
    const { n, counts } = optionCounts(responses, question.id, false);
    if (n === 0) continue;
    let maxShare = 0;
    let maxId = "";
    for (const [id, c] of counts) {
      const share = c / n;
      if (share > maxShare) {
        maxShare = share;
        maxId = id;
      }
    }
    const entropy = shannonEntropyNormalized(
      question.options.map((o) => counts.get(o.id) ?? 0),
    );
    const pass = maxShare <= 0.6 && entropy >= 0.5;
    results.push({
      id: `concentration:${question.id}`,
      hard: true,
      pass,
      detail: `max=${(maxShare * 100).toFixed(1)}% (${maxId}), entropy=${entropy.toFixed(3)} (need ≤60% and ≥0.5)`,
    });
  }

  // Multi-select ceiling
  for (const question of choiceQuestions) {
    if (question.input !== "multi") continue;
    const { n, counts } = optionCounts(responses, question.id, true);
    if (n === 0) continue;
    let maxShare = 0;
    let maxId = "";
    for (const [id, c] of counts) {
      // Exclude exclusive-none from the ceiling (it's a valid mode)
      if (id === "none" || id === "none-yet") continue;
      const share = c / n;
      if (share > maxShare) {
        maxShare = share;
        maxId = id;
      }
    }
    let totalSelections = 0;
    for (const answers of responses) {
      const value = answers[question.id];
      if (!Array.isArray(value)) continue;
      totalSelections += value.length;
    }
    const avgShare = totalSelections / n / question.options.length;
    const pass = maxShare <= 0.8 && avgShare <= 0.4;
    results.push({
      id: `multi-ceiling:${question.id}`,
      hard: true,
      pass,
      detail: `max=${(maxShare * 100).toFixed(1)}% (${maxId}), avgOptions=${(avgShare * 100).toFixed(1)}% of list (need ≤80% and ≤40%)`,
    });
  }

  // "Other" share
  for (const question of choiceQuestions) {
    if (!question.options.some((o) => o.id === "other")) continue;
    const { n, counts } = optionCounts(
      responses,
      question.id,
      question.input === "multi",
    );
    if (n === 0) continue;
    const otherShare = (counts.get("other") ?? 0) / n;
    results.push({
      id: `other-share:${question.id}`,
      hard: true,
      pass: otherShare <= 0.1,
      detail: `other=${(otherShare * 100).toFixed(1)}% (need ≤10%)`,
    });
  }

  // Duplicate full-answer fingerprint
  const fingerprints = new Map<string, number>();
  for (const answers of responses) {
    const key = JSON.stringify(
      Object.keys(answers)
        .sort()
        .map((k) => [k, answers[k]]),
    );
    fingerprints.set(key, (fingerprints.get(key) ?? 0) + 1);
  }
  let maxDup = 0;
  for (const c of fingerprints.values()) {
    if (c > maxDup) maxDup = c;
  }
  const dupShare = responses.length === 0 ? 0 : maxDup / responses.length;
  results.push({
    id: "duplicate-responses",
    hard: true,
    pass: dupShare <= 0.05,
    detail: `mostCommon=${(dupShare * 100).toFixed(1)}% (${maxDup}/${responses.length}) (need ≤5%)`,
  });

  // Consistency violations (soft)
  let maturityToolViolations = 0;
  let noneSpendViolations = 0;
  let copilotZeroSpend = 0;
  for (const answers of responses) {
    const maturity = answers["ai-maturity"];
    const tools = answers["ai-tools"];
    const useCases = answers["primary-use-cases"];
    const spend = answers["monthly-spend-chf"];
    if (
      maturity === "not-using" &&
      Array.isArray(tools) &&
      tools.some((t) => t !== "none")
    ) {
      maturityToolViolations += 1;
    }
    if (
      maturity === "not-using" &&
      Array.isArray(useCases) &&
      useCases.some((u) => u !== "none-yet" && u !== "none")
    ) {
      maturityToolViolations += 1;
    }
    if (
      Array.isArray(tools) &&
      tools.includes("none") &&
      typeof spend === "string" &&
      spend !== "0" &&
      spend !== "prefer-not" &&
      spend !== "dont-know"
    ) {
      noneSpendViolations += 1;
    }
    if (
      Array.isArray(tools) &&
      tools.includes("microsoft-copilot") &&
      spend === "0"
    ) {
      copilotZeroSpend += 1;
    }
  }
  results.push({
    id: "consistency:maturity-tools",
    hard: false,
    pass: maturityToolViolations / Math.max(responses.length, 1) <= 0.05,
    detail: `${maturityToolViolations} not-using+tools/use-cases conflicts`,
  });
  results.push({
    id: "consistency:none-spend",
    hard: false,
    pass: noneSpendViolations / Math.max(responses.length, 1) <= 0.05,
    detail: `${noneSpendViolations} tools=none with non-zero spend`,
  });
  results.push({
    id: "consistency:copilot-zero-spend",
    hard: false,
    pass: true,
    detail: `${copilotZeroSpend} microsoft-copilot with spend=0 (informational)`,
  });

  // Suppression survival at projected n
  for (const projectedN of [50, 100, 300]) {
    const sample = responses.slice(0, Math.min(projectedN, responses.length));
    if (sample.length < projectedN) {
      // scale by resampling with replacement from existing
      const rng = mulberry32(seed + projectedN);
      while (sample.length < projectedN) {
        sample.push(responses[Math.floor(rng() * responses.length)]!);
      }
    }
    const rows: AggregateResponseRow[] = sample.map((answers, i) => ({
      id: `syn-${projectedN}-${i}`,
      answers_json: JSON.stringify(answers),
    }));
    const agg = aggregateResponses(survey, rows, new Date().toISOString());
    let cells = 0;
    let published = 0;
    for (const question of choiceQuestions) {
      if (!question.aggregate) continue;
      for (const option of question.options) {
        cells += 1;
        if ((agg.questions[question.id]?.counts[option.id] ?? 0) >= SURVEY_SUPPRESSION_THRESHOLD) {
          published += 1;
        }
      }
    }
    const share = cells === 0 ? 0 : published / cells;
    // Soft gate: at n=300 expect ≥40% of cells publishable; at 50 expect ≥10%
    const threshold = projectedN >= 300 ? 0.4 : projectedN >= 100 ? 0.2 : 0.1;
    results.push({
      id: `suppression-survival:n=${projectedN}`,
      hard: projectedN === 300,
      pass: share >= threshold,
      detail: `${published}/${cells} cells (≥${SURVEY_SUPPRESSION_THRESHOLD}) = ${(share * 100).toFixed(1)}% (need ≥${(threshold * 100).toFixed(0)}%)`,
    });
  }

  // Cross-tab discrimination: distinct median spend bands across size bands
  {
    const rows: AggregateResponseRow[] = responses.map((answers, i) => ({
      id: `xtab-${i}`,
      answers_json: JSON.stringify(answers),
    }));
    const agg = aggregateResponses(survey, rows, new Date().toISOString());
    const medians = new Set<string>();
    for (const row of Object.values(agg.cross_tabs.spend_by_company_size)) {
      if (row.median_band) medians.add(row.median_band);
    }
    const publishedSizes = Object.keys(agg.cross_tabs.spend_by_company_size).length;
    results.push({
      id: "cross-tab-discrimination",
      hard: true,
      pass: medians.size >= 3,
      detail: `${medians.size} distinct median bands across ${publishedSizes} size bands (need ≥3): [${[...medians].join(", ")}]`,
    });
  }

  // Representativeness vs STATENT (report skew; soft)
  {
    const { n, counts } = optionCounts(responses, COMPANY_SIZE_QUESTION_ID, false);
    const skews: string[] = [];
    for (const [id, expected] of Object.entries(STATENT_SIZE)) {
      const actual = n === 0 ? 0 : (counts.get(id) ?? 0) / n;
      const ratio = expected === 0 ? 0 : actual / expected;
      skews.push(`${id}: ${(actual * 100).toFixed(1)}% vs ${(expected * 100).toFixed(1)}% (×${ratio.toFixed(1)})`);
    }
    results.push({
      id: "representativeness:company-size",
      hard: false,
      pass: true,
      detail: `Site audience vs STATENT — ${skews.join("; ")}. Publish weights or caveat if skewed.`,
    });

    const region = optionCounts(responses, "language-region", false);
    const regionSkews: string[] = [];
    for (const [id, expected] of Object.entries(STATENT_REGION)) {
      const actual =
        region.n === 0 ? 0 : (region.counts.get(id) ?? 0) / region.n;
      regionSkews.push(
        `${id}: ${(actual * 100).toFixed(1)}% vs ${(expected * 100).toFixed(1)}%`,
      );
    }
    results.push({
      id: "representativeness:language-region",
      hard: false,
      pass: true,
      detail: regionSkews.join("; "),
    });
  }

  // Sanity: spend question still present for median
  const spendQ = survey.questions.find((q) => q.id === SPEND_QUESTION_ID);
  results.push({
    id: "instrument:spend-question",
    hard: true,
    pass: !!spendQ && spendQ.input === "single",
    detail: spendQ
      ? `present with ${spendQ.input === "single" ? spendQ.options.length : 0} options`
      : "missing",
  });

  return results;
}

// --- Main -------------------------------------------------------------------

function loadResponsesFromJson(path: string): Record<string, AnswerValue>[] {
  const raw = JSON.parse(readFileSync(path, "utf8")) as unknown;
  if (!Array.isArray(raw)) {
    throw new Error("--from-json must be an array of {answers_json} or answer maps");
  }
  return raw.map((entry, i) => {
    if (entry && typeof entry === "object" && "answers_json" in entry) {
      const parsed = JSON.parse(
        (entry as { answers_json: string }).answers_json,
      ) as Record<string, AnswerValue>;
      return parsed;
    }
    if (entry && typeof entry === "object") {
      return entry as Record<string, AnswerValue>;
    }
    throw new Error(`Invalid row at index ${i}`);
  });
}

const survey = parseSurvey(
  JSON.parse(readFileSync(join(root, "data", "survey-questions.json"), "utf8")),
);

const responses = fromJson
  ? loadResponsesFromJson(fromJson)
  : generatePopulation(survey, sampleN, seed);

console.log(
  `evaluate-survey-instrument: ${survey.id}@v${survey.version}, n=${responses.length}${fromJson ? ` (from ${fromJson})` : ` (synthetic seed=${seed})`}`,
);

const gates = evaluateGates(survey, responses);
let hardFails = 0;
for (const gate of gates) {
  const mark = gate.pass ? "PASS" : gate.hard ? "FAIL" : "WARN";
  if (!gate.pass && gate.hard) hardFails += 1;
  console.log(`[${mark}] ${gate.id} — ${gate.detail}`);
}

if (hardFails > 0) {
  console.log(`\n${hardFails} hard gate(s) failed.`);
  if (!allowFail) process.exit(1);
  console.log("(--allow-fail set; exiting 0)");
} else {
  console.log("\nAll hard gates passed.");
}
