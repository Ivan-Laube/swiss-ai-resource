# aicompliant.ch website redesign: plan and task list

**Status:** Approved, not started · **Created:** 2026-09-29 · **Owner:** Ivan Laube
**Related:** [swiss_ai_resource_implementation_plan.md](swiss_ai_resource_implementation_plan.md) · [README.md](README.md) · [OPERATOR_CHECKLIST.md](OPERATOR_CHECKLIST.md)

This plan turns the reviewed Stitch proposal ("Helvetia Precision GovTech") into a delivery plan that fits the existing stack: Next.js static export, CSS modules, strict CSP, four locales and sourced data. It covers what we adopt, what we reject, the design system spec, and the task list, grouped into four PRs.

---

## 1. Goals

1. Replace the current placeholder look (Arial, a header with only the brand and language links, a homepage of bullet lists) with a coherent, trustworthy visual system.
2. Give visitors clear paths to the four products: guides, decision tools, vendor comparison and Website Quick-Check, plus the survey and benchmark.
3. Make every page work properly on mobile (375px and up), in light and dark mode, and in DE / EN / FR / IT.
4. Fix the UX and accessibility gaps found during the review. Several of these were not covered by the Stitch proposal.

## 2. Non-negotiables (carried over from the product plan)

- **Sourced facts only.** No invented metrics, scores or verdict labels. Every number on the site is computed from repo data at build time.
- **No third-party requests at runtime.** Fonts, icons and images are self-hosted. The only third party is Cloudflare Turnstile, and only on `/website-check/` and `/survey/`. The homepage loads no third-party script.
- **The CSP stays as it is** (`font-src 'self'`, `img-src 'self' data:`, hashed inline scripts through `scripts/csp-hashes.ts`). No Tailwind CDN, Google Fonts at runtime, Material Symbols or remote images.
- **Decision-tool outcomes are never coloured green or red** ("compliant / non-compliant"). They keep the "likely / unlikely / depends / unclear" wording and the disclaimer.
- **No overclaiming copy.** Words like "rechtssicher", "garantiert", "zertifiziert" and "Referenzstandard" are out. "Fachredaktion" is out too, since the operator is a natural person.
- **DE stays canonical.** Every new UI string exists in all four message files.
- **The static export stays static.** No server runtime.

## 3. Decisions log

| # | Decision | Notes |
|---|---|---|
| D1 | Visible brand is **aicompliant.ch**, with **"Swiss AI Resource"** as the subtitle | Subtitle stays in English in all locales. Title template becomes `%s \| aicompliant.ch`. |
| D2 | Logo: **red rounded square with white sparkles**, no Swiss cross | No vector source exists, so it's redrawn as SVG (Appendix A). The favicon uses only the large star, since the small elements disappear at 16px. |
| D3 | **White header**, clearly separated from the content | Hairline bottom border, tinted page background (`--bg`) under white surfaces, and a light shadow once the page is scrolled. |
| D4 | Font: **Instrument Sans**, self-hosted through `next/font` | Replaces the unused Geist fonts and the Arial fallback. |
| D5 | The hero's right-hand panel is the **Website Quick-Check** entry field | Decision tools become the hero's secondary CTA and get their own homepage section. |
| D6 | The survey is promoted **after a result**, not in the hero | Survey prompt at the end of Quick-Check results and decision-tool outcomes, plus a band on the homepage. |
| D7 | **Dark mode is kept** | Every token has a dark value. It follows `prefers-color-scheme`, with no manual toggle in this scope. |
| D8 | "Reviewed by counsel" badge **appears only when the review fields are complete** | Uses `reviewFieldsComplete()`. There is no "not yet reviewed" label. Lawyer review (T29) is due before full launch. |
| D9 | Mobile-first layout with breakpoints at **768px** and **1024px** | No horizontal page scroll anywhere. Tap targets are at least 44px. Exception: the header switches to the desktop nav at **1200px** (the DE/FR/IT nav needs ~1150px), and the header CTA moves into the menu below **480px**. |
| D10 | Quick-Check and decision-tool state live in the **URL fragment** (`#…`) | The fragment is never sent to the server or written to logs, and it works with the static export. |
| D11 | **`<html lang>` per locale** via a `[lang]` root layout + `(root)` for `/` + `global-not-found` | Next 16 i18n pattern (**R1A**). Shared font/metadata in `src/app/document.ts`. Single `404.html` defaults to `de` and sets `document.documentElement.lang` from the path when the first segment is a known locale (CSP-hashed). |

