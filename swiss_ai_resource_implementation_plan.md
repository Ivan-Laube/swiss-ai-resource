# Swiss AI deployment resource: implementation plan and architecture

Goal: a multilingual (DE/EN/FR/IT) resource site providing Swiss-specific AI deployment information for local companies. Built once, maintained by automation, differentiated by proprietary benchmark data and interactive decision tools. Solo-buildable, low ongoing time cost.

**Production host:** [https://aicompliant.ch](https://aicompliant.ch) on Cloudflare Pages (DNS + custom domain). Build-time site URL: `NEXT_PUBLIC_SITE_URL`. Worker `SITE_ORIGIN` is required (no silent `*.pages.dev` fallback); POST/OPTIONS enforce that Origin (plus www ↔ apex). Details: [DEPLOY.md](DEPLOY.md#production-host).

---

## 1. Scope of features

| Feature | Type | Maintenance model |
|---|---|---|
| Compliance/framework content (nDSG, EU AI Act applicability, sector guidance) | Static prose | Monthly change-check job |
| Vendor comparison table (hosting region, DPA terms, pricing, certifications) | Structured data | Automated monthly data refresh |
| Interactive decision tools (e.g. "Can I use this US-hosted LLM under nDSG?") | Client-side logic | Updated only when underlying rules change |
| Website compliance quick-check (visitor submits a URL, gets a heuristic first assessment against CH obligations) | Stateless Worker + client UI | Check definitions versioned in JSON; updated when underlying rules change |
| AI readiness self-check for KMU (12 scored questions → score, tier, top-3 next steps; plus a separate AI security initial assessment; printable) | Client-side logic, no data sent | Question set + scoring versioned in JSON; updated when underlying rules change |
| AI security guide for KMU (AI agents, prompt injection, AI-made fraud/deepfakes, incidents) | Static prose | Monthly change-check job; `volatility: fast` |
| Downloadable AI policy template (Word) | Markdown source → `.docx` generated at build | Edited as Markdown; DE canonical, translated by the pipeline |
| Swiss AI adoption survey + benchmark index | Data collection + annual report | Yearly cycle, rolling collection |
| Deployment cost benchmarks | Aggregated survey data | Same pipeline as survey |
| "Last verified" dates per page | Metadata | Written by the monthly job |
| Lawyer review badge on compliance pages | Editorial workflow | Per-page, on material changes only |
| Multilingual DE/EN/FR/IT | Content layer | DE canonical; EN/FR/IT pipeline-generated + reviewed |

---

## 2. Architecture overview

```
┌─────────────────────────────────────────────────────┐
│                     Cloudflare                       │
│  DNS · CDN · Pages (aicompliant.ch) · Workers        │
└─────────────────────────────────────────────────────┘
        │             │              │              │
   ┌────┴─────┐  ┌─────┴──────┐  ┌────┴───────┐  ┌───┴──────────┐
   │ Next.js  │  │ Decision   │  │ Website    │  │ Survey +     │
   │ static   │  │ tools      │  │ quick-check│  │ benchmarks   │
   │ site     │  │ (client JS)│  │ (stateless │  │ (Worker +    │
   │ (SSG)    │  │            │  │  Worker)   │  │  D1 SQLite)  │
   └────┬─────┘  └────────────┘  └────────────┘  └───┬──────────┘
        │                                            │
   ┌────┴────────────────────────────────────────────┴──┐
   │              Content repo (Git, single source)     │
│  /content/{de,en,fr,it}/*.md  (de = canonical)      │
│  /data/vendors.json  /data/rules/*.json            │
│  /data/survey-questions.json  /data/scanner-checks.json │
│  frontmatter: last_verified, reviewed_by, sources  │
   └──────┬─────────────────────────────────────────────┘
          │
   ┌──────┴─────────────────────────────────────────────┐
   │        Monthly maintenance job (GitHub Actions)      │
   │  1. Fetch tracked sources (regulator pages,          │
   │     vendor docs/DPAs)                                │
   │  2. Diff against stored snapshots                    │
   │  3. LLM classifies diffs: cosmetic / material        │
   │  4. Material → GitHub issue + draft PR for review    │
   │  5. Unchanged only → bump last_verified, auto-merge  │
   └─────────────────────────────────────────────────────┘
```

Everything static where possible. The only server-side components are the website quick-check scanner (a stateless Cloudflare Worker, no storage) and the survey intake + benchmark aggregation (a Cloudflare Worker + D1 database). No user accounts, no CMS server to maintain.

### Stack choices and rationale

- **Next.js (SSG mode) on Cloudflare Pages** at `aicompliant.ch`. You already use Next.js for Intriga and Cloudflare DNS for RightRanked. Static export means zero runtime cost and nothing to patch. Rebuild triggered by Git push. Canonical URLs use `NEXT_PUBLIC_SITE_URL`; survey/scanner Workers require `SITE_ORIGIN`, reject POST/OPTIONS with a missing or foreign `Origin`, and fail closed if `SITE_ORIGIN` is unset.
- **Content as Markdown in Git.** No CMS. Frontmatter carries `last_verified`, `reviewed_by`, `review_date`, `sources[]`, `volatility` (stable / moderate / fast). Git history is the audit trail, which matters if a lawyer's name is attached to a page.
- **Vendor data as JSON, not prose.** `vendors.json` holds one record per provider: hosting regions, DPA link, data-training opt-out, certifications (ISO 27001, SOC 2), pricing tier, Swiss/EU entity yes/no, source URLs, `last_checked`. The site renders it as a filterable table. The monthly job refreshes fields, not paragraphs.
- **Decision tools as pure client-side JSON-driven logic.** Each tool is a decision tree defined in `/data/rules/*.json` (questions, branches, outcomes with caveats and source links). One generic React component renders any tree. Adding a new tool = adding a JSON file. No backend, no liability-heavy "advice engine", every outcome links to the underlying rule text.
- **Survey via Cloudflare Worker + D1.** A single POST endpoint, honeypot + Turnstile for spam, no personal data beyond optional email. Emails go in a standalone `report_signups` table (own id, **no FK** to `responses`) so they cannot be joined back to answers; weekly cron purges both tables after 24 months and writes anonymized aggregates back to the content repo as JSON, so benchmark pages stay static. On-request deletion is `DELETE FROM report_signups WHERE email = …` (see [DEPLOY.md](DEPLOY.md#email-retention-and-deletion)).
- **Website quick-check as a stateless Worker + heuristic checks JSON.** The browser cannot fetch third-party sites (CORS), so a Cloudflare Worker fetches the submitted URL's HTML and headers, runs deterministic checks defined in `/data/scanner-checks.json` (same versioned-JSON pattern as the decision trees), and returns findings without storing anything. Findings are facts with statuses `found / not_found / indeterminate` — never "compliant/non-compliant" — and every check carries its legal basis (Art. 19 nDSG, Art. 3 Abs. 1 lit. s UWG, Art. 45c FMG, Art. 16 nDSG) plus a link to the relevant cornerstone page. Per-IP rate limiting, SSRF guards (scheme allowlist, private-IP blocking, size/timeout caps), one 8s wall-clock scan budget for DoH + all outbound fetches (hostname DoH memoized per request), HTML parse caps in `workers/scanner/src/html.ts` (512 KiB slice, 2000 anchors, one-shot lowercasing) against adversarial CPU burn, `Origin` header enforced against `SITE_ORIGIN` (CORS headers only for allowlisted origins — not a substitute for auth). DNS-rebinding between DoH check and `fetch` is an accepted residual risk on Workers (no loopback services to reach).

---

## 3. Content model

### Compliance content (stable tier)
- ~10-15 cornerstone pages: nDSG basics for AI, US-hosted LLMs and adequacy, EU AI Act reach for Swiss exporters, FINMA expectations, healthcare/insurance specifics, procurement checklist.
- **Shipped in T6 (DE):** `ndsg-ai-basics`, `us-hosted-llms-ndsg`, `eu-ai-act-swiss-exporters`, `finma-ai-expectations`, `ai-procurement-checklist`. Healthcare/insurance remains a later, demand-driven page.
- The EU AI Act page tracks both the original Regulation (EU) 2024/1689 high-risk dates and the Digital Omnibus on AI (Council final green light 29 June 2026; pending Official Journal publication) — Annex III → 2 Dec 2027, Annex I → 2 Aug 2028.
- The procurement checklist includes a short competence section (Art. 4 AI literacy + FINMA training expectations), naming the freely licensed AI Fluency 4D framework as one example. A full **KI-Kompetenz** page is a strong T30 candidate if demand appears.
- Written once in German, translated to EN/FR/IT (LLM draft, human pass; legal terms mapped via official Fedlex texts for FR/IT).
- Each page ends with sources and `last_verified` date rendered visibly.

### Legal pages (Impressum / Datenschutzerklärung)

Required for a customer-facing launch (Art. 3 Abs. 1 lit. s UWG; Art. 19 DSG). The site’s own Quick-Check also flags missing impressum / privacy links.

- **Shipped in T39:** `impressum` and `datenschutz` in DE/EN/FR/IT under [`content/`](content/). Linked from [`SiteFooter`](src/components/SiteFooter.tsx) on every locale page; Datenschutzerklärung also linked from the survey form (email/opt-in). Datenschutz describes unlinkable D1 storage (`responses` vs `report_signups`, no shared key), 24-month retention, and email deletion via the contact address.
- **Shipped in T40:** natural-person operator details (name, street, PLZ/Ort, email as `mailto:`) filled in all four locales; phone, Rechtsform, Vertretung, and Handelsregister/UID omitted as not applicable. Public contact for `report_signups` deletion: `i.laube@gmail.com`. Lawyer review of the filled text remains **T29**.
- Conventions: [content/README.md](content/README.md#legal-pages).

### Vendor table (fast tier)
- Start with 15-20 vendors relevant to Swiss SMEs (OpenAI, Anthropic, Google, Microsoft/Azure, Mistral, Aleph Alpha, AWS Bedrock, Swisscom AI offerings, local hosts like Infomaniak).
- Filterable by: Swiss hosting, EU hosting, DPA available, training opt-out, sector certifications.
- Every cell has a source URL. Cells without a verifiable source display "unverified", never a guess.

### Decision tools (start with 2)
1. "Can I use this US-hosted LLM under nDSG?" (data category → contractual safeguards → outcome with caveats)
2. "Does the EU AI Act apply to my Swiss company?" (market exposure → system risk class → obligations timeline)

### AI readiness self-check (v1, neutral)
Draft question set, scoring model and decisions: [docs/ai-readiness-check-draft.md](docs/ai-readiness-check-draft.md).

- 3 unscored profile questions (company size, AI usage stage, FINMA supervision) reusing survey option IDs, plus 12 scored questions in 6 dimensions; each answer 0/1/2, four questions allow N/A.
- Score 0–100 over applicable questions; tiers Getting started (0–39) / In progress (40–74) / Well set up (75–100); DE Am Anfang / Im Aufbau / Gut aufgestellt.
- **Red flags** (Q3 free/personal accounts for sensitive data, Q8 AI decisions about people without human review, Q10 EU exposure unchecked) cap the tier at In progress. When the cap lowers the tier, the result explains why, naming the answer; the score stays visible.
- Top-3 next steps ranked by severity × gap, red flags first, each linking to an existing guide or tool.
- Optional benchmark lines from `survey-aggregates.json` (same n<5 suppression as `/benchmark`).
- **AI security: initial assessment (separate result):** 3 questions, not part of the main score or tier, clearly labelled as an initial assessment and not a full security review. S1 what AI tools can access and do (agents), S2 outside content and traceability (prompt injection; only shown if S1 ≠ N/A), S3 second-channel verification of payment/data requests (AI phishing, deepfakes; shown to everyone). Result: status per risk area (covered / partly / gap / not relevant) plus an overall risk level High (any 0) / Medium (no 0, any 1) / Low (all 2), its own next steps linking to the AI security guide, and an always-visible note on what is not assessed (general IT security, providers, technical testing) pointing to BACS/NCSC guidance. With a High level, the first security gap also enters the main top 3 after red flags. AI add-ons (browser extensions, plug-ins, connectors) are covered by Q2 tool approval.
- **Printable result:** "Print or save as PDF" via a print stylesheet (no server, no PDF library). Includes an optional company name (only printed), date, question set version, all answers, all next steps with full URLs, the security assessment and the disclaimer. Answers live in memory only; the page says so at the start and next to the print button (closing or reloading clears them).
- Scoring runs entirely in the browser; nothing is stored or sent. Disclaimer before and after: orientation, not legal advice or certification.
- **No partners, referrals or "send my result" in v1** (see §9). Prerequisites for adding them later are listed in the draft (§8).

### AI policy template (download)
Drafts: [docs/ai-policy-template-de.md](docs/ai-policy-template-de.md) (canonical), [docs/ai-policy-template-en.md](docs/ai-policy-template-en.md).

- Fill-in template for KMU: scope, principles, approved tools, green/yellow/red data levels, using results, transparency, prohibited uses, responsibilities, training, incidents, review; acknowledgement block and AI tool register annex. `[Placeholders]` in square brackets.
- **Delivered as an editable Word file (`.docx`), generated from the Markdown at build time.** Markdown stays the single source; no `.docx` is committed. Must run on the Cloudflare Pages build image (no pandoc), i.e. a Node converter (e.g. `docx` + the existing `marked` lexer) in `prebuild`, writing to a gitignored `public/downloads/` so the static export copies it to `out/`. Placeholders highlighted in Word; build fails if conversion fails.
- Linked from check Q5 and from the relevant guides (`ndsg-ai-basics`, `ai-procurement-checklist`, `ai-security-risks`).
- Covers the security section too: add-ons count as tools needing approval, AI agents get only the access they need with confirmation for irreversible actions, and unusual payment/data requests are verified through a second channel.

### AI security guide (`ai-security-risks`)
Working title DE: *KI und Cybersicherheit für KMU*. Cornerstone-style page (DE canonical, normal frontmatter, sources, `last_verified`), linked from check S1–S3 and the policy template.

- **Scope:** risks from the company's own AI use (agents with too much access, prompt injection via emails/web pages/documents, data leaking through connectors and add-ons, unchecked AI-generated code) and AI-made attacks from outside (phishing, voice/video deepfakes, CEO fraud). Practical safeguards a KMU can apply without a security team.
- **When something goes wrong:** what to do after an AI-related incident, including the nDSG Art. 24 breach report to the FDPIC/EDÖB and reporting cyberattacks to BACS/NCSC. This is also the incident guidance that check Q12 links to (T52 merged here).
- **Legal anchors:** nDSG Art. 8 + DSV Art. 1–6 (data security), Art. 24 (breach notification); EU AI Act Art. 15 for high-risk systems where in scope; reporting duty for critical infrastructure under the Information Security Act only where relevant.
- **Sources** tracked in `sources.json` for the monthly job: BACS/NCSC guidance, OWASP Top 10 for LLM applications and its agentic AI guidance, ENISA. Marked `volatility: fast`.
- **Tone:** concrete and calm, no alarmism and no vendor names, consistent with the rest of the site.

### Deep links to guide sections (all tools)
When a tool, check result or scanner finding points to a guide, it links to the **section** that answers the question (`/de/ndsg-ai-basics/#transparenz`), not the top of the page. Applies to the AI readiness check, the existing decision trees, the website quick-check and the policy template.

- **Stable anchors.** Today heading ids are generated from the heading text ([`src/lib/markdown.ts`](src/lib/markdown.ts)), so they differ per language and change when a heading is reworded. Sections that are link targets get an explicit, language-independent anchor in the DE source: `## Transparenz und Information {#transparenz}`. The renderer uses the explicit id (and strips the marker); headings without one keep the generated id.
- **Translation keeps anchors.** The translation pipeline must carry `{#…}` markers over unchanged, and its verification fails if a translated page's anchor set differs from DE. Since translations are regenerated only after a DE change merges, the cross-locale comparison (`check:anchors`) warns on PRs and is strict in the translate workflow.
- **Validated references.** Data files reference sections as `slug#anchor`. Validators (`check:rules`, `check:scanner`, `check:content`) fail if the page or the anchor is missing in DE, so a renamed or deleted section can't silently break links. Other locales follow DE through the translate workflow (strict `check:anchors`), so a PR that adds an anchor and a link to it in one go is not blocked by translation lag.
- **Landing.** The target heading isn't hidden under the sticky header (`scroll-margin-top`) and is briefly highlighted (`:target`) so the reader sees where they landed. Respects `prefers-reduced-motion`.
- **Granularity.** Anchors on h2/h3 only. If no section matches a question, add a section to the guide rather than linking to a near miss.

### Website quick-check (v1 checks, all deterministic)

Defined in `/data/scanner-checks.json` (Zod-validated like the other data files). Each check carries `id`, `legal_basis` (article + Fedlex/source URL), `severity`, `related_page` (cornerstone slug), and detection patterns per language:

1. **HTTPS** — reachable over TLS, HTTP redirects to HTTPS (Art. 8 nDSG data security, informational)
2. **Privacy policy link** — keyword/anchor detection in DE/EN/FR/IT, plus a HEAD request confirming the link resolves (Art. 19 nDSG)
3. **Impressum / provider identification** — link detection: Impressum, Legal notice, Mentions légales, Note legali (Art. 3 Abs. 1 lit. s UWG)
4. **Cookie consent tooling** — known CMP script signatures: Cookiebot, OneTrust, Usercentrics, iubenda, Borlabs, CookieYes, consentmanager (Art. 45c FMG)
5. **Third-party trackers implying data export** — GA4/gtag, GTM, Meta Pixel, LinkedIn Insight, Hotjar, TikTok signatures; Google Fonts / US CDN loads (Art. 16 nDSG cross-border transfers)
6. **Security headers** — HSTS, CSP, X-Content-Type-Options presence (informational)
7. **Static-scan honesty flag** — if GTM or an SPA framework shell is detected, the report states that dynamically injected scripts cannot be seen by a static scan and results may be incomplete

Liability framing (non-negotiable): the tool is titled "Quick-Check" / "Erste Einschätzung", never "Compliance-Prüfung". Findings are phrased as facts ("No link matching 'Datenschutz' was found — Art. 19 nDSG requires…"), statuses are `found / not_found / indeterminate`, and every result page carries the informational-not-legal-advice disclaimer. The report component reserves a section slot for a future LLM policy-content pass (renders nothing in v1).

### Survey and benchmarks

Instrument: [`data/survey-questions.json`](data/survey-questions.json) (T22, **version 2**, 12 questions, ~5 minutes, DE/EN/FR/IT). Validated via `npm run check:survey` / `@/survey`.

| Question id | Type | What it captures |
|---|---|---|
| `company-size` | single | FTE bands aligned with BFS/EU SME thresholds |
| `sector` | single | Industry incl. Bau, Tourismus, Logistik, public admin |
| `language-region` | single | Deutschschweiz / Romandie / Tessin / multilingual |
| `ai-maturity` | single | not-using → exploring → piloting → production |
| `ai-tools` | multi | Named tools (incl. DeepL, M365 Copilot) + Swiss/EU host + OSS; `none` exclusive in T24 |
| `primary-use-cases` | multi | Incl. translation and sales (CH multilingual pattern) |
| `monthly-spend-chf` | single | CHF bands; licenses/API/cloud only (no staff time) |
| `hosting-requirement` | single | CH only / CH or EU-EEA / any / undecided |
| `personal-data-in-ai` | single | Personendaten with AI (DSG context) |
| `eu-market-exposure` | single | Offers AI to EU market/users (AI Act reach) |
| `deployment-blockers` | multi | Incl. integration, management buy-in; `none` exclusive in T24 |
| `vendor-decision-factors` | multi | Incl. Swiss entity / local support, national-language contracts |

Optional email, report opt-in, honeypot, and Turnstile are form chrome (T23/T24), not survey questions. Optional emails are stored in D1 `report_signups` with a separate id and **no foreign key** to `responses` (unlinkable from answers); see [`workers/survey/migrations/0001_init.sql`](workers/survey/migrations/0001_init.sql) and [DEPLOY.md](DEPLOY.md#email-retention-and-deletion).

- Incentive: respondents get the benchmark report first, plus a personal comparison ("your spend vs. your size band") generated client-side from published aggregates.
- Publication threshold: no aggregate published for any cell with n < 5. Report published annually; rolling teaser stats ("n companies surveyed so far") on the page.

---

## 4. The monthly maintenance job (detail)

GitHub Actions, cron monthly. Steps:

1. **Source registry.** `/data/sources.json` lists every tracked URL (EDÖB pages, EU AI Act official texts and guidance, FINMA circulars, each vendor's DPA/trust page) with a CSS/text selector and the content pages that depend on it.
2. **Fetch + snapshot.** Download each source, store normalized text snapshot in the repo (`/snapshots/`). Diff against previous snapshot.
3. **Classify.** LLM call per diff: cosmetic (typos, layout) vs. material (obligation, date, term, price changed). Prompt includes the dependent page's summary so classification is contextual.
4. **Act.**
   - Unchanged (empty diff) → bump `last_verified` on dependent pages, auto-commit. Cosmetic diffs do **not** bump (avoids prompt-injection false freshness).
   - Material → open a GitHub issue with the diff, the affected pages, and a drafted content edit as a PR. You review and merge. Nothing material publishes without your eyes on it.
5. **Vendor JSON refresh.** For vendor fields, the job attempts structured extraction (hosting regions, cert lists) from the fetched pages and updates `vendors.json` in the same PR-for-review pattern for material changes.
6. **Dead link check** across all published pages, monthly, same run.
7. **Build gate.** `npm run build` runs after validators and **before** any commit/push to `main`, so a broken static export cannot land from this job alone. The same gate exists on the DE-merge translate workflow. Separately, [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs typecheck, lint, offline `check:*` validators, and `npm run build` on every PR and every push to `main`. Material review PRs also need the repo setting **Allow GitHub Actions to create and approve pull requests** (otherwise `gh pr create` 403s). See [DEPLOY.md](DEPLOY.md#continuous-integration).

Expected steady-state cost to you: 30-60 minutes/month reviewing PRs, plus occasional larger edits when regulation actually moves (AI Act milestones are known in advance, so these are plannable).

---

## 5. Lawyer review workflow

- Applies only to the compliance tier (not vendor table, not benchmarks).
- Frontmatter: `reviewed_by`, `review_date`, `review_scope` (which version/commit was reviewed).
- Badge renders only if `review_date` is within 12 months and no material change has occurred since the reviewed commit (the monthly job clears the badge automatically when it merges a material change, re-review restores it).
- Offer: attribution + backlink to the lawyer's practice in exchange for review. One name is enough at launch.
- Disclaimer on every compliance page: informational, not legal advice, in both languages. Non-negotiable regardless of review status.

---

## 6. Multilingual approach (DE / EN / FR / IT)

- German is the source of truth for compliance content (largest SME segment, and it raises the copying bar).
- EN, FR, and IT generated per page via LLM in the build pipeline, each flagged `translation_status: draft` until a human pass. Draft translations still publish, with a small "translated" note per language.
- FR and IT need particular care on legal terminology: Swiss law exists officially in all three national languages (DSG = LPD in both French and Italian), so the pipeline should map legal terms against the official multilingual texts on Fedlex rather than free-translating them. English has no official Swiss legal text, so EN uses conventional translations with the German term in parentheses on first use.
- Human review priority when time is constrained: DE (canonical) > FR (second-largest market) > IT > EN. EN readers are the most tolerant of draft-quality translation in this domain.
- Vendor table and decision tools are data-driven, so translation is a strings file per language, not duplicated content.
- URL structure: `/de/...`, `/en/...`, `/fr/...`, `/it/...`, hreflang tags, DE default.
- Content-page hreflang alternates are limited to locales that actually have the slug (`buildLanguageAlternates(path, localesWithSlug(slug))`). After T14, the five cornerstone slugs emit all four locales; never advertise 404 targets for missing translations.
- Build-time [`src/app/sitemap.ts`](src/app/sitemap.ts) / [`src/app/robots.ts`](src/app/robots.ts) emit `sitemap.xml` and `robots.txt` into the static export (`NEXT_PUBLIC_SITE_URL` base; trailing slashes; all four locales × homes, guides index, content, tools, vendors, survey, benchmark, website-check). Sitemap hreflang mirrors page metadata; bare `/` is omitted (redirects to `/de/`). [`src/app/global-not-found.tsx`](src/app/global-not-found.tsx) emits `404.html` (**R1A**; `experimental.globalNotFound`; pathname-based locale chrome via [`NotFoundView`](src/components/NotFoundView.tsx); early inline script sets `<html lang>` from the path when it is a known locale; Cloudflare Pages serves it for unknown paths with no extra config). Locale pages set `<html lang>` from the `[lang]` root layout; `/` uses the `(root)` route-group layout. Guides index UI: [`/[lang]/guides/`](src/app/[lang]/guides/page.tsx) (**R19** in [website_redesign_plan.md](website_redesign_plan.md)).
- Lawyer review applies to the DE canonical text only; translated compliance pages carry a note that the reviewed version is the German one.

---

## 7. Build plan (with dependencies)

Task IDs are referenced in the "Depends on" column. Tasks with no dependency can start immediately or in parallel.

### Phase 1, foundation (weeks 1-2)

| ID | Task | Depends on | Status |
|---|---|---|---|
| T1 | Repo setup, Next.js SSG skeleton, Cloudflare Pages deploy | — | Done |
| T2 | Language routing `/de /en /fr /it`, hreflang, strings-file i18n scaffold | T1 | Done |
| T3 | Content schema: frontmatter spec (`last_verified`, `reviewed_by`, `translation_status`, `volatility`, `sources[]`) — see [content/README.md](content/README.md) | — | Done |
| T4 | Vendor JSON schema — see [data/README.md](data/README.md) | — | Done |
| T5 | Source registry schema (`sources.json`) — see [data/README.md](data/README.md) | — | Done |
| T6 | Write 4-5 cornerstone compliance pages in German | T3 | Done |
| T7 | Fedlex legal-term glossary (DE↔FR↔IT term map for nDSG/LPD, AI Act terms) | — | Done |

### Phase 2, differentiators (weeks 3-4)

| ID | Task | Depends on | Status |
|---|---|---|---|
| T8 | Decision tree JSON format + generic renderer component — see [data/README.md](data/README.md) | T1, T3 | Done |
| T9 | Launch tool 1: US-hosted LLM under nDSG | T8, T6 (cites cornerstone pages) | Done |
| T10 | Launch tool 2: EU AI Act applicability | T8, T6 | Done |
| T11 | Vendor research: first 15 vendors, sourced | T4 | Done |
| T12 | Vendor table UI (filterable, `last_checked` per row, "unverified" cells) | T4, T2 | Done |
| T13 | Translation pipeline: LLM draft EN/FR/IT on DE change, glossary-constrained for FR/IT, `translation_status` flagging | T2, T3, T7 | Done |
| T14 | Translate cornerstone pages + tool/table strings to EN/FR/IT | T13, T6, T9, T10, T12 | Done |

### Phase 3, automation (weeks 5-6)

| ID | Task | Depends on | Status |
|---|---|---|---|
| T15 | Monthly job: fetch + snapshot tracked sources | T5 | Done |
| T16 | Diff + LLM classification (cosmetic vs material) | T15 | Done |
| T17 | PR/issue workflow for material changes; auto-bump `last_verified` only on unchanged sources (not cosmetic); clear review badge on material merge; monthly job runs `npm run build` before push | T16, T3 | Done |
| T18 | Vendor JSON field refresh within the same job | T16, T11 | Done |
| T19 | Translation regeneration trigger on DE content merge (`check:content` + `npm run build` before bot commit; dispatch/step values via `env:`; actions pinned by SHA) | T17, T13 | Done |
| T20 | `last_verified` visible rendering on pages | T3, T1 | Done |
| T21 | Dead link checker in monthly run | T15 | Done |
| T38 | Snapshot fetch resilience for bot-blocked sources (e.g. OpenAI HTTP 403): bot/browser retry, HTTP 202 cookie retry, alternate URLs, JSON/PDF/HTML seedable snapshots, persistent failure brief/issues; seven failing sources from 2026-07-16 now have live recovery paths or seeded EUR-Lex baselines | T15, T18 | Done |

### Phase 4, data engine (weeks 7-8)

| ID | Task | Depends on | Status |
|---|---|---|---|
| T22 | Survey design: 12 questions (v2), DE first, translated — see [`data/survey-questions.json`](data/survey-questions.json) | T13 (for translations only; drafting has no dependency) | Done |
| T23 | Survey Worker + D1 + Turnstile intake endpoint (prod: T23a–T23d; secret hygiene T23e/T23f) | T1 | Done |
| T23a | Create remote D1 `swiss-ai-survey`, set `database_id`, apply migrations | T23 | Done |
| T23b | Create Turnstile widget (domains include `aicompliant.ch`); Pages site key + Worker secret | T23 | Done |
| T23c | Deploy Worker; confirm `SITE_ORIGIN=https://aicompliant.ch` + set `NEXT_PUBLIC_SURVEY_API_URL` | T23a, T23b | Done |
| T23d | Production smoke-test of `POST /submit` + unlinkable `report_signups` (no FK to `responses`) | T23c | Done |
| T23e | Rotate production Turnstile secret (and site key if widget replaced) before public survey launch — see [DEPLOY.md](DEPLOY.md#pre-launch-secret-hygiene-t23e--t23f) | T23b, T23d | Done |
| T23f | Replace Worker `GITHUB_TOKEN` with fine-grained PAT (Contents R/W, this repo only) — later superseded by T43 classic PAT on data repo — see [DEPLOY.md](DEPLOY.md#pre-launch-secret-hygiene-t23e--t23f) | T23c | Done |
| T24 | Survey form page (4 languages) | T22, T23, T2 | Done |
| T25 | Aggregation job with n<5 suppression, aggregates written to repo as JSON | T23 | Done |
| T26 | Benchmark page rendering from aggregates, client-side "your band vs median" comparison | T25, T1 | Done |
| T43 | Scope survey Worker `GITHUB_TOKEN` to a dedicated data-only repo (`swiss-ai-survey-data`) instead of `swiss-ai-resource`, so a leaked PAT can't touch published site content — see [DEPLOY.md](DEPLOY.md#pat-scoped-to-a-dedicated-data-repo-t43) | T23f, T25 | Done |
| T27 | Survey launch via LinkedIn + Swiss SME/startup communities | T24, T23e, T23f, T40, T41 | |
| T28 | Benchmark report (ships when n reaches 30-50, not on a fixed date) | T25, T27 |

### Phase 5, website quick-check (independent; any time after T1/T2)

First server-side component of the project. The Worker is stateless (no storage in v1) and built so the T23 survey Worker can later live alongside it.

| ID | Task | Depends on | Status |
|---|---|---|---|
| T32 | Check definitions: `data/scanner-checks.json`, `src/scanner/schema.ts` (Zod), `scripts/check-scanner.ts` validator | T3 (pattern), T6 (cornerstone slugs to cite) | Done |
| T33 | Worker scaffold `workers/scanner/`: `wrangler.jsonc`, POST `/scan` endpoint, `SITE_ORIGIN` required (production `https://aicompliant.ch`) with Origin enforcement on POST/OPTIONS + CORS reflect, per-IP rate limiting (Workers Rate Limiting binding) | T1 | Done |
| T34 | URL guards: scheme allowlist (http/https), private-IP/localhost blocking, response size cap (~2 MB), shared 8s scan budget (DoH AbortSignal + per-request hostname memo; fetch/HEAD/probe share one deadline) | T33 | Done |
| T35 | Heuristic engine: fetch target HTML + headers, run all checks, HEAD-verify policy/impressum links, emit findings JSON; HTML helpers cap slice/anchors and lowercase once (CPU hardening) | T32, T33, T34 | Done |
| T36 | Frontend page `/[lang]/website-check/`: URL form, loading state, findings report grouped by severity with legal citations, disclaimer, static-scan caveat, reserved LLM slot. Client form must import `@/rules/schema` (not `@/rules`) so static export stays free of `node:fs` | T35, T2 | Done |
| T37 | DE/EN/FR/IT strings for the tool; Worker deploy steps + `NEXT_PUBLIC_SCAN_API_URL` in DEPLOY.md | T36, T13 (translations only) | Done |
| T37b | Deploy scanner Worker + set Pages `NEXT_PUBLIC_SCAN_API_URL`; Worker smoke-test | T37 | Done |

Post-MVP, demand-driven (not built now):

- **Anonymized aggregate counters in D1** (per-check found/not-found tallies, no URLs stored) — feeds future benchmark content like "x% of scanned Swiss sites lack a privacy policy"
- Browser Rendering (headless Chrome) second pass for accurate tracker/banner detection on JS-heavy sites
- Optional LLM policy-content reader filling the reserved report slot (assesses Art. 19 disclosure coverage)

**Already shipped beyond original MVP notes:** Turnstile on `/scan` (same widget as survey), shared siteverify helper, zone WAF rate rule on `api.aicompliant.ch`, `workers_dev` disabled.

### Phase 6, AI readiness check + policy template + AI security guide

| ID | Task | Depends on | Status |
|---|---|---|---|
| T45 | Finalise check question set + scoring model incl. security section S1–S3 (DE canonical, EN draft) from [docs/ai-readiness-check-draft.md](docs/ai-readiness-check-draft.md); open questions settled 2026-10-02; final wording sign-off | — | In review |
| T46 | `data/rules/ai-readiness.json` (links as `slug#anchor`) + Zod schema for a scored questionnaire (dimensions, 0/1/2 options, N/A, conditional questions, severity, red flags, separate security assessment section with per-area status, actions, links); validated by `check:rules` | T45, T8, T58 | |
| T47 | Check page `/[lang]/tools/ai-readiness/`: client-only scoring, tiers, red-flag cap with explanation, top-3 actions + "show all" (incl. top security gap when High), security initial-assessment block below the main result, print view, disclaimer; no network calls | T46, T2, T53 (link target) | |
| T48 | Benchmark lines on the result from survey aggregates (size bucket when n ≥ 5, else overall) + survey invitation | T47, T25 | |
| T49 | AI policy template source moved to `content/templates/ai-policy/{de,en}.md`; FR/IT via the translation pipeline (glossary-constrained) | T13 | |
| T50 | Build-time Markdown → Word (`.docx`) generation in `prebuild` (Node converter, no pandoc), output gitignored under `public/downloads/`, placeholders highlighted, build fails on error; download links from Q5 and guides | T49 | |
| T51 | DE/EN/FR/IT strings for the check page | T47, T13 | |
| T52 | Incident-handling guidance for check Q12 | T53 | Merged into T53 |
| T53 | AI security guide `ai-security-risks` (DE canonical): agents, prompt injection, add-ons/connectors, AI-made fraud and deepfakes, incident steps (link target for check Q12); frontmatter `volatility: fast`, sources cited | T3, T6 (pattern), T54 | |
| T54 | Add AI security sources to `sources.json` (BACS/NCSC, OWASP LLM Top 10 + agentic AI guidance, ENISA) so the monthly job tracks them | T5 | |
| T55 | Translate the AI security guide EN/FR/IT via the pipeline | T53, T13 | |

### Cross-cutting: deep links to guide sections

| ID | Task | Depends on | Status |
|---|---|---|---|
| T56 | Explicit heading anchors `{#id}` in content Markdown: renderer support (explicit id wins, marker stripped, reserved-id and duplicate checks), TOC uses the same ids, `scroll-margin-top` + `:target` highlight — see [content/README.md](content/README.md#section-anchors-t56) | T3 | Done |
| T57 | Translation pipeline preserves `{#id}` markers: prompt rule, restore by heading position, write-time check; `check:anchors` (warn on PRs, `--strict` in the translate workflow) — see [content/README.md](content/README.md#generated-frontmatter-rules) | T56, T13 | Done |
| T58 | `slug#anchor` references in data files (readiness check, decision trees, scanner checks); validators fail on a missing page or anchor in DE (other locales via T57) | T56 | |
| T59 | Retrofit: add anchors to the existing guides' sections that tools cite and switch existing tool/scanner links to section links where a specific section fits | T56, T58 | |

### Post-launch / parallel (no phase)

| ID | Task | Depends on | Status |
|---|---|---|---|
| T39 | Legal pages: `impressum` + `datenschutz` (DE + EN/FR/IT drafts), site footer links, survey privacy link — see [content/README.md](content/README.md#legal-pages) | T3, T2, T24 (survey link) | Done |
| T40 | Fill Impressum / Datenschutzerklärung with natural-person operator details; sync EN/FR/IT; confirm footer + survey links still resolve | T39 | Done |
| T41 | Live browser smoke on `aicompliant.ch`: survey (real Turnstile) + website-check + footer legal links — see [DEPLOY.md](DEPLOY.md#live-ui-smoke-t41) | T23d, T37b, Pages deploy | Done |
| T42 | Enable GitHub Actions “Allow GitHub Actions to create and approve pull requests” (monthly material `gh pr create`) — see [DEPLOY.md](DEPLOY.md#github-actions-repo-permission-t42) | T17 | Done |
| T44 | Pre-traffic operator hardening: `api.aicompliant.ch` cutover, Turnstile domains, DNS anti-spoof/DNSSEC, GitHub supply chain, Pages preview Access, HSTS preload, CSP hash postbuild — see [OPERATOR_CHECKLIST.md](OPERATOR_CHECKLIST.md) | T23e, T37b, T43 | Done |
| T29 | Lawyer review of DE compliance pages (incl. filled legal pages from T40), badge wiring; also the AI readiness check (legal hooks + DE wording), the DE AI policy template and the AI security guide | T6, T17 (badge lifecycle), T40, T45, T49, T53 | Not started |
| T30 | Quarterly: new decision tool or page, demand-driven | T8 | |
| T31 | Yearly: survey re-run, benchmark refresh, lawyer re-review | T28, T29 | |

**T40 details (done):** Canonical DE and EN/FR/IT list the natural-person operator (name, street, PLZ/Ort, email as mailto — public deletion contact `i.laube@gmail.com`). Phone, Rechtsform, Vertretung, and Handelsregister/UID were omitted as not applicable. Engineering pre-announce items **T23e / T23f / T41 / T42 / T43 / T44** are done — the site is announce-ready from an engineering standpoint. Lawyer review of filled DE text remains **T29**. Notes: [DEPLOY.md](DEPLOY.md#legal-pages-t39t40).

**T30 candidate (demand-driven):** a dedicated page on **KI-Kompetenz im Unternehmen** (AI literacy / staff competence). EU AI Act Art. 4 has been in force since 2 February 2025 and is unaffected by the Digital Omnibus; enforcement pressure will grow. The procurement checklist already carries a short competence callout (with the freely licensed AI Fluency 4D framework as one example). Promote to a full page only if search queries or inbound questions show real demand — do not invent a content cadence.

### Critical path

T1 → T3 → T6 → T9/T10 → T14 (public launch of the differentiated core), with T15-T17 needed before the first `last_verified` claims are honest. Translation (T7, T13) sits on the critical path for a four-language launch; if timeline slips, launch DE-only and let T14 follow, since DE is canonical and the pipeline regenerates the rest. **T39/T40** legal pages are filled. Cloudflare side is live (survey + scanner Workers on `api.aicompliant.ch`, Pages env, Git `main` → `aicompliant.ch`; operator checklist **T44** complete). **T23e/T23f**, **T41**, **T42**, and **T43** are done — survey / Quick-Check announce is unblocked from an engineering standpoint. Remaining parallel: **T29** lawyer review; demand-driven **T27** community launch.

### Ongoing

- Monthly: review job PRs (30-60 min).
- Quarterly: T30 if a real gap shows up in search queries or inbound questions.
- Yearly: T31.

---

## 8. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Vendor table goes stale and damages credibility | Automated refresh targets known-volatile fields; unverifiable cells say "unverified"; visible `last_checked` per vendor |
| Snapshot fetches blocked by vendor bot protection (e.g. OpenAI 403) | Shipped in T38: bot→browser header retry, HTTP 202 cookie retry, per-source `fallback_urls`, JSON/PDF/HTML `--seed-file` seeding; Act already skips `kept` (no silent invent); material brief + `fetch-failures.md` / GitHub issue from the second consecutive month so rows are not left to rot unnoticed |
| Decision tools read as legal advice | Outcomes always phrased as "likely/unlikely, verify with counsel", every outcome cites sources, disclaimer on page |
| Website quick-check read as a compliance verdict | Named "Quick-Check", statuses limited to found/not_found/indeterminate, findings phrased as facts with legal citations, disclaimer on every result |
| Quick-check misses dynamically injected trackers/banners (static fetch) | Honesty flag: when GTM/SPA shell detected, report states the scan may be incomplete; Browser Rendering listed as post-MVP upgrade |
| Scan endpoint abused (SSRF, scraping proxy, volume, CPU) | Scheme allowlist, private-IP blocking, size/timeout caps, shared 8s scan budget (DoH AbortSignal + per-request hostname memo; fetch/HEAD/probe share one deadline), HTML parse caps (512 KiB / 2000 anchors / one-shot lowercasing in `html.ts`), per-IP rate limiting, Origin header enforced against `SITE_ORIGIN` (browser CSRF / casual curl; forgeable from non-browsers), Turnstile if abuse persists. DNS rebinding after DoH check: accepted residual risk — [DEPLOY.md](DEPLOY.md#accepted-residual-risks-workers) |
| Survey n too small to publish | Publish nothing below n=5 per cell; frame first report as "pilot benchmark"; recruitment via communities where you already have presence |
| LLM diff classifier misses a material change / prompt injection coerces "cosmetic" | Classifier prompt biases toward material and ignores instructions inside the untrusted diff; Act bumps `last_verified` / `last_checked` only on byte-identical `unchanged` sources — never on non-empty (cosmetic) diffs; quarterly manual spot-check of highest-stakes pages |
| Time creep beyond the "one-shot + automation" intent | Hard scope: no blog, no newsletter cadence commitment, no social feed. New content only quarterly and only demand-driven |
| Broken static export reaches Pages via automation | `ci.yml` on PR/`main`; monthly + translate workflows run `npm run build` before push; see [DEPLOY.md](DEPLOY.md#continuous-integration) |
| Translate workflow shell injection via `run:` interpolation | `workflow_dispatch` inputs and step outputs pass through `env:` in [translate-on-de-merge.yml](.github/workflows/translate-on-de-merge.yml); `actions/checkout` + `actions/setup-node` pinned to commit SHAs |
| LLM translation injects raw HTML into auto-committed content | Translate write path rejects raw HTML outside code blocks; [`src/lib/markdown.ts`](src/lib/markdown.ts) sanitizes marked output with `sanitize-html` before `dangerouslySetInnerHTML` |
| Incomplete Impressum / Datenschutz operator details | Mitigated by **T40** (natural-person operator filled in all locales); **T29** still reviews the filled DE text |
| Survey Worker secrets provisioned in an operator/agent session | Mitigated by **T23e** (Turnstile widget `swiss-ai-survey-v2` + secret rotate) and **T23f** (fine-grained PAT on Worker `GITHUB_TOKEN`) |
| Leaked survey Worker `GITHUB_TOKEN` could alter published site content, not just aggregate data (fine-grained PATs can't scope below "whole repo", and `main` auto-deploys) | Mitigated by **T43**: Worker writes only to dedicated public data repo (`swiss-ai-survey-data`) via classic PAT; old site-repo PAT revoked; Next.js build fetches aggregates via `npm run sync:survey-aggregates`, warning and falling back to the committed copy if that fetch fails rather than breaking the build |
| Public `*.workers.dev` Worker URLs / open preview URLs | Mitigated by **T44**: custom hostname `api.aicompliant.ch`, `workers_dev`/`preview_urls` false, zone WAF rate rule, Pages preview behind Access |
| Survey email stored even without report opt-in, contradicting the Datenschutzerklärung's consent basis | Fixed: `storeResponse` only inserts a `report_signups` row when `report_opt_in` is `true`; `created_at` written at date-only precision so it can't be joined back to a `responses` row by matching insert timestamp — see [DEPLOY.md](DEPLOY.md#email-retention-and-deletion) |
| No Content-Security-Policy / HSTS / Permissions-Policy on the static site (only `X-Frame-Options` / `X-Content-Type-Options` / `Referrer-Policy`) | Added to [`public/_headers`](public/_headers); `script-src` needs `'unsafe-inline'` for Next.js's static-export hydration scripts (no per-request nonce available), but third-party script origins, `object-src`, `base-uri`, `form-action`, and `frame-ancestors` all stay locked down — see [DEPLOY.md](DEPLOY.md#security-headers-public_headers) |
| Unbounded POST body on `/submit` and `/scan` before JSON parsing | Both Workers now reject oversized bodies (`413`) via a `Content-Length` pre-check plus a streamed byte cap (32 KiB / 8 KiB) before parsing — [`workers/survey/src/body-limit.ts`](workers/survey/src/body-limit.ts), [`workers/scanner/src/body-limit.ts`](workers/scanner/src/body-limit.ts) |
| Live UI never exercised in a real browser after deploy | Mitigated by **T41** (survey Turnstile submit + website-check + sitemap/robots/404) |
| Monthly material review PR fails with 403 | Mitigated by **T42** (Actions may create and approve pull requests) |
| Translation drift across DE/EN/FR/IT | DE is canonical; EN/FR/IT regenerated on DE change by the build pipeline, flagged for review; FR/IT legal terms constrained by Fedlex glossary |
| FR/IT legal terminology errors undermine credibility in Romandie/Ticino | Term mapping against official Fedlex multilingual law texts, not free translation; human pass prioritized DE > FR > IT > EN |

---

## 9. Explicitly out of scope

- User accounts, comments, community features
- Newsletter (collect emails via survey opt-in only; decide later)
- Named case studies (add only with written company consent)
- Paid tier or monetization (this is a visibility/connection asset; revisit only if inbound demand appears)
- Vendor or partner referrals from the AI readiness check in v1 (launch neutral; prerequisites for a later partner section in [docs/ai-readiness-check-draft.md](docs/ai-readiness-check-draft.md) §8)
- Any accusatory or investigative content about specific providers
