import fs from "node:fs";
import path from "node:path";

import { pageRefProblem } from "@/content";
import { locales } from "@/i18n/config";
import { listRuleIds } from "@/rules";
import { getSurvey } from "@/survey";

import {
  DOWNLOADS,
  NA,
  SITE_PAGES,
  parseReadinessCheck,
  type Condition,
  type ReadinessCheck,
} from "./schema";

export const READINESS_CHECK_PATH = path.join(
  process.cwd(),
  "data",
  "readiness-check.json",
);

function formatZodError(error: unknown): Error {
  if (
    error &&
    typeof error === "object" &&
    "issues" in error &&
    Array.isArray((error as { issues: unknown }).issues)
  ) {
    const issues = (error as { issues: Array<{ path: PropertyKey[]; message: string }> }).issues;
    const details = issues
      .map((i) => `  - ${i.path.length > 0 ? i.path.join(".") : "(root)"}: ${i.message}`)
      .join("\n");
    return new Error(`Invalid ${READINESS_CHECK_PATH}:\n${details}`);
  }
  return error instanceof Error ? error : new Error(String(error));
}

/** Why a next-step link can't be resolved, or null when it can. */
export function linkProblem(link: string): string | null {
  const [kind, target] = [link.slice(0, link.indexOf(":")), link.slice(link.indexOf(":") + 1)];
  switch (kind) {
    case "guide":
      return pageRefProblem(target);
    case "tool":
      return listRuleIds().includes(target) ? null : `unknown decision tool "${target}"`;
    case "site":
      return target in SITE_PAGES ? null : `unknown site page "${target}" (see SITE_PAGES)`;
    case "download": {
      if (!(target in DOWNLOADS)) return `unknown download "${target}" (see DOWNLOADS)`;
      const source = path.join("content", "templates", target, "de.md");
      return fs.existsSync(path.join(process.cwd(), source))
        ? null
        : `template source ${source} does not exist yet`;
    }
    default:
      return `unknown link kind "${kind}"`;
  }
}

/** Every LocalizedString-shaped object ({ de: … }) with its JSON path. */
function* localizedStrings(
  value: unknown,
  at: string,
): Generator<[string, Record<string, unknown>]> {
  if (Array.isArray(value)) {
    for (const [i, item] of value.entries()) {
      yield* localizedStrings(item, `${at}[${i}]`);
    }
  } else if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.de === "string") {
      yield [at, record];
      return;
    }
    for (const [key, item] of Object.entries(record)) {
      yield* localizedStrings(item, at ? `${at}.${key}` : key);
    }
  }
}

export type ReadinessValidation = { check: ReadinessCheck; warnings: string[] };

/**
 * Cross-field rules Zod can't express. Throws with every problem listed, so
 * one run shows all that needs fixing. Returns non-fatal warnings.
 */
