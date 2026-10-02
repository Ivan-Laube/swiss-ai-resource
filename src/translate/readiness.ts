import { stripCodeFence } from "@/lib/llm-output";

import type { MatchedGlossaryTerm } from "./glossary-match";
import { localeSystemRules, type TranslateTargetLocale, type TranslationPrompt } from "./prompt";
import { findRawHtmlOutsideCode } from "./verify";

/**
 * Translation of the readiness check's texts (T51). They live as
 * LocalizedStrings ({ de, en, fr, it }) inside data/readiness-check.json;
 * DE is canonical. Strings are sent in batches as a JSON object of
 * id → German text and must come back with the same ids and placeholders.
 */

/** One LocalizedString in the data: where it is and what it says. */
export type StringEntry = {
  /** Stable id, e.g. "questions.2.prompt". */
  id: string;
  path: (string | number)[];
  de: string;
  values: Record<string, string | undefined>;
};

/** Every LocalizedString-shaped object ({ de: string, … }) in document order. */
export function collectStrings(data: unknown, path: (string | number)[] = []): StringEntry[] {
  if (Array.isArray(data)) {
    return data.flatMap((item, i) => collectStrings(item, [...path, i]));
  }
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (typeof record.de === "string") {
      const values: Record<string, string | undefined> = {};
      for (const [k, v] of Object.entries(record)) {
        if (typeof v === "string") values[k] = v;
      }
      return [{ id: path.join("."), path, de: record.de, values }];
    }
    return Object.entries(record).flatMap(([k, v]) => collectStrings(v, [...path, k]));
  }
  return [];
}

/**
 * Strings to (re)translate into `locale`: missing or empty in that locale,
 * or — when the previous version of the file is given — whose German text
 * changed since then while this locale's text did not (a translation a
 * person updated in the same change is never overwritten). New strings are
 * only filled where the locale is missing.
 */
export function stringsToTranslate(
  entries: StringEntry[],
  locale: TranslateTargetLocale,
  previous?: StringEntry[],
): StringEntry[] {
  const before = previous ? new Map(previous.map((e) => [e.id, e])) : null;
  return entries.filter((e) => {
    if (!e.values[locale]?.trim()) {
      return true;
    }
    const old = before?.get(e.id);
    return old !== undefined && old.de !== e.de && old.values[locale] === e.values[locale];
  });
}

/** `{pct}`-style placeholders the UI fills in. */
const PLACEHOLDER_RE = /\{[a-z_]+\}/g;

function placeholders(text: string): string[] {
  return [...(text.match(PLACEHOLDER_RE) ?? [])].sort();
}

const ADDRESS: Record<TranslateTargetLocale, string> = {
  en: "Address the reader as 'you'.",
  fr: "Address the reader formally with 'vous' / 'votre'.",
  it: "Address the reader with the plural courtesy form used across the site's Italian UI ('voi' / 'vostra', e.g. 'Rispondete', 'la vostra azienda').",
};

export function buildReadinessPrompt(
  locale: TranslateTargetLocale,
  batch: StringEntry[],
  terms: MatchedGlossaryTerm[],
): TranslationPrompt {
  const system = [
    "You translate the texts of a Swiss self-assessment tool for SMEs (an AI readiness check: questions, answer options, next steps, result messages) from German into the target language.",
    "The input is a JSON object mapping ids to German texts. Return ONLY a JSON object with exactly the same ids and the translated texts as values. No code fences, no commentary.",
    "Keep placeholders in curly braces, e.g. {pct}, {score}, {tier}, {capped_tier}, {topics}, exactly as they are.",
    "Keep the tone and length: short answer options stay short; questions stay questions. Keep legal references (e.g. Art. 21 DSG, EU AI Act Art. 4) as references, rendered as is usual in the target language.",
    ADDRESS[locale],
    "Use the punctuation conventions of the target language (e.g. French guillemets « » with spaces, the % sign spacing of the target language).",
    "Do not add or remove information, and do not emit HTML.",
    "",
    localeSystemRules(locale, terms),
  ].join("\n");
  const user = JSON.stringify(Object.fromEntries(batch.map((e) => [e.id, e.de])), null, 2);
  return { system, user };
}

/** Parse and check a batch translation; throws with every problem found. */
export function parseReadinessTranslation(raw: string, batch: StringEntry[]): Record<string, string> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stripCodeFence(raw));
  } catch (error) {
    throw new Error(`Readiness translation is not valid JSON: ${(error as Error).message}`);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Readiness translation must be a JSON object");
  }
  const out = parsed as Record<string, unknown>;
  const problems: string[] = [];
  for (const entry of batch) {
    const value = out[entry.id];
    if (typeof value !== "string" || !value.trim()) {
      problems.push(`${entry.id}: missing`);
      continue;
    }
    if (placeholders(value).join() !== placeholders(entry.de).join()) {
      problems.push(`${entry.id}: placeholders ${placeholders(entry.de).join(" ")} not kept`);
    }
    if (findRawHtmlOutsideCode(value).length > 0) {
      problems.push(`${entry.id}: contains HTML`);
    }
  }
  const extra = Object.keys(out).filter((id) => !batch.some((e) => e.id === id));
  if (extra.length > 0) {
    problems.push(`unexpected ids: ${extra.join(", ")}`);
  }
  if (problems.length > 0) {
    throw new Error(`Readiness translation rejected:\n  - ${problems.join("\n  - ")}`);
  }
  return out as Record<string, string>;
}

/** Write translations into the data, keeping key order de, en, fr, it. */
export function applyTranslations(
  data: unknown,
  locale: TranslateTargetLocale,
  batch: StringEntry[],
  translations: Record<string, string>,
): void {
  const ORDER = ["de", "en", "fr", "it"];
  for (const entry of batch) {
    let node: unknown = data;
    for (const key of entry.path) {
      node = (node as Record<string | number, unknown>)[key];
    }
    const record = node as Record<string, unknown>;
    record[locale] = translations[entry.id];
    const sorted = Object.keys(record).sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
    const copy = { ...record };
    for (const key of Object.keys(record)) delete record[key];
    for (const key of sorted) record[key] = copy[key];
  }
}
