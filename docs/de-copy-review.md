# DE copy review before the lawyer review (T29)

Pre-review of the canonical German copy, 5 October 2026. This covers legal substance and language/style. It is a preparation for the lawyer review (T29), not a replacement for it. All changes were merged in PR #52 (`5773409`) and are live.

**Scope:** UI strings (`src/i18n/messages/de.ts`), all DE pages in `content/de/` (6 guides, Impressum, Datenschutz), the AI policy template (`content/templates/ai-policy-template/de.md`), and the DE strings of both decision tools (`data/rules/*.json`), the Website-Check (`data/scanner-checks.json`), the KI-Check (`data/readiness-check.json`, targeted fixes only) and the survey (`data/survey-questions.json`, title and one help text).

**Method:** read every string against the cited sources and the statute (DSG, DSV, UWG, FMG, ISG, OR, ArGV 3, AI Act). Claims about how the site works (privacy policy) were checked against the code (`workers/survey/src/store.ts`, migrations, `DecisionTree.tsx`). The status of the Digital Omnibus on AI was checked against the monitoring snapshot (`snapshots/consilium-digital-omnibus-ai.txt`) and secondary sources. EUR-Lex could not be fetched directly, so **the Omnibus dates must be confirmed against the Official Journal text** (see open questions).

## 1. Critical findings (fixed)