export function validateReadinessCheck(check: ReadinessCheck): string[] {
  const errors: string[] = [];
  const warnings: string[] = [];
  const survey = getSurvey();
  const surveyQuestion = (id: string) => survey.questions.find((q) => q.id === id);
  const surveyOptionIds = (id: string): string[] => {
    const q = surveyQuestion(id);
    return q && "options" in q ? q.options.map((o) => o.id) : [];
  };

  // Ids
  const all = [...check.questions, ...check.security.questions];
  const ids = [...check.profile.map((p) => p.id), ...all.map((q) => q.id)];
  for (const id of new Set(ids)) {
    if (ids.filter((x) => x === id).length > 1) errors.push(`duplicate id "${id}"`);
  }

  // Dimensions
  const dimensionIds = check.dimensions.map((d) => d.id);
  for (const q of check.questions) {
    if (!dimensionIds.includes(q.dimension)) {
      errors.push(`question "${q.id}": unknown dimension "${q.dimension}"`);
    }
  }
  for (const d of dimensionIds) {
    if (!check.questions.some((q) => q.dimension === d)) {
      errors.push(`dimension "${d}" has no questions`);
    }
  }

  // Options, conditions, red flags
  const optionIds = new Map(
    all.map((q) => [q.id, [...q.options.map((o) => o.id), ...(q.na_option ? [NA] : [])]]),
  );
  const order = all.map((q) => q.id);
  const checkCondition = (c: Condition, owner: string, label: string, mustBeEarlier: boolean) => {
    const target = optionIds.get(c.question);
    if (!target) {
      errors.push(`${owner}: ${label} refers to unknown question "${c.question}"`);
      return;
    }
    if (mustBeEarlier && order.indexOf(c.question) >= order.indexOf(owner)) {
      errors.push(`${owner}: ${label} must refer to an earlier question, not "${c.question}"`);
    }
    for (const option of [...(c.is ?? []), ...(c.is_not ?? [])]) {
      if (!target.includes(option)) {
        errors.push(`${owner}: ${label} uses unknown option "${option}" of "${c.question}"`);
      }
    }
  };
  for (const q of all) {
    const optionIdsOfQ = q.options.map((o) => o.id);
    if (new Set(optionIdsOfQ).size !== optionIdsOfQ.length) {
      errors.push(`question "${q.id}": duplicate option ids`);
    }
    if (q.options.map((o) => o.points).join() !== "0,1,2") {
      errors.push(`question "${q.id}": options must be ordered 0, 1, 2 points`);
    }
    if (q.show_if) checkCondition(q.show_if, q.id, "show_if", true);
  }
  for (const q of check.questions) {
    // Overrides may look ahead: severity is only used once all answers are in.
    q.severity_overrides.forEach((o, i) =>
      checkCondition(o.when, q.id, `severity_overrides[${i}]`, false),
    );
    if (q.red_flag && !q.options.some((o) => o.id === q.red_flag?.option)) {
      errors.push(`question "${q.id}": red_flag option "${q.red_flag.option}" does not exist`);
    }
  }
  checkCondition(check.security.none_can_act.when, "security.none_can_act", "when", false);

  // Tiers: contiguous 0..100
  const tiers = [...check.tiers].sort((a, b) => a.min - b.min);
  if (tiers[0].min !== 0 || tiers[tiers.length - 1].max !== 100) {
    errors.push("tiers must start at 0 and end at 100");
  }
  tiers.forEach((t, i) => {
    if (t.min > t.max) errors.push(`tier "${t.id}": min > max`);
    if (i > 0 && t.min !== tiers[i - 1].max + 1) {
      errors.push(`tier "${t.id}" must start at ${tiers[i - 1].max + 1} (no gaps or overlaps)`);
    }
  });
  if (!check.tiers.some((t) => t.id === check.red_flags.cap_tier)) {
    errors.push(`red_flags.cap_tier "${check.red_flags.cap_tier}" is not a tier`);
  }

  // Security levels
  const rules = check.security.levels.map((l) => l.rule);
  if (new Set(rules).size !== rules.length) errors.push("security.levels: each rule exactly once");
  if (!check.security.levels.some((l) => l.id === check.security.promote_on_level)) {
    errors.push(`security.promote_on_level "${check.security.promote_on_level}" is not a level`);
  }

  // Profile ↔ survey
  for (const p of check.profile) {
    const options = p.from_survey
      ? surveyOptionIds(p.from_survey)
      : (p.options ?? []).map((o) => o.id);
    if (p.from_survey && !surveyQuestion(p.from_survey)) {
      errors.push(`profile "${p.id}": unknown survey question "${p.from_survey}"`);
    }
    for (const id of [...p.notes.flatMap((n) => n.when), ...(p.add_links?.when ?? [])]) {
      if (!options.includes(id)) errors.push(`profile "${p.id}": unknown option "${id}"`);
    }
  }
  for (const q of check.questions) {
    if (q.survey_benchmark) {
      const { field, option } = q.survey_benchmark;
      if (!surveyOptionIds(field).includes(option)) {
        errors.push(`question "${q.id}": survey_benchmark ${field}=${option} is not a survey option`);
      }
      for (const [locale, text] of Object.entries(q.survey_benchmark.statement)) {
        if (typeof text === "string" && !text.includes("{pct}")) {
          errors.push(`question "${q.id}": survey_benchmark.statement.${locale} must contain {pct}`);
        }
      }
    }
  }

  // Links
  const linkOwners: [string, string[]][] = [
    ...all.map((q): [string, string[]] => [q.id, q.links]),
    ...check.profile.map((p): [string, string[]] => [`profile "${p.id}"`, p.add_links?.links ?? []]),
  ];
  for (const [owner, links] of linkOwners) {
    for (const link of links) {
      const problem = linkProblem(link);
      if (problem) errors.push(`${owner}: link "${link}": ${problem}`);
    }
  }
  for (const q of all) {
    for (const pending of q.pending_links) {
      if (check.status === "live") {
        errors.push(`${q.id}: pending link "${pending.link}" (${pending.task}) not allowed when live`);
      } else if (!linkProblem(pending.link)) {
        warnings.push(`${q.id}: pending link "${pending.link}" now resolves; move it to links`);
      }
    }
  }

  // Locales: DE + EN always, all four when live
  const required = check.status === "live" ? locales : (["de", "en"] as const);
  for (const [at, value] of localizedStrings(check, "")) {
    const missing = required.filter((l) => typeof value[l] !== "string" || !String(value[l]).trim());
    if (missing.length > 0) errors.push(`${at}: missing ${missing.join(", ")}`);
  }

  if (errors.length > 0) {
    throw new Error(`Invalid ${READINESS_CHECK_PATH}:\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  }
  return warnings;
}

/** Load, parse and validate the readiness check. */
export function loadReadinessCheck(): ReadinessValidation {
  let data: unknown;
  try {
    data = JSON.parse(fs.readFileSync(READINESS_CHECK_PATH, "utf8")) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON in ${READINESS_CHECK_PATH}: ${message}`);
  }
  let check: ReadinessCheck;
  try {
    check = parseReadinessCheck(data);
  } catch (error) {
    throw formatZodError(error);
  }
  return { check, warnings: validateReadinessCheck(check) };
}

export function getReadinessCheck(): ReadinessCheck {
  return loadReadinessCheck().check;
}
