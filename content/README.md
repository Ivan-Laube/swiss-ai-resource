# Content conventions

Markdown pages live under `content/{locale}/`, with German (`de`) as the canonical language.

## File layout

```
content/
  de/{slug}.md   # canonical
  en/{slug}.md   # translation (same slug)
  fr/{slug}.md
  it/{slug}.md
```

- Filename stem = URL slug (`ndsg-ai-basics.md` → slug `ndsg-ai-basics`).
- Do not put a `slug` field in frontmatter.
- Use the same slug across locales so hreflang pairing stays trivial.
- Slugs starting with `_` (e.g. `_fixture-schema.md`) are internal fixtures: validated by `check:content`, but not published as routes.

## Published DE pages (T6)

| Slug | Volatility | Notes |
|---|---|---|
| `ndsg-ai-basics` | moderate | nDSG/DSG + KI |
| `us-hosted-llms-ndsg` | fast | Auslandstransfer, Swiss-U.S. DPF |
| `eu-ai-act-swiss-exporters` | fast | Art. 2 scope; timeline includes Digital Omnibus two-track dates |
| `finma-ai-expectations` | moderate | FINMA Guidance 08/2024 |
| `ai-procurement-checklist` | stable | Buyer checklist; §7 competence / Art. 4 + AI Fluency 4D example |

### Legal pages (launch requirement)

| Slug | Volatility | Notes |
|---|---|---|
| `impressum` | stable | Art. 3 Abs. 1 lit. s UWG; `PLACEHOLDER_*` fields for legal entity |
| `datenschutz` | stable | Art. 19 DSG; controller, Cloudflare/D1 (`responses` + unlinkable `report_signups`), retention, deletion |

Legal pages ship in DE/EN/FR/IT (**T39**) and are linked from the site footer (and the survey form for `datenschutz`). They are excluded from the home “Compliance basics” list.

**T40 (blocks public launch):** replace every `PLACEHOLDER_*` marker with final details in canonical DE, then sync EN/FR/IT. Markers in use:

| Marker | Where |
|---|---|
| `PLACEHOLDER_LEGAL_NAME` | Impressum + Datenschutz |
| `PLACEHOLDER_LEGAL_FORM` | Impressum |
| `PLACEHOLDER_STREET` | Impressum + Datenschutz |
| `PLACEHOLDER_POSTAL_CITY` | Impressum + Datenschutz |
| `PLACEHOLDER_CONTACT_EMAIL` | Impressum + Datenschutz (incl. `report_signups` deletion contact) |
| `PLACEHOLDER_PHONE` | Impressum (optional) |
| `PLACEHOLDER_REPRESENTATIVE` | Impressum |
| `PLACEHOLDER_COMMERCIAL_REGISTER` | Impressum (if applicable) |
| `PLACEHOLDER_UID` | Impressum (if applicable) |

