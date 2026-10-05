---
title: "US-Hosted LLMs under the revised Federal Act on Data Protection (nDSG)"
description: "When Swiss companies may transfer personal data to language models in the US: Swiss-U.S. Data Privacy Framework, standard contractual clauses, information duties, and a practical checklist."
last_verified: "2026-10-01"
volatility: "fast"
translation_status: "draft"
category: "datenschutz"
reviewed_by: null
review_date: null
review_scope: null
sources:
  - title: "EDÖB – Bekanntgabe von Personendaten ins Ausland"
    url: "https://www.edoeb.admin.ch/de/bekanntgabe-von-personendaten-ins-ausland"
  - title: "EDÖB – Einsatz von ChatGPT und vergleichbaren KI-gestützten Anwendungen"
    url: "https://www.edoeb.admin.ch/de/04042023-einsatz-von-chatgpt-und-vergleichbaren-ki-gestuetzten-anwendungen"
  - title: "Fedlex – Bundesgesetz über den Datenschutz (DSG), Art. 16 und 17"
    url: "https://www.fedlex.admin.ch/eli/cc/2022/491/de"
  - title: "Fedlex – Verordnung über den Datenschutz (DSV), Anhang 1"
    url: "https://www.fedlex.admin.ch/eli/cc/2022/568/de"
  - title: "Data Privacy Framework – Participant List"
    url: "https://www.dataprivacyframework.gov/list"
---

Many generative language models (Large Language Models, LLMs) are operated in the United States. As soon as **personal data (Personendaten)** reach that country, the rules on **cross-border disclosure** apply (Art. 16 and 17 of the Federal Act on Data Protection (Bundesgesetz über den Datenschutz, DSG)). Disclosure covers not only transmitting data but also making it accessible (Art. 5 let. e DSG), for example when a provider (Anbieter) in the US can access data stored in Switzerland.

## Basic rule: adequate protection or safeguards {#transfer-abroad}

Personal data may be disclosed abroad if the Federal Council has determined that the recipient state ensures **adequate protection** (Art. 16 para. 1 DSG). The list of such states appears in **Annex 1 of the Data Protection Ordinance (Datenschutzverordnung, DSV)**; it includes, among others, all EU and EEA member states. For other states, **suitable safeguards** are required (Art. 16 para. 2 DSG), or an exception under Art. 17 DSG must apply.

The company must inform data subjects about the recipient state and, where applicable, about the safeguards or exception applied (Art. 19 para. 4 DSG). Companies that maintain a **record of processing activities (Verzeichnis der Bearbeitungstätigkeiten)** must also document this information there (Art. 12 DSG). Companies with fewer than 250 employees are exempt from the record-keeping duty in most cases (Art. 24 DSV).

## United States: Swiss-U.S. Data Privacy Framework {#swiss-us-dpf}

Since **15 September 2024**, the Federal Council recognizes adequate protection for the United States, but only for US companies certified under the **Swiss-U.S. Data Privacy Framework (DPF)** (Annex 1 DSV). This does not apply to any other recipients in the US.

Before engaging a US provider, check the following:

1. Is the exact entity that will receive your data actively certified on the public DPF participant list?
2. Does the certification expressly cover the **Swiss-U.S. DPF**, and not only the EU-U.S. DPF?
3. Does it cover the data in question? HR data (personnel data) is certified separately.

If the recipient is not appropriately certified, another legal basis is required (see next section). Keep in mind that the adequacy finding depends on the DPF's continued existence. The predecessor arrangement (Privacy Shield) was declared invalid by the Court of Justice of the EU in 2020, and the Federal Data Protection and Information Commissioner (Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter, EDÖB) subsequently found it insufficient for Switzerland as well. Many companies therefore additionally agree on standard contractual clauses (Standarddatenschutzklauseln) with important US providers.

## Without the DPF: safeguards and exceptions {#safeguards}

If no suitable DPF certification exists, disclosure may still be permissible if adequate data protection is otherwise ensured (Art. 16 para. 2 DSG), in particular through:

- **Standard contractual clauses** approved, issued, or recognized by the EDÖB, namely the European Commission's standard contractual clauses with the adaptations required for Switzerland;
- **Data protection clauses in an individual contract** that have been communicated to the EDÖB in advance;
- **Binding corporate rules** for data protection, which apply only within a corporate group.

Anyone relying on such clauses must assess whether the recipient can actually comply with them and whether the law of the recipient state — for example, regarding government access — stands in the way (Transfer Impact Assessment, TIA). Depending on the outcome, additional technical measures may be required, such as removing or pseudonymizing names in inputs.

In individual cases, Art. 17 DSG permits disclosure even without adequate protection, for instance with the explicit consent of the data subject or where disclosure is directly necessary for a contract with that person. These exceptions are rarely suitable for the ongoing use of an AI tool.

## Specific considerations for language models {#llm-specifics}

The EDÖB advises a **deliberate approach** to AI applications and reminds companies of their obligations, in particular the duty to provide transparent information about the purpose and nature of the processing.

Additionally, clarify:

- Are inputs used for **training** the model, and can this be excluded?
- Is a **data processing agreement (Auftragsbearbeitungsvertrag, DPA)** in place (Art. 9 DSG)?
- What data may be entered at all? Sensitive personal data (e.g., health data) and data subject to professional secrecy only if this has been expressly reviewed and safeguarded.
- Where are logs, embeddings, and support requests stored, and for how long?

## Quick checklist {#checklist}

| Question | Why it matters |
|---|---|
| Do inputs or outputs contain personal data? | Without personal data, the rules on cross-border disclosure do not apply |
| Is the US recipient certified under the Swiss-U.S. DPF? | Adequate protection since 15 September 2024, only for certified recipients (Annex 1 DSV) |
| If not: are standard contractual clauses and a transfer assessment (TIA) in place? | Art. 16 para. 2 DSG |
| Has a data processing agreement been concluded? | Art. 9 DSG |
| Have data subjects been informed about the state and safeguards? | Art. 19 para. 4 DSG |
| Is training on your data excluded? | Purpose limitation and transparency (Art. 6 para. 3 and Art. 19 DSG) |

Cross-border AI deployments should be assessed on a case-by-case basis, particularly where sensitive personal data is involved.
