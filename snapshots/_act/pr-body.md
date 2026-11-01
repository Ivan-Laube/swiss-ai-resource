## Summary

Monthly T17/T18 material-change PR for **2026-11**.

This PR:
- Clears lawyer review fields (`reviewed_by` / `review_date` / `review_scope`) on affected DE pages when they were set
- Proposes vendor claim-field updates in `data/vendors.json` (T18 structured extract)
- Includes `snapshots/_act/material-brief.md` with classifier rationales and patch excerpts
- Does **not** auto-rewrite legal prose — edit DE content before merge

### Affected DE pages

- `content/de/ai-procurement-checklist.md`
- `content/de/eu-ai-act-swiss-exporters.md`
- `content/de/ndsg-ai-basics.md`
- `content/de/us-hosted-llms-ndsg.md`

### Vendor updates

- `data/vendors.json`
  - `anthropic`: last_checked / review only
  - `aws-bedrock`: last_checked / review only
  - `cohere`: last_checked / review only
  - `deepl`: last_checked / review only
  - `exoscale`: last_checked / review only
  - `google-cloud`: last_checked / review only
  - `huggingface`: last_checked / review only
  - `ibm-watsonx`: last_checked / review only
  - `infomaniak`: last_checked / review only
  - `microsoft-azure`: last_checked / review only
  - `mistral`: last_checked / review only
  - `openai`: last_checked / review only
  - `ovhcloud`: last_checked / review only

### Checklist

- [ ] Review brief and patches
- [ ] Update DE cornerstone content where needed
- [ ] Set `last_verified` after human verification
- [ ] Merge clears the lawyer badge lifecycle (T17); re-review restores it (T29)
- [ ] Review vendor claim cells and source URLs