Lawyer review of the filled pages is **T29**. Deploy checklist: [DEPLOY.md](../DEPLOY.md#legal-pages-t39t40).

Routes: `/[lang]/[slug]/`. `hreflang` alternates are limited to locales that have the file (`localesWithSlug`). After T14, the five cornerstone slugs exist in DE/EN/FR/IT (`translation_status: draft` for non-DE). Legal pages also exist in all four locales (`translation_status: draft` for non-DE).

## Frontmatter

| Field | Type | Notes |
|---|---|---|
| `title` | string | Required |
| `description` | string | Required (SEO / summaries) |
| `last_verified` | `YYYY-MM-DD` | Bumped by the monthly job (T17) |
| `volatility` | `stable` \| `moderate` \| `fast` | How often sources move |
| `translation_status` | `canonical` \| `draft` \| `reviewed` | DE must be `canonical`; EN/FR/IT must be `draft` or `reviewed` |
| `reviewed_by` | string \| null | Lawyer name; default `null` |
| `review_date` | `YYYY-MM-DD` \| null | Badge only if set and fresh (T29) |
| `review_scope` | string \| null | Git commit SHA of the reviewed DE version |
| `sources` | `{ title, url }[]` | At least one; `url` must be absolute `https://` |

Lawyer fields are all-or-nothing: if any of `reviewed_by`, `review_date`, or `review_scope` is set, all three are required. The monthly act step (T17) clears all three on DE pages when a dependent source is classified **material**. Omit them or set them to `null` when there is no review yet.

`last_verified` is bumped by T17 on all locales that have the slug when dependent sources are unchanged or cosmetic (not when material). Writer helpers: [`src/content/write.ts`](../src/content/write.ts). Rendered on each compliance page (header + after sources) via [`formatIsoDate`](../src/lib/format-date.ts).

Implementation: Zod schema and parse helpers live in [`src/content/`](../src/content/) (`schema.ts`, `load.ts`, `write.ts`). Export barrel: `@/content`.

## Example

```yaml
---
title: "nDSG und KI-Grundlagen"
description: "Kurzüberblick für Schweizer KMU."
last_verified: "2026-07-10"
volatility: "moderate"
translation_status: "canonical"
reviewed_by: null
review_date: null
review_scope: null
sources:
  - title: "EDÖB"
    url: "https://www.edoeb.admin.ch/edoeb/de/home.html"
---
```

## Translation pipeline (T13)

Draft EN/FR/IT pages from canonical DE Markdown. Implementation: [`src/translate/`](../src/translate/) (`glossary-match`, `prompt`, `client`, `write`, `verify`). CLI: `npm run translate`.

```bash
npm run translate -- --slug=ndsg-ai-basics --dry-run
npm run translate -- --slug=ndsg-ai-basics --locale=fr
npm run translate -- --all
npm run translate -- --slug=ndsg-ai-basics --strict
```

Requires `ANTHROPIC_API_KEY` (optional local `.env`). Override model with `TRANSLATE_MODEL` (default `claude-sonnet-4-20250514`).

### Generated frontmatter rules

- LLM supplies translated `title`, `description`, and body only.
- Pipeline copies from DE: `last_verified`, `volatility`, `sources`.
- Pipeline forces: `translation_status: "draft"`; `reviewed_by` / `review_date` / `review_scope` = `null` (lawyer review is DE-only).
- FR/IT prompts inject matched Fedlex glossary rows; `--strict` fails if official terms are missing from the output.
- EN prompts require conventional phrasing with the German term in parentheses on first use for matched glossary terms.
- Overwrites existing target files (regeneration on DE change intentionally resets `reviewed` → `draft`).

**T14** (done): first full pass over all cornerstone pages plus tool LocalizedStrings (EN/FR/IT). Vendor/table UI chrome was already covered by T12 i18n messages.

### Translation regeneration on DE merge (T19)

Workflow: [`.github/workflows/translate-on-de-merge.yml`](../.github/workflows/translate-on-de-merge.yml).

- **Trigger:** push to `main` that touches `content/de/**/*.md`, plus manual `workflow_dispatch` (optional comma-separated slugs; empty = all publishable DE pages).
- **Canonical-change filter:** only regenerates when DE `title`, `description`, or body changed. Metadata-only DE edits (`last_verified`, lawyer review fields, `sources`, `volatility`) are skipped so monthly T17 bumps do not burn API calls.
- **Engine:** `changed-de-slugs` → `translate --strict` → `check:content` → `npm run build` → bot commit of `content/{en,fr,it}/`.
- **Landing:** commits regenerated `content/{en,fr,it}/*.md` to `main` with `translation_status: draft`. Translation-only commits do not re-trigger the workflow (path filter is DE-only).

Local helpers:

```bash
# List slugs whose canonical DE prose changed between two commits
npm run changed-de-slugs -- --before=HEAD~1 --to=HEAD

# Force-list (same as workflow_dispatch)
npm run changed-de-slugs -- --all
npm run changed-de-slugs -- --slug=ndsg-ai-basics
```

## Validation

```bash
npm run check:content
```

Parses every `content/{locale}/*.md` file with Zod. Invalid frontmatter fails the script with the file path and field errors. The same check runs in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) on every PR and push to `main`, and again in the translate workflow before `npm run build` and the bot commit.

Loader API (build-time) from `@/content`:

| Helper | Purpose |
|---|---|
| `listContentSlugs` | All `.md` stems for a locale (includes fixtures) |
| `listPublishableContentSlugs` | Public slugs only (excludes `_` prefix) |
| `localesWithSlug` | Locales that have a publishable page for a slug (hreflang) |
| `isPublishableSlug` | `true` unless slug starts with `_` |
| `getContentPage` | Parse + validate one page |
| `getAllContentPages` | All pages, optional locale filter |
| `validateAllContent` | Used by `npm run check:content` |