## 4. Stitch proposal: adopted vs rejected

**Adopted:**
- Slate and white palette, hairline borders, 4–6px corner radii and uppercase kicker labels.
- Cards that change border colour on hover instead of floating shadows.
- Sticky header with main navigation and a segmented language control.
- Hero with a value proposition and CTAs; Quick-Check teaser with a "what it checks" panel.
- Guide cards; a status-pill system; a callout with a left accent bar.
- Methodology trio (shown once); footer with columns.

**Adopted with changes:**
- Trust strip → an honest stats bar computed from data.
- "Governance-Monitor" panel → Quick-Check panel.
- Vendor matrix → factual teaser with no verdict labels.
- Red → brand accent and genuine warnings only; primary CTAs are slate.

**Rejected:**
- Tailwind CDN, Google Fonts, Material Symbols and the remotely hosted logo (they break the CSP, and our own Quick-Check flags them as an Art. 16 nDSG transfer).
- Invented numbers: 42/28/30, "15+ models", "5 tools", "100%", "Q1 2025", and the 88/100 scan score.
- Verdict labels in the vendor table.
- The Swiss-cross logo and "Standard / Aufsichtsstand" wording.
- Overclaiming copy.
- Fake contact buttons that trigger `alert()`.
- Duplicated or broken sections.
- A `<button>`-based language switcher.
- Dropping dark mode.

---

## 5. Design system spec

The design system is implemented as CSS custom properties in `src/app/globals.css` and documented in `docs/design-system.md` (task R1D).

### 5.1 Colour tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#F8FAFC` | `#0B1220` | Page background (sits under the white surfaces) |
| `--surface` | `#FFFFFF` | `#0F172A` | Header, cards, panels |
| `--surface-muted` | `#F1F5F9` | `#1E293B` | Callouts, table header, secondary buttons |
| `--border` | `#E2E8F0` | `#1E293B` | Hairlines, card borders |
| `--border-strong` | `#CBD5E1` | `#334155` | Hover borders, inputs |
| `--text` | `#0F172A` | `#F1F5F9` | Headings, body |
| `--text-muted` | `#475569` | `#CBD5E1` | Leads, descriptions |
| `--text-subtle` | `#64748B` | `#94A3B8` | Meta, captions |
| `--primary` / `--on-primary` | `#0F172A` / `#FFFFFF` | `#F1F5F9` / `#0F172A` | Primary buttons |
| `--primary-hover` | `#1E293B` | `#E2E8F0` | |
| `--accent` | `#DC2626` | `#EF4444` | Logo, ".ch", genuine warnings. **Not** used for CTAs |
| `--focus` | `#2563EB` | `#60A5FA` | Focus rings |

**Status tones** (the pill `fg / bg / border` triplets; dark mode uses about 12% alpha fills):

| Tone | Light fg / bg / border | Dark fg |
|---|---|---|
| `success` | `#065F46` / `#ECFDF5` / `#A7F3D0` | `#6EE7B7` |
| `warning` | `#92400E` / `#FFFBEB` / `#FDE68A` | `#FCD34D` |
| `danger` | `#991B1B` / `#FEF2F2` / `#FECACA` | `#FCA5A5` |
| `info` | `#1E40AF` / `#EFF6FF` / `#BFDBFE` | `#93C5FD` |
| `neutral` | `#334155` / `#F1F5F9` / `#E2E8F0` | `#CBD5E1` |

