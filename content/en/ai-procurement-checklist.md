---
title: "Checklist: AI procurement for Swiss SMEs"
description: "Practical questions for vendors and internally before you buy an AI tool: data protection, hosting, contracts, governance, and EU nexus."
last_verified: "2026-07-10"
volatility: "stable"
translation_status: "draft"
reviewed_by: null
review_date: null
review_scope: null
sources:
  - title: "EDÖB – KI und Datenschutz"
    url: "https://www.edoeb.admin.ch/de/ki-und-datenschutz"
  - title: "EDÖB – Bekanntgabe von Personendaten ins Ausland"
    url: "https://www.edoeb.admin.ch/de/bekanntgabe-von-personendaten-ins-ausland"
  - title: "EUR-Lex – Verordnung (EU) 2024/1689 (AI Act)"
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A32024R1689"
  - title: "FINMA Guidance 08/2024 (PDF)"
    url: "https://www.finma.ch/en/~/media/finma/dokumente/dokumentencenter/myfinma/4dokumentation/finma-aufsichtsmitteilungen/20241218-finma-aufsichtsmitteilung-08-2024.pdf"
  - title: "Anthropic – AI Fluency framework (4D)"
    url: "https://www.anthropic.com/ai-fluency"
---

This checklist bundles questions from the topics **nDSG/AI**, **US hosting**, **EU AI Act**, and — where relevant — **FINMA governance**. It is a procurement and due-diligence aid, not legal advice and not an approval decision.

Use it before the pilot and again before go-live.

## 1. Use case and data

- Which business problem does the tool solve — and which **personal data (Personendaten)** flow in?
- Are there particularly sensitive personal data, profiling, or automated individual decisions (automatisierte Einzelentscheidung) with significant effect?
- Can you start the use case with **synthetic or anonymised** data?
- Who is the internal owner (business, IT, data protection)?

## 2. Data protection and transparency (Federal Act on Data Protection (Bundesgesetz über den Datenschutz, DSG))

- Are purpose, functioning, and data sources **transparently** explainable to data subjects (betroffene Person)?
- Is a **data protection impact assessment (Datenschutz-Folgenabschätzung)** planned for high risk?
- Can data subjects object to automatic processing or require **human review**?
- Is there a current record of processing activities (Verzeichnis der Bearbeitungstätigkeiten) (including abroad and safeguards)?

## 3. Hosting and cross-border transfer

- In which regions are data stored and processed (CH / EU / US / other)?
- For US recipients: active **Swiss-U.S. Data Privacy Framework** certification checked?
- Otherwise: recognised **standard data protection clauses (Standarddatenschutzklauseln)**, DPA, and transfer assessment in place?
- Are inputs used for **model training** — and is there an opt-out?

## 4. Contract and operations

- Data processing agreement (Auftragsbearbeiter / DPA) with clear sub-processor rules?
- Deletion periods, export, incident notification, and audit rights regulated?
- Availability, support location, and sub-processor list known?
- Exit plan: Can you take data and configurations with you?

## 5. EU AI Act (if EU nexus)

- Is the system or its **output (Ausgabe) in the EU** offered or used?
- What role do you have (provider (Anbieter) / deployer (Betreiber) / importer / distributor)?
- Risk class roughly assessed (prohibited / high-risk AI system (Hochrisiko-KI-System) / transparency / general-purpose AI model (GPAI))?
- Phased applicability deadlines mapped to the product?

## 6. Governance (especially financial sector)

- Inventory entry and risk class for the application?
- Tests of accuracy, robustness, bias, and monitoring of drift?
- Explainability to customers, audit, and supervisors?
- Independent review for material applications?

## 7. Competence and training

- Do the people who operate or approve the tool have sufficient **AI literacy (KI-Kompetenz)** (EU AI Act Art. 4, in force since 2 February 2025)?
- Are training and roles clear (business, IT, data protection) — also in the sense of FINMA's expectation of «broad training measures» for supervised institutions?
- Is there a structured competence model for everyday work with AI? One freely licensed example is the [AI Fluency 4D framework](https://www.anthropic.com/ai-fluency) (Delegation, Description, Discernment, Diligence).

## 8. Decision rule (pragmatic)

| Signal | Meaning |
|---|---|
| Green | No personal data / CH or EU hosting with clear contract / low impact |
| Amber | Personal data + abroad or automated decisions — approval with measures |
| Red | Particularly sensitive data without protection concept, unclear training use, missing DPA/transfer basis |

Amber and red: do not «try first and clean up later». Clarify the basics first, then pilot.

## Further reading

- [nDSG and AI: basics](/en/ndsg-ai-basics/)
- [US-hosted LLMs under the nDSG](/en/us-hosted-llms-ndsg/)
- [EU AI Act for Swiss companies](/en/eu-ai-act-swiss-exporters/)
- [FINMA expectations for AI governance](/en/finma-ai-expectations/)

## Disclaimer

This checklist is **informational and not legal advice**. For regulated institutions and sensitive data categories, involve specialist units and, where appropriate, legal counsel.
