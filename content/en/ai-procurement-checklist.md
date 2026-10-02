---
title: "Checklist: AI Procurement for Swiss SMEs"
description: "Practical questions for providers and internal teams before purchasing an AI tool: data protection, hosting, contracts, governance, and EU relevance."
last_verified: "2026-10-01"
volatility: "stable"
translation_status: "draft"
category: "beschaffung"
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

This checklist bundles questions from the topics **revised Federal Act on Data Protection (Bundesgesetz über den Datenschutz, DSG)/AI**, **US hosting**, **EU AI Act**, and – where relevant – **FINMA governance**. It is a procurement and due-diligence tool, not legal advice and not an approval decision.

Use it before the pilot and again before going into production.

## 1. Use Case and Data

- What business problem does the tool solve – and what **personal data (Personendaten)** is involved?
- Is there especially sensitive data, profiling, or automated individual decisions with significant effects?
- Can you start the use case with **synthetic or anonymized** data?
- Who is the internal owner (business unit, IT, data protection)?

## 2. Data Protection and Transparency (DSG)

- Are the purpose, functioning, and data sources **transparently** explainable to data subjects?
- Is a **data protection impact assessment (Datenschutz-Folgenabschätzung, DSFA)** planned in cases of high risk?
- Can data subjects object to automated processing or request **human review**?
- Is there an up-to-date **record of processing activities (Verzeichnis der Bearbeitungstätigkeiten)** (including foreign processing and safeguards)?

## 3. Hosting and Cross-Border Transfer {#hosting-transfer}

- In which regions is data stored and processed (CH / EU / US / other)?
- For US recipients: has active **Swiss-U.S. Data Privacy Framework** certification been verified?
- Otherwise: are recognized **standard contractual clauses (Standarddatenschutzklauseln)**, a DPA, and a transfer assessment in place?
- Is input data used for **model training** – and is there an opt-out?

## 4. Contract and Operations {#contract-operations}

- Is there a data processing agreement (DPA) with clear subprocessor rules?
- Are deletion periods, export, incident notification, and audit rights regulated?
- Are availability, support location, and the subprocessor list known?
- Exit plan: can you take your data and configurations with you?

## 5. EU AI Act (if there is an EU connection) {#eu-ai-act}

- Is the system or its **output offered or used in the EU**?
- What role do you hold (provider (Anbieter) / deployer (Betreiber) / importer / distributor)?
- Has the risk class been roughly assessed (prohibited / high-risk / transparency / GPAI)?
- Have the staggered applicability deadlines been mapped to the product?

## 6. Governance (particularly in the financial sector)

- Is there an inventory entry and risk class for the application?
- Are there tests for accuracy, robustness, bias, and monitoring for drift?
- Is explainability provided to customers, auditors, and supervisors?
- Is there independent review for material applications?

## 7. Literacy and Training {#ai-literacy}

- Do the people operating or approving the tool have sufficient **AI literacy (KI-Kompetenz)** (EU AI Act Art. 4, in force since February 2, 2025)?
- Are training and roles clearly defined (business unit, IT, data protection) – also in line with FINMA's expectation of "broad training measures" at supervised institutions?
- Is there a structured competency model for everyday use of AI? One freely licensed example is the [AI Fluency 4D Framework](https://www.anthropic.com/ai-fluency) (Delegation, Description, Discernment, Diligence).

## 8. Decision Rule (pragmatic)

| Traffic light | Meaning |
|---|---|
| Green | No personal data / CH or EU hosting with a clear contract / low impact |
| Yellow | Personal data + foreign processing or automated decisions – approval with safeguards |
| Red | Especially sensitive data without a protection concept, unclear training use, missing DPA/transfer basis |

Yellow and Red: not "try it out and clean up later." Clarify the fundamentals first, then pilot.

## Further Reading

- [DSG and AI: Fundamentals](/de/ndsg-ai-basics/)
- [US-Hosted LLMs under the DSG](/de/us-hosted-llms-ndsg/)
- [EU AI Act for Swiss Companies](/de/eu-ai-act-swiss-exporters/)
- [FINMA Expectations for AI Governance](/de/finma-ai-expectations/)
- [AI Policy Template (Word)](download:ai-policy-template)

## Note

This checklist is **informational and not legal advice**. For regulated institutions and sensitive data categories, involve specialist departments and, where necessary, legal counsel.