Every text/background pair must pass WCAG AA in both themes. This is verified in R51.

### 5.2 Status mapping (factual states only)

| Where | State | Tone | Label (DE) |
|---|---|---|---|
| Vendor table | sourced `true` | success | Ja |
| | sourced `false` | neutral | Nein |
| | `null` / no source | neutral, dashed border | Ungeprüft |
| Quick-Check | found | success | Gefunden |
| | not found, check severity `high` | danger | Nicht gefunden |
| | not found, severity `medium` | warning | Nicht gefunden |
| | not found, severity `low` / `info` | neutral | Nicht gefunden |
| | unclear | info | Unklar |
| Decision tool | `likely` | info | Wahrscheinlich |
| | `unlikely` | neutral | Eher nicht |
| | `depends` / `unclear` | warning | Kommt darauf an / Unklar |

The existing message strings take precedence over the labels in this table. Confirm the Quick-Check severity mapping against `data/scanner-checks.json` and `WebsiteCheckForm` in R42.

### 5.3 Typography (Instrument Sans)

| Style | Desktop | Mobile | Weight | Tracking |
|---|---|---|---|---|
| Display (home H1) | 48/54 | 32/38 | 700 | −0.03em |
| H1 (page) | 36/44 | 28/34 | 700 | −0.025em |
| H2 | 28/36 | 24/32 | 600 | −0.02em |
| H3 | 20/28 | 18/26 | 600 | −0.015em |
| Body large (lead) | 18/30 | 17/28 | 400 | −0.005em |
| Body (prose) | 17/28 | 16/26 | 400 | 0 |
| Small | 14/22 | 14/22 | 400/500 | 0 |
| Caption / meta | 12/18 | 12/18 | 500 | 0.005em |
| Kicker | 12/16 caps | 11/16 caps | 700 | 0.08em |

- Sizes use `clamp()` between the mobile and desktop values.
- Long legal prose stays at 16–17px; the mockup's 14px body text is too small for it.
- Prose measure is at most 72ch.
- Numbers use `font-variant-numeric: tabular-nums`. Whether Instrument Sans supports this is checked in R11.

### 5.4 Layout, spacing, shape and elevation

- **Container:** max 1200px. Side gutters are 16px on mobile, 24px on tablet and 32px on desktop.
- **Breakpoints:** 768px and 1024px, written as literal values in media queries.
- **Spacing scale (4px base):** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64. Section spacing is 48px on mobile and 64px on desktop.
- **Radii:** 4px for buttons and inputs, 6px for cards, 8px for panels, 9999px for pills and the language control only.
- **Elevation:** cards are flat at rest. On hover the border becomes `--border-strong`, with a micro shadow `0 1px 3px rgb(15 23 42 / .06), 0 1px 2px rgb(15 23 42 / .04)`. The scrolled header uses the same micro shadow.
- **Motion:** transitions of 150ms or less. All motion is disabled under `prefers-reduced-motion`. No pulsing or ping animations.
- **Icons:** inline SVG components (stroke 1.5, `currentColor`). No icon font.

### 5.5 Information architecture

**Header (desktop):**
- Logo lockup
- Nav: Leitfäden (`/guides/`), Entscheidungshilfen (`/tools/`), Anbietervergleich (`/vendors/`), Umfrage & Benchmark (`/survey/`)
- Language control
- Primary CTA "Website prüfen" (`/website-check/`)
- Below **1200px** everything except the logo, the CTA and the menu toggle moves into a `<details>` menu (the panel drops down full width under the header). Below **480px** the CTA also moves into the menu, so the header stays one row. Covered by `e2e/layout/header.spec.ts` (all locales × 320–1280px).

**Footer:**

| Column | Links |
|---|---|
| Brand | Logo, one-line description, "Letzte Quellenprüfung: {date}" |
| Leitfäden | All published guides |
| Tools | Both decision tools, Website-Check |
| Daten | Anbietervergleich, Umfrage, Benchmark |
| Rechtliches | Impressum, Datenschutz |

