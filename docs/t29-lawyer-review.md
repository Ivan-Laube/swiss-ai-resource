# T29: lawyer review brief

What the lawyer has to check before the German copy can carry the "reviewed by counsel" badge, and what the operator does with the result. Status as of 5 October 2026.

**Background:** [de-copy-review.md](de-copy-review.md) (pre-review of the DE copy, 14 findings, already applied) and PR #51 (survey privacy code fix, live since 2026-10-05).

## 0. Before sending it to the lawyer (operator)

1. ~~Merge PR #52 (`content/de-copy-review`) so the live site shows the reviewed copy.~~ **Done 2026-10-05:** merged as `5773409`, deployed to aicompliant.ch.
2. **Review version:** `577340930b0621aca91da3f71eafdb127c2062e8` (the PR #52 merge commit). Send it with the brief and ask the lawyer to review the live pages, which show that version. Later commits that only regenerate EN/FR/IT do not change the German text. If DE files change before the lawyer starts, take the new SHA of `main` instead.
3. **Next step:** send the lawyer this file plus [de-copy-review.md](de-copy-review.md). Only the **German** text is in scope. EN/FR/IT are machine translations of it and are marked as such.

## 1. What to review

Each item needs one of: **approved**, **approved with the listed changes**, or **not approved (reason)**. For each page, any change wishes should be returned as replacement text.

### Legal pages

| # | Page | URL | Check in particular |
|---|---|---|---|
| L1 | Datenschutzerklärung | [/de/datenschutz/](https://aicompliant.ch/de/datenschutz/) | Questions A1–A6 below. Also whether the text meets Art. 19 Abs. 2 DSG as a whole: identity and contact, purposes, recipients, countries. |
| L2 | Impressum | [/de/impressum/](https://aicompliant.ch/de/impressum/) | Question B1 (name and email only, no postal address). |

### Guides

All six guides are at `/de/<slug>/`. For each one, check that legal statements are correct and correctly attributed (law vs. authority opinion), that no sentence promises a legal outcome, and the points listed.

| # | Guide | Check in particular |
|---|---|---|
| G1 | [nDSG und KI: Grundlagen](https://aicompliant.ch/de/ndsg-ai-basics/) | Question B5 (fines, Art. 60–64 DSG). The new sections: CH AI regulation status (Federal Council 12.02.2025, CoE convention); scope limited to natural persons (Art. 5 lit. a); DSFA trigger and EDÖB consultation (Art. 22/23); vendor as processor vs. controller when it trains on customer data; record-of-processing exemption under 250 employees (Art. 24 DSV); Art. 21 rewrite (Abs. 1–3), Art. 25 Abs. 2 lit. f, objection via Art. 30 Abs. 2 lit. b / Art. 31; EDÖB positions marked "nach Auffassung des EDÖB". |
| G2 | [US-gehostete LLMs unter dem nDSG](https://aicompliant.ch/de/us-hosted-llms-ndsg/) | Question B4 (CoE model clauses). Remote access counts as disclosure (Art. 5 lit. e); EU/EEA states on Annex 1 DSV; DPF covers HR data separately; DPF fragility (Privacy Shield precedent); Art. 17 exceptions; TIA and pseudonymisation as a supplementary measure; sensitive data framed as Art. 9 Abs. 1 lit. b plus the transfer basis, not as a GDPR-style "Rechtsgrundlage". |
| G3 | [EU AI Act: Reichweite für Schweizer Unternehmen](https://aicompliant.ch/de/eu-ai-act-swiss-exporters/) | Question B2 (Omnibus dates). Art. 4 is now an obligation of effort; the two new prohibitions from 2 December 2026; the SME relief sentence; the single timeline table. |
| G4 | [FINMA-Erwartungen an KI-Governance](https://aicompliant.ch/de/finma-ai-expectations/) | Aufsichtsmitteilung 08/2024 described as supervisory practice, not binding law; reference to the applicable laws and circulars. |
| G5 | [Checkliste: KI-Beschaffung](https://aicompliant.ch/de/ai-procurement-checklist/) | §7 (EU AI Act/Omnibus status); the contract and data-transfer checklist items. |
| G6 | [KI und Cybersicherheit](https://aicompliant.ch/de/ai-security-risks/) | Reporting duty for critical infrastructure limited to qualifying attacks (Art. 74a ff. ISG); data-breach reporting (Art. 24 DSG). |

### Template and tools

These have no badge, so the result is recorded only in section 3.

| # | Item | Where | Check in particular |
|---|---|---|---|
| T1 | KI-Richtlinie (template) | [Word download](https://aicompliant.ch/downloads/ai-policy-template-de.docx) | The full list of sensitive data (Art. 5 lit. c DSG); ban on employee monitoring (Art. 328b OR, ArGV 3 Art. 26); the Art. 21 sentence (a human-reviewed decision is not an automated individual decision); privacy-notice duty as Art. 19 requires it; the "no disadvantage" promise limited to the act of reporting. |
| T2 | KI-Check | [/de/tools/ai-readiness/](https://aicompliant.ch/de/tools/ai-readiness/) (URL only, not listed) | The legal hooks in the questions and results: nDSG Art. 5, 8, 9, 16–17, 19, 21, 22, 24; DSV Art. 1–6; EU AI Act Art. 4, 50; ArGV 3 Art. 26. Also whether a result can be read as legal advice. The check stays unlisted until T29 is approved. |
| T3 | Entscheidungshilfe EU AI Act | [/de/tools/eu-ai-act-applicability/](https://aicompliant.ch/de/tools/eu-ai-act-applicability/) | Applicability outcomes after the Omnibus. |
| T4 | Entscheidungshilfe US-LLM | [/de/tools/us-hosted-llm-ndsg/](https://aicompliant.ch/de/tools/us-hosted-llm-ndsg/) | The sensitive-data outcome. Also an operator decision the lawyer should comment on: DPF plus training ends at "Kommt darauf an", but SCCs plus training ends at "Eher nicht vertretbar". Is that asymmetry justified? |
| T5 | Website Quick-Check | [/de/website-check/](https://aicompliant.ch/de/website-check/) | The Impressum check (Art. 3 Abs. 1 lit. s UWG applies only to e-commerce offerings); the cookie check (Art. 45c FMG requires information and an opt-out, not a banner); question B6. |
| T6 | Homepage and UI copy | [/de/](https://aicompliant.ch/de/) | Headline "KI im Unternehmen einsetzen – was in der Schweiz gilt." and the lead: no outcome promises ("rechtssicher") and no misleading claims (Art. 3 Abs. 1 lit. b UWG); "Quellen werden automatisch überwacht" accurately describes the monitoring. |

## 2. Questions to answer

### A. Datenschutzerklärung and survey (L1)

**A1. Linking survey answers and emails (§2.2).** Since 5 October 2026, an answer no longer records whether an email was given, an email signup stores only its calendar week, and the two tables share no key. The current text (version B) says only what is stored:

> Es besteht damit kein gespeicherter Bezug zwischen E-Mail-Adresse und Antwort. Wir verknüpfen beide nicht und werten sie nicht gemeinsam aus.

The earlier text promised more ("Eine technische Zuordnung … ist nicht möglich"). A link is still possible in two cases:

- **Database history:** Cloudflare D1 keeps 30 days of restorable history, and it cannot be switched off. Someone with account access could restore earlier states and see which rows were added together.
- **Very small groups:** if only one answer arrives in a language in a given week, it belongs to that week's email in the same language.

**Question:** is version B adequate? Should the stronger claim return from 5 November 2026, when the old pre-fix data has left the history? If so, would this text (version A) be acceptable?

> Eine Zuordnung von E-Mail-Adresse und Einzelantwort anhand der gespeicherten Daten ist damit technisch nicht möglich. Zwei Ausnahmen bestehen: Cloudflare hält einen Verlauf der Datenbank während 30 Tagen vor, aus dem sich der Zeitpunkt der Einträge rekonstruieren liesse; und geht in einer Woche nur eine einzige Antwort in einer Sprache ein, lässt sie sich der E-Mail-Adresse derselben Woche und Sprache zuordnen. Wir nehmen keine solche Zuordnung vor.

**A2. "Anonym" (§2.2, §7; survey UI: "Ohne E-Mail-Adresse bleibt Ihre Teilnahme anonym").** An answer stores a timestamp to the second plus a company profile (size, sector, language region). Published results suppress values based on fewer than five answers. Is "anonym" accurate, or should it be "ohne Angaben zu Ihrer Person"? This is de-copy-review question 5.

**A3. IP hash (§2.3).** The text now says: an HMAC-SHA-256 with a secret key and the date, changing daily, not traceable to the IP without the key, deleted within ten days. The operator holds the key, so for the operator this is still personal data (pseudonymised). Is the description accurate and sufficient, and is the justification in §3 ("Interesse an einem sicheren … Angebot") adequate?

**A4. Retention and deletion (§5, §6).**

- §5 says emails are kept "bis zur Benachrichtigung über den Bericht". Nothing deletes them automatically before 24 months, so after sending the report the operator must delete them by hand. Is the promise acceptable as an operator obligation, or should the text say only "spätestens 24 Monate"?
- After deletion (on request or at 24 months), data stays in Cloudflare's restorable database history for up to 30 days. Does §5 or §6 need to say so?

**A5. Cloudflare abroad (§4).** This is de-copy-review question 2. Is naming the Swiss-U.S. DPF certification plus the SCCs in Cloudflare's DPA sufficient for Art. 19 Abs. 4 DSG? Is Cloudflare a processor for Turnstile, or partly a controller?

**A6. Cookies and Turnstile (§2.6).** This is de-copy-review question 3. Do Turnstile or Cloudflare's bot protection set cookies or read device data on this domain (Art. 45c FMG)? If so, "setzt keine Cookies" needs a qualification.

### B. Other open questions (from de-copy-review.md §4)

- **B1. Impressum and controller contact:** the postal address was removed at the operator's request, so both pages show only the name and an email.
  - Does Art. 3 Abs. 1 lit. s UWG apply to a free information site run by a natural person?
  - If it does, is an email enough, or is a postal address (business address or P.O. box) needed?
  - Is an email alone enough as "Kontaktdaten" under Art. 19 Abs. 2 lit. a DSG?
  - Should a domain email replace the private Gmail address?
- **B2. EU AI Act dates (G3, T3):** confirm against the OJ text of Regulation (EU) 2026/1744:
  - Art. 4 wording, applying from 27 July 2026;
  - the new Art. 5 prohibitions from 2 December 2026;
  - the Art. 50(2) transition to 2 December 2026;
  - 2 December 2027 (Annex III) and 2 August 2028 (Annex I).
- **B3. FINMA (G4):** is the description of the Aufsichtsmitteilung's legal effect correct?
- **B4. CoE model clauses (G2):** does the EDÖB recognise the Council of Europe model clauses for transfers? If yes, the sentence is re-added.
- **B5. Fines (G1):** confirm the summary of Art. 60–64 DSG, in particular "verfolgt wird auf Antrag" for Art. 60 and 61, the CHF 250'000 cap for individuals, intent only, and CHF 50'000 against the company (Art. 64).
- **B6. Website-Check (T5):** the static-scan caveat cites "Art. 19 DSG (Informationspflicht)" as its legal basis. Should the reference be removed?

## 3. Sign-off (operator, after the lawyer's answer)

1. **Apply the requested changes** to the DE files in `content/de/`, `content/templates/ai-policy-template/de.md` and `data/*.json`, in a PR. If the changes are substantive, send the diff back for a short confirmation.
2. **Record the badge** for each approved page (L1, L2, G1–G6) in its DE frontmatter. All three fields must be set together:

   ```yaml
   reviewed_by: "<name of the lawyer>"
   review_date: "<date of the written approval, YYYY-MM-DD>"
   review_scope: "<full 40-character SHA of the reviewed version>"
   ```

   `review_scope` is the SHA from step 0.2, or the SHA after step 1 if the lawyer confirmed the changed text. The badge appears automatically. The monthly job clears all three fields if a source of that page later changes materially, and the page then needs a new review.
3. **Set `last_verified`** to the sign-off date on the approved pages. So far it was bumped only on the EU AI Act page.
4. **Record the result for T1–T6** (no badge) in the table below, and list the KI-Check (T2) once it is approved.
5. **Set T29 to Done** in `swiss_ai_resource_implementation_plan.md` and `README.md`.

| Item | Result | Date | Notes |
|---|---|---|---|
| L1 Datenschutzerklärung | | | |
| L2 Impressum | | | |
| G1–G6 Guides | | | |
| T1 Policy template | | | |
| T2 KI-Check | | | |
| T3–T5 Tools | | | |
| T6 Homepage/UI | | | |
