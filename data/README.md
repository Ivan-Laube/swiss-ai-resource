# Data conventions

Structured JSON under `data/` drives the vendor table, source registry, Fedlex glossary, decision tools (`rules/`), the adoption survey (`survey-questions.json`), and the website quick-check (`scanner-checks.json`).

Offline `check:*` validators for these files run locally and in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) on every PR and push to `main` (see [DEPLOY.md](../DEPLOY.md#continuous-integration)). Live citation probing (`check:links`) stays in the [monthly sources workflow](../.github/workflows/monthly-sources.yml).

## Vendors (`vendors.json`)

Root value is a **JSON array** of vendor records. An empty array `[]` is valid (no vendors yet).

Implementation: Zod schema and loaders in [`src/vendors/`](../src/vendors/) (`schema.ts`, `load.ts`). Export barrel: `@/vendors`.

### Identity fields (always required)

| Field | Type | Notes |
|---|---|---|
| `id` | string | Kebab-case slug, unique in the file (`openai`, `swisscom-ai`) |
| `name` | string | Display name |
| `website` | `https://` URL | Vendor homepage |
| `last_checked` | `YYYY-MM-DD` | Bumped by monthly Act (T18) on unchanged vendor sources only; also set when material extract succeeds |

### Sourced cells

Every claim field is a sourced cell:

```json
{ "value": <T>, "source_url": "https://..." }   // verified
{ "value": null, "source_url": null }           // unverified — never invent a value
```

`value` and `source_url` must both be set or both null. The table UI (T12) renders null cells as "unverified".

### Claim fields

| Field | `value` type | Notes |
|---|---|---|
| `hosting_regions` | `string[]` | Region labels (e.g. `CH`, `EU`, `US`); empty array allowed if sourced |
| `swiss_hosting` | `boolean` | Filter: Swiss hosting |
| `eu_hosting` | `boolean` | Filter: EU hosting |
| `dpa_url` | `https://` URL | Filter “DPA available” = non-null verified value |
| `training_opt_out` | `boolean` | Data-training opt-out available |
| `certifications` | `("iso_27001" \| "soc_2" \| "finma_relevant" \| "other")[]` | Closed enum for filters |
| `pricing_tier` | `"free" \| "usage" \| "subscription" \| "enterprise" \| "contact"` | Coarse band only |
| `swiss_entity` | `boolean` | Swiss legal entity |
| `eu_entity` | `boolean` | EU legal entity |

### Example

```json
[
  {
    "id": "example-vendor",
    "name": "Example Vendor",
    "website": "https://example.com",
    "last_checked": "2026-07-10",
    "hosting_regions": {
      "value": ["EU", "US"],
      "source_url": "https://example.com/trust"
    },
    "swiss_hosting": { "value": null, "source_url": null },
    "eu_hosting": {
      "value": true,
      "source_url": "https://example.com/trust"
    },
    "dpa_url": {
      "value": "https://example.com/dpa",
      "source_url": "https://example.com/dpa"
    },
    "training_opt_out": { "value": null, "source_url": null },
    "certifications": {
      "value": ["iso_27001", "soc_2"],
      "source_url": "https://example.com/trust"
    },
    "pricing_tier": {
      "value": "usage",
      "source_url": "https://example.com/pricing"
    },
    "swiss_entity": { "value": null, "source_url": null },
    "eu_entity": { "value": null, "source_url": null }
  }
]
```

Real vendor rows are in `vendors.json` (T11: 15 Swiss-SME-relevant providers). Filterable table UI: `/[lang]/vendors/` (T12).

### Validation

```bash
npm run check:vendors
```

Parses `data/vendors.json` with Zod, enforces unique `id`s, and fails with index / id / field errors on invalid data.

Loader API (build-time): `getVendors`, `getVendorById`, `validateVendors`, `writeVendors` from `@/vendors`.

### Monthly refresh (T18)

Sources with `category: "vendor"` and `vendor_id` set are handled by `npm run maintain:act` after classify:

| Snapshot + classify | Action |
|---|---|
| unchanged | Bump `last_checked` → commit to `main` |
| cosmetic | No bump (non-empty diff must not mint freshness) |
| material | LLM extract claim fields into `vendors.json` → same review PR as content material |
| kept / failed / baseline | Skip |

Extract updates only claim cells with clear snapshot evidence; `source_url` must be a registered source URL. Unverifiable cells stay `{ value: null, source_url: null }`. Identity fields (`id` / `name` / `website`) are never auto-changed.

## Sources (`sources.json`)

Root value is a **JSON object** with a `sources` array. An empty registry `{ "sources": [] }` is valid.

Implementation: Zod schema and loaders in [`src/sources/`](../src/sources/) (`schema.ts`, `load.ts`). Export barrel: `@/sources`.

This registry is what the monthly job (T15) fetches and snapshots. It is separate from content frontmatter `sources: { title, url }[]` (page citations for display).

### Fields (always required)

| Field | Type | Notes |
|---|---|---|
| `id` | string | Kebab-case slug, unique in the file (`edoeb-home`, `openai-dpa`) |
| `title` | string | Human label for issues/PRs |
| `url` | `https://` URL | Page to fetch |
| `selector` | string | CSS selector for the region to snapshot (HTML only); use `body` when the whole page is the unit. For PDF URLs (`application/pdf` or `.pdf` path), the selector is ignored and full PDF text is extracted. For JSON URLs (`application/json`, `+json`, or `.json` path), the selector is ignored and stable JSON text is extracted |
| `dependent_pages` | `string[]` | Content slugs (no `.md`, no locale) that depend on this source. T16 uses these for classify prompts; T17 bumps `last_verified` |
| `category` | `"regulator" \| "vendor" \| "guidance" \| "other"` | Prioritization / classification hint |
| `vendor_id` | kebab-case string \| `null` | Optional link to a `vendors.json` `id` for vendor DPA/trust pages; must exist in vendors when non-null |
| `fallback_urls` | `https://` URL[] (optional, default `[]`) | Alternate URLs tried after the primary when fetch/extract fails (T38). Must not duplicate the primary or each other |

### Snapshots (T15)

```bash
npm run snapshot:sources
npm run snapshot:sources -- --dry-run
npm run snapshot:sources -- --id=edoeb-ki-und-datenschutz
npm run snapshot:sources -- --id=openai-dpa --seed-file=./openai-dpa.html
npm run snapshot:sources -- --id=eur-lex-ai-act-en --seed-file=./eur-lex-ai-act-en.html
```

Implementation: [`src/snapshot/`](../src/snapshot/). Layout under `snapshots/`:

| Path | Purpose |
|---|---|
| `{id}.txt` | Normalized UTF-8 text (NFC, collapsed whitespace) |
| `_diffs/{id}.patch` | Unified diff when text changed (T16 input) |
| `_meta/{id}.json` | `fetched_at`, `http_status`, `content_type`, `sha256`, `byte_length`, `ok`, optional `error`, `fetched_url`, `attempt`, `seeded`, `consecutive_failures`, `last_ok_at` |
| `_run.json` | Latest run summary including `changed` source ids and `failures[]` |
| `_classify.json` | LLM cosmetic/material classification per changed source (T16) |
| `_act.json` | Act report: bumped/material slugs and written file paths (T17) |
| `_act/material-brief.md` | Editorial brief for material issue/PR (T17) |
| `_act/fetch-failures.md` | Persistent fetch-failure brief (T38; written when any source has ≥2 consecutive failures) |

Fetch resilience (T38):

1. Honest bot User-Agent first
2. HTTP 202 soft-challenge responses get short retries with `Set-Cookie` forwarded
3. HTTP 403/202/429 or timeout gets one browser-profile retry
4. Primary URL then each `fallback_urls` entry until fetch + extract succeeds
5. `--seed-file` escape hatch for permanently blocked pages (requires `--id`; writes `seeded: true` meta)
6. Failed runs keep the previous `.txt`, increment `consecutive_failures`, and surface in `_run.json` `failures[]` + the monthly brief / issue

On fetch/extract failure the previous `.txt` is kept and meta is written with `ok: false`. This protects freshness claims: content `last_verified` and vendor `last_checked` are bumped only from successful unchanged sources (not cosmetic, material, failed, or `kept`), and the meta preserves `last_ok_at` plus `consecutive_failures`. Monthly GitHub Action: [`.github/workflows/monthly-sources.yml`](../.github/workflows/monthly-sources.yml).

### Current resilience notes

The seven failures from the 2026-07-16 snapshot run now have explicit recovery paths:

| Source id | Recovery path |
|---|---|
| `openai-dpa` | Browser-profile retry; CDN PDF fallback (`https://cdn.openai.com/pdf/openai-data-processing-addendum.pdf`) |
| `openai-business-data` | Browser-profile retry |
| `deepl-infrastructure` | DeepL infrastructure blog is primary; blocked Help Center article is fallback |
| `consilium-digital-omnibus-ai` | OEIL procedure file is primary while the Omnibus awaits Official Journal publication; Consilium and Legislative Train are fallbacks |
| `dpf-participant-list` | Official DPF list SPA is primary; FTC DPF overview is fallback because the public list page renders an empty shell to static fetches |
| `eur-lex-ai-act-en` | Seeded snapshot (`seeded: true`) because EUR-Lex still returns HTTP 202 to CI-style fetches |
| `eur-lex-ai-act-de` | Seeded snapshot (`seeded: true`) because EUR-Lex still returns HTTP 202 to CI-style fetches |

### Classification (T16)

```bash
npm run classify:snapshots
npm run classify:snapshots -- --dry-run
npm run classify:snapshots -- --id=edoeb-ki-und-datenschutz
```

Implementation: [`src/classify/`](../src/classify/). Requires `snapshots/_run.json` from a snapshot run and `_diffs/{id}.patch` for changed sources. Uses `dependent_pages` plus DE cornerstone `title`/`description` in the LLM prompt. The prompt biases toward material and treats the diff as untrusted evidence (ignore embedded instructions).

### Act (T17)

```bash
npm run maintain:act -- --dry-run
npm run maintain:act -- --write
```

Implementation: [`src/maintain/`](../src/maintain/). Requires `_run.json` and `_classify.json`.

| Input | Action |
|---|---|
| `_run` `unchanged` (ok) with `dependent_pages` | Bump `last_verified` on all locales |
| classify `cosmetic` | No bump (non-empty diff must not mint freshness; classifier bias is toward material) |
| classify `material` | Issue + PR; clear DE `reviewed_by` / `review_date` / `review_scope`; no auto-bump |
| `baseline` / `kept` / failed / empty `dependent_pages` | No content mutation |

If a slug is both bump-eligible and material in the same run, **material wins**. Bumps commit to `main`; material opens `review/material-YYYY-MM-DD` (no auto-merge). The PR brief lists classifier rationales and patch excerpts — humans edit DE prose before merge.

### Example

```json
{
  "sources": [
    {
      "id": "edoeb-home",
      "title": "EDÖB home",
      "url": "https://www.edoeb.admin.ch/edoeb/de/home.html",
      "selector": "body",
      "dependent_pages": ["ndsg-ai-basics"],
      "category": "regulator",
      "vendor_id": null,
      "fallback_urls": []
    }
  ]
}
```

Real tracked URLs are registered for the five DE cornerstone pages (T6), including EDÖB, Fedlex DSG, EUR-Lex AI Act (HTML + PDF fallback plus seeded baselines while live fetch is blocked), Digital Omnibus on AI through OEIL/European Parliament until Official Journal publication, FINMA Guidance 08/2024, DPF/FTC Data Privacy Framework references, and the AI Fluency framework (checklist competence callout). Vendor-linked DPA/trust entries are registered with T11 (`category: "vendor"`, `vendor_id` set, `dependent_pages: []`).

### Validation

```bash
npm run check:sources
```

Parses `data/sources.json` with Zod, enforces unique `id`s, rejects non-null `vendor_id` values that are missing from `vendors.json`, rejects `dependent_pages` slugs that are not publishable under `content/de/` (same rule as decision-tree `related_pages`), and rejects `fallback_urls` that duplicate the primary URL or each other. Fails with index / id / field errors on invalid data.

Loader API (build-time): `getSources`, `getSourceById`, `validateSources` from `@/sources`.

## Glossary (`glossary.json`)

Root value is a **JSON object** with a `terms` array. An empty glossary `{ "terms": [] }` is valid.

Implementation: Zod schema and loaders in [`src/glossary/`](../src/glossary/) (`schema.ts`, `load.ts`). Export barrel: `@/glossary`.

DE↔FR↔IT legal-term map for Swiss DSG/LPD and EU AI Act vocabulary. Used by the translation pipeline (T13) to constrain FR/IT drafts against official Fedlex / EUR-Lex wording. **EN is out of scope** (no official Swiss EN legal text).

Current seed: **28 terms** covering vocabulary from the five DE cornerstone pages (T6).

### Fields (always required unless noted)

| Field | Type | Notes |
|---|---|---|
| `id` | string | Kebab-case slug, unique in the file (`personendaten`, `hochrisiko-ki-system`) |
| `domain` | `"dsg" \| "ai_act" \| "institutional" \| "other"` | Grouping for T13 prompts |
| `de` | string | German label used for `getTermByDe` lookup; unique after trim. Prefer the phrasing in DE content pages when it differs from the statute’s exact words |
| `fr` | string | Official French (Fedlex LPD / EUR-Lex FR) |
| `it` | string | Official Italian (Fedlex LPD / EUR-Lex IT) |
| `abbreviations` | `{ de?, fr?, it? }` | Optional. **Only** official short forms in those languages (e.g. DSG / LPD / LPD; EDÖB / PFPDT / IFPDT). Do **not** put English-only short forms (e.g. GPAI) here — mention them in `notes` instead |
| `source_url` | `https://` URL | Primary multilingual law page (Fedlex ELI or EUR-Lex) |
| `notes` | string \| `null` | Caveats (e.g. informal «nDSG»; statute vs content paraphrase; IT loanword «deployer»; English «GPAI») |

### Conventions for T13

Used by the translation pipeline in [`src/translate/`](../src/translate/) (`matchGlossaryTerms`, `buildTranslationPrompt`, `verifyGlossaryTermsInTranslation`). CLI: `npm run translate`.

- **`de` is the lookup key.** `getTermByDe` matches the trimmed `de` string exactly. The pipeline also scans DE Markdown for `de` labels and `abbreviations.de` (longest-first, word-boundary-ish). Align `de` with how the term appears in DE Markdown (e.g. «angemessenes Datenschutzniveau»), and put the Art. 16 statute wording («angemessener Schutz») in `notes` when it differs.
- **`fr` / `it` stay official.** Never invent FR/IT; only Fedlex / EUR-Lex wording. FR/IT prompts inject matched rows; post-write verification checks that the official string (or locale abbreviation) appears.
- **`abbreviations` are locale-scoped.** A value under `abbreviations.de` is shown only for German, etc. English nicknames do not belong in this object.
- **EN is out of scope** for forced glossary strings; EN drafts use conventional phrasing with the German term in parentheses on first use.

### Example

```json
{
  "terms": [
    {
      "id": "dsg",
      "domain": "dsg",
      "de": "Bundesgesetz über den Datenschutz",
      "fr": "Loi fédérale sur la protection des données",
      "it": "Legge federale sulla protezione dei dati",
      "abbreviations": { "de": "DSG", "fr": "LPD", "it": "LPD" },
      "source_url": "https://www.fedlex.admin.ch/eli/cc/2022/491/de",
      "notes": "Informal «nDSG» refers to the revised DSG in force since 2023-09-01; not an official short title."
    }
  ]
}
```

### Validation

```bash
npm run check:glossary
```

Parses `data/glossary.json` with Zod, enforces unique `id`s and unique `de` labels, and fails with index / id / field errors on invalid data.

Loader API (build-time): `getTerms`, `getTermById`, `getTermByDe`, `validateGlossary` from `@/glossary`.

## Decision rules (`rules/*.json`)

One JSON file per interactive decision tool. Filename stem must equal the tree `id` (kebab-case). Adding a tool = adding a file; the generic renderer reads any valid tree.

Implementation: Zod schema and loaders in [`src/rules/`](../src/rules/) (`schema.ts`, `load.ts`). Export barrel: `@/rules` (build-time / server only — `load.ts` uses `node:fs`).

**Client components** must import `pickLocalized` / types from `@/rules/schema` (or `@/survey` / `@/scanner` re-exports of the same helpers), never from `@/rules`. Importing the barrel pulls `node:fs` into the client graph and breaks `npm run build` (`output: "export"`).

### Root fields

| Field | Type | Notes |
|---|---|---|
| `id` | string | Kebab-case; must match filename stem |
| `version` | positive int | Bump when the tree logic changes materially |
| `title` | localized string | Tool title |
| `description` | localized string | Short blurb for the tools index |
| `start` | node id | Must reference a **question** node |
| `nodes` | map of node id → node | Questions and outcomes |

### Localized strings

```json
{ "de": "…", "en": "…", "fr": "…", "it": "…" }
```

`de` is required. Launch trees also require `en` / `fr` / `it` (T14; enforced by `assertFullLocales`). The renderer still falls back to `de` if a locale is missing.

### Question nodes

```json
{
  "type": "question",
  "prompt": { "de": "…" },
  "help": { "de": "…" },
  "answers": [
    { "id": "yes", "label": { "de": "Ja" }, "next": "q2" },
    { "id": "no", "label": { "de": "Nein" }, "next": "out-a" }
  ]
}
```

- ≥2 answers; answer `id`s unique within the question
- Every `next` must exist in `nodes`

### Outcome nodes

```json
{
  "type": "outcome",
  "verdict": "likely",
  "summary": { "de": "…" },
  "caveats": [{ "de": "…" }],
  "sources": [{ "title": "…", "url": "https://…" }],
  "related_pages": ["us-hosted-llms-ndsg"]
}
```

| Field | Notes |
|---|---|
| `verdict` | `"likely" \| "unlikely" \| "unclear" \| "depends"` — UI labels come from i18n, not the JSON |
| `caveats` | ≥1 localized strings |
| `sources` | ≥1; absolute `https://` URLs (same shape as content frontmatter sources) |
| `related_pages` | Optional content slugs (DE publishable); empty array allowed. Non-empty slugs must exist under `content/de/` |

Localized strings (`title`, `description`, `prompt`, `help`, `label`, `summary`, `caveats[]`) require **`de` + `en` + `fr` + `it`** on launch trees (T14). Zod still accepts DE-only drafts; `assertFullLocales` in the loader fails the check if any of EN/FR/IT is missing or blank. Source citation titles are not localized.

### Graph rules (enforced by the loader)

- `start` exists and is a question
- Every answer `next` target exists
- Every node is reachable from `start`
- No cycles
- Leaves are outcomes (questions always branch)

### Example

See [`rules/us-hosted-llm-ndsg.json`](rules/us-hosted-llm-ndsg.json) (T9) and [`rules/eu-ai-act-applicability.json`](rules/eu-ai-act-applicability.json) (T10).

### Validation

```bash
npm run check:rules
```

Parses every `data/rules/*.json` with Zod, runs graph checks, validates `related_pages` against DE content slugs, and requires EN/FR/IT on every LocalizedString (T14).

Loader API (build-time): `listRuleIds`, `getRule`, `getAllRules`, `validateRules` from `@/rules`.

## Survey questions (`survey-questions.json`)

Single versioned questionnaire for the Swiss AI adoption survey (T22). **Current: `id` `swiss-ai-adoption-2026`, `version` 2, 12 questions.** One instrument file — not one file per question. Aggregates (T25) will live in a separate file (e.g. `survey-aggregates.json`); do not mix them here.

Implementation: Zod schema and loaders in [`src/survey/`](../src/survey/) (`schema.ts`, `load.ts`). Export barrel: `@/survey`. Reuses `localizedStringSchema` / `pickLocalized` from `@/rules`.

### Root fields

| Field | Type | Notes |
|---|---|---|
| `id` | string | Kebab-case wave id (`swiss-ai-adoption-2026`) |
| `version` | positive int | Bump when option meanings change; keep option ids stable within a version |
| `estimated_minutes` | positive int | Shown to respondents (target ~5) |
| `title` | localized string | Survey title |
| `description` | localized string | Short intro |
| `questions` | array | 10–12 questions |

### Localized strings

Same shape as decision rules:

```json
{ "de": "…", "en": "…", "fr": "…", "it": "…" }
```

`de` is required at the Zod layer; the loader requires **all four locales** on every user-facing string (title, description, prompts, help, option labels). Plain survey copy — Fedlex glossary constraints from T13 apply to compliance Markdown, not these strings.

### Question fields

| Field | Type | Notes |
|---|---|---|
| `id` | kebab-case | Unique within the file; stable aggregate key |
| `prompt` | localized string | Question text |
| `help` | localized string (optional) | Clarification under the prompt |
| `input` | `"single" \| "multi" \| "text"` | Choice vs free text |
| `required` | boolean | Form validation (T24) |
| `aggregate` | boolean | T25 only counts `aggregate: true` |
| `options` | `{ id, label }[]` | Required for `single` / `multi` (≥2); omitted for `text` |
| `max_length` | positive int (optional) | Only for `text` |

Loader rules: unique question ids; unique option ids within a question; choice questions must have `aggregate: true`; text questions must have `aggregate: false`.

### Current instrument (12 questions, version 2)

| id | input | Topics |
|---|---|---|
| `company-size` | single | Employee bands (BFS/EU SME thresholds) |
| `sector` | single | Industry (incl. Bau, Tourismus, Logistik) |
| `language-region` | single | DE / FR / IT / multilingual Switzerland |
| `ai-maturity` | single | Not using → production |
| `ai-tools` | multi | Tools in use (incl. DeepL; `none` exclusive in T24) |
| `primary-use-cases` | multi | Use cases (incl. translation, sales) |
| `monthly-spend-chf` | single | Spend bands (CHF); licenses/API/cloud only |
| `hosting-requirement` | single | CH / EU / any / undecided |
| `personal-data-in-ai` | single | Personendaten with AI (DSG) |
| `eu-market-exposure` | single | EU market / users (AI Act reach) |
| `deployment-blockers` | multi | Blockers (incl. integration, buy-in; `none` exclusive in T24) |
| `vendor-decision-factors` | multi | Vendor choice (incl. Swiss entity / local support) |

Option ids such as `1000-plus` / `10000-plus` stay kebab-case (no `+` in ids); display labels may show `1000+`.

**v2 vs v1:** dropped free-text `biggest-challenge`; added `language-region` and `eu-market-exposure`; expanded sectors; DeepL + clearer Copilot label; translation/sales use cases; Swiss-specific blockers/factors. Bump `version` again if option meanings change.

**T24 form rules (document now, implement later):** for `ai-tools` and `deployment-blockers`, selecting `none` must clear / disable other options (and vice versa).

### Out of this file (T23 / T24)

Optional email, report opt-in, honeypot, and Turnstile are **form chrome**, not survey questions. Store optional email separately from answers (plan §2): D1 table `report_signups` uses its own id and **no foreign key** to `responses`, so emails cannot be joined back to a response row. Retention (24 months) and on-request deletion: [DEPLOY.md](../DEPLOY.md#email-retention-and-deletion). Intake payload for [`workers/survey/`](../workers/survey/) `POST /submit` (T23):

```json
{
  "survey_id": "swiss-ai-adoption-2026",
  "survey_version": 2,
  "locale": "de",
  "answers": {
    "company-size": "10-49",
    "language-region": "german-speaking",
    "ai-tools": ["chatgpt", "deepl"],
    "eu-market-exposure": "no"
  },
  "email": null,
  "report_opt_in": false,
  "website": "",
  "turnstile_token": "..."
}
```

`website` is the honeypot (must be empty). Answers are validated by `@/survey` (`validateIntake` / `validateAnswers`). Emails go to D1 table `report_signups` (own id, no FK to `responses`), not into `answers_json`. Worker local + production: see [DEPLOY.md](../DEPLOY.md#survey-worker-t23).

### Validation

```bash
npm run check:survey
```

Parses `data/survey-questions.json` with Zod, enforces uniqueness / aggregate rules, and requires EN/FR/IT on every LocalizedString.

Loader API (build-time): `getSurvey`, `validateSurvey` from `@/survey`.

## Survey aggregates (`survey-aggregates.json`)

T25 publishes an anonymized, static snapshot for T26. The scheduled survey
Worker first purges `responses` / `report_signups` older than 24 months, then
reads only `responses.answers_json`; it never reads
`report_signups`. Until the first aggregation run, the committed stub uses
`generated_at: null`, `n: 0`, and empty aggregate maps.

Root fields:

| Field | Type | Notes |
|---|---|---|
| `survey_id` | string | Must match the current survey instrument |
| `survey_version` | positive int | Only matching D1 response rows are counted |
| `generated_at` | ISO datetime or `null` | `null` is reserved for the empty stub |
| `n` | non-negative int | Total matching responses; always public |
| `questions` | object | One distribution per `aggregate: true` question |
| `cross_tabs.spend_by_company_size` | object | Spend distributions grouped by company-size band |

Each question contains `n` (respondents who answered it) and `counts`, keyed
by stable option id. Multi-select counts are respondent counts per selected
option, so their sum can exceed `n`.

Privacy suppression is applied before publication:

- any option count below 5 is omitted rather than emitted as zero or marked
  as suppressed;
- a company-size cross-tab row is omitted when its row `n` is below 5;
- spend cells below 5 are omitted within published rows;
- `median_band` excludes `prefer-not` and is omitted unless at least 5 usable
  spend answers exist in that size band.

Validate the committed snapshot with:

```bash
npm run check:survey-aggregates
```

## Scanner checks (`scanner-checks.json`)

Versioned, deterministic definitions for the website quick-check (T32). Root value is a **JSON object** with a positive-int `version` and a non-empty `checks` array. The stateless scan Worker (T33–T35) reads these definitions; the frontend report (T36) renders each finding with its localized title/description, legal citation, and cornerstone link.

Implementation: Zod schema and loaders in [`src/scanner/`](../src/scanner/) (`schema.ts`, `load.ts`). Export barrel: `@/scanner`. Reuses `localizedStringSchema` / `pickLocalized` from `@/rules`.

Findings are **facts**, never verdicts: the engine emits `found / not_found / indeterminate` per check (statuses live in T35 output, not in this file). Titles use "Quick-Check" framing; every result carries the informational-not-legal-advice disclaimer.

### Common check fields (every check)

| Field | Type | Notes |
|---|---|---|
| `id` | kebab-case | Unique in the file; stable report key |
| `method` | `"tls" \| "link" \| "script_signature" \| "response_header" \| "static_scan_flag"` | Selects the detection strategy and the method-specific fields below |
| `title` | localized string | Check name in the report (DE + EN + FR + IT) |
| `description` | localized string | Fact-phrased explanation incl. legal context (DE + EN + FR + IT) |
| `severity` | `"high" \| "medium" \| "low" \| "info"` | Report grouping; informational checks use `info` |
| `legal_basis` | `{ reference, url }` | `reference` e.g. `Art. 19 DSG …`; `url` is an absolute `https://` Fedlex/source link |
| `related_page` | kebab-case slug \| `null` | Cornerstone slug to cite; non-null must be a publishable `content/de/` slug (same rule as decision-tree `related_pages`) |

Localized strings require **all four locales** on `title` / `description` (enforced by the loader, like rules/survey). Detection-pattern arrays are validated by Zod.

### Method-specific fields

| `method` | Extra fields |
|---|---|
| `tls` | `require_https_redirect: boolean` — also verify plain HTTP redirects to HTTPS |
| `link` | `patterns: { de[], en[], fr[], it[] }` (≥1 per locale), `verify_link: boolean` (HEAD-check the matched link resolves) |
| `script_signature` | `implies_data_export: boolean`, `signatures: { id, label, patterns[] }[]` (≥1). `patterns` are locale-independent substrings matched against HTML / script `src` / resource URLs |
| `response_header` | `headers: { id, name, label }[]` (≥1); `name` is the lower-cased header |
| `static_scan_flag` | `signatures[]` (same shape as `script_signature`); presence triggers the "results may be incomplete" caveat in the report |

### v1 checks (7, `version` 1)

| id | method | severity | legal basis |
|---|---|---|---|
| `https` | tls | info | Art. 8 DSG |
| `privacy-policy-link` | link | high | Art. 19 DSG |
| `impressum` | link | medium | Art. 3 Abs. 1 lit. s UWG |
| `cookie-consent-tooling` | script_signature | low | Art. 45c FMG |
| `third-party-trackers` | script_signature (`implies_data_export: true`) | high | Art. 16 DSG |
| `security-headers` | response_header | info | Art. 8 DSG |
| `static-scan-honesty-flag` | static_scan_flag | info | Art. 19 DSG |

Bump `version` when check semantics change (definitions are versioned per plan §1). Nested `signatures[].id` and `headers[].id` must be unique within their check.

### Validation

```bash
npm run check:scanner
```

Parses `data/scanner-checks.json` with Zod, enforces unique check ids (and unique nested signature/header ids), validates non-null `related_page` against DE content slugs, and requires EN/FR/IT on every localized `title` / `description`.

Loader API (build-time): `getScannerChecks`, `getScannerCheckById`, `validateScannerChecks` from `@/scanner`.

### Worker scan response (T35)

`POST /scan` with `{ "url": "…" }` returns findings JSON (never verdicts). Types live in [`workers/scanner/src/types.ts`](../workers/scanner/src/types.ts).

```ts
{
  ok: true,
  url: string,                 // guarded request URL
  finalUrl: string,            // after redirects
  status: number,              // HTTP status of final GET
  contentType: string | null,
  byteLength: number,
  checks_version: number,      // from scanner-checks.json
  static_scan_incomplete: boolean,  // true when static_scan_flag status === "found"
  findings: Finding[]
}
```

Each finding copies `id`, `method`, `severity`, `title`, `description`, `legal_basis`, and `related_page` from the check definition, plus:

| Field | Notes |
|---|---|
| `status` | `"found" \| "not_found" \| "indeterminate"` only |
| `evidence` | Method-specific object (below) |

**Status rules**

| Method | `found` | `not_found` | `indeterminate` |
|---|---|---|---|
| `tls` | HTTPS final URL + (if `require_https_redirect`) HTTP→HTTPS redirect observed | Final URL not HTTPS, or redirect required but HTTP stays on HTTP / fails to HTTPS | Redirect probe timed out / blocked / upstream error |
| `link` | Pattern match + (`!verify_link` or HEAD 2xx/3xx) | No matching `<a>` | Match found but HEAD fails (timeout/4xx/5xx/SSRF block) |

Link detection scans at most the first **512 KiB** of HTML and at most **2000** anchors ([`workers/scanner/src/html.ts`](../workers/scanner/src/html.ts)); patterns and anchor text/href are lowercased once before matching. Oversized or adversarial pages may therefore miss a late privacy/impressum link and report `not_found` — an accepted trade-off against Worker CPU exhaustion. See [DEPLOY.md](../DEPLOY.md#html--cpu-bounds-link-checks). Outbound DoH + fetch/HEAD/probe share one **8s** wall-clock budget with per-request hostname memoization ([`scan-budget.ts`](../workers/scanner/src/scan-budget.ts)); see [DEPLOY.md](../DEPLOY.md#scan-budget-doh--outbound-fetches).
| `script_signature` | ≥1 signature pattern hits HTML | None | — |
| `response_header` | All listed headers present | None present | Some but not all |
| `static_scan_flag` | ≥1 honesty signature hits | None | — |

**Evidence shapes**

- `tls`: `{ https, http_redirects_to_https }`
- `link`: `{ matched_text, matched_href, locale, verify_status: "skipped" \| "ok" \| "failed" \| null }`
- `script_signature` / `static_scan_flag`: `{ matched_signatures: { id, label }[] }`
- `response_header`: `{ headers: { id, name, present, value }[] }`

### Frontend report (T36)

UI: [`/[lang]/website-check/`](../src/app/[lang]/website-check/page.tsx) + [`WebsiteCheckForm`](../src/components/WebsiteCheckForm.tsx). Posts to `{NEXT_PUBLIC_SCAN_API_URL}/scan`, groups findings by severity (`high` → `info`), shows localized title/description via `pickLocalized` (imported from `@/rules/schema` in the client form), legal citations, cornerstone links (`related_page`), static-scan caveat when `static_scan_incomplete`, and the informational disclaimer. Reserves an empty slot for a future LLM policy-content pass. Local + deploy: [DEPLOY.md](../DEPLOY.md#scanner-worker-t33t37). Verify with `npm run build` after UI changes — the static export fails if a `"use client"` module imports the `@/rules` barrel.