The bottom row has the disclaimer and the copyright year.

**Homepage sections, in order:**
1. **Hero.**
   - Left column: kicker, H1, lead. The canonical-language callout appears on EN/FR/IT only. CTAs: "Entscheidungshilfe starten" (primary) and "Anbieter vergleichen" (secondary).
   - Right column: Quick-Check panel. On mobile it stacks below the left column.
2. Stats bar (real data).
3. Guides (card grid: 3 columns on desktop, 2 on tablet, 1 on mobile).
4. Decision tools (2 cards).
5. Vendor teaser.
6. Survey & benchmark band.
7. Methodology trio.

---

## 6. Task list

Task status is `Todo`, `In progress` or `Done`. The "Depends on" column refers to task IDs. Every PR must meet the Definition of Done in §7.

### Prep (before PR 1)

| ID | Task | Depends on | Status |
|---|---|---|---|
| R00 | Commit or land the pending work on `main` (survey v3 schema/answers/aggregates, `SurveyForm.tsx`, `e2e/`, `playwright.config.ts`, `scripts/build-e2e.ts`, `scripts/evaluate-survey-instrument.ts`, CI changes) so the redesign branch starts clean | — | Done |
| R01 | Keep `stitch_ai_compliant_website_redesign.zip` out of the repo (move it out of the working tree or add it to `.gitignore`) | — | Done |
| R02 | Create the branch `redesign/foundation` from the updated `main` | R00 | Done |

### PR 1: Foundation and site shell (L)

| ID | Task | Depends on | Status |
|---|---|---|---|
| R10 | Design tokens from §5.1–5.4 in `globals.css` (light and dark, status tones, spacing, radii, shadows). Remove the old `--background` / `--foreground` tokens once all pages are migrated | R02 | Done |
| R11 | Instrument Sans through `next/font` (read the Next 16 font docs in `node_modules/next/dist/docs/` first). Variable weights 400–700, subsets `latin` and `latin-ext`. Remove Geist / Geist Mono. Check `tnum` support and fall back to a documented alternative if it's missing. Confirm the built site makes no request to `fonts.googleapis.com` / `fonts.gstatic.com` | R10 | Done |
| R12 | Base element styles: headings, links (underline on hover/focus), `:focus-visible` rings, `::selection`, form controls. Shared `.prose` styles for rendered Markdown (lists, tables, blockquotes, code) | R10 | Done |
| R13 | UI building blocks in `src/components/ui/`: `Container`, `Button` (primary / secondary / ghost; renders as `Link` or `button`), `StatusPill` (tone + dot), `Card` (static / interactive), `Callout` (info / warning / neutral, left accent), `SectionHeader` (kicker, title, lead, optional action link), and inline SVG `Icon`s | R10 | Done |
| R14 | Logo: a `BrandMark` SVG component (Appendix A) and a `BrandLockup` (mark + "aicompliant**.ch**" + "Swiss AI Resource"). App icons: `icon.svg` (large-star-only variant), `favicon.ico`, `apple-icon.png`. Delete the default favicon and the create-next-app leftovers in `public/` (`next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`) after checking nothing references them | R10 | Done |
| R15 | Rewrite `SiteHeader`: white sticky header with a hairline border; light shadow on scroll through scroll-driven CSS animation (progressive enhancement, border only as fallback); nav items from §5.5; "Website prüfen" CTA; `aria-current` on the active section | R13, R14 | Done |
| R16 | Language control that stays on the same page: each page passes the locales it exists in (e.g. via `localesWithSlug()`), and the switcher links to the same path in those locales and hides the rest. Segmented-control styling, `hrefLang` kept | R15 | Done |
| R17 | Mobile menu (< 1200px) built with `<details>`/`<summary>`, no JS dependency for opening. Closes after client-side navigation (small effect keyed on pathname, or plain `<a>` links; decide during implementation). Tap targets ≥ 44px | R15 | Done |
| R18 | Rewrite `SiteFooter` with the columns from §5.5 and the computed "last source check" date (latest of `last_verified` across published DE guides and `last_checked` across vendors), disclaimer and copyright | R13, R14 | Done |
| R19 | New route `/[lang]/guides/`: guide index built from `Card`s, with hreflang alternates and a sitemap entry. It's the target of the "Leitfäden" nav item | R13 | Done |
| R1A | Correct `<html lang>` per locale. Investigate the Next 16 options (multiple root layouts through a route group for `[lang]` vs root, `global-not-found`). Fallback: set `document.documentElement.lang` early, with its hash picked up by `csp-hashes.ts`. Root `/` redirect and `404.html` must keep working | R02 | Done |
| R1B | Metadata rebrand: title template `%s \| aicompliant.ch`, per-locale default title/description from messages, `metadataBase` from `siteUrl`, `applicationName` | R02 | Done |
| R1C | Accessibility baseline: "skip to content" link, `<main id>` on every page, `prefers-reduced-motion` handling, landmark labels | R12 | Done |
| R1D | `docs/design-system.md`: tokens, building blocks, status mapping (§5.2), and usage rules (red restraint, no verdict colours on legal outcomes, no third-party assets). This replaces the Stitch `DESIGN.md` as the reference | R10–R13 | Done |
| R1E | New UI strings (nav, footer, menu, skip link, brand) added to `Messages` / `de.ts`, drafted in `en.ts` / `fr.ts` / `it.ts` | R15–R18 | Done |
| R1F | Apply the new shell to every route (home, guides, legal, tools, vendors, website-check, survey, benchmark, 404). Page bodies may keep interim styling until PR 3/4, but must use the tokens so dark mode doesn't break | R15–R19 | Done |

