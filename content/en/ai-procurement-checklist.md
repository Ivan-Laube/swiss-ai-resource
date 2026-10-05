---
title: "Checklist: AI Procurement for Swiss SMEs"
description: "Practical questions for providers and for your own company before purchasing an AI tool: data protection, hosting, contracts, governance, and EU relevance."
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
  - title: "EUR-Lex – Verordnung (EU) 2026/1744 (Digital Omnibus on AI)"
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32026R1744"
  - title: "FINMA Guidance 08/2024 (PDF)"
    url: "https://www.finma.ch/en/~/media/finma/dokumente/dokumentencenter/myfinma/4dokumentation/finma-aufsichtsmitteilungen/20241218-finma-aufsichtsmitteilung-08-2024.pdf"
  - title: "Anthropic – AI Fluency framework (4D)"
    url: "https://www.anthropic.com/ai-fluency"
---

This checklist summarizes the key questions on **data protection**, **hosting abroad**, the **EU AI Act**, and, where relevant, **FINMA governance**. It helps with selecting and reviewing an AI tool, but it does not replace a legal review or the company's approval decision.

Work through the questions before the pilot project and again before productive use.

## 1. Use Case and Data

- What problem is the tool meant to solve, and what personal data (Personendaten) is involved?
- Is particularly sensitive personal data, profiling, or automated individual decisions with significant effect involved?
- Can the use case be started with **synthetic or anonymized** data?
- Who is internally responsible (business unit, IT, data protection)?

## 2. Data Protection and Transparency (DSG)

- Can the purpose, functioning, and data sources be **explained in an understandable way** to data subjects, and is this reflected in the privacy policy?
- Is a **data protection impact assessment (Datenschutz-Folgenabschätzung, DSFA)** planned in case of high risk (Art. 22 DSG)?
- Does the tool decide exclusively through automated means about individuals? If so, data subjects must be informed and must be able to request **review by a human** (Art. 21 DSG).
- Is the tool recorded in the record of processing activities (Verzeichnis der Bearbeitungstätigkeiten), with details on foreign processing and safeguards? This record is mandatory from 250 employees onward or for processing with high risk (Art. 12 DSG, Art. 24 DSV).

## 3. Hosting and Disclosure Abroad {#hosting-transfer}

- In which countries is the data stored and processed (CH / EU / USA / other), and from where does the provider (Anbieter) have access, for example for support purposes?
- For US recipients: Has certification under the **Swiss-U.S. Data Privacy Framework** been verified?
- Otherwise: Are recognized **standard contractual clauses (Standarddatenschutzklauseln)** agreed upon, and is the transfer assessment documented?
- Is input data used for **training**, and can this be excluded?

## 4. Contract and Operations {#contract-operations}

- Is there a **data processing agreement** (DPA) in place, with clear rules for sub-processors?
- Are deletion periods, data export, reporting of security incidents, and audit rights regulated?
- Are availability, support location, and the list of sub-processors known?
- Exit plan: Can you take data and configurations with you if you switch providers?

## 5. EU AI Act (Where EU Relevance Applies) {#eu-ai-act}

- Is the system or its **output offered or used in the EU**?
- What role do you have (provider (Anbieter), operator (Betreiber), importer, distributor)?
- How is the system broadly classified (prohibited, high-risk, subject to transparency obligations, GPAI, or without special obligations)?
- Are the applicable deadlines mapped to the product (see [timeline](/en/eu-ai-act-swiss-exporters/#timeline))?

## 6. Governance (Especially in the Financial Sector)

- Is the application recorded and classified in the AI inventory?
- Are there tests for accuracy, robustness, and bias, as well as monitoring for changes (drift)?
- Can results be explained to customers, audit firms, and supervisory authorities?
- Are material applications reviewed independently?

## 7. Competence and Training {#ai-literacy}

- Do the people using or approving the tool know enough about AI, its limitations, and its risks? If your company falls under the EU AI Act, you must take measures to promote this **AI literacy (KI-Kompetenz)** (Art. 4, in the version effective from July 27, 2026).
- Are training programs and roles clearly regulated (business unit, IT, data protection)? Supervised financial institutions should also take into account FINMA's expectation of broadly designed training programs.
- Is there a model that training can be based on? One freely available example is the [AI Fluency 4D Framework](https://www.anthropic.com/ai-fluency) (Delegation, Description, Discernment, Diligence).

## 8. Decision Rule (Simplified Traffic Light)

| Traffic Light | Typical Situation |
|---|---|
| Green | No personal data, or hosting in Switzerland or the EU with a data processing agreement; low impact on individuals |
| Yellow | Personal data with disclosure abroad or automated decisions: approval only with mitigating measures |
| Red | Particularly sensitive personal data without a protection concept, unclear use for training, missing data processing agreement, or missing legal basis for disclosure abroad |

For Yellow and Red, the rule is: do not "try it out and clean up later." First clarify the fundamentals, then start the pilot project. For regulated institutions and sensitive data, it is advisable to involve data protection or legal specialists.

## Further Reading

- [nDSG and AI: Fundamentals](/en/ndsg-ai-basics/)
- [US-Hosted LLMs under the nDSG](/en/us-hosted-llms-ndsg/)
- [EU AI Act: Scope for Swiss Companies](/en/eu-ai-act-swiss-exporters/)
- [FINMA Expectations on AI Governance](/en/finma-ai-expectations/)
- [AI and Cybersecurity: Risks for SMEs](/en/ai-security-risks/)
- [AI Policy Template (Word)](download:ai-policy-template)
