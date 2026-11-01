# Snapshot fetch failures (2026-11)

Automated T38 brief from the monthly source job.
These sources failed on consecutive runs and are **skipped** by Act (no silent invent of vendor cells or `last_verified` bumps).

Persistent failures (≥2 consecutive): **2**.
All failures this run: **2**.

## Persistent failures

### `eur-lex-ai-act-de`

- **HTTP:** 202
- **Error:** HTTP 202 Accepted after 3 attempts (tried 3 URLs; last: https://eur-lex.europa.eu/eli/reg/2024/1689/oj/deu/pdf)
- **Consecutive failures:** 2
- **Last ok:** 2026-07-17T09:43:17.873Z
- **Vendor:** (none)
- **Dependent pages:** `eu-ai-act-swiss-exporters`, `ai-procurement-checklist`
- **Configured fallbacks:** `https://eur-lex.europa.eu/legal-content/DE/TXT/PDF/?uri=CELEX:32024R1689`, `https://eur-lex.europa.eu/eli/reg/2024/1689/oj/deu/pdf`
- **Hint:** add a `fallback_urls` entry in `data/sources.json`, or seed manually: `npm run snapshot:sources -- --id=eur-lex-ai-act-de --seed-file=<path>`

### `eur-lex-ai-act-en`

- **HTTP:** 202
- **Error:** HTTP 202 Accepted after 3 attempts (tried 3 URLs; last: https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng/pdf)
- **Consecutive failures:** 2
- **Last ok:** 2026-07-17T09:43:14.983Z
- **Vendor:** (none)
- **Dependent pages:** `eu-ai-act-swiss-exporters`
- **Configured fallbacks:** `https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1689`, `https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng/pdf`
- **Hint:** add a `fallback_urls` entry in `data/sources.json`, or seed manually: `npm run snapshot:sources -- --id=eur-lex-ai-act-en --seed-file=<path>`

## Editor checklist

- [ ] Open each primary URL in a browser; confirm it still exists
- [ ] Add a stable `fallback_urls` entry in `data/sources.json` when an alternate page carries the same claims
- [ ] Or seed: `npm run snapshot:sources -- --id=<id> --seed-file=<saved.html|pdf>`
- [ ] Re-run `npm run snapshot:sources -- --id=<id>` and confirm `ok` before the next monthly cron

