# Broken links (2026-07)

Automated T21 dead-link check from the monthly source job.
Fix or replace unreachable citation URLs on published surfaces.
Does **not** bump `last_verified` or clear lawyer review badges.

Checked **50** unique URL(s): **46** ok, **4** broken.
(Reused 38 from T15 run report; probed 12.)

## Broken URLs

### https://openai.com/business-data/

- **Status:** 403 — HTTP 403 Forbidden
- **Reused from T15:** yes
- **Cited from:**
  - `vendor` `openai#hosting_regions.source_url`
  - `vendor` `openai#swiss_hosting.source_url`
  - `vendor` `openai#eu_hosting.source_url`
  - `vendor` `openai#training_opt_out.source_url`
  - `vendor` `openai#certifications.source_url`

### https://openai.com/policies/data-processing-addendum/

- **Status:** 403 — HTTP 403 Forbidden
- **Reused from T15:** yes
- **Cited from:**
  - `vendor` `openai#dpa_url.source_url`
  - `vendor` `openai#swiss_entity.source_url`
  - `vendor` `openai#eu_entity.source_url`
  - `vendor` `openai#dpa_url.value`

### https://support.deepl.com/hc/en-us/articles/26380849099932-DeepL-infrastructure-and-data-protection

- **Status:** 403 — HTTP 403 Forbidden
- **Reused from T15:** yes
- **Cited from:**
  - `vendor` `deepl#hosting_regions.source_url`
  - `vendor` `deepl#eu_hosting.source_url`
  - `vendor` `deepl#training_opt_out.source_url`
  - `vendor` `deepl#certifications.source_url`
  - `vendor` `deepl#swiss_entity.source_url`
  - `vendor` `deepl#eu_entity.source_url`

### https://www.consilium.europa.eu/en/press/press-releases/2026/06/29/artificial-intelligence-council-gives-final-green-light-to-simplify-and-streamline-rules/

- **Status:** 403 — HTTP 403 Forbidden
- **Reused from T15:** yes
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