### PR 2: Homepage (M)

| ID | Task | Depends on | Status |
|---|---|---|---|
| R20 | Hero layout and copy (Appendix B draft → final DE → EN/FR/IT). Canonical-language `Callout` on non-DE locales only | PR 1 | Todo |
| R21 | Hero Quick-Check panel: `type="url"` input (`inputmode="url"`, `autocomplete="url"`) and a submit button that navigates to `/[lang]/website-check/#url=<encoded>`. Compact list of checks generated from `data/scanner-checks.json` (localized labels). Privacy line whose wording is checked against actual scanner behaviour (stateless Worker, no storage). No Turnstile and no third-party script on the homepage | R20 | Todo |
| R22 | `WebsiteCheckForm`: read the `#url=` fragment, prefill the field, start the scan automatically once the Turnstile token is available, then remove the fragment with `history.replaceState`. Invalid URLs show the normal validation message | R21 | Todo |
| R23 | Stats bar computed at build: number of published guides, number of decision tools, number of vendors, last source check date (same helper as R18) | R18 | Todo |
| R24 | Guide cards: category kicker, title, description, `last_verified`, reading time (word count ÷ 200, rounded). Add an optional language-neutral `category` enum to the content frontmatter schema (e.g. `datenschutz`, `eu-ai-act`, `finanzmarkt`, `beschaffung`), set it on the guides in all four locales, localize labels in messages, update `check:content`. Make sure the translation pipeline keeps the field | R13 | Todo |
| R25 | Decision-tool cards: title, description, "max. N Fragen" computed from the longest path in the tree, link to the tool | R13 | Todo |
| R26 | Vendor teaser: factual counts computed from `vendors.json` (vendors listed, with sourced Swiss hosting, with sourced DPA) + the "unverified cells" note + link. No per-vendor verdicts | R13 | Todo |
| R27 | Survey & benchmark band: survey CTA. The benchmark link says "Ergebnisse ab n ≥ 5" while below `SURVEY_SUPPRESSION_THRESHOLD`, and shows the live benchmark link once published data exists | R13 | Todo |
| R28 | Methodology trio (official sources + monthly source checks; no affiliate or sponsor links; no legal advice). **Check each claim** against the repo before publishing (monthly job T15–T17 active; `vendors.json` has no affiliate/tracking parameters; no analytics on the site) | R13 | Todo |
| R29 | Homepage responsive pass at 375 / 768 / 1024 / 1280 in both themes and all four locales | R20–R28 | Todo |

