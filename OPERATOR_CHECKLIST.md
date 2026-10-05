# Pre-traffic operator checklist — aicompliant.ch

**Status (2026-10-05): all items complete** (item 9, survey privacy rollout, done 2026-10-05). This file is the historical runbook for Cloudflare / GitHub / DNS / terminal steps that shipped launch hardening. Re-run individual sections when rotating secrets or re-verifying production.

**Related:** [DEPLOY.md](DEPLOY.md) (full deploy runbook) · repo [`Ivan-Laube/swiss-ai-resource`](https://github.com/Ivan-Laube/swiss-ai-resource)

### Progress tracker

| # | Task | Severity | Done |
|---|---|---|---|
| 1 | Revoke old survey PAT | Critical | [x] |
| 2 | Custom API hostname + WAF cutover | Critical | [x] |
| 3 | Turnstile widget hygiene | Critical | [x] |
| 4 | Observability + plan limits | Critical | [x] |
| 5 | DNS / email spoofing records | High | [x] |
| 6 | GitHub supply chain | High | [x] |
| 7 | Pages preview Access + HSTS preload | Medium | [x] |
| 8 | Post-deploy CSP / hydration smoke | Medium | [x] |
| 9 | Survey IP hash secret + migration `0003` | High | [x] |

---

## Prerequisites

- Cloudflare account with zone **aicompliant.ch** (DNS proxied).
- Logged into GitHub as owner of `Ivan-Laube/swiss-ai-resource` and `Ivan-Laube/swiss-ai-survey-data`.
- Local machine: Node 20+, `wrangler` via `npm ci`, Cloudflare auth (`npx wrangler whoami`).
- Production secrets you already have: Turnstile secret, classic PAT (`public_repo`) for `swiss-ai-survey-data` on the survey Worker.

---

## 1. Revoke old survey PAT (Critical)

**Why:** The old fine-grained PAT `swiss-ai-survey-aggregates` had Contents write on `swiss-ai-resource`. A leak can push to `main` and auto-deface the live Pages site. The Worker now writes only to `swiss-ai-survey-data` — confirm that works, then revoke the old token.

### 1.1 Confirm the Worker uses the data-repo PAT — DONE

Verified matching Cloudflare Worker secrets/vars and GitHub fine-grained PAT scope (`swiss-ai-survey-data` only, Contents R/W).

<details>
<summary>Original steps (completed)</summary>

1. Open [Cloudflare Dashboard → Workers & Pages → `swiss-ai-survey`](https://dash.cloudflare.com/).
2. Settings → Variables and Secrets → confirm `GITHUB_TOKEN` exists (secret; value not shown).
3. Settings → Variables → confirm non-secret vars:
   - `GITHUB_REPO` = `Ivan-Laube/swiss-ai-survey-data`
   - `GITHUB_BRANCH` = `main`
   - `GITHUB_AGGREGATES_PATH` = `survey-aggregates.json`
4. On GitHub → Settings → Developer settings → [Fine-grained personal access tokens](https://github.com/settings/personal-access-tokens):
   - Find **`swiss-ai-survey-data-aggregates`** (or whatever name you gave the T43 token).
   - Confirm it has access **only** to `Ivan-Laube/swiss-ai-survey-data`, permission **Contents: Read and write**.

</details>

### 1.2 Force one successful aggregates write — DONE

Verified 2026-09-28: `survey_aggregation_complete` with `"write":"unchanged"` (GitHub auth OK; file already matched). Weekly cron restored (`0 5 * * 1`).

<details>
<summary>Original diagnosis / steps (completed)</summary>

The data repo currently may only have the seed commit. You need at least one real write (or a no-op “unchanged” if content is identical — prefer a real update).

**Diagnosed (2026-09-28):** Cron *does* fire. Retention purge succeeds. Aggregate job fails with:

`GitHub file read failed: HTTP 403` / later `Bad credentials` (secret paste/newline). Fixed with classic PAT `public_repo` + User-Agent header + clean `wrangler secret put`.

Success log: `{"event":"survey_aggregation_complete","responses":1,"write":"unchanged"}`

</details>

### 1.3 Verify the data repo

1. Open [https://github.com/Ivan-Laube/swiss-ai-survey-data/commits/main](https://github.com/Ivan-Laube/swiss-ai-survey-data/commits/main).
2. Expect a commit message like `chore(survey): refresh anonymized aggregates` (or confirm logs said `unchanged` after a successful API round-trip).
3. Open `survey-aggregates.json` and confirm it is valid JSON with `survey_id`, `survey_version`, `n`, `questions`.

### 1.4 Revoke the old PAT — DONE

Revoked 2026-09-28. Active Worker auth is a classic PAT (`public_repo`) on `GITHUB_TOKEN` only.

<details>
<summary>Original steps (completed)</summary>

1. GitHub → Settings → Developer settings → Fine-grained personal access tokens.
2. Open **`swiss-ai-survey-aggregates`** (the T23f token that had access to `swiss-ai-resource`).
3. Click **Revoke**.
4. Confirm it no longer appears as active.
5. Tick DEPLOY.md T43 boxes (below).

</details>

**Done when:** Data-repo write verified; old PAT revoked; DEPLOY checkboxes ticked. ✓

---

## 2. Custom API hostname + WAF cutover (Critical)

**Why:** `*.workers.dev` is outside your zone — no WAF rate rules / Bot Fight Mode. Both Workers already declare routes for `api.aicompliant.ch`. You must attach DNS, deploy, migrate D1, point Pages env, add WAF, then disable `workers_dev`.

**Do not skip the order.** Wrong order can break the live survey / Quick-Check.

### 2.1 Create DNS for `api.aicompliant.ch` — DONE

Verified: AAAA `100::` proxied; `/submit` hits survey Worker; `/` may 522 (no route).

### 2.2 Put Turnstile secret on the scanner Worker — DONE

Operator confirmed `TURNSTILE_SECRET_KEY` on `swiss-ai-scanner`.

### 2.3 Apply D1 migration `0002` (daily quotas) — DONE

`submission_quotas` table present; no pending remote migrations.

### 2.4 Deploy both Workers (routes go live) — DONE

Routes bound: `api.aicompliant.ch/submit*` and `/scan*`. `workers_dev` still `true` until cutover.

### 2.5 Smoke the new host (before flipping Pages) — DONE

Hostname + Turnstile path verified (survey + website-check against `api.aicompliant.ch`; scanner secret corrected 2026-09-29).

<details>
<summary>Optional deeper smoke</summary>

You need a **real** Turnstile token from the live site (browser DevTools → Network → survey/scan request → `turnstile_token`).

```powershell
curl -s -D - -X POST https://api.aicompliant.ch/scan `
  -H "Origin: https://aicompliant.ch" `
  -H "Content-Type: application/json" `
  -d "{\"url\":\"https://www.admin.ch\",\"turnstile_token\":\"PASTE_REAL_TOKEN\"}"
```

- Missing / wrong `Origin` → **403**
- Valid Origin + Turnstile + public URL → scan **200** with `findings`

</details>

### 2.6 Point Pages env at the custom API — DONE

Operator set Production env URLs; empty commit `b665e4d` rebuilt Pages (CI + production deploy succeeded).

### 2.7 Add WAF rate-limiting rules — DONE

Free plan: one combined rule for `/scan` + `/submit` on `api.aicompliant.ch`.

### 2.8 Flip off `workers_dev` and clean CSP — DONE (Workers); Pages CSP pending push

`workers_dev: false` deployed for survey + scanner (deploy output no longer lists `*.workers.dev`; those hosts return plain 404). Custom routes still serve. Local `public/_headers` + `scripts/csp-hashes.ts` connect-src cleaned to api + Turnstile only — **push to `main` still needed** so production CSP drops legacy hosts.

**Browser smoke (your check):**

- [https://aicompliant.ch/de/survey/](https://aicompliant.ch/de/survey/) — Turnstile loads; submit once succeeds.
- [https://aicompliant.ch/de/website-check/](https://aicompliant.ch/de/website-check/) — Turnstile + scan of `https://www.admin.ch` returns findings.

**Done when:** API on `api.aicompliant.ch`, Pages points there, WAF on, `workers_dev` false, legacy CSP hosts gone from production. ✓ except final CSP commit if not yet pushed.

---

## 3. Turnstile widget hygiene (Critical) — DONE

Operator confirmed production widget hostnames are apex + www only (no localhost). Scanner Turnstile secret corrected; `GITHUB_TOKEN` rotated after accidental secret-name exposure.

---

## 4. Observability + plan limits (Critical)

**Why:** Free Workers limits (10 ms CPU, 50 subrequests, 100k req/day) can fail under scanner load. You need a paid plan (or confirmed headroom) and alerts before traffic spikes.

### 4.1 Confirm Workers plan — DONE

Upgraded to **Workers Paid** ($5/mo + usage) — scanner CPU/subrequest headroom OK for pre-traffic.

### 4.2 Confirm observability logs — DONE

Survey + scanner Observability show events (dashboard Refresh can lag/bug; Live / wait works). Explicit `observability.logs` enabled on both Workers.

### 4.3 Usage and billing alerts — DONE (best-effort)

Cloudflare “Real-Time Issue” create form only exposes name/description (no delivery destination) on this account — cannot Save. §4.3 accepted via Observability Live logs + plan awareness; revisit Notifications after CF UI/Paid if a destination picker appears.

---

## 5. DNS / email spoofing records (High) — DONE

**§5.1** SPF / DMARC / null MX / CAA live on Cloudflare.  
**§5.2 DNSSEC:** Enabled at Cloudflare; DS published at registrar — propagation in progress (2026-09-29). Re-check later with DNSViz / `dig +dnssec` when AD flag appears.

---

## 6. GitHub supply chain (High)

**Why:** Monthly workflow has write + `ANTHROPIC_API_KEY`. Default write for all workflows widens blast radius. Unprotected `main` + leaked PAT = site defacement.

Repo: [https://github.com/Ivan-Laube/swiss-ai-resource/settings](https://github.com/Ivan-Laube/swiss-ai-resource/settings)

### 6.1 Workflow permissions (default read-only) — DONE

### 6.2 Branch protection on `main` — DONE

Ruleset on default branch (`main`): Active; bypass Repository admin; Restrict deletions + Block force pushes. Status checks / required PRs deferred (GitHub Actions not available as bypass actor without a custom App).

### 6.3 Secret scanning + push protection — DONE

GitHub UI label may be **Secret protection** (includes scanning + push protection). Dependabot alerts/updates + secret protection enabled.

### 6.4 Confirm action SHA pins (already in repo) — N/A / already in repo

**Done when:** Default Actions perms are read-only; `main` protected; secret protection on; Dependabot enabled. ✓

---

## 7. Pages preview Access + HSTS preload (Medium)

### 7.1 Protect Pages preview deployments — DONE

Access app on `*.swiss-ai-resource.pages.dev` with Allow policy (email + OTP). Production `aicompliant.ch` not gated.

**Correction 2026-10-01:** previews were in fact public. On 2026-10-01, branch and commit preview URLs returned `200` without login, and the Pages project showed **Preview access → Restrict previews** (i.e. off).

**Re-done 2026-10-01** via **Workers & Pages → swiss-ai-resource → Settings → General → Preview access → Restrict previews**. That created the Zero Trust app "swiss-ai-resource - Cloudflare Pages":
- destination `*.swiss-ai-resource.pages.dev`;
- policy "Allow Members – Cloudflare Pages" (Cloudflare account members);
- login with One-time PIN.

Verified: `deps-security-bumps.…`, `23c8f167.…` and `redesign-foundation.…` return `302` to `misty-credit-a815.cloudflareaccess.com`. `swiss-ai-resource.pages.dev` (production alias) and `aicompliant.ch` return `200`.

Re-check with:

```bash
curl -s -o /dev/null -w "%{http_code}
" https://<branch>.swiss-ai-resource.pages.dev/
```

The expected result is `302`.

### 7.2 Submit HSTS preload — DONE

Submitted 2026-09-29: `aicompliant.ch` pending inclusion on the HSTS preload list. Revisit hstspreload.org over coming weeks.

**Done when:** Preview hostnames require Access; HSTS preload submission accepted. ✓

---

## 8. Post-deploy CSP / hydration smoke (Medium) — DONE

Verified 2026-09-29:
- Headers: HSTS preload, COOP/CORP `same-origin`, CSP `connect-src` includes `api.aicompliant.ch`, no `ACAO *`
- Survey hydration OK (radio sticks); Turnstile token present
- Website-check Turnstile ready
- `scripts/csp-hashes.ts` is on `main` (`postbuild`); after each Pages deploy, confirm `Content-Security-Policy` uses `sha256-...` (not only `'unsafe-inline'`) and that survey radios still hydrate

**Correction 2026-09-30:** the CSP check above was wrong.
- **Finding:** production served **no CSP at all**. The hashed header line was 6,182 characters, and Cloudflare Pages silently drops header values over 2,000.
- **Fix (merged in #13):** a per-page `<meta>` CSP plus a short header policy. See [DEPLOY.md](DEPLOY.md#security-headers-public_headers).
- **Verification is now automated:** `npm run check:live-headers`, and the **Live security headers** workflow, which runs after each push to `main`, daily, and on demand.
- **Manual header greps** like the one above can't see the per-page policy, so use the script instead.

---

## 9. Survey IP hash secret + migration `0003` (High) — DONE

Verified 2026-10-05: secret set (10:13 UTC) → Worker uploaded (10:14) → `0003` applied. `responses` has no `report_opt_in`; `report_signups` is `WITHOUT ROWID`; a live opt-in submit stored the signup as `2026-10-05` (Monday) and a 64-char keyed quota hash; test signup deleted.

**Why:** The survey Worker now stores the client IP for the daily cap as an HMAC keyed by a new secret, `IP_HASH_SECRET`. Before, it stored a plain SHA-256, which can be reversed for IPv4. Migration `0003` also removes the marker that let a survey answer be matched to its report email. Background: [DEPLOY.md → Unlinkability rollout](DEPLOY.md#unlinkability-rollout-migration-0003).

**Do not skip the order.** Without the secret, the new Worker rejects every survey submit (500). The old Worker breaks if the migration runs before the new one is deployed.

Do this after PR #51 is merged, from an up-to-date `main` checkout.

### 9.1 Set the secret

Generate a random value and pipe it straight into Wrangler, so it is never shown or saved:

```powershell
node -e "process.stdout.write(require('crypto').randomBytes(32).toString('base64'))" | npx wrangler secret put IP_HASH_SECRET -c workers/survey/wrangler.jsonc
```

You never need to read the value back. If it's lost, set a new one; that only resets today's submission counters.

**Check:** `npx wrangler secret list -c workers/survey/wrangler.jsonc` lists `IP_HASH_SECRET` next to `TURNSTILE_SECRET_KEY` and `GITHUB_TOKEN`.

### 9.2 Deploy the survey Worker

```powershell
npm run deploy:survey
```

### 9.3 Apply migration `0003`

```powershell
npx wrangler d1 migrations apply swiss-ai-survey --remote -c workers/survey/wrangler.jsonc
```

Wrangler lists `0003_unlinkable_signups.sql` as pending; confirm.

### 9.4 Check

```powershell
npx wrangler d1 execute swiss-ai-survey --remote -c workers/survey/wrangler.jsonc --command "PRAGMA table_info(responses);"
npx wrangler d1 execute swiss-ai-survey --remote -c workers/survey/wrangler.jsonc --command "SELECT created_at, COUNT(*) AS n FROM report_signups GROUP BY created_at;"
```

- `report_opt_in` is not in the first list.
- Every `created_at` in the second list is a Monday.
- Submit once on [aicompliant.ch/de/survey/](https://aicompliant.ch/de/survey/) with a throwaway email and the report box checked: you get the success message.
- Delete the test signup:

  ```powershell
  npx wrangler d1 execute swiss-ai-survey --remote -c workers/survey/wrangler.jsonc --command "DELETE FROM report_signups WHERE lower(email) = lower('your-test@example.com');"
  ```

**If the survey returns 500 after 9.2:** the secret is missing. Repeat 9.1; no redeploy needed.

**Rollback:** before 9.3, `npx wrangler rollback -c workers/survey/wrangler.jsonc` restores the previous Worker. After 9.3, don't roll back the Worker (the old one needs the dropped column); fix forward instead.

**Done when:** secret listed, migration applied, checks above pass. Then the Datenschutzerklärung §2.2/§2.3 wording can be updated (operator + lawyer, see PR #51).

---

## Quick reference — commands

```powershell
# Auth
npx wrangler whoami

# Secrets
npx wrangler secret put TURNSTILE_SECRET_KEY -c workers/scanner/wrangler.jsonc
npx wrangler secret put TURNSTILE_SECRET_KEY -c workers/survey/wrangler.jsonc
npx wrangler secret put GITHUB_TOKEN -c workers/survey/wrangler.jsonc
npx wrangler secret put IP_HASH_SECRET -c workers/survey/wrangler.jsonc   # set before deploy:survey (section 9)

# D1
npx wrangler d1 migrations apply swiss-ai-survey --remote -c workers/survey/wrangler.jsonc
npm run db:survey:local

# Deploy Workers
npm run deploy:survey
npm run deploy:scanner

# Build site locally (runs CSP hash postbuild)
npm run build
```

---

## After everything is green

1. Progress tracker above is fully checked (2026-09-29).
2. T43 boxes in [DEPLOY.md](DEPLOY.md#pat-scoped-to-a-dedicated-data-repo-t43) are checked.
3. Optional launch risk (not security): lawyer review of Impressum / Datenschutz (**T29**).
4. After each future production Pages deploy, re-run §8 CSP / hydration smoke (especially if `public/_headers` or `scripts/csp-hashes.ts` changed).
