---
title: "nDSG and AI: Basics for Swiss Companies"
description: "What the Data Protection Act means for the use of AI: transparency, automated individual decisions, data protection impact assessments, responsibilities, and fines."
last_verified: "2026-10-01"
volatility: "moderate"
translation_status: "draft"
category: "datenschutz"
reviewed_by: null
review_date: null
review_scope: null
sources:
  - title: "EDÖB – KI und Datenschutz"
    url: "https://www.edoeb.admin.ch/de/ki-und-datenschutz"
  - title: "EDÖB – Update: Geltendes Datenschutzgesetz ist auf KI direkt anwendbar"
    url: "https://www.edoeb.admin.ch/de/update-geltendes-datenschutzgesetz-ist-auf-ki-direkt-anwendbar"
  - title: "Fedlex – Bundesgesetz über den Datenschutz (DSG)"
    url: "https://www.fedlex.admin.ch/eli/cc/2022/491/de"
  - title: "Fedlex – Verordnung über den Datenschutz (DSV)"
    url: "https://www.fedlex.admin.ch/eli/cc/2022/568/de"
  - title: "Bundesrat – KI-Regulierung: Bundesrat will Konvention des Europarats ratifizieren (12.02.2025)"
    url: "https://www.admin.ch/gov/de/start/dokumentation/medienmitteilungen/bundesrat.msg-id-104110.html"
---

The revised Federal Act on Data Protection (Bundesgesetz über den Datenschutz, DSG), often referred to as the "nDSG", has been in force since 1 September 2023. The Federal Data Protection and Information Commissioner (Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter, EDÖB) has stated that the DSG is **technology-neutral** and therefore **applies directly to data processing involving AI** as well.

Switzerland does not yet have a dedicated AI act. The Federal Council intends to ratify the Council of Europe's AI Convention and to adapt Swiss law accordingly; a consultation draft has been announced for the end of 2026. This page summarizes what applies today.

## Who the DSG applies to

The DSG applies to all private companies that process **personal data (Personendaten)** — that is, information relating to an identified or identifiable natural person (Art. 5 lit. a DSG). The EDÖB explicitly names **manufacturers, providers (Anbieter), and users** of AI applications. Anyone who processes personal data using AI, whether internally or via a cloud service, must comply with the requirements of the DSG.

## Transparency and information {#transparency}

Anyone who collects personal data must adequately inform the **data subjects (betroffene Person)** concerned, typically by means of a privacy notice (Art. 19 DSG). In the EDÖB's view, when AI is used this also includes the purpose, functioning, and data sources of the processing. Where language models communicate directly with users, the EDÖB holds that those users should be informed:

- whether and to what extent they are communicating with a machine;
- whether their input is used to improve the system or for other purposes.

Where AI is used to alter the faces, images, or voices of identifiable persons (so-called deepfakes), this must be clearly recognizable, unless it is already a criminal offense in itself.

## Automated individual decisions and objection {#human-review}

Where a system makes a decision **exclusively through automated means**, and that decision produces a legal effect for the data subject or significantly affects them (e.g., the automatic rejection of a job application), Art. 21 DSG applies:

- The company must **inform** the data subject of the automated decision.
- Upon request, the person may **state their position** and demand that the decision be **reviewed by a human**.
- These obligations do not apply where the decision is directly connected with entering into or performing a contract with the person and their request is granted, or where the person has expressly consented.

Through the right of access, data subjects may also learn whether an **automated individual decision (automatisierte Einzelentscheidung)** has been made and on what logic it is based (Art. 25 para. 2 lit. f DSG).

Independently of this, data subjects may object to the processing of their data. If a company continues processing the data despite an express objection, it needs a justification for doing so, such as an overriding interest (Art. 30 para. 2 lit. b and Art. 31 DSG).

## High risks and data protection impact assessments {#dpia}

If processing may pose a **high risk** to the personality or fundamental rights of data subjects, the company must first carry out a **data protection impact assessment (Datenschutz-Folgenabschätzung, DSFA)** (Art. 22 DSG). A high risk is particularly likely when new technologies are used, when sensitive personal data is processed on a large scale, and in the case of systematic surveillance of extensive public areas. If the DSFA shows a high residual risk despite protective measures, the EDÖB must be consulted beforehand (Art. 23 DSG).

High-risk AI applications are generally permissible provided appropriate protective measures are taken. In the EDÖB's view, however, applications designed to undermine privacy and informational self-determination are impermissible — for example, blanket real-time facial recognition or "social scoring".

## Who is responsible within the company {#responsibility}

Responsibility for data protection lies with the company itself (the "controller" within the meaning of the DSG), not with the AI tool. The provider typically processes the data as a **processor (Auftragsbearbeiter)** on your behalf (Art. 9 DSG). If the provider also uses the data for its own purposes, such as training its models, it is responsible for that use itself. For your company, this constitutes a disclosure to third parties, which you must address in your privacy notice. It is therefore worth contractually excluding the use of your data for training purposes.

The DSG does not require companies to appoint an AI officer. Private companies may appoint a data protection advisor (Art. 10 DSG), but are not obliged to do so.

In practice, however, a clearly responsible person is still needed, otherwise questions and decisions go unaddressed. It has proven effective to designate a named individual who:

- keeps the register of AI tools in use up to date;
- decides on new tools or prepares such decisions;
- acts as the contact person for questions and incidents;
- organizes training and keeps the internal AI policy up to date.

In small companies, this is usually the owner or management. What matters is that the task is explicitly assigned and that time is set aside for it. Institutions supervised by FINMA are subject to more extensive expectations regarding governance and responsibilities (see [FINMA expectations for AI governance](/de/finma-ai-expectations/)).

## Fines for violations

The DSG provides for fines of up to CHF 250,000, including for violations of information and access obligations, unlawful disclosure abroad, engaging a processor without meeting the statutory requirements, and failure to meet minimum data security requirements (Art. 60 and 61 DSG). Unlike in the EU, fines are generally directed against the **responsible natural persons**, such as members of executive management, rather than against the company. Only intentional conduct is punishable, and prosecution occurs only upon request. The company itself may be fined up to CHF 50,000 if identifying the responsible individual would be disproportionate (Art. 64 DSG).

## What SMEs can do now {#next-steps}

1. **Create an overview:** Record which AI tools process personal data. Companies with fewer than 250 employees are only required to maintain a **register of processing activities (Verzeichnis der Bearbeitungstätigkeiten)** (Art. 12 DSG) if they process sensitive personal data on a large scale or carry out high-risk profiling (Art. 24 of the **Data Protection Ordinance (Datenschutzverordnung, DSV)**).
2. **Update your privacy notice and internal rules.** The [AI policy template (Word)](download:ai-policy-template) serves as a starting point.
3. **Carry out a DSFA where high risk is present**, before the application goes live.
4. **Clarify matters with providers:** processing agreement, training on your data, storage location, and disclosure abroad (see [US-hosted LLMs under the nDSG](/de/us-hosted-llms-ndsg/)).
5. **Ensure human review** where AI makes or prepares decisions with a significant effect on individuals.
6. **Designate a responsible person** (see [Who is responsible within the company](#responsibility)).
