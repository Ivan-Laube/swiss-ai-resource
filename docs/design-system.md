# Design system — aicompliant.ch

Living reference for the visual system. This replaces the Stitch `DESIGN.md` as the in-repo source of truth for tokens, UI building blocks, status mapping, and usage rules.

Delivery context and task list: [website_redesign_plan.md](../website_redesign_plan.md) §5.

## Purpose and precedence

1. **Token values:** [`src/app/globals.css`](../src/app/globals.css) is authoritative. This doc mirrors those names and values; if they diverge, trust the CSS.
2. **Product rules:** This doc and the redesign plan §2 / §5.2 override any Stitch mockup (no Tailwind CDN, no invented metrics, no verdict greens/reds on legal outcomes).
3. **Keep this file current** when tokens or `@/components/ui` APIs change (task R57).

## Non-negotiables / usage rules

1. **Red restraint.** `--accent` is for the logo mark, the “.ch” in the wordmark, and genuine warnings only. Primary CTAs use `--primary` (slate), not red.
2. **No verdict colours on legal outcomes.** Decision-tool results stay in the wording “likely / unlikely / depends / unclear” (localized). Never colour them green/red as “compliant / non-compliant”. Map tones per [Status mapping](#status-mapping) below.
3. **No third-party runtime assets.** Fonts, icons, and images are self-hosted. CSP stays `font-src 'self'`, `img-src 'self' data:`. The only third party is Cloudflare Turnstile, and only on `/website-check/` and `/survey/`. The homepage loads no third-party script.
4. **Sourced facts only.** No invented metrics, scores, or verdict labels. Numbers on the site are computed from repo data at build time.
5. **Dark mode** follows `prefers-color-scheme`. No manual theme toggle in this redesign scope. Every token has a dark value.
6. **Motion** transitions are ≤ 150ms (`--duration`). All motion is disabled under `prefers-reduced-motion`. No pulsing or ping animations.
7. **Layout.** Breakpoints at `768px` and `1024px` (literal values in media queries). Tap targets ≥ 44px. No horizontal page scroll. Header exceptions: desktop nav from `1200px`; header CTA moves into the menu below `480px` (tested in `e2e/layout/header.spec.ts`).
8. **Copy.** No overclaiming (“rechtssicher”, “garantiert”, “zertifiziert”, “Referenzstandard”, “Fachredaktion”). DE is canonical; every UI string exists in DE / EN / FR / IT.

## Tokens

Defined on `:root` in `src/app/globals.css`. Dark overrides live under `@media (prefers-color-scheme: dark)`.

### Colour

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#f8fafc` | `#0b1220` | Page background (under white/dark surfaces) |
| `--surface` | `#ffffff` | `#0f172a` | Header, cards, panels |
| `--surface-muted` | `#f1f5f9` | `#1e293b` | Callouts, table headers, secondary buttons |
| `--border` | `#e2e8f0` | `#1e293b` | Hairlines, card borders |
| `--border-strong` | `#cbd5e1` | `#334155` | Hover borders, inputs |
| `--text` | `#0f172a` | `#f1f5f9` | Headings, body |
| `--text-muted` | `#475569` | `#cbd5e1` | Leads, descriptions |
| `--text-subtle` | `#64748b` | `#94a3b8` | Meta, captions |
| `--primary` | `#0f172a` | `#f1f5f9` | Primary button background |
| `--on-primary` | `#ffffff` | `#0f172a` | Text on primary |
| `--primary-hover` | `#1e293b` | `#e2e8f0` | Primary hover |
| `--accent` | `#dc2626` | `#ef4444` | Logo, “.ch”, genuine warnings — **not** CTAs |
| `--focus` | `#2563eb` | `#60a5fa` | Focus rings |

### Status tones

Each tone has `fg` / `bg` / `border`. Dark mode uses ~12% alpha fills and ~28% alpha borders.

| Tone | Light fg / bg / border | Dark fg / bg / border |
|---|---|---|
| `success` | `#065f46` / `#ecfdf5` / `#a7f3d0` | `#6ee7b7` / `rgb(110 231 183 / 0.12)` / `rgb(110 231 183 / 0.28)` |
| `warning` | `#92400e` / `#fffbeb` / `#fde68a` | `#fcd34d` / `rgb(252 211 77 / 0.12)` / `rgb(252 211 77 / 0.28)` |
| `danger` | `#991b1b` / `#fef2f2` / `#fecaca` | `#fca5a5` / `rgb(252 165 165 / 0.12)` / `rgb(252 165 165 / 0.28)` |
| `info` | `#1e40af` / `#eff6ff` / `#bfdbfe` | `#93c5fd` / `rgb(147 197 253 / 0.12)` / `rgb(147 197 253 / 0.28)` |
| `neutral` | `#334155` / `#f1f5f9` / `#e2e8f0` | `#cbd5e1` / `rgb(203 213 225 / 0.12)` / `rgb(203 213 225 / 0.28)` |

CSS names: `--status-{tone}-fg|bg|border`. Contrast pairs must pass WCAG AA in both themes (verified in R51).

### Spacing and layout

| Token | Value | Notes |
|---|---|---|
| `--space-1` … `--space-8` | 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px | 4px base scale |
| `--section-gap` | 48px; **64px** at ≥ 1024px | Vertical section rhythm |
| `--container-max` | 1200px | Content max width |
| `--gutter` | 16px → 24px @768 → 32px @1024 | Side gutters |

### Radii, elevation, motion

| Token | Value |
|---|---|
| `--radius-control` | 4px (buttons, inputs) |
| `--radius-card` | 6px |
| `--radius-panel` | 8px |
| `--radius-pill` | 9999px (pills and language control only) |
| `--shadow-micro` | Light: `0 1px 3px rgb(15 23 42 / 0.06), 0 1px 2px rgb(15 23 42 / 0.04)`; dark override in CSS |
| `--duration` | `150ms` (`0ms` under reduced motion) |
| `--ease` | `ease` |

Cards are flat at rest. On hover, interactive cards use `--border-strong` plus `--shadow-micro`. The scrolled header uses the same micro shadow (progressive enhancement).

### Typography

**Font:** Instrument Sans via `next/font` (`src/app/document.ts`), variable weights 400–700, subsets `latin` and `latin-ext`. Applied as `--font-sans` on `<html>`; body stack is `--font-family: var(--font-sans), Arial, Helvetica, sans-serif`. Self-hosted at build — no runtime request to Google Fonts.

`body` sets `font-variant-numeric: tabular-nums` (Instrument Sans ships a GSUB `tnum` feature). Fixed-width number containers remain available where layout alignment needs them (stats bar, tables).

| Style | Token | Weight | Tracking |
|---|---|---|---|
| Display (home H1) | `--font-display` | 700 | `--tracking-display` (−0.03em) |
| H1 (page) | `--font-h1` | 700 | `--tracking-h1` |
| H2 | `--font-h2` | 600 | `--tracking-h2` |
| H3 | `--font-h3` | 600 | `--tracking-h3` |
| Lead | `--font-lead` | 400 | `--tracking-lead` |
| Body | `--font-body` | 400 | 0 |
| Small | `--font-small` (14px) | 400/500 | 0 |
| Caption / meta | `--font-caption` (12px) | 500 | `--tracking-caption` |
| Kicker | `--font-kicker` | 700 | `--tracking-kicker` (0.08em, uppercase) |

Sizes use `clamp()` between mobile and desktop targets. Matching line-height tokens: `--leading-*`. Prose measure is at most `72ch` (`.prose`).

**Global utility classes** (in `globals.css`):

| Class | Role |
|---|---|
| `.display` | Home hero H1 scale |
| `.lead` | Supporting sentence under a title |
| `.kicker` | Uppercase section label |
| `.caption` | Meta / captions |
| `.text-small` | 14px body |
| `.prose` | Rendered Markdown (lists, tables, blockquotes, code) |

## Building blocks

Import from `@/components/ui` unless noted. Prefer these over ad-hoc cards, buttons, and pills.

### `Container`

Centered content wrapper: max `--container-max`, horizontal `--gutter`.

| Prop | Type | Default |
|---|---|---|
| `as` | `"div" \| "section"` | `"div"` |
| `children` | `ReactNode` | — |
| `className` | `string` | — |

### `Button`

Renders a `<button>` or Next.js `Link` when `href` is set. Variants: `primary` | `secondary` | `ghost` (default `primary`). Default `type="button"` for the button form.

| Prop | Notes |
|---|---|
| `variant` | Visual style |
| `href` | If set → link mode |
| `children`, `className` | — |
| Native button/anchor attrs | Forwarded to the underlying element |

### `StatusPill`

Factual state chip with a tone-coloured dot. Tones: `success` | `warning` | `danger` | `info` | `neutral`.

| Prop | Type | Default |
|---|---|---|
| `tone` | `StatusTone` | required |
| `dashed` | `boolean` | `false` (use for unverified / null cells) |
| `children` | Label text | — |
| `className` | `string` | — |

### `Card`

Surface with hairline border. Flat at rest; `interactive` (or `href`) adds hover border/shadow treatment.

| Prop | Type | Default |
|---|---|---|
| `as` | `"div" \| "section" \| "article"` | `"div"` |
| `href` | `string` | — (renders as `Link` when set) |
| `interactive` | `boolean` | inferred from `href` |
| `id`, `aria-*` | — | forwarded to the element (use `aria-labelledby` with `as="section"` so the section is exposed as a named region) |
| `children`, `className` | — | — |

Use cards for interactive destinations (guide/tool cards), not as decorative boxes in a hero.

### `Callout`

`<aside>` with a left accent bar. Tones: `info` | `warning` | `neutral` (default `neutral`).

| Prop | Type | Default |
|---|---|---|
| `tone` | `CalloutTone` | `"neutral"` |
| `title` | `ReactNode` | — |
| `children` | Body | — |
| `className` | `string` | — |

### `SectionHeader`

Section title block: optional kicker, title, lead, optional ghost action link.

| Prop | Type | Default |
|---|---|---|
| `kicker` | `string` | — |
| `title` | `ReactNode` | required |
| `lead` | `ReactNode` | — |
| `action` | `{ href, label }` | — |
| `headingLevel` | `2 \| 3` | `2` |
| `className` | `string` | — |

### `BrandMark` / `BrandLockup`

- **`BrandMark`:** Red rounded square with white sparkles (SVG). Fill is `currentColor` → `--accent`. Props: `size` (default 32), optional `title` for accessible labelling (otherwise `aria-hidden`).
- **`BrandLockup`:** Mark + “aicompliant**.ch**” + subtitle “Swiss AI Resource” (English in all locales). `variant`: `"header"` (mark 32px) | `"footer"` (mark 28px). Wrap in a `Link` in the site shell.

App icons: `src/app/icon.svg` (large-star-only), `favicon.ico`, `apple-icon.png`.

Open Graph: per-locale static PNGs in `public/og/{de,en,fr,it}.png` (1200×630), wired through `buildRootMetadata` (`openGraph` + `twitter.card: summary_large_image`). Regenerated with `npx tsx scripts/generate-og-images.ts`. Dynamic `opengraph-image.tsx` is not used with `output: "export"`.

### Icons

Inline SVG components in `@/components/ui`: `IconArrowRight`, `IconChevronDown`, `IconChevronRight`, `IconExternalLink`, `IconMenu`, `IconX`. Stroke 1.5, `currentColor`, default size 20. Optional `title` for a11y; otherwise decorative (`aria-hidden`). No icon font.

### `cx`

Class-name helper: `cx(...parts: Array<string | false | null | undefined>)`. Import from `@/components/ui/cx` — **not** re-exported from the barrel `index.ts`.

## Status mapping

Factual states only. Existing i18n message strings take precedence over the sample DE labels in this table. Quick-Check severity mapping is confirmed against `data/scanner-checks.json` (R42).

| Where | State | Tone | Sample label (DE) |
|---|---|---|---|
| Vendor table | sourced `true` | `success` | Ja |
| | sourced `false` | `neutral` | Nein |
| | `null` / no source | `neutral`, `dashed` | Ungeprüft |
| Quick-Check | found | `success` | Gefunden |
| | not found, severity `high` | `danger` | Nicht gefunden |
| | not found, severity `medium` | `warning` | Nicht gefunden |
| | not found, severity `low` / `info` | `neutral` | Nicht gefunden |
| | unclear | `info` | Unklar |
| Decision tool | `likely` | `info` | (messages; e.g. “Eher vertretbar”) |
| | `unlikely` | `neutral` | (messages) |
| | `depends` / `unclear` | `warning` | Kommt darauf an / Unklar |

**Wired consumers:** `DecisionTree` outcomes (R34), `VendorTable` (R40), and `WebsiteCheckForm` results (R42) use `StatusPill` with the mapping above. Do not introduce green/red “compliant” framing on legal outcomes.

## Trust claims that must stay true

Homepage methodology copy and related UI depend on these remaining accurate. If any change, update the copy **and** this checklist (see also redesign plan R28 / risk table).

- [ ] No analytics or tracking scripts on the site (homepage and content routes load no third-party script)
- [ ] Vendor links in `vendors.json` have no affiliate or tracking parameters
- [ ] Monthly source-check job remains active (guides `last_verified`, vendors `last_checked`)
- [ ] Turnstile appears only on `/website-check/` and `/survey/`
- [ ] Decision-tool and Quick-Check outcomes are not presented as legal compliance verdicts

## How to extend

1. Add or change tokens in `src/app/globals.css` for **both** light and dark.
2. Prefer `@/components/ui` building blocks over one-off surfaces; extend those components when a pattern repeats.
3. Keep the CSP and the no-third-party-runtime rule; regenerate hashes via the existing postbuild if inline scripts change.
4. Update this document when APIs, tokens, or status mappings change (R57).
5. Do not invent status tones outside the five listed above without a product decision and AA contrast check.
6. In client components (`"use client"`), import from `@/i18n/config` / `@/i18n/path`, never the `@/i18n` barrel: it pulls every locale's message catalogue into the browser bundle. Pass only the message slice a component needs (e.g. `SiteHeader` takes `nav={messages.nav}`), not the whole `Messages` object.
7. After changing tokens or check pairs, also update the copied values in `scripts/check-contrast.ts` (`npm run check:contrast`).
8. Every page's `generateMetadata` returns `buildPageMetadata()` from `src/lib/metadata.ts`. Next.js does not merge a page's title/description into the layout's Open Graph data, so a page that sets only `title`/`description` shares with the site-wide preview.
