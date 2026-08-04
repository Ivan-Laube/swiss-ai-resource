---
title: "US-hosted LLMs under the nDSG"
description: "When Swiss companies may disclose personal data to US-hosted language models: adequacy, Swiss-U.S. Data Privacy Framework, contractual safeguards, and practical checks."
last_verified: "2026-07-10"
volatility: "fast"
translation_status: "draft"
reviewed_by: null
review_date: null
review_scope: null
sources:
  - title: "EDÖB – Bekanntgabe von Personendaten ins Ausland"
    url: "https://www.edoeb.admin.ch/de/bekanntgabe-von-personendaten-ins-ausland"
  - title: "EDÖB – Einsatz von ChatGPT und vergleichbaren KI-gestützten Anwendungen"
    url: "https://www.edoeb.admin.ch/de/04042023-einsatz-von-chatgpt-und-vergleichbaren-ki-gestuetzten-anwendungen"
  - title: "Fedlex – Bundesgesetz über den Datenschutz (DSG), Art. 16"
    url: "https://www.fedlex.admin.ch/eli/cc/2022/491/de"
  - title: "Data Privacy Framework – Participant List"
    url: "https://www.dataprivacyframework.gov/list"
---

Many generative language models (LLMs) are operated in the USA. As soon as **personal data (Personendaten)** leave Switzerland, the rules on **disclosure of personal data abroad (Bekanntgabe von Personendaten ins Ausland)** apply (Art. 16 and 17 of the Federal Act on Data Protection (Bundesgesetz über den Datenschutz, DSG)). This page explains the framework for Swiss companies — without replacing legal advice.

## Starting point: personal data and cross-border transfer

Personal data may in principle only be disclosed abroad if the recipient country has an **adequate level of data protection (angemessenes Datenschutzniveau)** or **suitable safeguards** apply. Whether a state is adequate is determined by the Federal Council in **Annex 1 of the Ordinance on Data Protection (Datenschutzverordnung, DSV)**.

The data subject (betroffene Person) must be informed about a disclosure of data abroad (Art. 19 para. 4 DSG). Countries and safeguards are among the mandatory particulars in the record of processing activities (Verzeichnis der Bearbeitungstätigkeiten) (Art. 12 DSG).

## USA and Swiss-U.S. Data Privacy Framework

On **15 September 2024**, the amendment to the list of states (Annex 1 DSV) regarding the USA entered into force. The related legal framework — the **Swiss-U.S. Data Privacy Framework (DPF)** — applies to **certified** US organisations.

Practical check before using a US provider:

1. Is the specific recipient actively certified on the public DPF participant list?
2. Does the certification expressly cover the **Swiss-U.S.** extension (not only EU-U.S.)?
3. Does the certified processing purpose match your use case (e.g. cloud AI, support, analytics)?

Without a matching certification, «the provider is based in the USA» alone is **not** an adequacy basis.

## When no adequacy decision applies

If there is no adequacy decision (or it does not apply to the specific recipient), transfers may still be permissible if data protection is otherwise ensured — in particular through:

- **standard data protection clauses (Standarddatenschutzklauseln)** (recognised or approved by the Federal Data Protection and Information Commissioner (Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter, EDÖB); the EU SCCs and CoE MCCs are recognised by the EDÖB);
- **data protection clauses in a specific contract** (with a duty to notify the EDÖB);
- **binding corporate rules (BCR)**.

The controller (Verantwortlicher) must ensure that the recipient can comply with the clauses and that the law of the third country does not prevent this. Technical measures may be necessary if disproportionate government access is a risk.

## LLM-specific points

The EDÖB advises users to handle AI applications **consciously** and reminds companies of their duties — in particular transparent information about purposes and the nature of processing.

Also clarify:

- Are inputs used for **model training**? Is there an opt-out?
- Is there a **data processing agreement (Auftragsbearbeiter / DPA)**?
- Which data categories may be entered at all (no particularly sensitive personal data without a clear legal basis and protective measures)?
- Where are logs, embeddings, and support tickets stored?

## Short checklist

| Question | Why it matters |
|---|---|
| Do prompts contain personal data? | Without personal data, no cross-border transfer issue under the DSG |
| Is the US recipient Swiss-U.S. DPF-certified? | Possible adequacy basis since 15.09.2024 |
| Otherwise SCC/DPA and transfer assessment? | Art. 16 para. 2 DSG |
| Information of data subjects? | Art. 19 para. 4 DSG |
| Training use and opt-out clarified? | Transparency and purpose limitation |

## Disclaimer

This page is **informational and not legal advice**. Cross-border AI deployments should be assessed on a case-by-case basis.
