## Summary

Monthly T17/T18 material-change PR for **2026-10**.

This PR:
- Clears lawyer review fields (`reviewed_by` / `review_date` / `review_scope`) on affected DE pages when they were set
- Proposes vendor claim-field updates in `data/vendors.json` (T18 structured extract)
- Includes `snapshots/_act/material-brief.md` with classifier rationales and patch excerpts
- Does **not** auto-rewrite legal prose — edit DE content before merge

### Affected DE pages

- `content/de/eu-ai-act-swiss-exporters.md`
- `content/de/finma-ai-expectations.md`

### Vendor updates

- `data/vendors.json`
  - `anthropic`: certifications
  - `cohere`: certifications
  - `deepl`: certifications
  - `exoscale`: last_checked / review only
  - `google-cloud`: last_checked / review only
  - `infomaniak`: swiss_entity
  - `microsoft-azure`: last_checked / review only
  - `mistral`: training_opt_out
  - `openai`: pricing_tier
  - `ovhcloud`: last_checked / review only

### Checklist

- [ ] Review brief and patches
- [ ] Update DE cornerstone content where needed
- [ ] Set `last_verified` after human verification
- [ ] Merge clears the lawyer badge lifecycle (T17); re-review restores it (T29)
- [ ] Review vendor claim cells and source URLs

