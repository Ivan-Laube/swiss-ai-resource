# Swiss AI Deployment Resource

Multilingual (DE / EN / FR / IT) static site with Swiss-specific AI deployment guidance for local companies. Built with Next.js static export, hosted on Cloudflare Pages.

**Production:** [https://aicompliant.ch](https://aicompliant.ch) (also `www`). Canonical/hreflang/sitemap base URL comes from `NEXT_PUBLIC_SITE_URL` (default in [`src/lib/site.ts`](src/lib/site.ts)). Static export also emits [`/sitemap.xml`](src/app/sitemap.ts) and [`/robots.txt`](src/app/robots.ts) (all four locales × homes, content slugs, tools, vendors, survey, benchmark, website-check; bare `/` omitted), plus [`404.html`](src/app/not-found.tsx) for unknown paths (Cloudflare Pages; locale from URL path, default `de`). Workers require `SITE_ORIGIN` (default in wrangler vars is the same origin) and reject POST/OPTIONS whose `Origin` does not match it (or the www ↔ apex sibling).

German (`de`) is the canonical content language. See [swiss_ai_resource_implementation_plan.md](swiss_ai_resource_implementation_plan.md) for the full architecture and task plan.

## Status

| ID | Task | Status |
|---|---|---|
| T1 | Next.js SSG skeleton + Cloudflare Pages | Done |
| T2 | Language routing, hreflang, i18n strings | Done |
| T3 | Content frontmatter schema + loader | Done |
| T4 | Vendor JSON schema + loader | Done |
| T5 | Source registry schema + loader | Done |
| T6 | Cornerstone compliance pages (DE) + content routes | Done |
| T7 | Fedlex legal-term glossary (DE↔FR↔IT) | Done |
| T8 | Decision tree JSON format + generic renderer | Done |
| T9 | Launch tool 1: US-hosted LLM under nDSG | Done |
| T10 | Launch tool 2: EU AI Act applicability | Done |
| T11 | Vendor research: first 15 vendors, sourced | Done |
| T12 | Vendor table UI (filterable) | Done |
| T13 | Translation pipeline (LLM draft EN/FR/IT) | Done |
| T14 | Translate cornerstone pages + tool/table strings to EN/FR/IT | Done |
| T15 | Monthly job: fetch + snapshot tracked sources | Done |
| T16 | Diff + LLM classification (cosmetic vs material) | Done |
| T17 | PR/issue workflow + last_verified bump (build gate before push) | Done |
| T18 | Vendor JSON field refresh in monthly job | Done |
| T19 | Translation regeneration on DE merge (build gate before commit) | Done |
| T20 | `last_verified` visible on compliance pages (header + after sources) | Done |
| T21 | Dead link checker in monthly run | Done |
| T38 | Snapshot fetch resilience for bot-blocked sources | Done |
| T22 | Survey design: 12 questions v2 (schema + DE/EN/FR/IT) | Done |
| T23 | Survey Worker + D1 + Turnstile (production provisioned) | Done |
| T23a–d | Remote D1 / Turnstile / deploy / prod smoke-test | Done |
| T23e | Rotate production Turnstile secret before survey launch | Done |
| T23f | Replace Worker `GITHUB_TOKEN` with fine-grained PAT | Done |
| T24 | Survey form page (4 languages) | Done |
| T25 | Aggregation job with n<5 suppression, aggregates written to repo as JSON | Done |
| T32 | Scanner check definitions (`scanner-checks.json` + Zod) | Done |
| T33–T35 | Scanner Worker: `/scan`, SSRF guards, heuristic engine + HTML CPU caps | Done |
| T36 | Website Quick-Check page `/[lang]/website-check/` | Done |
| T37 | Quick-Check i18n + scanner deploy docs (`NEXT_PUBLIC_SCAN_API_URL`) | Done |
| T37b | Scanner Worker prod deploy + Pages `NEXT_PUBLIC_SCAN_API_URL` | Done |
| T39 | Impressum + Datenschutzerklärung pages, footer + survey links | Done |
| T40 | Fill Impressum/Datenschutz operator details (natural person); sync EN/FR/IT | Done |
| T41 | Live browser smoke (survey + website-check on aicompliant.ch) | Mostly done — one human Turnstile submit left |
| T42 | GitHub Actions: allow Actions to create/approve PRs | Done |
| T29 | Lawyer review of DE pages (incl. legal pages after T40) | Not started |

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (root redirects to `/de/`).

| Script | Purpose |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Static export to `out/` |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Typecheck (also run in CI) |
| `npm run check:content` | Validate all `content/{locale}/*.md` frontmatter |
| `npm run check:vendors` | Validate `data/vendors.json` |
| `npm run check:sources` | Validate `data/sources.json` |
| `npm run check:glossary` | Validate `data/glossary.json` |
| `npm run check:rules` | Validate `data/rules/*.json` decision trees |
| `npm run check:survey` | Validate `data/survey-questions.json` |
| `npm run check:survey-answers` | Validate intake answer helpers (T23) |
| `npm run check:survey-aggregates` | Validate `data/survey-aggregates.json` + aggregation fixtures (T25) |
| `npm run aggregate:survey -- --local [--write]` | Build aggregates from local D1 (T25) |
| `npm run check:scanner` | Validate `data/scanner-checks.json` |
| `npm run dev:survey` | Survey Worker local (`wrangler dev`) |
| `npm run db:survey:local` | Apply survey D1 migrations locally |
| `npm run dev:scanner` | Scanner Worker local (`wrangler dev`) |
| `npm run deploy:scanner` | Deploy scanner Worker |
| `npm run check:classify` | Validate `snapshots/_classify.json` when present |
| `npm run check:act` | Validate `snapshots/_act.json` when present |
| `npm run check:links` | Probe published citation URLs (T21; pass `--write` for report) |
| `npm run check:links-report` | Validate `snapshots/_links.json` when present |
| `npm run snapshot:sources` | Fetch tracked sources and write `snapshots/` (T15) |
| `npm run classify:snapshots` | Classify changed snapshots via LLM (T16; `ANTHROPIC_API_KEY` unless `--dry-run`) |
| `npm run maintain:act` | Bump `last_verified` / `last_checked`, material brief + vendor extract (T17/T18; pass `--write`) |
| `npm run changed-de-slugs` | List DE slugs with canonical prose changes (T19; used by translate workflow) |
| `npm run translate` | Draft EN/FR/IT content from DE (`ANTHROPIC_API_KEY` required unless `--dry-run`) |

PR and `main` CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)): typecheck, lint, offline `check:*`, and `npm run build`. Details and the required GitHub Actions PR-permission setting: [DEPLOY.md](DEPLOY.md#continuous-integration).

## Project layout

```
content/{de,en,fr,it}/   # Markdown pages (DE canonical)
data/                    # vendors.json, sources.json, glossary.json, rules/, survey-*, scanner-checks.json
src/app/                 # App Router (locale routes + sitemap.ts / robots.ts / not-found.tsx → out/)
src/components/          # Shared UI (SiteHeader, NotFoundView, DecisionTree, VendorTable, WebsiteCheckForm, …)
src/content/             # Frontmatter Zod schema + loader
src/vendors/             # Vendor Zod schema + loader
src/sources/             # Source registry Zod schema + loader
src/glossary/            # Fedlex DE↔FR↔IT term glossary + loader
src/translate/           # LLM translation pipeline (T13)
src/rules/               # Decision-tree Zod schema + loader
src/survey/              # Survey questions Zod schema + intake validation (T22/T23)
src/scanner/             # Website quick-check Zod schema + loader (T32)
workers/survey/          # Survey intake Worker + D1 (`responses` / unlinkable `report_signups`)
workers/scanner/         # Stateless website scan Worker (T33–T35)
src/snapshot/            # Fetch + normalize source snapshots (T15)
src/classify/            # LLM diff classification (T16)
src/maintain/            # last_verified bump + material brief (T17)
src/links/               # Published URL dead-link check (T21)
src/i18n/                # Locale config + UI string files
src/lib/markdown.ts      # Markdown → HTML (marked + sanitize-html)
snapshots/               # Normalized source text + meta (monthly GHA)
```

## Content

Compliance pages are Markdown with YAML frontmatter (`last_verified`, `volatility`, `translation_status`, lawyer review fields, `sources[]`).

- Conventions and field reference: [content/README.md](content/README.md)
- Schema + loader: [`src/content/`](src/content/)
- Fixture used by `check:content`: [`content/de/_fixture-schema.md`](content/de/_fixture-schema.md)

Same filename slug across locales (e.g. `ndsg-ai-basics.md`) so hreflang pairing stays simple. Content routes: `/[lang]/[slug]/` (T6). Internal fixtures use a `_` prefix (e.g. `_fixture-schema.md`) and are not published (excluded from routes and from `sitemap.xml`).

### Published cornerstone pages (T6 + T14)

| Slug | Topic |
|---|---|
| `ndsg-ai-basics` | nDSG/DSG basics for AI |
| `us-hosted-llms-ndsg` | US-hosted LLMs under nDSG (incl. Swiss-U.S. DPF) |
| `eu-ai-act-swiss-exporters` | EU AI Act reach for Swiss companies (incl. Digital Omnibus timeline tracks) |
| `finma-ai-expectations` | FINMA Guidance 08/2024 |
| `ai-procurement-checklist` | Procurement checklist (incl. Art. 4 / competence callout) |

DE is canonical under `content/de/`. EN/FR/IT drafts live under `content/{en,fr,it}/` with `translation_status: draft` (**T14**). Regenerate or refresh drafts with the **T13** pipeline:

```bash
# Preview prompts (no API key needed)
npm run translate -- --slug=ndsg-ai-basics --dry-run

# Draft one page into all three locales (requires ANTHROPIC_API_KEY)
npm run translate -- --slug=ndsg-ai-basics

# Optional: TRANSLATE_MODEL overrides the default Claude Sonnet model
```

Generated files always get `translation_status: draft`. Non-DE content pages show a canonical-DE note and a draft note. Content-page `hreflang` alternates list all locales that have the slug (`localesWithSlug`). Homepage lists compliance pages per locale when translations exist.

Decision-tool node copy (`data/rules/*.json`) also ships `de` + `en` + `fr` + `it` on every LocalizedString; `npm run check:rules` enforces that. Vendor table chrome strings were already in `src/i18n/messages/` (T12).

## Vendors

Vendor comparison data lives in [`data/vendors.json`](data/vendors.json) (**15** sourced vendor rows from T11). Schema and loader: [`src/vendors/`](src/vendors/). Field reference: [data/README.md](data/README.md). Filterable table UI: [`/[lang]/vendors/`](src/app/[lang]/vendors/page.tsx) (T12).

## Sources

Tracked URL registry for the monthly maintenance job lives in [`data/sources.json`](data/sources.json). Schema and loader: [`src/sources/`](src/sources/). Field reference: [data/README.md](data/README.md).

Current registry covers the DE cornerstone pages (EDÖB, Fedlex, EUR-Lex AI Act, Digital Omnibus on AI via OEIL/European Parliament while awaiting Official Journal publication, FINMA Guidance 08/2024, DPF/FTC Data Privacy Framework references, AI Fluency framework) plus vendor trust/DPA URLs from T11. After the Digital Omnibus appears in the Official Journal, swap the OEIL source to the EUR-Lex consolidated text.

**T15 — fetch + snapshot:** `npm run snapshot:sources` downloads each registry URL, extracts text (HTML via CSS `selector`, PDF via full-text, JSON via stable serialization / participant-name dump), normalizes it, and writes:

| Path | Purpose |
|---|---|
| `snapshots/{id}.txt` | Normalized text (git-diffable) |
| `snapshots/_diffs/{id}.patch` | Unified diff when text changed (T16 input) |
| `snapshots/_meta/{id}.json` | Last fetch metadata (`ok`, HTTP status, sha256, error, `fetched_url`, `attempt`, `seeded`, `consecutive_failures`, `last_ok_at`) |
| `snapshots/_run.json` | Latest run summary (`changed` ids, per-source results, `failures[]`) |
| `snapshots/_classify.json` | LLM cosmetic/material classification (T16) |
| `snapshots/_act.json` | Act decisions: content + vendor bumps vs material (T17/T18) |
| `snapshots/_act/` | Material editorial brief + PR body (T17/T18) |

Flags for `snapshot:sources`: `--dry-run` (no writes), `--id=<sourceId>` (single source), `--seed-file=<path>` (T38: seed from a local HTML/PDF/JSON; requires `--id`). Per-source failures keep the previous `.txt`, record `ok: false` + `consecutive_failures` in meta, and list under `_run.json` `failures[]` — the run does not abort. Fetch tries the bot User-Agent first; HTTP 202 responses get short cookie-forwarding soft-challenge retries; then a browser-profile retry runs on 403/202/429/timeout; then each `fallback_urls` entry is tried.

**T16 — classify diffs:** after a snapshot run with changes, `npm run classify:snapshots` reads `_run.json` `changed[]`, loads each `_diffs/{id}.patch`, and calls Anthropic with dependent DE page context (`dependent_pages` in `sources.json`). Output: `snapshots/_classify.json` (`cosmetic` / `material`; new snapshots → `baseline`). The prompt biases toward material and treats the diff as untrusted evidence (ignore embedded instructions). Flags: `--dry-run`, `--id=<sourceId>`. Optional `CLASSIFY_MODEL` (default same Sonnet family as translate).

**T17 — act:** `npm run maintain:act -- --write` reads `_run.json` + `_classify.json`. Only byte-identical successful fetches (`unchanged`) bump `last_verified` on all locales for their `dependent_pages` (committed to `main`). Cosmetic classifications do **not** bump — a non-empty diff must not mint a freshness claim (source-page prompt injection could coerce "cosmetic"). Material sources open a GitHub issue + review PR that clears DE lawyer review fields and ships an editorial brief — no auto prose rewrite, no auto-bump. If a slug is both bump-eligible and material, material wins. Fetch failures are listed in the material brief; persistent failures (≥2 consecutive) also write `snapshots/_act/fetch-failures.md`.

**T18 — vendor refresh:** the same `maintain:act` step groups sources by `vendor_id`. Only `unchanged` vendor sources bump `last_checked` on `data/vendors.json` (committed to `main`); cosmetic diffs do not. Material vendor sources LLM-extract claim-field patches (hosting, DPA, certs, etc.) into `vendors.json` for the same review issue/PR — evidence-only, identity fields never auto-changed. Material wins over bump per vendor. Optional `VENDOR_EXTRACT_MODEL` (falls back to `CLASSIFY_MODEL` / Sonnet).

**T21 — dead links:** `npm run check:links -- --write` inventories unique `https://` URLs from publishable content, `vendors.json`, and decision rules; reuses T15 `_run.json` reachability when the same URL was already fetched; otherwise probes (HEAD, GET fallback). Writes `snapshots/_links.json` + `snapshots/_links/brief.md`. Broken links open a soft-fail GitHub issue — no `last_verified` bump, no review-badge clear, no PR.

**T38 — fetch resilience:** HTTP 202 cookie retry, browser-profile retry, per-source `fallback_urls`, JSON/PDF/HTML `--seed-file` seeding, and persistent-failure surfacing (`fetch-failures.md` + GitHub issue from the second consecutive month) so bot-blocked vendor sources (e.g. OpenAI 403) do not silently skip T18 forever.

The first T38 hardening pass recovered the seven failing sources from the 2026-07-16 run:

| Source | Recovery path |
|---|---|
| `openai-dpa` | Browser-profile retry; official CDN PDF fallback registered |
| `openai-business-data` | Browser-profile retry |
| `deepl-infrastructure` | DeepL infrastructure blog promoted to primary; Help Center retained as fallback |
| `consilium-digital-omnibus-ai` | OEIL procedure page primary; Consilium and Legislative Train as fallbacks |
| `dpf-participant-list` | Official SPA list retained; FTC DPF overview fallback used for snapshot text |
| `eur-lex-ai-act-en` / `eur-lex-ai-act-de` | EUR-Lex still returns HTTP 202 to CI-style fetches; seeded snapshots are committed (`seeded: true`) until live fetch succeeds |

Dates protect the published claims: content `last_verified` and vendor `last_checked` are bumped only from successful **unchanged** sources (empty diff). Cosmetic or material diffs never auto-bump freshness. A failed source stays `kept`, preserves the previous `.txt`, and records `last_ok_at` / `consecutive_failures`; it does **not** make the site look freshly verified.

Monthly cron: [`.github/workflows/monthly-sources.yml`](.github/workflows/monthly-sources.yml) (1st of month 06:00 UTC + `workflow_dispatch`); after validators it runs `npm run build`, then snapshot/classify artifacts, link report, `last_verified` bumps, and vendor `last_checked` bumps land on `main`; broken citation links and persistent fetch failures open issues; material content/vendor changes open a `review/material-YYYY-MM-DD` PR. Enable **Allow GitHub Actions to create and approve pull requests** in the repo Actions settings or that PR step 403s.

**T19 — translate on DE merge:** [`.github/workflows/translate-on-de-merge.yml`](.github/workflows/translate-on-de-merge.yml) watches `content/de/**` on `main`. When DE `title` / `description` / body change, it runs `changed-de-slugs` → `translate --strict` → `check:content` → `npm run build` and commits EN/FR/IT drafts. Metadata-only DE edits (including T17 `last_verified` bumps) are skipped.

## Glossary

Fedlex / EUR-Lex DE↔FR↔IT legal-term map lives in [`data/glossary.json`](data/glossary.json) (**28 terms** seeded from T6 pages). Schema and loader: [`src/glossary/`](src/glossary/). Field reference and T13 conventions: [data/README.md](data/README.md). Pipeline: [`src/translate/`](src/translate/).

- Constrains FR/IT translation drafts via `npm run translate` (T13); EN is out of scope for this file.
- `de` matches DE content phrasing so `getTermByDe` / glossary matching works; statute wording that differs goes in `notes`.
- `abbreviations` hold only official DE/FR/IT short forms (not English nicknames like GPAI).

## Decision tools

Interactive decision trees are JSON files under [`data/rules/`](data/rules/) (one file per tool). Schema and loader: [`src/rules/`](src/rules/). Field reference: [data/README.md](data/README.md). Generic client renderer: [`src/components/DecisionTree.tsx`](src/components/DecisionTree.tsx).

Routes: `/[lang]/tools/` (index) and `/[lang]/tools/[toolId]/`. Tool ids are shared across all locales (hreflang lists all four) and are included in `sitemap.xml` via `listRuleIds()`. Node copy uses locale maps with **de + en + fr + it** required on launch trees (T14); UI chrome lives in `src/i18n/messages/`.

Current trees: `us-hosted-llm-ndsg` (T9), `eu-ai-act-applicability` (T10).

## Survey (T22 / T23 / T24 / T25)

Adoption questionnaire: [`data/survey-questions.json`](data/survey-questions.json) (**version 2**, 12 questions, full DE/EN/FR/IT). Schema and loader: [`src/survey/`](src/survey/). Intake validation: `validateIntake` / `validateAnswers` in [`src/survey/answers.ts`](src/survey/answers.ts). Field reference: [data/README.md](data/README.md#survey-questions-survey-questionsjson). Validate with `npm run check:survey` and `npm run check:survey-answers`.

Instrument covers company size, sector, language region, AI maturity/tools/use cases, CHF spend, hosting, personal data in AI, EU market exposure, blockers, and vendor decision factors. **T23** Worker intake: [`workers/survey/`](workers/survey/) (`POST /submit`, D1, Turnstile, honeypot; `Origin` must match required `SITE_ORIGIN` or its www sibling) — production Worker `https://swiss-ai-survey.i-laube.workers.dev`; see [DEPLOY.md](DEPLOY.md#survey-worker-t23). Optional emails land in `report_signups` (own id, no FK to `responses`) so they are unlinkable from answers; retention purge + deletion path (public contact on Datenschutz): [DEPLOY.md](DEPLOY.md#email-retention-and-deletion). **T24** form UI: [`/[lang]/survey/`](src/app/[lang]/survey/page.tsx) — live at [aicompliant.ch/de/survey/](https://aicompliant.ch/de/survey/). **T25** aggregation: a weekly Worker cron purges rows older than 24 months, then computes n&lt;5-suppressed aggregates from `responses` only (never `report_signups`) and commits [`data/survey-aggregates.json`](data/survey-aggregates.json) via the GitHub Contents API for T26; run locally with `npm run aggregate:survey -- --local`. See [DEPLOY.md](DEPLOY.md#survey-aggregation-t25). Before public survey launch: **T23e** / **T23f** (secret hygiene) and **T41** (browser smoke) — [DEPLOY.md](DEPLOY.md#pre-launch-secret-hygiene-t23e--t23f).

## Website Quick-Check (T32–T37)

Heuristic first assessment of a public URL against Swiss-facing signals (HTTPS, privacy/impressum links, cookie tooling, trackers, security headers). Check definitions: [`data/scanner-checks.json`](data/scanner-checks.json). Schema/loader: [`src/scanner/`](src/scanner/). Validate with `npm run check:scanner`. Field reference: [data/README.md](data/README.md#scanner-checks-scanner-checksjson).

**Worker (T33–T35):** [`workers/scanner/`](workers/scanner/) — production `https://swiss-ai-scanner.i-laube.workers.dev` (`POST /scan`), SSRF guards, per-IP rate limit, `Origin` enforced against `SITE_ORIGIN` (missing/empty env → HTTP 500; missing/wrong Origin → 403). Link detection in [`workers/scanner/src/html.ts`](workers/scanner/src/html.ts) caps the HTML slice (512 KiB), extracted anchors (2000), and lowercases text/href once before pattern matching so adversarial pages cannot burn Worker CPU. Outbound work shares one 8s wall-clock budget ([`scan-budget.ts`](workers/scanner/src/scan-budget.ts)): DoH lookups use that `AbortSignal`, hostname resolutions are memoized per request, and `fetchTarget` / `headTarget` / `probeHttpRedirectToHttps` no longer each start a fresh 8s timer. DNS-rebinding residual risk is accepted — [DEPLOY.md](DEPLOY.md#accepted-residual-risks-workers). **UI (T36):** [`/[lang]/website-check/`](src/app/[lang]/website-check/page.tsx) posts to `{NEXT_PUBLIC_SCAN_API_URL}/scan`, groups findings by severity, shows legal citations, static-scan caveat, and disclaimer (never a compliance verdict). UI chrome is DE/EN/FR/IT in `src/i18n/messages/`; finding copy comes from the Worker. The client form imports `pickLocalized` from `@/rules/schema` (not the `@/rules` barrel, which loads `node:fs` and breaks static export). Live: [aicompliant.ch/de/website-check/](https://aicompliant.ch/de/website-check/). Local + deploy: [DEPLOY.md](DEPLOY.md#scanner-worker-t33t37). Browser confirmation is **T41**.

## Legal pages (T39 / T40)

Impressum (`/[lang]/impressum/`) and Datenschutzerklärung (`/[lang]/datenschutz/`) are Markdown content pages in all four locales. Footer links: [`SiteFooter`](src/components/SiteFooter.tsx). Survey form links Datenschutzerklärung next to the optional email field. Datenschutz documents unlinkable D1 storage (`responses` vs `report_signups`), retention, and deletion via the public contact email. Conventions: [content/README.md](content/README.md#legal-pages).

**T39** (done): draft pages + UI links. **T40** (done): natural-person operator (name, street, PLZ/Ort, email) in DE/EN/FR/IT; phone, Rechtsform, Vertretung, and Handelsregister/UID omitted as not applicable. Notes: [DEPLOY.md](DEPLOY.md#legal-pages-t39t40). Lawyer review of the filled DE text is T29.

## Deploy

Live host, Pages/Worker env vars, and connect steps: [DEPLOY.md](DEPLOY.md) (see especially [Production host](DEPLOY.md#production-host) and [Production status (site)](DEPLOY.md#production-status-site)).

**Outstanding before announce:** one human Turnstile survey submit (T41). Lawyer review remains **T29** (parallel).
