# Cloudflare Pages deployment

## Pre-traffic security hardening (operator checklist)

**Status (2026-09-29): complete.** All eight operator tasks in [`OPERATOR_CHECKLIST.md`](OPERATOR_CHECKLIST.md) are done (PAT revoke, `api.aicompliant.ch` cutover with `workers_dev: false`, Turnstile domains, WAF, observability/Paid plan, DNS anti-spoof + DNSSEC, GitHub supply chain, Pages preview Access, HSTS preload, CSP/hydration smoke). Keep that file as the historical runbook if you need to re-verify or rotate secrets.

Remaining non-security launch item: lawyer review of Impressum / Datenschutz (**T29**).

---

## Production host

| Item | Value |
|---|---|
| Live site | [https://aicompliant.ch](https://aicompliant.ch) (`www` CNAME → same Pages project) |
| Pages project hostname | `swiss-ai-resource.pages.dev` (still valid; custom domain is canonical) |
| Site URL (build) | `NEXT_PUBLIC_SITE_URL=https://aicompliant.ch` — Pages env; code default in [`src/lib/site.ts`](src/lib/site.ts); used for canonical tags, hreflang, `sitemap.xml`, and `robots.txt` |
| API hostname | `https://api.aicompliant.ch` — survey `POST /submit`, scanner `POST /scan` (Workers routes on zone `aicompliant.ch`; `workers_dev` / `preview_urls` disabled — see [`OPERATOR_CHECKLIST.md`](OPERATOR_CHECKLIST.md) §2) |
| Worker origin allowlist | `SITE_ORIGIN=https://aicompliant.ch` in both Worker `wrangler.jsonc` `vars` |

DNS for `aicompliant.ch` is on Cloudflare. Apex and `www` are proxied CNAMEs to `swiss-ai-resource.pages.dev`. API host `api` uses proxied AAAA `100::` (Workers custom hostname; not a CNAME to `*.workers.dev`).

Both Workers **require** `SITE_ORIGIN`. There is no `*.pages.dev` fallback; an unset/empty value returns HTTP 500 with `{ "error": "SITE_ORIGIN is not configured" }`. For local UI testing, override with `--var SITE_ORIGIN:http://localhost:3000`.

**Origin enforcement (not CORS-as-ACL):** `POST` and `OPTIONS` on `/submit` and `/scan` require an `Origin` header that matches `SITE_ORIGIN` exactly, or the www ↔ apex sibling of that host (same scheme/port). Missing or foreign Origin → **403** with no `Access-Control-Allow-*` headers. Matching requests get CORS headers reflecting the **request** Origin. Non-browser clients can forge `Origin`; volume abuse is limited by per-IP rate limiting, Turnstile (survey + scanner), and a hashed per-IP daily survey cap (20/day). See [Accepted residual risks](#accepted-residual-risks-workers).

## Build settings

| Setting | Value |
|---|---|
| Framework preset | None (or Next.js Static HTML Export) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Node version | 20 |
| Root directory | `/` |

### Security headers ([`public/_headers`](public/_headers))

Cloudflare Pages applies these to every response (copied to `out/_headers` by the static export build). Verify after a deploy with `npm run check:live-headers` (see below).

**Cloudflare Pages silently drops `_headers` values longer than 2,000 characters.** Until 2026-09-30 the CSP was one site-wide header listing every page's script hashes (6,182 chars), so production served **no CSP at all**. The CSP is now split in two:

- **Per-page `<meta http-equiv="Content-Security-Policy">`:** injected into every HTML file by the postbuild step. It carries only that page's inline-script hashes (currently at most 11, under 1,000 chars) and is the policy that restricts scripts, styles, connections and frames.
- **Short header policy:** `frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'`. These are directives a meta policy can't express (`frame-ancestors`) plus some hardening. The browser enforces both policies together.

`csp-hashes.ts` fails the build if any header value would exceed the limit.

| Header | Value | Notes |
|---|---|---|
| `Content-Security-Policy` (header) | `frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'` | The full per-page policy is a `<meta>` tag written by [`scripts/csp-hashes.ts`](scripts/csp-hashes.ts) (`postbuild`): `default-src 'self'`, `script-src 'self'` + that page's sha256 hashes + Turnstile, `connect-src 'self' https://api.aicompliant.ch https://challenges.cloudflare.com`, `frame-src` Turnstile, `upgrade-insecure-requests`. The postbuild step also emits COOP/CORP and detaches `Access-Control-Allow-Origin`. |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Submitted at hstspreload.org (OPERATOR §7). |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` | |
| `Cross-Origin-Opener-Policy` | `same-origin` | |
| `Cross-Origin-Resource-Policy` | `same-origin` | |
| `X-Frame-Options` | `DENY` | |
| `X-Content-Type-Options` | `nosniff` | |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | |

**If you change this file or `csp-hashes.ts`, redeploy and re-check.** A too-strict `script-src` silently breaks React hydration site-wide, with no 4xx/5xx to notice. Two automated guards cover this:

- The Playwright `privacy` project loads every route under its real meta CSP and fails on any CSP violation.
- `npm run check:live-headers [-- <origin>]` ([`scripts/check-live-headers.ts`](scripts/check-live-headers.ts)) fetches the deployed site. It fails if a security header is missing, a page has no meta CSP, `script-src` allows `'unsafe-inline'`/`'unsafe-eval'`, or an inline script isn't hashed. The [Live security headers](.github/workflows/live-headers.yml) workflow runs it against production after every push to `main` (retrying while Pages deploys), daily, and on demand.

Zod 4 probes for `eval` support on first parse, which the CSP blocks and reports as a violation. All schemas therefore import `z` from [`src/lib/zod.ts`](src/lib/zod.ts), which sets `jitless: true`. Import from there, not from `"zod"`.

### Pages environment variables (production)

| Name | Value / notes |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://aicompliant.ch` (canonical + hreflang + sitemap/robots base) |
| `NEXT_PUBLIC_SURVEY_API_URL` | `https://api.aicompliant.ch` (no trailing slash; shared API host) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Production Turnstile site key (widget for `aicompliant.ch` / `www` only — no localhost; public by design) |
| `NEXT_PUBLIC_SCAN_API_URL` | `https://api.aicompliant.ch` (no trailing slash; same host, `/scan` route) |

These `NEXT_PUBLIC_*` values are baked in at **Pages build time**. After changing them, push to `main` (or Dashboard → Retry deployment) so the next production build picks them up.

### Production status (site)

| Item | Value |
|---|---|
| Git | `main` on [`Ivan-Laube/swiss-ai-resource`](https://github.com/Ivan-Laube/swiss-ai-resource) (engineering launch readiness: T40 + T43 + launch hardening + T23e/T23f/T41/T42 + OPERATOR checklist complete) |
| Pages project | `swiss-ai-resource` — Git-connected; production branch `main` |
| Live host | [https://aicompliant.ch](https://aicompliant.ch) (`/de/survey/`, `/de/website-check/`, legal pages, `/sitemap.xml`, `/robots.txt` → **200**; custom locale 404) |
| API | [https://api.aicompliant.ch](https://api.aicompliant.ch) — `/submit` + `/scan`; `*.workers.dev` disabled |
| Workers | Survey + scanner deployed; Origin fail-closed; Turnstile on both; observability logs on; see [Survey Worker](#survey-worker-t23) and [Scanner Worker](#scanner-worker-t33t37) |

Direct upload (`npx wrangler pages deploy out --project-name=swiss-ai-resource --commit-dirty=true`) can publish a local `out/` without waiting for Git; prefer **push to `main`** so GitHub and Pages stay aligned.

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
7. Set Pages env `NEXT_PUBLIC_SITE_URL=https://aicompliant.ch` and trigger a rebuild so canonical/hreflang tags and `sitemap.xml` / `robots.txt` use the custom host.

## Local verification

```bash
npm install
npm run check:content
npm run lint
npx tsc --noEmit
npm run build
```

`check:content` validates Markdown frontmatter under `content/{locale}/` (see [content/README.md](content/README.md)). A successful build writes static files to `out/`, including `out/sitemap.xml` and `out/robots.txt` from [`src/app/sitemap.ts`](src/app/sitemap.ts) / [`src/app/robots.ts`](src/app/robots.ts) (`export const dynamic = "force-static"` required for `output: "export"`), plus `out/404.html` from [`src/app/global-not-found.tsx`](src/app/global-not-found.tsx) (`experimental.globalNotFound` in [`next.config.ts`](next.config.ts); in-locale `notFound()` uses [`src/app/[lang]/not-found.tsx`](src/app/[lang]/not-found.tsx)). Sitemap URLs use trailing slashes and enumerate locale homes, guides index, publishable content slugs, tools (index + `listRuleIds()`), vendors, survey, benchmark, and website-check — not the redirect-only `/`. Cloudflare Pages serves `404.html` for unknown paths with no extra config; document language defaults to `de` and an early inline script (CSP-hashed) plus chrome follow the URL path (`de` / `en` / `fr` / `it`). Locale pages set `<html lang>` from the `[lang]` root layout. After deploy, spot-check [https://aicompliant.ch/sitemap.xml](https://aicompliant.ch/sitemap.xml), [https://aicompliant.ch/robots.txt](https://aicompliant.ch/robots.txt), and a missing path (e.g. `/de/does-not-exist/`) for the custom 404.

## Legal pages (T39/T40)

Impressum and Datenschutzerklärung are required for a customer-facing site (Art. 3 Abs. 1 lit. s UWG; Art. 19 DSG). Routes: `/[lang]/impressum/`, `/[lang]/datenschutz/`. Footer + survey links ship with **T39**. Conventions: [content/README.md](content/README.md#legal-pages).

**T40 (done):** natural-person operator filled in DE/EN/FR/IT — name, street, PLZ/Ort, contact email (`mailto:`). Phone, Rechtsform, Vertretung, and Handelsregister/UID omitted as not applicable. Public deletion contact on Datenschutz matches the Impressum email (`i.laube@gmail.com`).

### Production checklist (T40)

- [x] Fill operator details in [`content/de/impressum.md`](content/de/impressum.md) and [`content/de/datenschutz.md`](content/de/datenschutz.md)
- [x] Sync EN/FR/IT by hand (same structure; no LLM rewrite of legal copy)
- [x] Confirm no `PLACEHOLDER_` string remains under `content/` (except historical notes in docs)
- [x] Spot-check footer links and survey privacy link on `/de/`, `/de/survey/`
- [ ] Hand filled DE pages to lawyer review (**T29**)

Do not treat lawyer review as a soft gate for marketing announce if you accept that risk: hand filled DE pages to lawyer review (**T29**) remains open. Engineering pre-announce items (T23e/T23f/T41/T42) are done.

## Usage statistics (no cookies, no client script)

The site sets no cookies and loads no analytics script, so it needs no cookie banner (Datenschutz §2.5 says so in all four languages). Usage is measured server-side only. Keep it that way: any change here must keep §2.5 true.

### Page traffic — Cloudflare dashboard (nothing to deploy)

Read it under **aicompliant.ch zone → Analytics & Logs → HTTP Traffic** (requests, visits, top paths, status codes), built from the CDN's own request data.

**Do not** switch on **Web Analytics** (Pages project → Metrics, or the zone's *Web Analytics → automatic setup*). Both inject the `static.cloudflareinsights.com` beacon `<script>` into every page: that is a third-party client script, the meta CSP blocks it (`script-src` / `connect-src`), and §2.5 would become false.

### Tool usage — Workers Analytics Engine

Both API workers write one data point per `POST /scan` and `POST /submit` to the `aicompliant_usage` dataset (binding `USAGE`, see [`src/lib/usage-metrics.ts`](src/lib/usage-metrics.ts)): `blob1` = tool (`scan` / `survey`), `blob2` = outcome (`ok`, `bot_rejected`, `rate_limited`, `turnstile_failed`, `rejected`, `upstream_error`, `error`), `double1` = HTTP status. No IP, URL, answers, country or user agent. Analytics Engine keeps data for three months (matches the §5 retention row). Writes are best-effort and never fail a request; locally (`wrangler dev` without the binding) they are a no-op.

The dataset is created on first write after `npm run deploy:scanner` and `npm run deploy:survey`. Query it with an API token that has **Account Analytics: Read**:

```bash
curl "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/analytics_engine/sql" \
  -H "Authorization: Bearer $CF_ANALYTICS_TOKEN" \
  --data "SELECT blob1 AS tool, blob2 AS outcome, SUM(_sample_interval) AS requests FROM aicompliant_usage WHERE timestamp > NOW() - INTERVAL '30' DAY GROUP BY tool, outcome ORDER BY tool, requests DESC"
```

Use `SUM(_sample_interval)`, not `COUNT()`: Analytics Engine samples at high volume.

## Continuous integration

Every pull request and every push to `main` runs [`.github/workflows/ci.yml`](.github/workflows/ci.yml):

- Workflow `permissions: contents: read` (default; monthly/translate jobs request write only where needed)
- Actions pinned to commit SHAs
- `npm run sync:survey-aggregates` (T43 — best-effort fetch of the latest `survey-aggregates.json` from [`swiss-ai-survey-data`](https://github.com/Ivan-Laube/swiss-ai-survey-data); warns and keeps the committed copy on failure rather than failing CI. **Exception:** it hard-fails when the local file is the e2e test fixture — see [E2E survey fixture guard](#e2e-survey-fixture-guard))
- `npx tsc --noEmit`
- `npm run lint`
- Offline `check:*` validators (content, vendors, sources, glossary, rules, scanner, survey, survey-answers, survey-aggregates, classify, act, links-report, contrast)
- `npm run build` (static export to `out/` + `postbuild` CSP hash rewrite)
- Playwright e2e job (`build:e2e` + `test:e2e`, 45 min timeout), run **inside the `mcr.microsoft.com/playwright:v1.63.0-jammy` container**, the same image as `scripts/docker-visual.sh`, so visual baselines match pixel-for-pixel. Keep the image tag in sync with `@playwright/test` in `package.json`. Projects (see [`playwright.config.ts`](playwright.config.ts)):
  - `configured` / `unconfigured`: functional specs for website-check, survey and benchmark, plus [`e2e/website-check/headers.spec.ts`](e2e/website-check/headers.spec.ts), which locks the header CSP, the per-page meta CSP (one per HTML file, before any script, hashing exactly its inline scripts), the other security headers and the 2,000-char header-value limit in both `out-e2e` and `out-e2e-unconfigured` (**R53**)
  - `layout`: [`e2e/layout/header.spec.ts`](e2e/layout/header.spec.ts), single-row header, no horizontal overflow, mobile menu and `aria-current` across all locales × 320–1280px
  - `privacy`: no third-party requests and no CSP violations on any public route or the 404 page, DE + FR (**R52**)
  - `a11y-light` / `a11y-dark`: axe scan, no serious or critical violations (**R51**)
  - `visual-{375,768,1280}-{light,dark}`: **R50** full-page snapshots for all public routes × {de, fr}. Dates, counts, reading times, the copyright year and Turnstile hosts are masked. Their text is also replaced with a fixed placeholder before the screenshot, so a monthly `last_verified` bump can't change the layout and break baselines.

  On failure CI uploads `playwright-report/` and `test-results/` (diff images).

**Updating visual baselines (R50):** always regenerate in the **same Playwright image CI uses**. Native Playwright on Linux, Windows or macOS is not authoritative, because font rendering differs.

**Preferred, no local Docker needed:** **Actions → Update visual baselines → Run workflow** ([`update-visual-baselines.yml`](.github/workflows/update-visual-baselines.yml)).
- Enter the PR branch (never `main`).
- The workflow regenerates all snapshots in `mcr.microsoft.com/playwright:v1.63.0-jammy`, uploads them as the `visual-baselines` artifact, and (with **commit** ticked) commits them back to the branch.
- It pushes with the deploy key, so CI re-runs on the branch automatically.
- Review the changed PNGs in the PR before merging.

**Alternative, local Docker:**

```bash
npm run build:e2e
bash scripts/docker-visual.sh --update   # write baselines
bash scripts/docker-visual.sh            # compare only; run once more to confirm they're stable
```

- The helper reuses an existing `out-e2e/`, so run `build:e2e` first after source changes.
- In Git Bash on Windows, prefix the commands with `MSYS_NO_PATHCONV=1` if Docker mangles the volume paths.
- On the operator's Windows 10 machine, Docker Desktop crashed the system while its engine started (2026-10-01), so use the workflow there.

`npm run test:visual` runs the visual projects natively, which is only useful for a quick local look, not for baselines.

### E2E survey fixture guard

`build:e2e` temporarily swaps `data/survey-aggregates.json` for [`e2e/fixtures/survey-aggregates.populated.json`](e2e/fixtures/survey-aggregates.populated.json) (fabricated responses, so the benchmark page has data to test) and restores it afterwards, including on Ctrl-C or a failed step. A leaked fixture would publish fabricated benchmark numbers, so three places refuse it (shared check in [`scripts/e2e-fixture-guard.ts`](scripts/e2e-fixture-guard.ts)):

- `build:e2e` won't start if the working-tree file already equals the fixture
- `sync:survey-aggregates` (the `prebuild` hook, so every production build) fails instead of falling back to the local copy
- `check:survey-aggregates` fails in CI

Recovery: `git checkout data/survey-aggregates.json`.

Live citation probing (`npm run check:links`) stays in the monthly job — it needs the network and is soft-fail by design. The CI workflow validates a committed `snapshots/_links.json` via `check:links-report` when present.

Dependabot: [`.github/dependabot.yml`](.github/dependabot.yml) (weekly npm + GitHub Actions). Soft branch ruleset on `main` + secret scanning / push protection are enabled (OPERATOR §6).

The monthly and translate automation workflows also run `npm run build` **before** any push to `main`, so a broken export cannot land from those jobs alone.

Both push with the **`bots-push-main` deploy key**, not `GITHUB_TOKEN`:
- **Setup:** the private key is in the Actions secret `BOT_DEPLOY_KEY` and is passed as `ssh-key` to `actions/checkout`.
- **Why:** the `protect-main` ruleset lets deploy keys bypass its required CI checks, and on a personal-account repo the Actions token can't be exempted.
- **Side effect:** deploy-key pushes trigger the usual workflows (CI, Live security headers), which `GITHUB_TOKEN` pushes didn't.
- **Setup, rotation and rollback:** see [docs/operator-followups-2026-10.md](docs/operator-followups-2026-10.md#b-require-ci-on-main-with-a-deploy-key-for-the-bots).

## Monthly source snapshots (GitHub Actions)

Site hosting is Cloudflare Pages; the monthly source job is **not** a Cloudflare Worker. It runs in GitHub Actions:

- Workflow: [`.github/workflows/monthly-sources.yml`](.github/workflows/monthly-sources.yml)
- Schedule: 1st of each month at 06:00 UTC, plus manual `workflow_dispatch`
- Commands: `snapshot:sources` (T15/T38) → `classify:snapshots` (T16) → `maintain:act -- --write` (T17/T18) → `check:links -- --write` (T21) → `check:content` → `check:vendors` → **`npm run build`** → commits / issues / review PR
- Commits snapshot artifacts (including `_links.json` and `_act/fetch-failures.md` when present), `last_verified` bumps to `main`; opens a GitHub issue for broken citation links (T21, soft-fail); opens a GitHub issue for persistent snapshot fetch failures (T38, ≥2 consecutive months); opens a GitHub issue + `review/material-YYYY-MM-DD` PR when material changes are classified

**GitHub secret:** add `ANTHROPIC_API_KEY` for the classify step (T16). Optional: set `CLASSIFY_MODEL` to override the default (`claude-sonnet-5`). T15 fetch/snapshot and T17 act alone do not need an API key (T17 uses the classify report; T18 material vendor extract needs the key). The same `ANTHROPIC_API_KEY` secret is used by the T19 translation workflow below. Optional: set repository variable `TRANSLATE_MODEL` to override the default (`claude-sonnet-5`) for translation.

**Repo setting (T42 — done):** Actions → General → Workflow permissions has **Allow GitHub Actions to create and approve pull requests** enabled (`default_workflow_permissions: write`, `can_approve_pull_request_reviews: true`). Required so monthly `gh pr create` for material changes does not 403.

### Source-fetch operations

The snapshot fetcher is defensive against common source-site failures:

- HTTP 202 soft challenges retry with cookie forwarding before being treated as failures.
- HTTP 403/202/429/timeouts retry once with a browser-like header profile.
- `fallback_urls` in `data/sources.json` are tried after the primary URL.
- Permanently blocked pages can be seeded once with `npm run snapshot:sources -- --id=<sourceId> --seed-file=<saved.html|pdf|json>`.

If a source fails, the previous snapshot text is kept and `last_verified` / `last_checked` are **not** bumped from that source. Persistent failures produce `snapshots/_act/fetch-failures.md` and a GitHub issue from the second consecutive failed month.

**Freshness rule:** Act bumps `last_verified` / `last_checked` only when a dependent source is successfully fetched with an empty diff (`unchanged`). Cosmetic classifications (non-empty diffs the LLM judged non-substantive) do **not** bump — that closes the prompt-injection path where a third-party page could instruct the classifier to answer "cosmetic" and mint a false freshness claim. Material changes still open a review PR with no auto-bump. The classifier prompt biases toward material and tells the model to ignore instructions inside the untrusted diff.

## Translation regeneration on DE merge (GitHub Actions)

When canonical DE prose merges to `main`, EN/FR/IT drafts are regenerated automatically:

- Workflow: [`.github/workflows/translate-on-de-merge.yml`](.github/workflows/translate-on-de-merge.yml)
- Trigger: push to `main` with paths under `content/de/**/*.md`, plus `workflow_dispatch` (optional slug list)
- Filter: only `title` / `description` / body changes count; T17 `last_verified` bumps on DE files do not retranslate
- Commands: `changed-de-slugs` → `translate --strict` → `check:content` → **`npm run build`** → bot commit of `content/{en,fr,it}/`
- Hardening: `workflow_dispatch` slugs and step outputs are passed via `env:` (never interpolated into `run:`), and `actions/checkout` / `actions/setup-node` are pinned to commit SHAs
- XSS hardening: LLM drafts must not contain raw HTML tags outside code blocks (`assertNoRawHtmlInTranslation` refuses the write); rendered pages run marked output through `sanitize-html` in [`src/lib/markdown.ts`](src/lib/markdown.ts) before `dangerouslySetInnerHTML`

Requires the same `ANTHROPIC_API_KEY` repository secret as the monthly job.

## Survey Worker (T23)

Intake API for the Swiss AI adoption survey. Code lives in [`workers/survey/`](workers/survey/). Form UI is T24.

### Production status (T23a–T23d done)

| Item | Value |
|---|---|
| Worker | `https://api.aicompliant.ch` (`POST /submit`, cron `0 5 * * 1`; `workers_dev` / `preview_urls` disabled) |
| D1 | `swiss-ai-survey` — `database_id` in [`workers/survey/wrangler.jsonc`](workers/survey/wrangler.jsonc); tables `responses` + `report_signups` (no FK) + `submission_quotas` (hashed IP daily cap) |
| Origin / CORS | `SITE_ORIGIN=https://aicompliant.ch` — POST/OPTIONS enforce Origin; ACAO only for allowlisted origin |
| Worker secrets | `TURNSTILE_SECRET_KEY`, `GITHUB_TOKEN` (classic PAT with `public_repo` for data-repo writes — never in git) |
| Pages | `NEXT_PUBLIC_SURVEY_API_URL` + `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set; form live on [aicompliant.ch/de/survey/](https://aicompliant.ch/de/survey/) |

**Pre-launch hygiene (done):** Turnstile widget rotated to `swiss-ai-survey-v2` and Worker `GITHUB_TOKEN` replaced — [T23e / T23f](#pre-launch-secret-hygiene-t23e--t23f). PAT blast radius narrowed to [`swiss-ai-survey-data`](https://github.com/Ivan-Laube/swiss-ai-survey-data) — [T43](#pat-scoped-to-a-dedicated-data-repo-t43). Live form + Quick-Check browser smoke — [T41](#live-ui-smoke-t41). Operator cutover — [`OPERATOR_CHECKLIST.md`](OPERATOR_CHECKLIST.md).

**D1 tables** ([`migrations/0001_init.sql`](workers/survey/migrations/0001_init.sql) + [`0002_submission_quotas.sql`](workers/survey/migrations/0002_submission_quotas.sql)):

| Table | Purpose |
|---|---|
| `responses` | Survey answers (`answers_json`); own UUID; `report_opt_in` flag only |
| `report_signups` | Optional report-notification emails; **own UUID, no FK** to `responses` |
| `submission_quotas` | Hashed client IP → UTC-day successful submit count (cap 20/day) |

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

   Expect `201` and `{ "ok": true, "id": "..." }`. Honeypot (`website` non-empty) → `204` and no D1 row. Invalid answers → `400`. Missing/wrong `Origin` → `403` (no CORS headers). Failed Turnstile → `403`. More than 5 POSTs/minute from one IP → `429`. More than 20 successful submits/UTC-day per hashed IP → `429`. Body over 32 KiB → `413` (checked via `Content-Length` and a streamed cap in [`workers/survey/src/body-limit.ts`](workers/survey/src/body-limit.ts), before JSON parsing). Apply migration `0002_submission_quotas` locally with `npm run db:survey:local` (and `--remote` for production).

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
| `NEXT_PUBLIC_SURVEY_API_URL` | Pages / `.env` | Worker base URL (prod: `https://api.aicompliant.ch`; local: `http://127.0.0.1:8787`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Pages / `.env` | Turnstile site key (test key for local; production widget on Pages) |
| `TURNSTILE_SECRET_KEY` | Worker secret / `.dev.vars` | Siteverify secret (never in git) |
| `SITE_ORIGIN` | Worker `vars` | Allowed browser Origin + CORS reflect value (required; default `https://aicompliant.ch`; www sibling also accepted; use `http://localhost:3000` for local form UI; missing → 500) |

### Production checklist (T23a–T23d) — completed

- [x] **T23a** Create D1: `npx wrangler d1 create swiss-ai-survey`, paste `database_id` into [`workers/survey/wrangler.jsonc`](workers/survey/wrangler.jsonc), then `npx wrangler d1 migrations apply swiss-ai-survey --remote -c workers/survey/wrangler.jsonc`
- [x] **T23b** Create a Turnstile widget (domains: `aicompliant.ch`, `www.aicompliant.ch` only — **no localhost** on the production widget; local UI uses test keys). Set Pages `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. Put the secret: `echo SECRET | npx wrangler secret put TURNSTILE_SECRET_KEY -c workers/survey/wrangler.jsonc` (and the same secret on the scanner Worker).
- [x] **T23c** Confirm `SITE_ORIGIN` is `https://aicompliant.ch`; `npm run deploy:survey`; set Pages `NEXT_PUBLIC_SURVEY_API_URL` to the Worker URL
- [x] **T23d** Smoke-test production `POST /submit`; confirm `responses` + optional `report_signups` rows in remote D1 (separate ids; no shared key). Production `TURNSTILE_SECRET_KEY` rejects dummy tokens (`403`).

Redeploy Worker after config changes: `npm run deploy:survey`.

### Pre-launch secret hygiene (T23e / T23f)

Provisioning used an interactive operator/agent session. `NEXT_PUBLIC_*` values are public and do **not** need rotation. **T23e / T23f are done** (keep this section as the runbook if secrets must be rotated again):

- [x] **T23e — Turnstile secret:** Replaced widget with `swiss-ai-survey-v2` (site key on Pages `NEXT_PUBLIC_TURNSTILE_SITE_KEY`); secret set via `wrangler secret put TURNSTILE_SECRET_KEY`; old widget deleted. Dummy token against production `/submit` returns `403`.

- [x] **T23f — GitHub PAT:** Initially a fine-grained PAT `swiss-ai-survey-aggregates` (Contents R/W on this repo). Superseded by **T43** (data-repo classic PAT). Optionally revoke any older broad `gh` OAuth token that was previously on the Worker.

### PAT scoped to a dedicated data repo (T43)

Fine-grained PATs cannot be scoped below "whole repo," so the T23f PAT (Contents R/W on `swiss-ai-resource`) could alter published site content (`content/**`, `public/_headers`, …) if leaked, since `main` auto-deploys to Cloudflare Pages on push — not just `data/survey-aggregates.json`, the only path the Worker actually writes (`writeGitHubFile` in [`workers/survey/src/github.ts`](workers/survey/src/github.ts)). **T43 narrows this**: the weekly cron now writes to a separate, public, data-only repo — [`Ivan-Laube/swiss-ai-survey-data`](https://github.com/Ivan-Laube/swiss-ai-survey-data) — so a leaked `GITHUB_TOKEN` can only rewrite that one JSON file in a repo with no deploy hook of its own. The data is already fully public via the benchmark page, so making its source repo public too discloses nothing new, and lets the Next.js build fetch it unauthenticated (no second secret to manage).

How it fits together:

- [`workers/survey/wrangler.jsonc`](workers/survey/wrangler.jsonc) `GITHUB_REPO` now points at `Ivan-Laube/swiss-ai-survey-data` (`GITHUB_AGGREGATES_PATH: "survey-aggregates.json"` at that repo's root); `aggregate-job.ts` / `github.ts` needed no code changes, they were already fully parameterized by env vars.
- [`scripts/sync-survey-aggregates.ts`](scripts/sync-survey-aggregates.ts) fetches that repo's `survey-aggregates.json` over `raw.githubusercontent.com` (unauthenticated), validates it against the survey schema and instrument, and overwrites the local `data/survey-aggregates.json` — the file [`src/survey/aggregate-load.ts`](src/survey/aggregate-load.ts) reads at build time is unchanged. On any fetch/parse/validation failure it logs a warning and leaves the existing committed copy in place rather than failing the build.
- Wired in as `npm run sync:survey-aggregates`, as a `prebuild` hook (covers `npm run build`, i.e. Cloudflare Pages' build command, automatically), and as its own step in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) before the `check:*` steps.
- `data/survey-aggregates.json` stays committed in `swiss-ai-resource` as the offline/local-dev fallback; it's no longer the bot-committed source of truth, so it won't receive the weekly `chore(survey): refresh anonymized aggregates` commits any more (those now land in the data repo instead) and will look increasingly stale in `git log` — that's expected, the live copy is fetched at build time.

**Status (T43):**

- [x] Created the [`Ivan-Laube/swiss-ai-survey-data`](https://github.com/Ivan-Laube/swiss-ai-survey-data) repo (public; seeded with a `survey-aggregates.json` matching the then-current empty snapshot and a short README).
- [x] Created a new fine-grained PAT `swiss-ai-survey-data-aggregates`, scoped to **only** that repo (Contents R/W).
- [x] `wrangler secret put GITHUB_TOKEN -c workers/survey/wrangler.jsonc`, then `npm run deploy:survey` — deployed, `env.GITHUB_REPO` confirmed as `Ivan-Laube/swiss-ai-survey-data`.
- [x] Confirm a real write succeeds (forced minute-cron run 2026-09-28: `survey_aggregation_complete`, `write: unchanged` — GitHub auth OK; see OPERATOR_CHECKLIST §1.2).
- [x] Revoke or narrow the old `swiss-ai-survey-aggregates` PAT's access to `swiss-ai-resource` once the above is confirmed working.
- [x] Worker `GITHUB_TOKEN` is now a **classic** PAT (`public_repo`) for `swiss-ai-survey-data` (fine-grained tokens for this flow revoked).

### Live UI smoke (T41)

Worker-level smokes (curl) are done. Before announcing the survey or Quick-Check, confirm the **browser** paths on production:

- [x] Open [https://aicompliant.ch/de/survey/](https://aicompliant.ch/de/survey/) — form renders (not the unavailable message); Turnstile widget present with v2 site key.
- [x] Complete Turnstile; submit once with a throwaway email + report opt-in → `201` / success UI; confirm remote D1 `responses` + unlinkable `report_signups` rows (see T23d queries above); delete the test signup email afterward.
- [x] Open [https://aicompliant.ch/de/website-check/](https://aicompliant.ch/de/website-check/) — scan `https://www.admin.ch` → findings render with citations and disclaimer.
- [x] Spot-check footer → Impressum / Datenschutz on `/de/`.
- [x] Spot-check [https://aicompliant.ch/sitemap.xml](https://aicompliant.ch/sitemap.xml) and [https://aicompliant.ch/robots.txt](https://aicompliant.ch/robots.txt) (trailing-slash locale URLs; sitemap listed in robots).
- [x] Spot-check a missing URL (e.g. [https://aicompliant.ch/de/does-not-exist/](https://aicompliant.ch/de/does-not-exist/)) for the custom locale-aware 404 (header + home link, not Next’s default).

### GitHub Actions repo permission (T42)

- [x] Repo **Settings → Actions → General → Workflow permissions**: **Allow GitHub Actions to create and approve pull requests** enabled (`default_workflow_permissions: write`, `can_approve_pull_request_reviews: true`).

## Survey aggregation (T25)

The survey Worker also runs a weekly cron (`0 5 * * 1`, Monday 05:00 UTC) that first purges `responses` / `report_signups` older than 24 months, then reads only `responses.answers_json` — never `report_signups` — computes anonymized aggregates with n&lt;5 cell suppression, and commits `survey-aggregates.json` to [`swiss-ai-survey-data`](https://github.com/Ivan-Laube/swiss-ai-survey-data) via the GitHub Contents API (**T43**). T26 renders the benchmark page from the copy synced into this repo at build time.

### Email retention and deletion

Optional report emails live in `report_signups` with their **own** id and **no foreign key** to `responses`, so they cannot be joined back to an answer row. That matches the survey UI claim that emails are stored separately from answers.

- **Opt-in gated:** `storeResponse` in [`workers/survey/src/store.ts`](workers/survey/src/store.ts) only inserts a `report_signups` row when `report_opt_in` is `true` — an email typed into the field without checking the box is never persisted. (Previously any non-empty email was stored regardless of the checkbox; fixed as it contradicted the Datenschutzerklärung's opt-in basis for email storage.)
- **Timestamp unlinkability:** `report_signups.created_at` is written at date-only precision (`date('now')`), not the shared insert batch's second-precision `datetime('now')` — so it can't be joined back to a `responses` row by matching insert timestamp, on top of the separate-id/no-FK design.
- **Public contact (T40):** deletion requests are directed to **i.laube@gmail.com** (Impressum / Datenschutzerklärung).
- **Automatic retention:** the weekly cron deletes signup (and response) rows older than 24 months (`purgeExpiredSurveyData` in [`workers/survey/src/store.ts`](workers/survey/src/store.ts)).
- **On-request deletion:** after a user emails the contact above, remove all signup rows for that address (case-insensitive):

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

Worker `GITHUB_TOKEN` is a **classic** PAT with `public_repo` used only to write `survey-aggregates.json` in [`swiss-ai-survey-data`](https://github.com/Ivan-Laube/swiss-ai-survey-data) (**T43** done). Rotation checklist:

1. If rotating the PAT later:

   ```powershell
   "CLASSIC_PAT_public_repo" | npx wrangler secret put GITHUB_TOKEN -c workers/survey/wrangler.jsonc
   ```

2. Confirm the non-secret targets in [`workers/survey/wrangler.jsonc`](workers/survey/wrangler.jsonc): `GITHUB_REPO=Ivan-Laube/swiss-ai-survey-data`, `GITHUB_BRANCH`, `GITHUB_AGGREGATES_PATH`.
3. `npm run deploy:survey` registers the cron trigger (already deployed; re-run after config changes if needed — secrets apply without redeploy).
4. Force a run to verify: trigger from the Cloudflare dashboard on the deployed Worker (Schedules / Cron Triggers), or locally `wrangler dev -c workers/survey/wrangler.jsonc --test-scheduled` then `curl "http://127.0.0.1:8787/__scheduled?cron=0+5+*+*+1"` (requires remote D1 + `GITHUB_TOKEN` in `.dev.vars`). Confirm a `chore(survey): refresh anonymized aggregates` commit on `main` of the **`swiss-ai-survey-data`** repo (or logs `survey_aggregation_complete` with `write: unchanged`); the write is skipped when only `generated_at` would change.

### Environment variables (aggregation)

| Name | Where | Purpose |
|---|---|---|
| `GITHUB_TOKEN` | Worker secret / `.dev.vars` | Contents API write auth (never in git; classic PAT `public_repo` targeting `GITHUB_REPO` — T43) |
| `GITHUB_REPO` | Worker `vars` | Target `owner/repo` — the dedicated `swiss-ai-survey-data` repo, not `swiss-ai-resource` (T43) |
| `GITHUB_BRANCH` | Worker `vars` | Commit branch (default `main`) |
| `GITHUB_AGGREGATES_PATH` | Worker `vars` | Committed file path |

## Scanner Worker (T33–T37)

Stateless website Quick-Check API. Code lives in [`workers/scanner/`](workers/scanner/). Check definitions: [`data/scanner-checks.json`](data/scanner-checks.json). Form UI is T36 (`/[lang]/website-check/`); UI strings + this deploy section are T37.

### Production status

| Item | Value |
|---|---|
| Worker | `https://api.aicompliant.ch` (`POST /scan`; `workers_dev` / `preview_urls` disabled) |
| Origin / CORS | `SITE_ORIGIN=https://aicompliant.ch` — POST/OPTIONS enforce Origin; ACAO only for allowlisted origin |
| Rate limit | `SCANNER_RATE_LIMITER` — 5 requests / 60s per IP (+ zone WAF rate rule on `api.aicompliant.ch`) |
| Bot gate | Turnstile (`TURNSTILE_SECRET_KEY` + `turnstile_token` on POST; action `website-scan`) |
| Body size cap | 8 KiB on `POST /scan` before JSON parsing — `413` over that (checked via `Content-Length` and a streamed cap in [`workers/scanner/src/body-limit.ts`](workers/scanner/src/body-limit.ts)) |
| Pages | `NEXT_PUBLIC_SCAN_API_URL` + `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set; UI live on [aicompliant.ch/de/website-check/](https://aicompliant.ch/de/website-check/) |

Prod smoke (API + **T41** browser + OPERATOR §8 2026-09-29): `POST /scan` with Turnstile + public URL → findings; missing Origin → `403`; missing/invalid Turnstile → `400`/`403`; UI on `/de/website-check/` renders severity-grouped findings with citations and disclaimer.

Together with the [survey Worker](#survey-worker-t23), both Workers are deployed; Pages env + Git `main` ship the UIs (including sitemap/robots/404 from the launch-hardening release).

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

3. Smoke-test (Worker only; no Next required). With Turnstile **test** secret in `.dev.vars`, include a dummy token:

   ```bash
   curl -s -X POST http://127.0.0.1:8787/scan \
     -H "Content-Type: application/json" \
     -H "Origin: https://aicompliant.ch" \
     -d "{\"url\":\"https://www.admin.ch\",\"turnstile_token\":\"XXXX.DUMMY.TOKEN.XXXX\"}"
   ```

   Expect `200` with `ok: true`, `findings[]`, and `static_scan_incomplete`. Omit `Origin` (or send a foreign one) → `403`. Omit `turnstile_token` → `400`. Or run:

   ```bash
   # Copy workers/scanner/.dev.vars.example → .dev.vars first (test Turnstile secret)
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
# Terminal A — Worker with CORS for Next (and Turnstile test secret in .dev.vars)
npx wrangler dev -c workers/scanner/wrangler.jsonc --var SITE_ORIGIN:http://localhost:3000

# Terminal B — Next (.env.local)
# NEXT_PUBLIC_SCAN_API_URL=http://127.0.0.1:8787
# NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
npm run dev
```

Open `http://localhost:3000/de/website-check/`. Submit a public `https://` URL → expect a severity-grouped findings report with legal citations and disclaimer. With empty `NEXT_PUBLIC_SCAN_API_URL`, the page shows an unavailable message and does not crash.

### Environment variables

| Name | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Pages / `.env` | Canonical site origin (`https://aicompliant.ch` in production) |
| `NEXT_PUBLIC_SCAN_API_URL` | Pages / `.env` | Scanner Worker base URL (prod: `https://api.aicompliant.ch`; local: `http://127.0.0.1:8787`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Pages / `.env` | Same Turnstile site key as survey (required for Quick-Check) |
| `TURNSTILE_SECRET_KEY` | Worker secret / `.dev.vars` | Siteverify secret (never in git; same value as survey Worker) |
| `SITE_ORIGIN` | Worker `vars` | Allowed browser Origin + CORS reflect value (required; default `https://aicompliant.ch`; www sibling also accepted; use `http://localhost:3000` for local form UI; missing → 500) |

Rate limiting uses the Workers Rate Limiting binding `SCANNER_RATE_LIMITER` (5 requests / 60s per IP) configured in [`workers/scanner/wrangler.jsonc`](workers/scanner/wrangler.jsonc) — no secret.

### HTML / CPU bounds (link checks)

Fetch still caps the response body at ~2 MB ([`fetch-target.ts`](workers/scanner/src/fetch-target.ts)), but anchor extraction must not run unbounded regex / string work over that body. [`workers/scanner/src/html.ts`](workers/scanner/src/html.ts):

| Bound | Value | Why |
|---|---|---|
| HTML slice scanned for `<a>` | First 512 KiB | Caps work even when the body is larger |
| Extracted anchors | 2000 | Link checks only need the first match |
| Open-tag attempts | 4000 | Floods of unclosed `<a` stay cheap |
| Max chars between `<a…>` and `</a>` | 8 KiB | Normal link text is far smaller |
| Pattern matching | Lowercase text/href/patterns once | Avoids `toLowerCase()` inside locale × pattern × anchor loops |

Closing tags are found with a bounded linear scan (not a lazy `[\s\S]*?</a>`), and pages with no `</a>` at all fast-reject. Redeploy the Worker after changing these helpers: `npm run deploy:scanner`.

### Scan budget (DoH + outbound fetches)

One wall-clock deadline covers the whole `POST /scan` network path (DoH, target GET, redirect hops, TLS HTTP→HTTPS probe, link HEAD verifies). [`workers/scanner/src/scan-budget.ts`](workers/scanner/src/scan-budget.ts):

| Bound | Value | Why |
|---|---|---|
| Shared AbortSignal | 8s from request start | Stops independent 8s timers stacking across fetch / HEAD / probe |
| DoH `fetch` | Same signal | Untimed Cloudflare DoH lookups cannot outlive the budget |
| DoH hostname memo | Per request (`Map`) | Redirects + link checks reuse A/AAAA answers for the same host |

A+AAAA lookups for one hostname run in parallel (still two subrequests, one RTT). Redeploy after changing these helpers: `npm run deploy:scanner`.

### Origin enforcement (POST / OPTIONS)

Both Workers share the same rule in [`workers/scanner/src/cors.ts`](workers/scanner/src/cors.ts) / [`workers/survey/src/cors.ts`](workers/survey/src/cors.ts):

| Request | Behavior |
|---|---|
| `Origin` = `SITE_ORIGIN` | Allowed; response includes `Access-Control-Allow-Origin` reflecting that Origin |
| `Origin` = www ↔ apex sibling of `SITE_ORIGIN` | Allowed (same scheme/port); ACAO reflects the **request** Origin |
| Missing or other `Origin` | **403** `{ "error": "Origin not allowed" }` with **no** CORS headers |

This stops browser cross-site POSTs and casual curl without `Origin`. Forged `Origin` from non-browser clients remains possible — rate limiting and Turnstile on survey **and** scanner cover volume abuse.

### Accepted residual risks (Workers)

| Risk | Decision |
|---|---|
| **DNS rebinding on scan targets** | `assertSafeScanUrl` validates DoH answers, then `fetch()` resolves the hostname again. A short-TTL attacker domain can pass validation and be fetched at a different address. On Workers there are no loopback services to reach, so practical impact is low. **Accepted** — document only; no TOCTOU pin of resolved IPs. |
| **Forgeable Origin from curl** | Origin checks are browser CSRF / casual-script controls, not proof of the site UI. Mitigated by per-IP rate limits + Turnstile on survey and scanner + survey daily hashed-IP cap (20) + zone WAF rate rules on `api.aicompliant.ch`. |

### Production checklist — completed

- [x] Confirm Worker `SITE_ORIGIN` is `https://aicompliant.ch` (no pages.dev fallback).
- [x] Deploy: `npm run deploy:scanner` → `https://api.aicompliant.ch/scan` (set scanner `TURNSTILE_SECRET_KEY` first).
- [x] Set Pages env `NEXT_PUBLIC_SCAN_API_URL` to `https://api.aicompliant.ch` (no trailing slash).
- [x] Smoke-test `POST /scan` (public URL + Turnstile token → findings; private IP → `400`; Origin `https://aicompliant.ch`; missing Origin → `403`).

Browser confirmation of `/de/website-check/` is **T41** (done 2026-09-18). Optionally burst past the rate limit and confirm `429`.

Redeploy: `npm run deploy:scanner`.