### PR 3: Decision tools and guides (M)

| ID | Task | Depends on | Status |
|---|---|---|---|
| R30 | `DecisionTree` URL state: answer path in the fragment (`#a=<answerId>.<answerId>…`), rebuilt on load, browser back/forward through `hashchange`. An invalid or stale path restarts cleanly | PR 1 | Todo |
| R31 | Progress indicator: "Frage n · max. m" (remaining steps computed as the longest path from the current node) with a slim progress bar | R30 | Todo |
| R32 | Outcome view: recap of the answers (question → chosen answer), "Link kopieren" (Clipboard API, hidden where unsupported), "Drucken / als PDF" (`window.print()` + print CSS from R3D) | R30 | Todo |
| R33 | Accessibility: move focus to the new question heading on each step, `aria-live` announcement, keyboard-only walkthrough tested | R30 | Todo |
| R34 | Outcome styling: verdict `StatusPill` per §5.2 (never green/red), summary in a `Callout`, caveats / sources / related pages as sections | R13 | Todo |
| R35 | Related pages show **titles** instead of slugs: resolve titles at build in the tool page and pass them to the client component | — | Todo |
| R36 | Survey prompt after an outcome ("Helfen Sie beim Schweizer Benchmark, 3 Minuten") | R34 | Todo |
| R37 | Tools index page restyled with tool cards (reuses the R25 card) | R25 | Todo |
| R38 | Guide page layout: breadcrumbs (Start › Leitfäden › Titel), meta row (`last_verified`, reading time), translation notes as a `Callout`, lead styling | R19 | Todo |
| R39 | Table of contents from the H2s: add stable heading ids in `renderMarkdown` (slugify with umlaut / diacritic handling, deduplicated). Sticky sidebar at ≥ 1024px, collapsible `<details>` above the content on mobile | R38 | Todo |
| R3A | "Passende Entscheidungshilfe" box: reverse lookup of the trees whose outcomes list this slug in `related_pages` | R38 | Todo |
| R3B | Sources section styled as a reference list (title, domain, external-link icon) | R38 | Todo |
| R3C | "Reviewed by counsel · {date}" badge, rendered only when `reviewFieldsComplete()` is true for the page | R38 | Todo |
| R3D | Print stylesheet: hide header, footer, nav and TOC; print source URLs; sensible page breaks; checklist items print with boxes (useful for `ai-procurement-checklist`) | R38 | Todo |
| R3E | Legal pages (`impressum`, `datenschutz`) use the guide layout without TOC, badge or related tools | R38 | Todo |

### PR 4: Remaining pages (M)

| ID | Task | Depends on | Status |
|---|---|---|---|
| R40 | `VendorTable` restyle: cell `StatusPill`s per §5.2, per-cell source links kept, sticky header row on desktop, filter controls using the building blocks | PR 1 | Todo |
| R41 | `VendorTable` mobile layout (< 768px): one card per vendor with a `<dl>` of fields, same filters, no horizontal scroll | R40 | Todo |
| R42 | `WebsiteCheckForm` results: grouped by severity, status pills (confirm the mapping against `scanner-checks.json`), legal references, "Neue Prüfung" action, survey prompt after results | R22 | Todo |
| R43 | `SurveyForm` restyle: progress indicator, radio/checkbox options as ≥ 44px tappable cards, clear error and success states. Must not change the survey schema or submission behaviour | R00 | Todo |
| R44 | Benchmark page: designed empty state below the n ≥ 5 threshold (explains the threshold, survey CTA). `BenchmarkComparison` charts use tokens and work in dark mode | R13 | Todo |
| R45 | `NotFoundView` restyle, with links to guides, tools and home | R13 | Todo |
| R46 | OpenGraph / Twitter metadata on all pages, and a per-locale OG image (1200×630, logo lockup + title). Check the Next 16 static-export support for `opengraph-image`; fall back to committed static PNGs | R14 | Todo |
| R47 | Cleanup: remove obsolete per-page CSS, grep for hard-coded colours / `Arial` / old tokens, no unused CSS modules left | R40–R46 | Todo |

