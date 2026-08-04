# Cloudflare Pages deployment

## Production host

| Item | Value |
|---|---|
| Live site | [https://aicompliant.ch](https://aicompliant.ch) (`www` CNAME → same Pages project) |
| Pages project hostname | `swiss-ai-resource.pages.dev` (still valid; custom domain is canonical) |
| Site URL (build) | `NEXT_PUBLIC_SITE_URL=https://aicompliant.ch` — Pages env; code default in [`src/lib/site.ts`](src/lib/site.ts) |
| Worker CORS | `SITE_ORIGIN=https://aicompliant.ch` in both Worker `wrangler.jsonc` `vars` |

DNS for `aicompliant.ch` is on Cloudflare. Apex and `www` are proxied CNAMEs to `swiss-ai-resource.pages.dev`.

Both Workers **require** `SITE_ORIGIN`. There is no `*.pages.dev` fallback; an unset/empty value returns HTTP 500 with `{ "error": "SITE_ORIGIN is not configured" }`. For local UI testing, override with `--var SITE_ORIGIN:http://localhost:3000`.

## Build settings

| Setting | Value |
|---|---|
| Framework preset | None (or Next.js Static HTML Export) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Node version | 20 |
| Root directory | `/` |

### Pages environment variables (production)

| Name | Value / notes |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://aicompliant.ch` (canonical + hreflang base) |
| `NEXT_PUBLIC_SURVEY_API_URL` | `https://swiss-ai-survey.i-laube.workers.dev` (no trailing slash; set at T23c) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Production Turnstile site key (widget for `aicompliant.ch` / `www` / localhost; set at T23b — public by design) |
| `NEXT_PUBLIC_SCAN_API_URL` | `https://swiss-ai-scanner.i-laube.workers.dev` (no trailing slash; set with scanner deploy) |

These `NEXT_PUBLIC_*` values are baked in at **Pages build time**. After changing them, trigger a new production deployment of current `main` (Git push or Dashboard → Retry deployment). As of the survey + scanner Worker deploys, all four public env vars above are set on the Pages project; `/[lang]/survey/` and `/[lang]/website-check/` go live once that build includes the T24/T36 forms.

## Manual setup (~10 minutes)

1. Create a GitHub repository (e.g. `swiss-ai-resource`).
2. Add the remote and push:

   ```bash
   git remote add origin git@github.com:YOUR_USER/swiss-ai-resource.git
   git branch -M main
   git push -u origin main
   ```

3. In Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
4. Select the repository and apply the build settings above.
5. Deploy. The root path redirects to `/de/` via `public/_redirects`.
6. Add custom domain under the Pages project (**Custom domains** → `aicompliant.ch` and optionally `www`). Point the zone’s DNS at Cloudflare if needed, then attach the domain so Pages creates the proxied CNAMEs.
7. Set Pages env `NEXT_PUBLIC_SITE_URL=https://aicompliant.ch` and trigger a rebuild so canonical/hreflang tags use the custom host.

## Local verification

```bash
npm install
npm run check:content
npm run lint
npx tsc --noEmit
npm run build
```

`check:content` validates Markdown frontmatter under `content/{locale}/` (see [content/README.md](content/README.md)). A successful build writes static files to `out/`.

## Legal pages (T39/T40)

Impressum and Datenschutzerklärung are required before a customer-facing launch (Art. 3 Abs. 1 lit. s UWG; Art. 19 DSG). Routes: `/[lang]/impressum/`, `/[lang]/datenschutz/`. Footer + survey links ship with **T39**.

### Production checklist (T40) — fill before announcing the site

- [ ] Replace every `PLACEHOLDER_*` in [`content/de/impressum.md`](content/de/impressum.md) and [`content/de/datenschutz.md`](content/de/datenschutz.md) with final legal name, address, contact email, and related fields (marker list: [content/README.md](content/README.md#legal-pages-launch-requirement))
- [ ] Sync EN/FR/IT (`npm run translate -- --slug=impressum --slug=datenschutz` or manual edit of the same markers)
- [ ] Confirm no `PLACEHOLDER_` string remains: e.g. `rg PLACEHOLDER_ content/`
- [ ] Spot-check footer links and survey privacy link on `/de/`, `/de/survey/`
- [ ] Hand filled DE pages to lawyer review (**T29**)

Do not enable production survey email collection or publicly announce the site until T40 is complete.

## Continuous integration

Every pull request and every push to `main` runs [`.github/workflows/ci.yml`](.github/workflows/ci.yml):

- `npx tsc --noEmit`
- `npm run lint`
- Offline `check:*` validators (content, vendors, sources, glossary, rules, scanner, survey, survey-answers, survey-aggregates, classify, act, links-report)
- `npm run build` (static export to `out/`)

Live citation probing (`npm run check:links`) stays in the monthly job — it needs the network and is soft-fail by design. The CI workflow validates a committed `snapshots/_links.json` via `check:links-report` when present.

The monthly and translate automation workflows also run `npm run build` **before** any push to `main`, so a broken export cannot land from those jobs alone.

## Monthly source snapshots (GitHub Actions)

Site hosting is Cloudflare Pages; the monthly source job is **not** a Cloudflare Worker. It runs in GitHub Actions:

- Workflow: [`.github/workflows/monthly-sources.yml`](.github/workflows/monthly-sources.yml)
- Schedule: 1st of each month at 06:00 UTC, plus manual `workflow_dispatch`
- Commands: `snapshot:sources` (T15/T38) → `classify:snapshots` (T16) → `maintain:act -- --write` (T17/T18) → `check:links -- --write` (T21) → `check:content` → `check:vendors` → **`npm run build`** → commits / issues / review PR
- Commits snapshot artifacts (including `_links.json` and `_act/fetch-failures.md` when present), `last_verified` bumps to `main`; opens a GitHub issue for broken citation links (T21, soft-fail); opens a GitHub issue for persistent snapshot fetch failures (T38, ≥2 consecutive months); opens a GitHub issue + `review/material-YYYY-MM-DD` PR when material changes are classified

**GitHub secret:** add `ANTHROPIC_API_KEY` for the classify step (T16). Optional: set `CLASSIFY_MODEL` to override the default Claude Sonnet model. T15 fetch/snapshot and T17 act alone do not need an API key (T17 uses the classify report; T18 material vendor extract needs the key). The same `ANTHROPIC_API_KEY` secret is used by the T19 translation workflow below. Optional: set repository variable `TRANSLATE_MODEL` to override the default Claude Sonnet model for translation.

**Repo setting (required for material PRs):** under **Settings → Actions → General → Workflow permissions**, enable **Allow GitHub Actions to create and approve pull requests**. Without this, `gh pr create` in the monthly job returns 403 and the material-change review path never opens a PR.

### Source-fetch operations

The snapshot fetcher is defensive against common source-site failures:

- HTTP 202 soft challenges retry with cookie forwarding before being treated as failures.
- HTTP 403/202/429/timeouts retry once with a browser-like header profile.
- `fallback_urls` in `data/sources.json` are tried after the primary URL.
- Permanently blocked pages can be seeded once with `npm run snapshot:sources -- --id=<sourceId> --seed-file=<saved.html|pdf|json>`.

If a source fails, the previous snapshot text is kept and `last_verified` / `last_checked` are **not** bumped from that source. Persistent failures produce `snapshots/_act/fetch-failures.md` and a GitHub issue from the second consecutive failed month.

## Translation regeneration on DE merge (GitHub Actions)

When canonical DE prose merges to `main`, EN/FR/IT drafts are regenerated automatically:

- Workflow: [`.github/workflows/translate-on-de-merge.yml`](.github/workflows/translate-on-de-merge.yml)
- Trigger: push to `main` with paths under `content/de/**/*.md`, plus `workflow_dispatch` (optional slug list)
- Filter: only `title` / `description` / body changes count; T17 `last_verified` bumps on DE files do not retranslate
- Commands: `changed-de-slugs` → `translate --strict` → `check:content` → **`npm run build`** → bot commit of `content/{en,fr,it}/`

Requires the same `ANTHROPIC_API_KEY` repository secret as the monthly job.

## Survey Worker (T23)

Intake API for the Swiss AI adoption survey. Code lives in [`workers/survey/`](workers/survey/). Form UI is T24.

### Production status (T23a–T23d done)

| Item | Value |
|---|---|
| Worker | `https://swiss-ai-survey.i-laube.workers.dev` (`POST /submit`, cron `0 5 * * 1`) |
| D1 | `swiss-ai-survey` — `database_id` in [`workers/survey/wrangler.jsonc`](workers/survey/wrangler.jsonc); tables `responses` + `report_signups` (no FK) |
| CORS | `SITE_ORIGIN=https://aicompliant.ch` in Worker `vars` |
| Worker secrets | `TURNSTILE_SECRET_KEY`, `GITHUB_TOKEN` (never in git) |
| Pages | `NEXT_PUBLIC_SURVEY_API_URL` + `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set (see [Pages environment variables](#pages-environment-variables-production)) |

**Before public survey launch:** rotate secrets that were provisioned in an agent/operator session — [T23e / T23f](#pre-launch-secret-hygiene-t23e--t23f).

**D1 tables** ([`migrations/0001_init.sql`](workers/survey/migrations/0001_init.sql)):

| Table | Purpose |
|---|---|
| `responses` | Survey answers (`answers_json`); own UUID; `report_opt_in` flag only |
| `report_signups` | Optional report-notification emails; **own UUID, no FK** to `responses` |

That separation is what makes the UI/privacy claim (“emails stored separately from answers”) accurate. Retention and deletion: [Email retention and deletion](#email-retention-and-deletion).

### Local development

1. Install deps (includes `wrangler`):

   ```bash
   npm install
   cp workers/survey/.dev.vars.example workers/survey/.dev.vars
   ```

2. Apply D1 migrations to the **local** database:

   ```bash
   npm run db:survey:local
   ```

   If you previously applied the old `response_emails` schema locally, delete the Worker’s local D1 state under `workers/survey/.wrangler/` (or the project `.wrangler/`) and re-run the command so `0001_init.sql` creates `report_signups` instead.
3. Start the Worker. For **curl / smoke-test** (Origin = `https://aicompliant.ch`), use the default:

   ```bash
   npm run dev:survey
   ```

   For the **Next.js survey form** on `http://localhost:3000`, override CORS so the browser can POST:

   ```bash
   npx wrangler dev -c workers/survey/wrangler.jsonc --var SITE_ORIGIN:http://localhost:3000
   ```

   Default URL: `http://127.0.0.1:8787`. Endpoint: `POST /submit`.

4. Use Cloudflare Turnstile **test** keys (always-pass):

   | Role | Value |
   |---|---|
   | Site key (Pages / T24) | `1x00000000000000000000AA` |
   | Secret (`.dev.vars`) | `1x0000000000000000000000000000000AA` |

   Docs: [Turnstile testing](https://developers.cloudflare.com/turnstile/troubleshooting/testing/).

5. Smoke-test (example payload; adjust option ids if the instrument changes). Use default `SITE_ORIGIN` (`npm run dev:survey`), not the localhost override:

   ```bash
   curl -s -D - -X POST http://127.0.0.1:8787/submit \
     -H "Content-Type: application/json" \
     -H "Origin: https://aicompliant.ch" \
     -d "{\"survey_id\":\"swiss-ai-adoption-2026\",\"survey_version\":2,\"locale\":\"de\",\"answers\":{\"company-size\":\"10-49\",\"sector\":\"ict-software\",\"language-region\":\"german-speaking\",\"ai-maturity\":\"piloting\",\"ai-tools\":[\"chatgpt\",\"deepl\"],\"primary-use-cases\":[\"translation\"],\"monthly-spend-chf\":\"1-500\",\"hosting-requirement\":\"switzerland\",\"personal-data-in-ai\":\"no\",\"eu-market-exposure\":\"no\",\"deployment-blockers\":[\"none\"],\"vendor-decision-factors\":[\"swiss-entity-support\"]},\"email\":\"bench@example.com\",\"report_opt_in\":true,\"website\":\"\",\"turnstile_token\":\"XXXX.DUMMY.TOKEN.XXXX\"}"
   ```

   Expect `201` and `{ "ok": true, "id": "..." }`. Honeypot (`website` non-empty) → `204` and no D1 row. Invalid answers → `400`. Failed Turnstile → `403`. More than 5 POSTs/minute from one IP → `429`.

   Or run the scripted smoke test (asserts all of the above) against the running Worker:

   ```bash
   node workers/survey/smoke-test.mjs
   # optional custom base URL: node workers/survey/smoke-test.mjs http://127.0.0.1:8787
   ```

   This is an ad-hoc local check (needs `dev:survey` running), not part of CI.

6. Validate answer helpers without the Worker:

   ```bash
   npm run check:survey
   npm run check:survey-answers
   ```

### Survey form UI (T24)

Static pages at `/[lang]/survey/` (DE/EN/FR/IT). Client form posts to `{NEXT_PUBLIC_SURVEY_API_URL}/submit`.

Local dual-process run:

```bash
# Terminal A — Worker with CORS for Next
npx wrangler dev -c workers/survey/wrangler.jsonc --var SITE_ORIGIN:http://localhost:3000

# Terminal B — Next (.env.local)
# NEXT_PUBLIC_SURVEY_API_URL=http://127.0.0.1:8787
# NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
npm run dev
```

Open `http://localhost:3000/de/survey/`. Complete the form → expect `201` and a D1 row. With empty `NEXT_PUBLIC_SURVEY_API_URL`, the page shows an unavailable message and does not crash.

### Environment variables

| Name | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Pages / `.env` | Canonical site origin (`https://aicompliant.ch` in production) |
| `NEXT_PUBLIC_SURVEY_API_URL` | Pages / `.env` | Worker base URL (prod: see above; local: `http://127.0.0.1:8787`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Pages / `.env` | Turnstile site key (test key for local; production widget on Pages) |
| `TURNSTILE_SECRET_KEY` | Worker secret / `.dev.vars` | Siteverify secret (never in git) |
| `SITE_ORIGIN` | Worker `vars` | CORS allowlist (required; default in wrangler is `https://aicompliant.ch`; use `http://localhost:3000` when testing the form UI locally; missing → 500) |

### Production checklist (T23a–T23d) — completed

- [x] **T23a** Create D1: `npx wrangler d1 create swiss-ai-survey`, paste `database_id` into [`workers/survey/wrangler.jsonc`](workers/survey/wrangler.jsonc), then `npx wrangler d1 migrations apply swiss-ai-survey --remote -c workers/survey/wrangler.jsonc`
- [x] **T23b** Create a Turnstile widget (domains: `aicompliant.ch`, `www.aicompliant.ch`, `localhost`, `127.0.0.1`). Set Pages `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. Put the secret: `echo SECRET | npx wrangler secret put TURNSTILE_SECRET_KEY -c workers/survey/wrangler.jsonc`
- [x] **T23c** Confirm `SITE_ORIGIN` is `https://aicompliant.ch`; `npm run deploy:survey`; set Pages `NEXT_PUBLIC_SURVEY_API_URL` to the Worker URL
- [x] **T23d** Smoke-test production `POST /submit`; confirm `responses` + optional `report_signups` rows in remote D1 (separate ids; no shared key). Production `TURNSTILE_SECRET_KEY` rejects dummy tokens (`403`).

Redeploy Worker after config changes: `npm run deploy:survey`.

### Pre-launch secret hygiene (T23e / T23f)

Provisioning used an interactive operator/agent session. `NEXT_PUBLIC_*` values are public and do **not** need rotation. Rotate Worker secrets before announcing the survey:

- [ ] **T23e — Turnstile secret:** In Cloudflare Dashboard → **Turnstile** → the `swiss-ai-survey` widget → rotate/reveal a new secret (or create a replacement widget and update the Pages site key). Then:

  ```powershell
  "NEW_TURNSTILE_SECRET" | npx wrangler secret put TURNSTILE_SECRET_KEY -c workers/survey/wrangler.jsonc
  ```

  If the **site key** changes, update Pages `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and rebuild. Smoke-check: dummy token `XXXX.DUMMY.TOKEN.XXXX` against production `/submit` must return `403`; a real widget solve on the live form must return `201`.

- [ ] **T23f — GitHub PAT:** Replace the provisional Worker `GITHUB_TOKEN` (initially a broad `gh` OAuth token) with a **fine-grained PAT** scoped to `Ivan-Laube/swiss-ai-resource` only, permission **Contents: Read and write**, no other repos. Then:

  ```powershell
  "NEW_FINE_GRAINED_PAT" | npx wrangler secret put GITHUB_TOKEN -c workers/survey/wrangler.jsonc
  ```

  Optionally revoke or leave the old `gh` session token for local CLI only — do not leave a broad `repo`-scoped token on the Worker. Verify with a forced cron/scheduled run (see below) that aggregates can still commit.

## Survey aggregation (T25)

The survey Worker also runs a weekly cron (`0 5 * * 1`, Monday 05:00 UTC) that first purges `responses` / `report_signups` older than 24 months, then reads only `responses.answers_json` — never `report_signups` — computes anonymized aggregates with n&lt;5 cell suppression, and commits [`data/survey-aggregates.json`](data/survey-aggregates.json) to the repo via the GitHub Contents API. T26 renders the benchmark page from that static file.

### Email retention and deletion

Optional report emails live in `report_signups` with their **own** id and **no foreign key** to `responses`, so they cannot be joined back to an answer row. That matches the survey UI claim that emails are stored separately from answers.

- **Automatic retention:** the weekly cron deletes signup (and response) rows older than 24 months (`purgeExpiredSurveyData` in [`workers/survey/src/store.ts`](workers/survey/src/store.ts)).
- **On-request deletion:** remove all signup rows for an address (case-insensitive):

  ```bash
  npx wrangler d1 execute swiss-ai-survey --remote -c workers/survey/wrangler.jsonc \
    --command "DELETE FROM report_signups WHERE lower(email) = lower('user@example.com');"
  ```

  Local D1: add `--local` instead of `--remote`. The Worker also exports `deleteReportSignupByEmail` for the same operation.

### Local run (no GitHub, no secrets)

Generate aggregates from the local D1 database seeded by `POST /submit`:

```bash
npm run aggregate:survey -- --local          # print to stdout
npm run aggregate:survey -- --local --write  # write data/survey-aggregates.json
npm run check:survey-aggregates              # validate committed file + fixtures
```

`--local` is required; the script refuses to query D1 otherwise, since production aggregation runs inside the scheduled Worker.

### Production setup (aggregation)

A Worker `GITHUB_TOKEN` is already present (provisional; replace via **T23f** before public launch). Remaining checks:

1. Prefer a fine-grained PAT scoped to this repo only, with **Contents: Read and write** ([T23f](#pre-launch-secret-hygiene-t23e--t23f)):

   ```powershell
   "FINE_GRAINED_PAT" | npx wrangler secret put GITHUB_TOKEN -c workers/survey/wrangler.jsonc
   ```

2. Confirm the non-secret targets in [`workers/survey/wrangler.jsonc`](workers/survey/wrangler.jsonc): `GITHUB_REPO`, `GITHUB_BRANCH`, `GITHUB_AGGREGATES_PATH`.
3. `npm run deploy:survey` registers the cron trigger (already deployed with T23c; re-run after secret changes if needed — secrets apply without redeploy).
4. Force a run to verify: trigger from the Cloudflare dashboard on the deployed Worker (Schedules / Cron Triggers), or locally `wrangler dev -c workers/survey/wrangler.jsonc --test-scheduled` then `curl "http://127.0.0.1:8787/__scheduled?cron=0+5+*+*+1"` (requires remote D1 + `GITHUB_TOKEN` in `.dev.vars`). Confirm a `chore(survey): refresh anonymized aggregates` commit on `main`; the write is skipped when only `generated_at` would change.

### Environment variables (aggregation)

| Name | Where | Purpose |
|---|---|---|
| `GITHUB_TOKEN` | Worker secret / `.dev.vars` | Contents API write auth (never in git; use fine-grained PAT — T23f) |
| `GITHUB_REPO` | Worker `vars` | Target `owner/repo` |
| `GITHUB_BRANCH` | Worker `vars` | Commit branch (default `main`) |
| `GITHUB_AGGREGATES_PATH` | Worker `vars` | Committed file path |

## Scanner Worker (T33–T37)

Stateless website Quick-Check API. Code lives in [`workers/scanner/`](workers/scanner/). Check definitions: [`data/scanner-checks.json`](data/scanner-checks.json). Form UI is T36 (`/[lang]/website-check/`); UI strings + this deploy section are T37.

### Production status

| Item | Value |
|---|---|
| Worker | `https://swiss-ai-scanner.i-laube.workers.dev` (`POST /scan`) |
| CORS | `SITE_ORIGIN=https://aicompliant.ch` in Worker `vars` |
| Rate limit | `SCANNER_RATE_LIMITER` — 5 requests / 60s per IP (no secret) |
| Pages | `NEXT_PUBLIC_SCAN_API_URL` set (bake in via Pages rebuild of current `main`) |

Prod smoke (2026-08-04): `POST /scan` with `https://www.admin.ch` → `200` / `ok: true` / findings; `http://127.0.0.1/` → `400`; CORS preflight allows `https://aicompliant.ch`.

Together with the [survey Worker](#survey-worker-t23), both Workers from production-launch readiness item 4 are deployed and Pages has both `NEXT_PUBLIC_*_API_URL` values. The UI routes go live after a Pages deploy of current `main`.

### Local development

1. Install deps (includes `wrangler`):

   ```bash
   npm install
   ```

2. Start the Worker (default `SITE_ORIGIN` is `https://aicompliant.ch` in [`workers/scanner/wrangler.jsonc`](workers/scanner/wrangler.jsonc)):

   ```bash
   npm run dev:scanner
   ```

   For the **Next.js Quick-Check form** on `http://localhost:3000`, override CORS so the browser can POST:

   ```bash
   npx wrangler dev -c workers/scanner/wrangler.jsonc --var SITE_ORIGIN:http://localhost:3000
   ```

   Default local base URL is `http://127.0.0.1:8787`. If the survey Worker is already on `8787`, assign another port, e.g. `--port 8788`, and point `NEXT_PUBLIC_SCAN_API_URL` at that port.

3. Smoke-test (Worker only; no Next required):

   ```bash
   curl -s -X POST http://127.0.0.1:8787/scan \
     -H "Content-Type: application/json" \
     -d "{\"url\":\"https://www.admin.ch\"}"
   ```

   Expect `200` with `ok: true`, `findings[]`, and `static_scan_incomplete`. Or run:

   ```bash
   node workers/scanner/smoke-test.mjs
   # optional custom base URL: node workers/scanner/smoke-test.mjs http://127.0.0.1:8787
   ```

4. Validate check definitions:

   ```bash
   npm run check:scanner
   ```

### Quick-Check form UI (T36)

Static pages at `/[lang]/website-check/` (DE/EN/FR/IT). Client form posts to `{NEXT_PUBLIC_SCAN_API_URL}/scan`.

`WebsiteCheckForm` is a client component: import localization helpers from `@/rules/schema`, not `@/rules` (the barrel re-exports `load.ts` → `node:fs` and breaks `npm run build` with `output: "export"`). Confirm with `npm run build` after changing the form.

Local dual-process run:

```bash
# Terminal A — Worker with CORS for Next
npx wrangler dev -c workers/scanner/wrangler.jsonc --var SITE_ORIGIN:http://localhost:3000

# Terminal B — Next (.env.local)
# NEXT_PUBLIC_SCAN_API_URL=http://127.0.0.1:8787
npm run dev
```

Open `http://localhost:3000/de/website-check/`. Submit a public `https://` URL → expect a severity-grouped findings report with legal citations and disclaimer. With empty `NEXT_PUBLIC_SCAN_API_URL`, the page shows an unavailable message and does not crash.

### Environment variables

| Name | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Pages / `.env` | Canonical site origin (`https://aicompliant.ch` in production) |
| `NEXT_PUBLIC_SCAN_API_URL` | Pages / `.env` | Scanner Worker base URL (prod: `https://swiss-ai-scanner.i-laube.workers.dev`; local: `http://127.0.0.1:8787`) |
| `SITE_ORIGIN` | Worker `vars` | CORS allowlist (required; default in wrangler is `https://aicompliant.ch`; use `http://localhost:3000` when testing the form UI locally; missing → 500) |

Rate limiting uses the Workers Rate Limiting binding `SCANNER_RATE_LIMITER` (5 requests / 60s per IP) configured in [`workers/scanner/wrangler.jsonc`](workers/scanner/wrangler.jsonc) — no secret.

### Production checklist — completed

- [x] Confirm Worker `SITE_ORIGIN` is `https://aicompliant.ch` (no pages.dev fallback).
- [x] Deploy: `npm run deploy:scanner` → `https://swiss-ai-scanner.i-laube.workers.dev`.
- [x] Set Pages env `NEXT_PUBLIC_SCAN_API_URL` to that Worker URL (no trailing slash).
- [x] Smoke-test `POST /scan` (public URL → findings; private IP → `400`; CORS origin `https://aicompliant.ch`).

After the next Pages deploy of current `main`, confirm `/de/website-check/` from the live site. Optionally burst past the rate limit and confirm `429`.

Redeploy: `npm run deploy:scanner`.
