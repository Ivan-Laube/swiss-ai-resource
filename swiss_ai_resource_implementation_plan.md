# Swiss AI deployment resource: implementation plan and architecture

Goal: a multilingual (DE/EN/FR/IT) resource site providing Swiss-specific AI deployment information for local companies. Built once, maintained by automation, differentiated by proprietary benchmark data and interactive decision tools. Solo-buildable, low ongoing time cost.

---

## 1. Scope of features

| Feature | Type | Maintenance model |
|---|---|---|
| Compliance/framework content (nDSG, EU AI Act applicability, sector guidance) | Static prose | Monthly change-check job |
| Vendor comparison table (hosting region, DPA terms, pricing, certifications) | Structured data | Automated monthly data refresh |
| Interactive decision tools (e.g. "Can I use this US-hosted LLM under nDSG?") | Client-side logic | Updated only when underlying rules change |
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
│  DNS · CDN · Pages (static hosting) · Workers        │
└─────────────────────────────────────────────────────┘
          │                    │                │
   ┌──────┴──────┐      ┌──────┴──────┐  ┌──────┴───────┐
   │  Next.js     │      │  Decision   │  │  Survey +    │
   │  static site │      │  tools      │  │  benchmarks  │
   │  (SSG)       │      │  (client JS)│  │  (Worker +   │
   │              │      │             │  │   D1 SQLite) │
   └──────┬──────┘      └─────────────┘  └──────┬───────┘
          │                                      │
   ┌──────┴──────────────────────────────────────┴─────┐
   │              Content repo (Git, single source)     │
   │  /content/{de,en,fr,it}/*.md  (de = canonical)      │
   │  /data/vendors.json  /data/rules/*.json            │
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
   │  5. No change → bump last_verified date, auto-merge  │
   └─────────────────────────────────────────────────────┘
```

Everything static where possible. The only server-side components are the survey intake and benchmark aggregation (a single Cloudflare Worker + D1 database). No user accounts, no CMS server to maintain.

### Stack choices and rationale

- **Next.js (SSG mode) on Cloudflare Pages.** You already use Next.js for Intriga and Cloudflare DNS for RightRanked. Static export means zero runtime cost and nothing to patch. Rebuild triggered by Git push.
- **Content as Markdown in Git.** No CMS. Frontmatter carries `last_verified`, `reviewed_by`, `review_date`, `sources[]`, `volatility` (stable / moderate / fast). Git history is the audit trail, which matters if a lawyer's name is attached to a page.
- **Vendor data as JSON, not prose.** `vendors.json` holds one record per provider: hosting regions, DPA link, data-training opt-out, certifications (ISO 27001, SOC 2), pricing tier, Swiss/EU entity yes/no, source URLs, `last_checked`. The site renders it as a filterable table. The monthly job refreshes fields, not paragraphs.
- **Decision tools as pure client-side JSON-driven logic.** Each tool is a decision tree defined in `/data/rules/*.json` (questions, branches, outcomes with caveats and source links). One generic React component renders any tree. Adding a new tool = adding a JSON file. No backend, no liability-heavy "advice engine", every outcome links to the underlying rule text.
- **Survey via Cloudflare Worker + D1.** A single POST endpoint, honeypot + Turnstile for spam, no personal data beyond optional email (stored separately from responses). Aggregation is a scheduled Worker that writes anonymized aggregates back to the content repo as JSON, so benchmark pages are still static.

---

## 3. Content model

### Compliance content (stable tier)
- ~10-15 cornerstone pages: nDSG basics for AI, US-hosted LLMs and adequacy, EU AI Act reach for Swiss exporters, FINMA expectations, healthcare/insurance specifics, procurement checklist.
- Written once in German, translated to EN/FR/IT (LLM draft, human pass; legal terms mapped via official Fedlex texts for FR/IT).
- Each page ends with sources and `last_verified` date rendered visibly.

### Vendor table (fast tier)
- Start with 15-20 vendors relevant to Swiss SMEs (OpenAI, Anthropic, Google, Microsoft/Azure, Mistral, Aleph Alpha, AWS Bedrock, Swisscom AI offerings, local hosts like Infomaniak).
- Filterable by: Swiss hosting, EU hosting, DPA available, training opt-out, sector certifications.
- Every cell has a source URL. Cells without a verifiable source display "unverified", never a guess.

### Decision tools (start with 2)
1. "Can I use this US-hosted LLM under nDSG?" (data category → contractual safeguards → outcome with caveats)
2. "Does the EU AI Act apply to my Swiss company?" (market exposure → system risk class → obligations timeline)

### Survey and benchmarks
- 10-12 questions, 5 minutes: company size, sector, AI tools in use, monthly spend band, deployment blockers, hosting requirements.
- Incentive: respondents get the benchmark report first, plus a personal comparison ("your spend vs. your size band") generated client-side from published aggregates.
- Publication threshold: no aggregate published for any cell with n < 5. Report published annually; rolling teaser stats ("n companies surveyed so far") on the page.

---

## 4. The monthly maintenance job (detail)

GitHub Actions, cron monthly. Steps:

1. **Source registry.** `/data/sources.json` lists every tracked URL (EDÖB pages, EU AI Act official texts and guidance, FINMA circulars, each vendor's DPA/trust page) with a CSS/text selector and the content pages that depend on it.
2. **Fetch + snapshot.** Download each source, store normalized text snapshot in the repo (`/snapshots/`). Diff against previous snapshot.
3. **Classify.** LLM call per diff: cosmetic (typos, layout) vs. material (obligation, date, term, price changed). Prompt includes the dependent page's summary so classification is contextual.
4. **Act.**
   - No diff or cosmetic → bump `last_verified` on dependent pages, auto-commit.
   - Material → open a GitHub issue with the diff, the affected pages, and a drafted content edit as a PR. You review and merge. Nothing material publishes without your eyes on it.
5. **Vendor JSON refresh.** For vendor fields, the job attempts structured extraction (hosting regions, cert lists) from the fetched pages and updates `vendors.json` in the same PR-for-review pattern for material changes.
6. **Dead link check** across all published pages, monthly, same run.

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
- Lawyer review applies to the DE canonical text only; translated compliance pages carry a note that the reviewed version is the German one.

---

## 7. Build plan (with dependencies)

Task IDs are referenced in the "Depends on" column. Tasks with no dependency can start immediately or in parallel.

### Phase 1, foundation (weeks 1-2)

| ID | Task | Depends on |
|---|---|---|
| T1 | Repo setup, Next.js SSG skeleton, Cloudflare Pages deploy | — |
| T2 | Language routing `/de /en /fr /it`, hreflang, strings-file i18n scaffold | T1 |
| T3 | Content schema: frontmatter spec (`last_verified`, `reviewed_by`, `translation_status`, `volatility`, `sources[]`) | — |
| T4 | Vendor JSON schema | — |
| T5 | Source registry schema (`sources.json`) | — |
| T6 | Write 4-5 cornerstone compliance pages in German | T3 |
| T7 | Fedlex legal-term glossary (DE↔FR↔IT term map for nDSG/LPD, AI Act terms) | — |

### Phase 2, differentiators (weeks 3-4)

| ID | Task | Depends on |
|---|---|---|
| T8 | Decision tree JSON format + generic renderer component | T1, T3 |
| T9 | Launch tool 1: US-hosted LLM under nDSG | T8, T6 (cites cornerstone pages) |
| T10 | Launch tool 2: EU AI Act applicability | T8, T6 |
| T11 | Vendor research: first 15 vendors, sourced | T4 |
| T12 | Vendor table UI (filterable, `last_checked` per row, "unverified" cells) | T4, T2 |
| T13 | Translation pipeline: LLM draft EN/FR/IT on DE change, glossary-constrained for FR/IT, `translation_status` flagging | T2, T3, T7 |
| T14 | Translate cornerstone pages + tool/table strings to EN/FR/IT | T13, T6, T9, T10, T12 |

### Phase 3, automation (weeks 5-6)

| ID | Task | Depends on |
|---|---|---|
| T15 | Monthly job: fetch + snapshot tracked sources | T5 |
| T16 | Diff + LLM classification (cosmetic vs material) | T15 |
| T17 | PR/issue workflow for material changes; auto-bump `last_verified` otherwise; clear review badge on material merge | T16, T3 |
| T18 | Vendor JSON field refresh within the same job | T16, T11 |
| T19 | Translation regeneration trigger on DE content merge | T17, T13 |
| T20 | `last_verified` visible rendering on pages | T3, T1 |
| T21 | Dead link checker in monthly run | T15 |

### Phase 4, data engine (weeks 7-8)

| ID | Task | Depends on |
|---|---|---|
| T22 | Survey design: 10-12 questions, DE first, translated | T13 (for translations only; drafting has no dependency) |
| T23 | Survey Worker + D1 + Turnstile intake endpoint | T1 |
| T24 | Survey form page (4 languages) | T22, T23, T2 |
| T25 | Aggregation job with n<5 suppression, aggregates written to repo as JSON | T23 |
| T26 | Benchmark page rendering from aggregates, client-side "your band vs median" comparison | T25, T1 |
| T27 | Survey launch via LinkedIn + Swiss SME/startup communities | T24 |
| T28 | Benchmark report (ships when n reaches 30-50, not on a fixed date) | T25, T27 |

### Post-launch / parallel (no phase)

| ID | Task | Depends on |
|---|---|---|
| T29 | Lawyer review of DE compliance pages, badge wiring | T6, T17 (badge lifecycle) |
| T30 | Quarterly: new decision tool or page, demand-driven | T8 |
| T31 | Yearly: survey re-run, benchmark refresh, lawyer re-review | T28, T29 |

### Critical path

T1 → T3 → T6 → T9/T10 → T14 (public launch of the differentiated core), with T15-T17 needed before the first `last_verified` claims are honest. Translation (T7, T13) sits on the critical path for a four-language launch; if timeline slips, launch DE-only and let T14 follow, since DE is canonical and the pipeline regenerates the rest.

### Ongoing

- Monthly: review job PRs (30-60 min).
- Quarterly: T30 if a real gap shows up in search queries or inbound questions.
- Yearly: T31.

---

## 8. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Vendor table goes stale and damages credibility | Automated refresh targets known-volatile fields; unverifiable cells say "unverified"; visible `last_checked` per vendor |
| Decision tools read as legal advice | Outcomes always phrased as "likely/unlikely, verify with counsel", every outcome cites sources, disclaimer on page |
| Survey n too small to publish | Publish nothing below n=5 per cell; frame first report as "pilot benchmark"; recruitment via communities where you already have presence |
| LLM diff classifier misses a material change | Sources are official pages that change rarely; quarterly manual spot-check of the highest-stakes pages; classifier errs toward "material" (false positives cost you a PR review, false negatives cost credibility) |
| Time creep beyond the "one-shot + automation" intent | Hard scope: no blog, no newsletter cadence commitment, no social feed. New content only quarterly and only demand-driven |
| Translation drift across DE/EN/FR/IT | DE is canonical; EN/FR/IT regenerated on DE change by the build pipeline, flagged for review; FR/IT legal terms constrained by Fedlex glossary |
| FR/IT legal terminology errors undermine credibility in Romandie/Ticino | Term mapping against official Fedlex multilingual law texts, not free translation; human pass prioritized DE > FR > IT > EN |

---

## 9. Explicitly out of scope

- User accounts, comments, community features
- Newsletter (collect emails via survey opt-in only; decide later)
- Named case studies (add only with written company consent)
- Paid tier or monetization (this is a visibility/connection asset; revisit only if inbound demand appears)
- Any accusatory or investigative content about specific providers