### Quality assurance (runs in every PR; set up in PR 1)

| ID | Task | Depends on | Status |
|---|---|---|---|
| R50 | Playwright visual snapshots: all routes × {375, 768, 1280} × {light, dark} × {de, fr}. Dates and live data are masked. Baselines are created in PR 1 and updated per PR | R1F | Done |
| R51 | Automated accessibility checks with `@axe-core/playwright` (new dev dependency): no serious or critical violations on any route, both themes; contrast pairs from §5.1 pass AA | R1F | Done |
| R52 | E2E test "no third-party requests": record network requests per route (DE + FR, including the 404 page). Allowed: same origin; `api.aicompliant.ch` + `challenges.cloudflare.com` only on `/website-check/` and `/survey/` | R11 | Done |
| R53 | `e2e/website-check/headers.spec.ts` locks the full CSP (exact directive set; only `script-src` sha256 hashes may vary, no `unsafe-inline`/`unsafe-eval`/extra origins) and the other security headers, in both `out-e2e` and `out-e2e-unconfigured` | R1A | Done |
| R54 | Translation and overflow review: Ivan reviews the drafted EN/FR/IT strings; manual check that nav, buttons and cards don't overflow in FR/IT at every breakpoint (adjust the menu breakpoint if needed) | each PR | Todo |
| R55 | Performance check: Lighthouse mobile on home, one guide, vendors and website-check. Targets: performance ≥ 90, accessibility = 100, CLS < 0.05. Guide pages ship no client JS apart from framework basics | PR 2, PR 3 | Todo |
| R56 | Manual check on real devices (iOS Safari, Android Chrome): mobile menu open/close, header, forms. **Deferred to the production launch** (decision 2026-09-30: little traffic until then); done once on production, not per PR. Automated coverage per PR: `e2e/layout/header.spec.ts` + visual snapshots | Production launch | Todo |
| R57 | Docs: add a redesign section to the README status table, link this plan, update `docs/design-system.md` as the building blocks change | PR 4 | Todo |

### Sequencing

```
R00 → R02 → PR 1 (R10–R1F, R50–R53 set up)
              ├─→ PR 2 (R20–R29)   ─┐
              ├─→ PR 3 (R30–R3E)   ─┼─→ R47 cleanup → R55/R56 final pass → R57
              └─→ PR 4 (R40–R46)   ─┘
```

PR 2, 3 and 4 depend only on PR 1 and can be done in any order. The one cross-dependency is R42, which relies on R22 from PR 2. Recommended order: PR 2 → PR 3 → PR 4, because the homepage matters most for visitors.

---

## 7. Definition of Done (per PR)

- [ ] CI green: `tsc --noEmit`, `lint`, all offline `check:*`, `npm run build` (including the CSP-hash postbuild)
- [ ] Playwright e2e and visual snapshots pass (R50); axe checks pass (R51); no third-party requests (R52)
- [ ] All four locales render. New strings exist in DE/EN/FR/IT, with EN/FR/IT reviewed by Ivan
- [ ] Checked at 375 / 768 / 1280 in light and dark; no horizontal page scroll; tap targets ≥ 44px
- [ ] No invented numbers, verdict colours or overclaiming copy (§2)
- [ ] Reviewed on the Cloudflare Pages preview (real-device check R56 is deferred to the production launch)

