import fs from "node:fs";
import path from "node:path";

import { locales, type Locale } from "@/i18n/config";

/**
 * Downloadable templates (T49): Markdown under `content/templates/<id>/`,
 * one file per locale (`de.md` canonical). Converted to Word at build
 * (T50, `scripts/build-downloads.ts`).
 */
export const TEMPLATES_ROOT = path.join(process.cwd(), "content", "templates");

/** Template ids (directories with a canonical `de.md`), sorted. */
export function listTemplateIds(): string[] {
  if (!fs.existsSync(TEMPLATES_ROOT)) {
    return [];
  }
  return fs
    .readdirSync(TEMPLATES_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((id) => fs.existsSync(templatePath(id, "de")))
    .sort();
}

export function templatePath(id: string, locale: Locale): string {
  return path.join(TEMPLATES_ROOT, id, `${locale}.md`);
}

/** Locales that have a source file for this template. */
export function templateLocales(id: string): Locale[] {
  return locales.filter((locale) => fs.existsSync(templatePath(id, locale)));
}

export function readTemplate(id: string, locale: Locale): string {
  return fs.readFileSync(templatePath(id, locale), "utf8").replace(/^\uFEFF/, "");
}

/** `[Firmenname]`-style placeholders; translations must keep the same number. */
export const PLACEHOLDER_RE = /\[[^\]\n]+\](?!\()/g;