| # | Where | Problem | Fix |
|---|---|---|---|
| 1 | EU AI Act guide, EU AI Act tool, procurement checklist §7 | The Digital Omnibus on AI was published in the OJ on **24 July 2026** as **Regulation (EU) 2026/1744** and has been in force since **27 July 2026**. The site still said "Amtsblatt ausstehend", described "two planning tracks", and stated that Art. 4 (AI literacy) is "vom Digital Omnibus unberührt". That last point is now wrong: Art. 4 was rewritten into an obligation of effort (measures to support AI literacy, no guaranteed level). The Omnibus also adds two prohibitions from 2 December 2026 (non-consensual intimate imagery, CSAM). The monthly job classified this as *material* on 2026-10-01, but the page was not updated. | Timeline rewritten as a single, current table; Art. 4 and new prohibitions added; tool strings fixed **in all four locales**; Consilium source (HTTP 403, issue #16) replaced by EUR-Lex 2026/1744. `last_verified` set to 2026-10-05 on that page only. |
| 2 | Datenschutzerklärung §2.2, §6 | Claimed that linking an email to an answer is "technisch nicht möglich". Not accurate: `responses` stores `report_opt_in` and a timestamp, `report_signups` stores date and locale, so on low-traffic days an answer can be matched to an email. | Copy now says what is true (separate tables, no shared key, **we do not link them**). **Code fixed in #51** (opt-in flag dropped, signup date reduced to the calendar week; live 2026-10-05); §2.2 now describes that (version B in [t29-lawyer-review.md](t29-lawyer-review.md)). |
| 3 | Datenschutzerklärung §2.3 | "Einweg-Hash … ohne Klartext-IP" suggests anonymity. The hash is an unsalted SHA-256 of the IP, which is reversible for IPv4 by brute force, so it is still personal data. Retention said "wenige Tage"; the weekly purge means up to about nine days. | Neutral wording ("Hashwert"), "spätestens nach zehn Tagen". **Code fixed in #51** (HMAC-SHA-256 with a secret key and the date; live 2026-10-05); §2.3 now describes the keyed hash. |
| 4 | Datenschutzerklärung §4 | Art. 19 Abs. 4 DSG requires naming the destination country and the safeguard. The text only said processing "can" happen outside CH/EU and that an adequate level is "angestrebt". | Names USA and other countries, the Swiss-U.S. DPF certification of Cloudflare, and the SCCs in Cloudflare's DPA. **Operator must confirm** (section 4). |
| 5 | Datenschutzerklärung §3 | GDPR-style legal-basis paragraph ("Erfüllung eines Vertrags bzw. vorvertraglicher Massnahmen …"). The DSG does not require a legal basis for private processing, and there is no contract with survey participants. | Replaced by DSG principles (Art. 6), consent for the email, and legitimate interest wording. |
| 6 | Datenschutzerklärung | KI-Check and decision tools not mentioned; `last_verified` (a code field name) shown to readers; "beim EDÖB beschweren" (the DSG has no formal complaint right like Art. 77 GDPR); retention described as a "Ziel" although deletion after 24 months is implemented. | New §2.5 (answers stay in the browser; copied tool links contain the answers); plain-language wording; "an den EDÖB wenden"; retention stated as implemented; portability (Art. 28 DSG) added to the rights. |
| 7 | US-LLM guide, US-LLM tool, KI-Check Q4 | "Rechtsgrundlage" used as if the GDPR applied ("keine besonders schützenswerten Daten ohne klare Rechtsgrundlage"). Under the DSG, private parties need a justification only where processing violates personality rights (Art. 30/31), and the real question for sensitive data in a cloud LLM is Art. 9 Abs. 1 lit. b (secrecy duties) plus the transfer basis. | Reworded in DSG terms; the tool's sensitive-data outcome is fixed in all four locales. |
| 8 | nDSG guide "Widerspruch und menschliche Überprüfung" | Merged the right to object and Art. 21 into one vague sentence. Art. 21 applies only to decisions based **exclusively** on automated processing with legal effect or significant impact, and it has exceptions (Abs. 3). | Section rewritten: Art. 21 Abs. 1–3, Art. 25 Abs. 2 lit. f (logic), and objection via Art. 30 Abs. 2 lit. b / Art. 31. |
| 9 | nDSG guide | EDÖB positions were presented as statutory rules ("müssen … ausgewiesen werden", "datenschutzrechtlich verboten"). | Attributed ("nach Auffassung des EDÖB"); the statutory basis (Art. 19, 22, 23 DSG) is cited separately. |
| 10 | FINMA guide | "Verbindlich sind die FINMA-Mitteilung …". Aufsichtsmitteilungen are not binding law; they set out FINMA's supervisory practice. | Corrected; it now points to the applicable financial market laws and circulars. |
| 11 | Website-Check, Impressum check | "verpflichtet Betreiber von Websites" overstates Art. 3 Abs. 1 lit. s UWG, which applies to those *offering goods, works or services* in e-commerce. | Corrected. |
| 12 | Website-Check, cookie check | Implied that a consent tool is the expected state. Swiss law (Art. 45c FMG) requires information and an opt-out, not a banner; a banner may be needed for EU audiences. | Clarified (DE only; see section 6). |
| 13 | Vendor table | Certification filter "FINMA-relevant". FINMA does not certify vendors, so listing this under "Zertifizierungen" is misleading. | Label changed to "FINMA (Selbstauskunft)". Consider a separate column instead (section 5). |
| 14 | Homepage, methodology | "monatlich gegen die Quellen geprüft" and "aktualisiert Verifikationsdaten im Repository" overstate an automated change detector, and finding 1 shows the gap. "Primärquellen" is not true for OWASP or the Anthropic framework. | Now says the sources are monitored automatically and that pages are reviewed when a source changes materially; sources are described as primarily laws and authority publications. |

## 2. New content that needs a legal check

Added where the copy had a gap a Swiss SME would care about. Please review in particular:

- **nDSG guide:** status of AI regulation in CH (Federal Council, 12 Feb 2025: ratify the CoE AI Convention, consultation draft announced by end of 2026; source added); scope limited to natural persons (Art. 5 lit. a); DSFA trigger and EDÖB consultation (Art. 22/23); vendor as processor vs. controller when it trains on customer data; **new section on fines** (Art. 60, 61, 64 DSG: up to CHF 250'000 against individuals, intent only, on complaint; CHF 50'000 against the company); exemption from the record of processing for companies under 250 employees (Art. 24 DSV).
- **US-LLM guide:** remote access counts as disclosure (Art. 5 lit. e); EU/EEA states are on Annex 1 DSV; DPF covers HR data separately; DPF fragility (Privacy Shield precedent); Art. 17 exceptions; TIA and pseudonymisation as a supplementary measure.
- **Security guide:** reporting duty for critical infrastructure limited to qualifying attacks (Art. 74a ff. ISG).
- **Policy template:** full list of sensitive data categories (Art. 5 lit. c); Art. 328b OR added to the ban on employee monitoring; Art. 21 sentence reworded (a human-reviewed decision is not an automated individual decision); privacy-notice duty stated as Art. 19 requires it (purpose, recipients, countries) instead of "name every tool"; "no disadvantage" promise limited to the act of reporting.
- **EU AI Act:** the complete timeline table, the SME relief sentence, and the four-locale tool strings.

## 3. Style changes

**Homepage headline.** "KI in der Schweiz einsetzen – auf belegter Grundlage." reads oddly because *belegt* goes with claims (*eine belegte Aussage*), not with *Grundlage*. It also brings to mind *besetzt* or *ein belegtes Brot*. The construction looks like a calque of the English "— on a sourced footing". New: **"KI im Unternehmen einsetzen – was in der Schweiz gilt."** The eyebrow is now "Für Schweizer KMU", and the "sourced, independent, monitored" message moved into the lead. Alternatives if you prefer:

- "Was beim KI-Einsatz in der Schweiz gilt." (shortest, best as `<title>`)
- "KI im Unternehmen: was erlaubt ist und was zu tun ist."

*Update 6 October 2026:* the headline is now **"KI im Unternehmen – Schweizer Vorgaben auf einen Blick"** (PR #62), with matching EN/FR/IT headlines.

Avoid "rechtssicher" or "sicher einsetzen": both promise an outcome the disclaimer then takes back, which is a misleading-advertising risk under Art. 3 Abs. 1 lit. b UWG.

**Applied throughout:**

- German punctuation: em dashes (—) replaced; slashes used as "and/or" replaced with words; fewer dash asides overall.
- Anglicisms and jargon replaced: Prompts → Eingaben, Owner → verantwortlich, Opt-out → ausschliessen/abwählen (where it isn't a product term), Zellen → Werte, Signale → Merkmale, KI-Adoption → KI-Nutzung, LLM-Entwurf → maschinell erstellt, kanonisch → massgebend, Repository, GTM/SPA-Shell, HEAD-Anfrage, "broad training measures".
- Official terms: *KI-Modell mit allgemeinem Verwendungszweck* (official DE term of the AI Act), *Standarddatenschutzklauseln* (DSG term, Art. 16 Abs. 2 lit. d), *Auftragsbearbeitungsvertrag* with "DPA" only as a gloss, *Swiss-U.S. DPF* spelled consistently, *massgebend* (Swiss legislative usage).
- One disclaimer per page: the shell already prints one under the sources, so the repeated "## Hinweis … informativ und keine Rechtsberatung" sections and intro sentences are gone. Where a Hinweis carried page-specific advice, that advice moved into the text (FINMA, EU AI Act, procurement, security).
- Accessibility: breadcrumb `aria-label` "Brotkrumen" → "Pfadnavigation".
- Consistency: "Neu beginnen" in both tools; readiness/benchmark/survey wording aligned with the privacy policy.

## 4. Open questions for the lawyer

1. **Omnibus dates (EU AI Act guide, timeline table):** confirm against the OJ text of Regulation (EU) 2026/1744: Art. 4 wording and application date (27 July 2026), new Art. 5 prohibitions from 2 December 2026, the Art. 50(2) transition to 2 December 2026, and the 2 December 2027 (Annex III) and 2 August 2028 (Annex I) dates.
2. **Datenschutzerklärung §4:** is naming the Cloudflare Swiss-U.S. DPF certification plus the SCCs in Cloudflare's DPA sufficient for Art. 19 Abs. 4? Does Cloudflare act as processor for Turnstile, or partly as controller?
3. **Datenschutzerklärung §2.6:** do Turnstile or Cloudflare's bot protection set cookies or read device data on this domain (Art. 45c FMG)? If so, "setzt keine Cookies" needs a qualification.
4. **Impressum and Datenschutz (operator decision, October 2026):** at the operator's request, the postal address has been removed from both pages in all four languages; they now show only the name and an email address. Please assess: does Art. 3 Abs. 1 lit. s UWG apply to a free information site run by a natural person? If it does, is an email enough as the "Kontaktadresse", or is a postal address (business address or P.O. box) needed? Is an email alone enough as the controller's "Kontaktdaten" under Art. 19 Abs. 2 lit. a DSG? Consider a domain email instead of a private Gmail address.
5. **Survey anonymity wording:** finding 2 is fixed in code, but an answer still stores a timestamp to the second and a company profile (size, sector, region). Is "anonym" for answers without an email still accurate, or should it say "ohne Angaben zu Ihrer Person"? See [t29-lawyer-review.md](t29-lawyer-review.md) A1.
6. **US-LLM guide, SCCs:** the previous text said the EDÖB also recognises the Council of Europe model clauses. I removed this pending verification; please confirm and re-add if correct.
7. **nDSG guide, fines:** confirm the summary of Art. 60–64 DSG, especially "verfolgt wird auf Antrag" for Art. 60 and 61.
8. **Scanner legal references:** the static-scan caveat cites "Art. 19 DSG (Informationspflicht)" as its legal basis, which does not fit a technical caveat. Remove the reference if the schema allows it.

## 5. Not changed: needs the operator or a code change

- ~~**Unlinkability (finding 2)**~~: done in #51 (2026-10-05). Whether the stronger "technisch nicht möglich" claim can return is a lawyer question: [t29-lawyer-review.md](t29-lawyer-review.md) A1.
- ~~**IP hash (finding 3)**~~: done in #51 (2026-10-05).
- **Email deletion after the report:** the privacy policy promises deletion after the notification is sent; nothing deletes automatically before 24 months. Delete manually after sending, or add a job.
- **Source registry:** `data/sources.json` still tracks the Omnibus via OEIL ("swap to EUR-Lex after OJ publication"). Swap it to EUR-Lex 2026/1744 and re-seed the snapshot.
- **US-LLM tool logic:** DPF plus training ends at "Kommt darauf an", but SCCs plus training ends at "Eher nicht vertretbar". The asymmetry is hard to justify; please decide.
- **Vendor table:** show FINMA statements as their own column, not as a certification.
- **`last_verified`:** bumped only on the EU AI Act page. Bump the others once the changes are accepted.
- **Monitoring process:** a *material* classification should open an issue or PR assigned to a person, so that a case like finding 1 cannot sit for two months.

## 6. Translations and CI after merge

- **Content pages and template:** the translate workflow regenerates EN/FR/IT on merge to `main` (all eight DE pages and the template changed).
- **EU AI Act tool:** the Omnibus/Art. 4 strings are updated in DE/EN/FR/IT. The **US-LLM tool's** sensitive-data outcome is also updated in all four. All other DE-only changes in `data/rules/*.json`, `data/scanner-checks.json` (cookie and Impressum descriptions are substantive) and `data/readiness-check.json` (4 strings; run `npm run translate:readiness`) still need EN/FR/IT.
- **UI strings:** `en.ts`, `fr.ts`, `it.ts` are not updated. Keys with a substantive change: `home.lead`, `home.methodology*Body`, `home.toolsLead`, `survey.disclaimer`, `benchmark.disclaimer`, `vendors.certFinmaRelevant`, `content.breadcrumbLabel`. The EN headline "Deploy AI in Switzerland — on a sourced footing." has the same problem as the DE one.
- **Visual baselines:** every DE page changed, so regenerate them with the *Update visual baselines* workflow before CI can pass.