## 8. Risks and mitigations

| Risk | Mitigation |
|---|---|
| The pending survey/e2e work on `main` conflicts with the redesign (`SurveyForm.tsx`, CI) | R00 lands it first; R43 only restyles and doesn't change behaviour |
| Next 16 APIs differ from older docs (fonts, metadata, root layouts, OG images) | Read `node_modules/next/dist/docs/` before each related task (per `AGENTS.md`); R1A and R46 have documented fallbacks |
| Instrument Sans lacks tabular figures | R11 verified: GSUB includes `tnum`; `font-variant-numeric: tabular-nums` is set on `body`. Fixed-width number containers remain available for stats bar / table layout (R23, R40) |
| Scroll-shadow CSS isn't supported in every browser | Progressive enhancement only; the hairline border always gives the separation |
| FR/IT labels overflow the desktop nav | R54 check; the menu breakpoint can move up; nav labels are kept short in messages |
| Visual snapshots are flaky (fonts, dates, live data) | Self-hosted font, masked dates/counts, fixed viewport and colour scheme per project |
| Trust copy becomes untrue later (e.g. analytics added, monthly job disabled) | Claims are listed in R28 and `docs/design-system.md`; any change to analytics or the monthly job must update the copy |
| Guides are public before the lawyer review (T29) | The disclaimer stays on every page; the counsel badge (R3C) appears automatically once the review fields are filled |

## 9. Out of scope (this redesign)

- Site search / ⌘K (not needed with 5 guides)
- Glossary page for `data/glossary.json` (candidate follow-up)
- "Methodik & Quellen" page (candidate follow-up; the homepage trio covers the basics for now)
- Contact form, "Anbieter melden" form, newsletter
- Manual light/dark toggle
- New content, new decision trees, new vendors
- All elements rejected in §4

---

## Appendix A: Logo mark (SVG draft)

Redrawn from the supplied PNG. `#DC2626` equals `--accent` in the light theme. The favicon variant keeps only the large star.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="13" fill="#DC2626"/>
  <path fill="#fff" d="M38.5 16.5C40.66 27.84 40.66 27.84 52.0 30C40.66 32.16 40.66 32.16 38.5 43.5C36.34 32.16 36.34 32.16 25.0 30C36.34 27.84 36.34 27.84 38.5 16.5ZM19.5 14.5C20.54 19.96 20.54 19.96 26.0 21C20.54 22.04 20.54 22.04 19.5 27.5C18.46 22.04 18.46 22.04 13.0 21C18.46 19.96 18.46 19.96 19.5 14.5Z"/>
  <circle cx="19" cy="45" r="2.8" fill="#fff"/>
</svg>
```

**Lockup:** the mark at 32px (header) / 28px (footer), then "aicompliant" in `--text` 700 weight with ".ch" in `--accent`, and the subtitle "Swiss AI Resource" in `--text-subtle` 500 weight, 12px.

## Appendix B: Draft hero copy (DE, needs sign-off)

- **Kicker:** Schweizer KMU · KI-Einsatz
- **H1:** KI in der Schweiz einsetzen – auf belegter Grundlage.
- **Lead:** Leitfäden zu DSG, EU AI Act und FINMA, Entscheidungshilfen, ein quellenbasierter Anbietervergleich und ein Website-Check. Unabhängig, ohne Tracking, monatlich gegen die Quellen geprüft.
- **CTAs:** Entscheidungshilfe starten · Anbieter vergleichen
- **Quick-Check panel title:** Website Quick-Check
- **Quick-Check panel lead:** Prüft öffentlich sichtbare Signale Ihrer Website – Datenschutzerklärung, Impressum, Cookie-Tools, Tracker, Sicherheitsheader. Keine Compliance-Bewertung.
- **Quick-Check button:** Website prüfen

"Ohne Tracking" and "monatlich gegen die Quellen geprüft" must be confirmed in R28 before publishing.
