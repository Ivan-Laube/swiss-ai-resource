# Broken links (2026-10)

Automated T21 dead-link check from the monthly source job.
Fix or replace unreachable citation URLs on published surfaces.
Does **not** bump `last_verified` or clear lawyer review badges.

Checked **51** unique URL(s): **49** ok, **2** broken.
(Reused 36 from T15 run report; probed 15.)

## Broken URLs

### https://openai.com/

- **Status:** 403 — HTTP 403
- **Reused from T15:** no
- **Cited from:**
  - `vendor` `openai#website`

### https://www.consilium.europa.eu/en/press/press-releases/2026/06/29/artificial-intelligence-council-gives-final-green-light-to-simplify-and-streamline-rules/

- **Status:** 403 — HTTP 403
- **Reused from T15:** no
- **Cited from:**
  - `content` `de/eu-ai-act-swiss-exporters#sources`
  - `content` `en/eu-ai-act-swiss-exporters#sources`
  - `content` `fr/eu-ai-act-swiss-exporters#sources`
  - `content` `it/eu-ai-act-swiss-exporters#sources`
  - `rule` `eu-ai-act-applicability#out-transparency`
  - `rule` `eu-ai-act-applicability#out-highrisk-annex-iii`
  - `rule` `eu-ai-act-applicability#out-highrisk-annex-i`
  - `rule` `eu-ai-act-applicability#out-unclear-annex`

## Editor checklist

- [ ] Open each URL (or its replacement) and confirm it is the intended source
- [ ] Update content frontmatter / body, `data/vendors.json`, or `data/rules/*.json` as needed
- [ ] Do not bump `last_verified` solely because a link was fixed

