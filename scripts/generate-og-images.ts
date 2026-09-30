/**
 * One-shot generator for per-locale Open Graph PNGs (1200×630).
 * Uses sharp (via next) to rasterize an SVG with the brand lockup + title.
 * Fonts are system/Arial — no runtime Google Fonts request.
 *
 * Usage: npx tsx scripts/generate-og-images.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { de } from "../src/i18n/messages/de";
import { en } from "../src/i18n/messages/en";
import { fr } from "../src/i18n/messages/fr";
import { it } from "../src/i18n/messages/it";
import type { Locale } from "../src/i18n/config";

const WIDTH = 1200;
const HEIGHT = 630;

const titles: Record<Locale, string> = {
  de: de.home.title,
  en: en.home.title,
  fr: fr.home.title,
  it: it.home.title,
};

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Naive wrap for SVG tspans (character-based; fine for short titles). */
function wrapTitle(title: string, maxChars: number): string[] {
  const words = title.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function buildSvg(locale: Locale): string {
  const titleLines = wrapTitle(titles[locale], 36);
  const titleTspans = titleLines
    .map((line, index) => {
      const dy = index === 0 ? 0 : 52;
      return `<tspan x="96" dy="${dy}">${escapeXml(line)}</tspan>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="100%" height="100%" fill="#F8FAFC"/>
  <rect x="0" y="0" width="12" height="100%" fill="#DC2626"/>
  <g transform="translate(96, 88)">
    <svg width="72" height="72" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="13" fill="#DC2626"/>
      <path fill="#fff" d="M38.5 16.5C40.66 27.84 40.66 27.84 52.0 30C40.66 32.16 40.66 32.16 38.5 43.5C36.34 32.16 36.34 32.16 25.0 30C36.34 27.84 36.34 27.84 38.5 16.5ZM19.5 14.5C20.54 19.96 20.54 19.96 26.0 21C20.54 22.04 20.54 22.04 19.5 27.5C18.46 22.04 18.46 22.04 13.0 21C18.46 19.96 18.46 19.96 19.5 14.5Z"/>
      <circle cx="19" cy="45" r="2.8" fill="#fff"/>
    </svg>
  </g>
  <text x="188" y="128" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700" fill="#0F172A">aicompliant<tspan fill="#DC2626">.ch</tspan></text>
  <text x="188" y="168" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="500" fill="#64748B">Swiss AI Resource</text>
  <text x="96" y="320" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="700" fill="#0F172A" letter-spacing="-0.03em">${titleTspans}</text>
  <text x="96" y="560" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="500" fill="#64748B">${escapeXml(locale.toUpperCase())} · aicompliant.ch</text>
</svg>`;
}

async function main() {
  const outDir = join(process.cwd(), "public", "og");
  mkdirSync(outDir, { recursive: true });

  for (const locale of Object.keys(titles) as Locale[]) {
    const svg = Buffer.from(buildSvg(locale), "utf8");
    const png = await sharp(svg).png().toBuffer();
    const outPath = join(outDir, `${locale}.png`);
    writeFileSync(outPath, png);
    console.log(`Wrote ${outPath} (${png.byteLength} bytes)`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
