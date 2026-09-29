# Survey instrument cognitive pretest & pilot gates

Run these steps before a public launch of survey v3. They are process/ops
checks complementary to the automated gates in
`npm run evaluate:survey`.

## Cognitive pretests (think-aloud)

Recruit **5–8** respondents, with at least:

- 2 German-speaking
- 2 French-speaking
- 1 Italian-speaking

Protocol (15–20 minutes each):

1. Share the live `/[lang]/survey/` form (staging).
2. Ask them to think aloud while answering; do **not** explain options unless stuck.
3. Note for each question:
   - Misunderstood prompts or help text
   - Missing options they wanted
   - Options they found overlapping or forced
   - Whether `max_select` (3) felt too tight
4. Capture whether non-users could complete without inventing answers
   (`none` / `none-yet` paths).

Log findings in the issue tracker; bump to **survey_version 4** if wording or
options change materially.

## Pilot sample (n ≈ 50)

1. Soft-launch to a known Swiss SME / compliance list.
2. Export or query local/production D1 responses into JSON rows
   (`[{ "answers_json": "..." }, ...]`).
3. Re-run automated gates:

```bash
npm run evaluate:survey -- --from-json path/to/pilot-rows.json
```

Hard gates must pass before promoting aggregates to the public benchmark page.

4. Review soft WARN lines (consistency, STATENT skew). If company-size or
   language-region mix is heavily skewed vs BFS STATENT, publish
   post-stratified weights or a clear caveat on `/benchmark`.

## Suppression readiness

At n≈50, expect many option cells still suppressed (k=5). Confirm the
benchmark empty-state CTA remains correct until enough cells publish, and that
the spend-by-company-size comparison is not claiming precision it lacks.
