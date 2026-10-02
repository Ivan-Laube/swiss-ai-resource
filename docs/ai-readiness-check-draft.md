# Draft: AI readiness check for Swiss SMEs (KI-Check für KMU)

**Status:** Signed off 2026-10-02 (T45). Implemented as data in [`data/readiness-check.json`](../data/readiness-check.json) (T46); change the check there, not here — see [data/README.md](../data/README.md#readiness-check-readiness-checkjson).
**Languages:** EN and DE here. FR and IT will go through the normal translation pipeline once DE is final, and DE is canonical.
**Proposed route:** `/[lang]/tools/ai-readiness/`. The data lives in `data/readiness-check.json` (not `data/rules/`, whose loader reads every file there as a decision tree).

## Open questions

None at the moment. The six questions from the last review were answered on 2026-10-02; the decisions are in section 9.

---

## 1. Purpose and principles

- **What it does.** In about 5–6 minutes, a KMU can see where its AI use stands on data protection, internal rules and EU exposure. It also gets the three most important next steps, each linked to an existing guide or tool.
- **Not a certification and not legal advice.** The result says "orientation," never "compliant." The disclaimer (section 7) is shown before and after the check.
- **Nothing leaves the browser.** Scoring runs entirely on the client and there is no server call. v1 has no partner handoff (section 8).
- **Neutral.** The questions, scoring and recommendations never name a vendor. Vendor references point to the vendor table only.
- **Written for small firms.** Each "2" answer is reachable for a 10-person company without a compliance department. Where a requirement scales with size, the notes say so.

---

## 1a. Links go to the relevant section

Every "Link" in this document means a link to the **specific section** of the guide that answers that question, not to the top of the page. Links are written as `slug#anchor` (e.g. `ndsg-ai-basics#transparenz`) using the stable anchors described in the plan (T56–T59). The exact anchors are filled in at T46; where a guide has no section that matches a question, a section is added to the guide. Tool links (e.g. the EU AI Act check) go to the tool's start.

## 2. Structure

| Part | Content | Scored |
|---|---|---|
| Profile | P1 company size, P2 AI usage stage, P3 FINMA supervision | No. Used for the benchmark and to add links. |
| D1 | Overview & usage (*Überblick & Nutzung*) | Q1–Q2 |
| D2 | Data & contracts (*Daten & Verträge*) | Q3–Q4 |
| D3 | Rules & people (*Regeln & Mitarbeitende*) | Q5–Q6 |
| D4 | Transparency & decisions (*Transparenz & Entscheide*) | Q7–Q8 |
| D5 | Risk & EU exposure (*Risiko & EU-Bezug*) | Q9–Q10 |
| D6 | Responsibility & incidents (*Verantwortung & Vorfälle*) | Q11–Q12 |
| Security | AI security, initial assessment (*KI-Sicherheit, Ersteinschätzung*) | S1–S3, separate result (section 4a). S2 only shown if S1 ≠ N/A. |

There are 12 scored questions. Each has three options scored **0 / 1 / 2**. Q3, Q7, Q8 and Q10 also offer **"not applicable" (N/A)**.

---

## 3. Profile questions (not scored)

### P1. Company size
- **EN:** How many employees does your company have?
- **DE:** Wie viele Mitarbeitende hat Ihr Unternehmen?
- Options: same IDs as survey `company-size` (`1`, `2-9`, `10-49`, `50-249`, `250-999`, `1000-plus`, survey v4), so benchmarks can be filtered by size.

### P2. AI usage stage
- **EN:** How far along is your company with AI?
- **DE:** Wie weit ist Ihr Unternehmen bei der KI-Nutzung?
- Options: same IDs as survey `ai-maturity` (`not-using`, `individual-ad-hoc`, `sanctioned-tools`, `piloting-custom`, `production`).
- If `not-using`, a note is shown before Q1:
  - **EN:** Even if your company has not introduced AI, employees may already be using it on their own. Answer for the actual situation.
  - **DE:** Auch wenn Ihr Unternehmen KI nicht offiziell eingeführt hat, nutzen Mitarbeitende sie womöglich bereits auf eigene Faust. Antworten Sie für die tatsächliche Situation.

### P3. FINMA supervision
- **EN:** Is your company supervised by FINMA (e.g. bank, insurer, asset manager)?
- **DE:** Untersteht Ihr Unternehmen der FINMA-Aufsicht (z. B. Bank, Versicherung, Vermögensverwalter)?
- Options: `yes` / `no` / `unsure`
- If `yes` or `unsure`, the result adds the guide `finma-ai-expectations` and a note that FINMA expects more than this check covers.

---

## 4. Scored questions

### D1 · Overview & usage / Überblick & Nutzung

#### Q1 `inventory`. AI inventory
- **EN:** Do you know which AI tools are used in your company, including free tools employees use on their own?
- **DE:** Wissen Sie, welche KI-Tools in Ihrem Unternehmen genutzt werden, auch kostenlose Tools, die Mitarbeitende selbst verwenden?

| Score | EN | DE |
|---|---|---|
| 0 | No, we have no overview. | Nein, wir haben keinen Überblick. |
| 1 | Roughly, but nothing is written down. | Ungefähr, aber nichts ist schriftlich festgehalten. |
| 2 | Yes, a written list that is kept current (tool, purpose, data used, owner). | Ja, eine schriftliche Liste, die aktuell gehalten wird (Tool, Zweck, verwendete Daten, verantwortliche Person). |

- **Severity:** medium · **Survey benchmark:** `ai-governance-measures` = `tool-inventory`
- **Action EN:** Make a one-page list of every AI tool in use, what it is used for and what data goes into it. Ask your team, because the tools you don't know about are the risky ones.
- **Action DE:** Erstellen Sie eine einseitige Liste aller genutzten KI-Tools mit Zweck und verwendeten Daten. Fragen Sie im Team nach, denn riskant sind gerade die Tools, von denen Sie nichts wissen.
- **Link:** `ai-procurement-checklist`

#### Q2 `tool-approval`. Which tools are allowed
- **EN:** Can employees use any AI tool they choose for work?
- **DE:** Dürfen Mitarbeitende für die Arbeit beliebige KI-Tools nach eigener Wahl nutzen?

| Score | EN | DE |
|---|---|---|
| 0 | Yes, there is no rule. | Ja, es gibt keine Regel. |
| 1 | There is informal guidance (e.g. "don't paste customer data"). | Es gibt informelle Vorgaben (z. B. «keine Kundendaten eingeben»). |
| 2 | Approved tools are defined, including AI browser extensions, plug-ins and connectors; other tools need approval first. | Freigegebene Tools sind definiert, auch KI-Browsererweiterungen, Plug-ins und Konnektoren; andere Tools brauchen vorher eine Freigabe. |

- **Severity:** medium
- **Action EN:** Pick the tools you allow (ideally business accounts with a data processing agreement) and say clearly that anything else needs approval first.
- **Action DE:** Legen Sie fest, welche Tools erlaubt sind (idealerweise Business-Konten mit Auftragsbearbeitungsvertrag), und kommunizieren Sie klar, dass alles andere vorher freigegeben werden muss.
- **Link:** `ai-procurement-checklist`, vendor table

### D2 · Data & contracts / Daten & Verträge

#### Q3 `accounts-dpa`. Accounts and contracts for sensitive data ⚑
- **EN:** When personal or confidential data goes into AI tools, what kind of accounts are used?
- **DE:** Wenn Personendaten oder vertrauliche Daten in KI-Tools gelangen, welche Art von Konten wird genutzt?

| Score | EN | DE |
|---|---|---|
| 0 | Free or personal accounts, or we don't know. | Kostenlose oder private Konten, oder wir wissen es nicht. |
| 1 | Business accounts, but we haven't checked the terms (data processing agreement, use of data for training). | Business-Konten, aber die Bedingungen (Auftragsbearbeitungsvertrag, Nutzung der Daten für Training) haben wir nicht geprüft. |
| 2 | Business accounts with a signed data processing agreement, and training on our data is excluded. | Business-Konten mit unterzeichnetem Auftragsbearbeitungsvertrag, und das Training mit unseren Daten ist ausgeschlossen. |
| N/A | We have verified that no personal or confidential data goes into AI tools. | Wir haben sichergestellt, dass keine Personendaten oder vertraulichen Daten in KI-Tools gelangen. |

- **Severity:** high · **Red flag if 0** · **Survey benchmark:** `business-dpa`
- **Legal hook:** nDSG Art. 9 (processing by processors), professional secrecy where applicable.
- **Action EN:** Move work that involves personal or confidential data to business accounts, sign the provider's data processing agreement and switch off training on your data.
- **Action DE:** Verlagern Sie Arbeiten mit Personendaten oder vertraulichen Daten auf Business-Konten, unterzeichnen Sie den Auftragsbearbeitungsvertrag des Anbieters und deaktivieren Sie das Training mit Ihren Daten.
- **Link:** `us-hosted-llms-ndsg`, vendor table (DPA / training opt-out columns)

#### Q4 `data-location`. Where data is processed
- **EN:** Do you know where your AI providers process and store your data, and is disclosure abroad legally covered?
- **DE:** Wissen Sie, wo Ihre KI-Anbieter Ihre Daten bearbeiten und speichern, und ist die Bekanntgabe ins Ausland rechtlich abgedeckt?

| Score | EN | DE |
|---|---|---|
| 0 | We don't know. | Wir wissen es nicht. |
| 1 | We know the region, but haven't checked the legal basis for disclosure abroad. | Wir kennen die Region, haben aber die Rechtsgrundlage für die Bekanntgabe ins Ausland nicht geprüft. |
| 2 | Known and documented (e.g. Switzerland/EU, a US provider certified under the Swiss-US Data Privacy Framework, or standard contractual clauses). | Bekannt und dokumentiert (z. B. Schweiz/EU, ein unter dem Swiss-US Data Privacy Framework zertifizierter US-Anbieter oder Standardvertragsklauseln). |

- **Severity:** high
- **Legal hook:** nDSG Art. 16–17 (disclosure abroad), Federal Council list of countries with adequate protection (DSV Annex 1).
- **Action EN:** For each tool on your list, note where data is processed and on what basis it may go there. Use the US-hosted LLM tool to check.
- **Action DE:** Halten Sie für jedes Tool auf Ihrer Liste fest, wo die Daten bearbeitet werden und auf welcher Grundlage sie dorthin gelangen dürfen. Prüfen Sie dies mit dem Tool zu US-gehosteten LLMs.
- **Link:** tool `us-hosted-llm-ndsg`, `us-hosted-llms-ndsg`, vendor table (hosting region column)

### D3 · Rules & people / Regeln & Mitarbeitende

#### Q5 `usage-policy`. Written AI policy
- **EN:** Does your company have written rules for using AI at work?
- **DE:** Hat Ihr Unternehmen schriftliche Regeln für den Einsatz von KI bei der Arbeit?

| Score | EN | DE |
|---|---|---|
| 0 | No. | Nein. |
| 1 | A draft, or informal guidance (e.g. an email). | Einen Entwurf oder informelle Vorgaben (z. B. eine E-Mail). |
| 2 | Yes, written, communicated to everyone and acknowledged by them. | Ja, schriftlich, allen kommuniziert und von ihnen zur Kenntnis genommen. |

- **Severity:** medium · **Survey benchmark:** `usage-policy`
- **Action EN:** Write a short AI policy (one to two pages): approved tools, data that must not go in, checking outputs and who to ask. Have every employee confirm they have read it.
- **Action DE:** Verfassen Sie eine kurze KI-Richtlinie (ein bis zwei Seiten): freigegebene Tools, Daten, die nicht eingegeben werden dürfen, Prüfung der Ergebnisse und Ansprechperson. Lassen Sie alle Mitarbeitenden die Kenntnisnahme bestätigen.
- **Link:** AI policy template download (Word, generated at build; drafts: [ai-policy-template-de.md](ai-policy-template-de.md), [ai-policy-template-en.md](ai-policy-template-en.md)), `ndsg-ai-basics`

#### Q6 `training`. AI literacy
- **EN:** Do employees who use AI know its limits and risks (e.g. made-up answers, confidentiality)?
- **DE:** Kennen Mitarbeitende, die KI nutzen, deren Grenzen und Risiken (z. B. erfundene Antworten, Vertraulichkeit)?

| Score | EN | DE |
|---|---|---|
| 0 | We haven't addressed this. | Das haben wir nicht thematisiert. |
| 1 | Sometimes, or people learn it themselves. | Gelegentlich, oder die Mitarbeitenden eignen es sich selbst an. |
| 2 | Everyone who uses AI has been briefed, and this is documented and repeated. | Alle, die KI nutzen, wurden instruiert, dies ist dokumentiert und wird wiederholt. |

- **Severity:** low (raised to medium if Q10 shows EU exposure, since EU AI Act Art. 4 on AI literacy applies to providers and deployers in scope) · **Survey benchmark:** `staff-training`
- **Action EN:** Run a one-hour briefing on what AI does well and badly, what data must not go in and how to check outputs. Record who attended.
- **Action DE:** Führen Sie eine einstündige Schulung durch: Was KI gut und schlecht kann, welche Daten nicht hineingehören und wie man Ergebnisse prüft. Halten Sie fest, wer teilgenommen hat.
- **Link:** `ndsg-ai-basics`, `eu-ai-act-swiss-exporters` (Art. 4)

### D4 · Transparency & decisions / Transparenz & Entscheide

#### Q7 `transparency`. Telling people about AI use
- **EN:** Do you tell customers, applicants or employees when AI processes their data or interacts with them (e.g. chatbot, AI-generated content)?
- **DE:** Informieren Sie Kundinnen und Kunden, Bewerbende oder Mitarbeitende, wenn KI ihre Daten bearbeitet oder mit ihnen interagiert (z. B. Chatbot, KI-generierte Inhalte)?

| Score | EN | DE |
|---|---|---|
| 0 | No. | Nein. |
| 1 | Partly (e.g. a general mention in the privacy notice). | Teilweise (z. B. allgemeiner Hinweis in der Datenschutzerklärung). |
| 2 | Yes: the privacy notice names the AI processing and providers, and chatbots are labelled as AI. | Ja: Die Datenschutzerklärung nennt die KI-Bearbeitung und Anbieter, und Chatbots sind als KI gekennzeichnet. |
| N/A | Our AI use does not involve other people's data and is not visible to them. | Unsere KI-Nutzung betrifft keine Daten Dritter und ist für sie nicht sichtbar. |

- **Severity:** medium
- **Legal hook:** nDSG Art. 19 (duty to inform), EDÖB position (Nov 2023) that the nDSG applies directly to AI, including transparency about purpose and interaction with AI; EU AI Act Art. 50 where in scope.
- **Action EN:** Update your privacy notice to name the AI tools that process personal data and why. Label chatbots and AI-generated content clearly.
- **Action DE:** Ergänzen Sie Ihre Datenschutzerklärung um die KI-Tools, die Personendaten bearbeiten, und deren Zweck. Kennzeichnen Sie Chatbots und KI-generierte Inhalte deutlich.
- **Link:** `ndsg-ai-basics`

#### Q8 `automated-decisions`. Decisions about people ⚑
- **EN:** Does AI make or substantially prepare decisions about people (e.g. hiring, credit, prices, contract terminations)?
- **DE:** Trifft KI Entscheide über Personen oder bereitet sie massgeblich vor (z. B. Rekrutierung, Kredit, Preise, Kündigungen)?

| Score | EN | DE |
|---|---|---|
| 0 | Yes, without human review. | Ja, ohne Prüfung durch einen Menschen. |
| 1 | Yes, a person reviews the result, but the process is not documented. | Ja, eine Person prüft das Ergebnis, aber der Ablauf ist nicht dokumentiert. |
| 2 | Yes, with documented human review, and affected people can ask for a person to look at their case. | Ja, mit dokumentierter menschlicher Prüfung, und Betroffene können verlangen, dass eine Person ihren Fall beurteilt. |
| N/A | No, AI does not make or prepare decisions about people. | Nein, KI trifft oder bereitet keine Entscheide über Personen vor. |

- **Severity:** high · **Red flag if 0** · **Survey benchmark:** `human-review`
- **Legal hook:** nDSG Art. 21 (automated individual decisions: duty to inform, right to state one's view and request human review), Art. 22 (DPIA).
- **Action EN:** Make sure a person checks every AI-supported decision about individuals, write down how, and tell affected people they can ask for a human review.
- **Action DE:** Stellen Sie sicher, dass eine Person jeden KI-gestützten Entscheid über Einzelpersonen prüft, halten Sie den Ablauf schriftlich fest und informieren Sie Betroffene über ihr Recht auf menschliche Überprüfung.
- **Link:** `ndsg-ai-basics`

### D5 · Risk & EU exposure / Risiko & EU-Bezug

#### Q9 `risk-assessment`. Checking new use cases
- **EN:** Before introducing a new AI use, do you assess the risks (data protection, errors, confidentiality)?
- **DE:** Prüfen Sie vor der Einführung einer neuen KI-Anwendung die Risiken (Datenschutz, Fehler, Vertraulichkeit)?

| Score | EN | DE |
|---|---|---|
| 0 | No. | Nein. |
| 1 | Sometimes, informally. | Manchmal, informell. |
| 2 | Yes, with a set checklist, and a data protection impact assessment where the risk is high. | Ja, mit einer festen Checkliste und bei hohem Risiko mit einer Datenschutz-Folgenabschätzung. |

- **Severity:** medium · **Survey benchmark:** `dpia`
- **Legal hook:** nDSG Art. 22 (DPIA for high-risk processing).
- **Action EN:** Use a short checklist before each new AI use: what data, which provider, what happens if it's wrong. Run a data protection impact assessment if the risk is high.
- **Action DE:** Nutzen Sie vor jeder neuen KI-Anwendung eine kurze Checkliste: welche Daten, welcher Anbieter, was passiert bei Fehlern. Führen Sie bei hohem Risiko eine Datenschutz-Folgenabschätzung durch.
- **Link:** `ai-procurement-checklist`, `ndsg-ai-basics`

#### Q10 `eu-exposure`. EU AI Act check ⚑
- **EN:** Have you checked whether the EU AI Act applies to your company?
- **DE:** Haben Sie geprüft, ob der EU AI Act für Ihr Unternehmen gilt?

| Score | EN | DE |
|---|---|---|
| 0 | No, although we have EU customers or our AI output is used in the EU. | Nein, obwohl wir EU-Kundschaft haben oder unser KI-Output in der EU verwendet wird. |
| 1 | We assume it doesn't apply, but haven't checked properly. | Wir gehen davon aus, dass er nicht gilt, haben es aber nicht richtig geprüft. |
| 2 | Yes, checked and documented (our role and the obligations, or why it doesn't apply). | Ja, geprüft und dokumentiert (unsere Rolle und die Pflichten oder weshalb er nicht gilt). |
| N/A | We have no EU customers or users, and none of our AI output is used in the EU. | Wir haben keine Kundschaft oder Nutzende in der EU, und kein KI-Output wird in der EU verwendet. |

- **Severity:** high · **Red flag if 0** · **Survey benchmark:** `eu-market-exposure` (share answering `unsure`)
- **Action EN:** Take the 3-minute EU AI Act tool and keep the result, including your role (provider or deployer) and which deadlines apply.
- **Action DE:** Machen Sie den 3-Minuten-Check zum EU AI Act und bewahren Sie das Ergebnis auf, inklusive Ihrer Rolle (Anbieter oder Betreiber) und der geltenden Fristen.
- **Link:** tool `eu-ai-act-applicability`, `eu-ai-act-swiss-exporters`

### D6 · Responsibility & incidents / Verantwortung & Vorfälle

#### Q11 `ownership`. Who is responsible
- **EN:** Is someone responsible for how AI is used in your company?
- **DE:** Ist jemand für den KI-Einsatz in Ihrem Unternehmen verantwortlich?

| Score | EN | DE |
|---|---|---|
| 0 | No one. | Niemand. |
| 1 | Implicitly (e.g. IT or management), but not formally assigned. | Stillschweigend (z. B. IT oder Geschäftsleitung), aber nicht formell zugewiesen. |
| 2 | A named person is responsible and has time for it. | Eine namentlich bestimmte Person ist zuständig und hat Zeit dafür. |

- **Severity:** low · **Survey benchmark:** `ai-owner`
- **Size note:** for `1` and `2-9`, the owner or managing director counts as "named."
- **Action EN:** Name one person who keeps the tool list current, approves new tools and answers questions. Give them a little time each month to do it.
- **Action DE:** Bestimmen Sie eine Person, die die Tool-Liste aktuell hält, neue Tools freigibt und Fragen beantwortet. Geben Sie ihr jeden Monat etwas Zeit dafür.
- **Link:** `ndsg-ai-basics`

#### Q12 `incidents`. When something goes wrong
- **EN:** What happens if an AI tool causes a problem (e.g. confidential data entered, wrong output sent to a customer)?
- **DE:** Was passiert, wenn ein KI-Tool ein Problem verursacht (z. B. vertrauliche Daten eingegeben, falsches Ergebnis an Kundschaft verschickt)?

| Score | EN | DE |
|---|---|---|
| 0 | We have no plan. | Wir haben keinen Plan. |
| 1 | We would deal with it case by case. | Wir würden es von Fall zu Fall lösen. |
| 2 | There is a defined process, including checking whether to report a data breach to the FDPIC. | Es gibt einen festgelegten Ablauf, inklusive Prüfung einer Meldung an den EDÖB bei einer Datensicherheitsverletzung. |

- **Severity:** low
- **Legal hook:** nDSG Art. 24 (report data security breaches to the FDPIC/EDÖB).
- **Action EN:** Write down who to contact if something goes wrong, how to stop the damage, and when a data breach has to be reported to the FDPIC.
- **Action DE:** Halten Sie fest, wer bei einem Vorfall zu kontaktieren ist, wie der Schaden begrenzt wird und wann eine Datensicherheitsverletzung dem EDÖB gemeldet werden muss.
- **Link:** `ai-security-risks` (section on what to do when something goes wrong), `ndsg-ai-basics`

---

## 4a. AI security: initial assessment (separate result)

Three short questions on AI-related security risks: AI tools that can act on the company's behalf (agents) and AI-made fraud from outside. They do **not** count towards the main score or tier. The result shows its own assessment and next steps directly below the main result. It is deliberately labelled an **initial assessment**: three questions about three specific risks, not a full security review.

Every action links to the new guide **`ai-security-risks`** (working title DE: *KI und Cybersicherheit für KMU*; see plan T53).

#### S1 `agent-access`. What AI tools can access and do
- **EN:** Can AI tools access company systems (email, files, calendar, CRM, code) or take actions on their own (send, book, pay, delete)?
- **DE:** Können KI-Tools auf Firmensysteme zugreifen (E-Mail, Dateien, Kalender, CRM, Code) oder selbst Aktionen ausführen (versenden, buchen, bezahlen, löschen)?

| Score | EN | DE |
|---|---|---|
| 0 | Yes, with the access granted at setup; nobody has limited it, and they act without confirmation. | Ja, mit den Zugriffen, die bei der Einrichtung erteilt wurden; niemand hat sie eingeschränkt, und sie handeln ohne Bestätigung. |
| 1 | Yes, access is somewhat limited but not reviewed, or actions that can't be undone don't need confirmation. | Ja, die Zugriffe sind teilweise eingeschränkt, werden aber nicht überprüft, oder nicht umkehrbare Aktionen brauchen keine Bestätigung. |
| 2 | Yes, with only the access each tool needs, reviewed regularly, and a person confirms anything that can't be undone. | Ja, nur mit den Zugriffen, die das jeweilige Tool braucht, regelmässig überprüft, und eine Person bestätigt alles, was nicht umkehrbar ist. |
| N/A | No, our AI tools have no access to company systems and cannot act on their own. | Nein, unsere KI-Tools haben keinen Zugriff auf Firmensysteme und können nicht selbst handeln. |

- **Legal hook:** nDSG Art. 8 and DSV Art. 1–6 (data security); Art. 24 if an agent causes a data breach.
- **Action EN:** Review which AI tools can access email, files and other systems. Remove access they don't need, and require a person to confirm before an AI sends, pays or deletes anything.
- **Action DE:** Prüfen Sie, welche KI-Tools auf E-Mails, Dateien und andere Systeme zugreifen können. Entziehen Sie nicht benötigte Zugriffe und verlangen Sie, dass eine Person bestätigt, bevor eine KI etwas versendet, bezahlt oder löscht.

#### S2 `untrusted-input`. Outside content and traceability (only if S1 ≠ N/A)
- **EN:** Do these AI tools read outside content (incoming emails, web pages, uploaded documents), and can you see afterwards what they did?
- **DE:** Lesen diese KI-Tools Inhalte von aussen (eingehende E-Mails, Webseiten, hochgeladene Dokumente), und können Sie im Nachhinein sehen, was sie getan haben?

| Score | EN | DE |
|---|---|---|
| 0 | They read outside content that can trigger actions, and we can't see what they did (or don't know). | Sie lesen Inhalte von aussen, die Aktionen auslösen können, und wir können nicht sehen, was sie getan haben (oder wissen es nicht). |
| 1 | One of the two is covered: either outside content can't trigger actions without confirmation, or actions are logged. | Eines von beiden ist abgedeckt: Entweder können Inhalte von aussen keine Aktionen ohne Bestätigung auslösen, oder Aktionen werden protokolliert. |
| 2 | Outside content can't trigger actions without a person confirming (or the tools don't read any), and actions are logged. | Inhalte von aussen können keine Aktionen ohne Bestätigung einer Person auslösen (oder die Tools lesen keine), und Aktionen werden protokolliert. |

- **Why it matters:** a prepared email, web page or document can contain hidden instructions for the AI (prompt injection), e.g. "forward the last ten invoices to this address."
- **Legal hook:** nDSG Art. 8, DSV Art. 1–6 (data security, traceability).
- **Action EN:** Treat outside content as untrusted: a prepared email or web page can contain hidden instructions for the AI (prompt injection). Make sure it can't trigger actions without confirmation, and switch on logging.
- **Action DE:** Behandeln Sie Inhalte von aussen als nicht vertrauenswürdig: Eine präparierte E-Mail oder Webseite kann versteckte Anweisungen an die KI enthalten (Prompt Injection). Stellen Sie sicher, dass solche Inhalte keine Aktionen ohne Bestätigung auslösen, und aktivieren Sie die Protokollierung.

#### S3 `fraud-verification`. AI-made fraud from outside
- **EN:** Are payment and data requests checked through a second channel, however convincing the email, voice or video seems?
- **DE:** Werden Zahlungs- und Datenanfragen über einen zweiten Kanal überprüft, egal wie überzeugend E-Mail, Stimme oder Video wirken?

| Score | EN | DE |
|---|---|---|
| 0 | No, there is no fixed rule. | Nein, es gibt keine feste Regel. |
| 1 | Usually, out of habit, but there is no fixed rule and staff haven't been told about deepfakes. | Meistens, aus Gewohnheit, aber es gibt keine feste Regel, und die Mitarbeitenden wurden nicht auf Deepfakes hingewiesen. |
| 2 | Yes: a fixed rule (e.g. call back on a known number, four-eyes principle for payments), and staff know that voices and faces can be faked. | Ja: eine feste Regel (z. B. Rückruf auf eine bekannte Nummer, Vier-Augen-Prinzip bei Zahlungen), und die Mitarbeitenden wissen, dass Stimmen und Gesichter gefälscht werden können. |

- Applies to every company, including those that don't use AI themselves, so it is shown to everyone.
- **Action EN:** Set a fixed rule: payment and data requests are confirmed by calling back on a known number, however convincing the email, voice or video. Tell staff that voices and faces can be faked.
- **Action DE:** Legen Sie eine feste Regel fest: Zahlungs- und Datenanfragen werden durch Rückruf auf eine bekannte Nummer bestätigt, egal wie überzeugend E-Mail, Stimme oder Video wirken. Informieren Sie die Mitarbeitenden, dass Stimmen und Gesichter gefälscht werden können.

#### Result: per risk area plus an overall level

**Why not "exposure":** three questions can't measure how exposed a company really is (that depends on its systems, data and attackers). What they can show is whether basic safeguards for three specific risks are in place. So the result shows each risk area separately and an overall **risk level**, and says plainly what was not assessed.

**Heading and intro on the result:**
- **EN:** *AI security: initial assessment.* Based on three questions about three specific AI-related risks. This is a first orientation, not a full security assessment.
- **DE:** *KI-Sicherheit: Ersteinschätzung.* Basierend auf drei Fragen zu drei konkreten KI-bezogenen Risiken. Dies ist eine erste Orientierung, keine umfassende Sicherheitsprüfung.

**Per risk area:**

| Area EN | Area DE | From |
|---|---|---|
| What AI tools can do | Was KI-Tools tun können | S1 |
| Manipulated content (prompt injection) | Manipulierte Inhalte (Prompt Injection) | S2 |
| AI-made fraud and deepfakes | KI-gestützter Betrug und Deepfakes | S3 |

| Answer | Status EN | Status DE |
|---|---|---|
| 2 | Covered | Abgedeckt |
| 1 | Partly covered | Teilweise abgedeckt |
| 0 | Gap | Lücke |
| N/A (or S2 hidden) | Not relevant | Nicht relevant |

**Overall risk level** (*Risikostufe*), based on the applicable answers (S1 and S2 can drop out; S3 always counts):

| Level EN | Level DE | Rule | Summary EN | Summary DE |
|---|---|---|---|---|
| **High** | **Hoch** | Any answer is 0 | At least one of these risks has no safeguard. Start with the steps below. | Für mindestens eines dieser Risiken fehlt eine Schutzmassnahme. Beginnen Sie mit den Schritten unten. |
| **Medium** | **Mittel** | No 0, at least one 1 | Basic safeguards are in place, with gaps. | Grundlegende Schutzmassnahmen sind vorhanden, mit Lücken. |
| **Low** | **Gering** | All applicable answers are 2 | You have safeguards for these three risks. Review them when you add new AI tools. | Sie haben Schutzmassnahmen für diese drei Risiken. Überprüfen Sie sie, wenn Sie neue KI-Tools einführen. |

- If S1 = N/A, a note says: **EN:** "None of your AI tools can act on their own, so for these three risks your main concern is AI-made fraud from outside." **DE:** «Keines Ihrer KI-Tools kann selbst handeln. Bei diesen drei Risiken steht für Sie daher KI-gestützter Betrug von aussen im Vordergrund.»
- All security actions scoring below 2 are shown (at most three), in the order S1, S2, S3.

**What this does not cover** (always shown, below the per-area status):
- **EN:** This initial assessment does not cover general IT security (backups, updates, passwords and multi-factor login, network and firewall), the security of your providers, or a technical test of your systems. For a full assessment, see the guidance of the Federal Office for Cybersecurity (BACS/NCSC) or ask an IT security specialist.
- **DE:** Diese Ersteinschätzung deckt weder die allgemeine IT-Sicherheit (Datensicherung, Updates, Passwörter und Mehr-Faktor-Anmeldung, Netzwerk und Firewall) noch die Sicherheit Ihrer Anbieter oder eine technische Prüfung Ihrer Systeme ab. Für eine umfassende Einschätzung beachten Sie die Empfehlungen des Bundesamts für Cybersicherheit (BACS) oder wenden Sie sich an eine IT-Sicherheitsfachperson.

**In the main next steps:** if the risk level is **High**, the first security action scoring 0 (order S1, S2, S3) also goes into the main top 3, right after any red-flag actions and before the rest, tagged "Security" / «Sicherheit». It stays in the security block as well.

---

## 5. Scoring model

### 5.1 Points
- Each answer gives 0, 1 or 2 points. N/A answers drop out of both the points earned and the maximum possible.
- **Dimension score** = points ÷ (2 × applicable questions in that dimension) × 100. If both questions in a dimension are N/A, the dimension shows "not applicable."
- **Overall score** = total points ÷ (2 × all applicable questions) × 100, rounded to a whole number.
- At most 4 questions can be N/A, so at least 8 questions (16 points) always count.

### 5.2 Tiers

| Score | Tier EN | Tier DE | Summary EN | Summary DE |
|---|---|---|---|---|
| 0–39 | **Getting started** | **Am Anfang** | AI is being used without basic rules. Start with an overview and simple ground rules. | KI wird ohne Grundregeln genutzt. Beginnen Sie mit einem Überblick und einfachen Regeln. |
| 40–74 | **In progress** | **Im Aufbau** | The foundations are partly there. Close the gaps below before expanding AI use. | Die Grundlagen sind teilweise vorhanden. Schliessen Sie die Lücken unten, bevor Sie den KI-Einsatz ausweiten. |
| 75–100 | **Well set up** | **Gut aufgestellt** | Your AI use is well organised. Keep it current as tools and rules change. | Ihr KI-Einsatz ist gut organisiert. Halten Sie ihn aktuell, wenn sich Tools und Regeln ändern. |

### 5.3 Red flags (lower the tier)
Q3 = 0, Q8 = 0 and Q10 = 0 are **red flags**. If any is set:
- The tier is capped at **In progress / Im Aufbau**, whatever the score. The score itself stays visible and unchanged, so the user can see the gap between the two.
- This is there so that strong answers elsewhere can't hide something like personal data going into free consumer accounts.

**If the cap lowers the tier** (score 75 or more), the result shows an explanation under the tier label:

- **EN:** Your score of {score} would normally put you at *Well set up*. Because of your answer on {topics}, we show *In progress*: this carries a concrete legal risk that good answers elsewhere don't offset. Once it is fixed, your level will match your score.
- **DE:** Mit {score} Punkten wären Sie eigentlich auf der Stufe *Gut aufgestellt*. Wegen Ihrer Antwort zum Thema {topics} zeigen wir *Im Aufbau* an: Dieser Punkt birgt ein konkretes rechtliches Risiko, das gute Antworten in anderen Bereichen nicht ausgleichen. Sobald er behoben ist, entspricht Ihre Stufe wieder Ihrer Punktzahl.

**If the tier is already In progress or Getting started** (score below 75), there is nothing to lower, so a shorter banner is shown instead:

- **EN:** Your answer on {topics} points to a concrete legal risk. Address it first.
- **DE:** Ihre Antwort zum Thema {topics} weist auf ein konkretes rechtliches Risiko hin. Gehen Sie diesen Punkt zuerst an.

`{topics}` labels (joined with "and" / «und» if there is more than one flag):

| Flag | EN | DE |
|---|---|---|
| Q3 | accounts and contracts for sensitive data | Konten und Verträge für sensible Daten |
| Q8 | AI decisions about people | KI-Entscheide über Personen |
| Q10 | the EU AI Act check | Prüfung des EU AI Act |

### 5.4 Next steps (top 3)
For each question scoring below 2:
`priority = severity weight × (2 − score)`, where high = 3, medium = 2, low = 1.

1. Red-flag questions always come first.
2. The rest are sorted by priority, highest first. Ties go to question order.
3. Show the **top 3** with action text and link. A "Show all" toggle shows the rest.
4. If P3 = yes or unsure, add the FINMA guide link to every action.
5. Q6 is raised from low to medium if Q10 ≠ N/A, since EU exposure brings in AI Act Art. 4.
6. If the security risk level is High, the first security action scoring 0 is inserted after the red-flag actions (section 4a). The list is still cut to three.

### 5.5 Worked examples
- **Small Treuhand (10–49), using ChatGPT free accounts, no rules:** Q1=1, Q2=0, Q3=0⚑, Q4=0, Q5=0, Q6=1, Q7=1, Q8=N/A, Q9=0, Q10=N/A, Q11=1, Q12=0 → 4/20 = **20, Getting started**. Top 3: Q3 (red flag), Q4 (6), Q2 (4).
- **Machine maker (50–249) with EU customers and an approved Copilot rollout:** Q1=2, Q2=2, Q3=2, Q4=2, Q5=2, Q6=1, Q7=1, Q8=N/A, Q9=1, Q10=0⚑, Q11=2, Q12=1 → 16/22 = **73, In progress** (it would be In progress anyway, so the short red-flag banner shows). Top 3: Q10 (red flag), Q6 (medium because of EU exposure, 2), Q7 (2).
- **Well-organised recruiting agency (10–49) that screens applicants with AI and no human review:** Q1=2, Q2=2, Q3=2, Q4=2, Q5=2, Q6=2, Q7=2, Q8=0⚑, Q9=2, Q10=N/A, Q11=2, Q12=1 → 19/22 = **86**, which would be Well set up, **lowered to In progress**. The explanation names "AI decisions about people." Next steps: Q8 (red flag), Q12 (1).

---

## 6. Benchmark (optional, using existing survey data)

After the score, show up to three comparisons from `data/survey-aggregates.json`, filtered by P1 size when that bucket has n ≥ 5, otherwise for all respondents. The same n<5 suppression rule applies as on `/benchmark`.

| Check question | Survey field / option |
|---|---|
| Q1 | `ai-governance-measures` = `tool-inventory` |
| Q3 | `ai-governance-measures` = `business-dpa` |
| Q5 | `ai-governance-measures` = `usage-policy` |
| Q6 | `ai-governance-measures` = `staff-training` |
| Q9 | `ai-governance-measures` = `dpia` |
| Q8 | `ai-governance-measures` = `human-review` |
| Q11 | `ai-governance-measures` = `ai-owner` |
| Q10 | `eu-market-exposure` = `unsure` |

- **EN:** "{pct}% of surveyed companies with {size} employees have a written AI policy."
- **DE:** «{pct} % der befragten Unternehmen mit {size} Mitarbeitenden haben eine schriftliche KI-Richtlinie.»

Below it, a link invites the user to take the survey too, which builds the benchmark over time.

---

## 6a. Printable result

A **"Print or save as PDF"** button (*«Drucken oder als PDF speichern»*) on the result opens the browser's print dialog with a print stylesheet. No server and no PDF library are involved; nothing is sent.

The printout contains:
- an optional company name, typed into a field just before printing (only printed, never stored);
- date of the check, question set version and the site URL;
- profile answers (size, AI stage, FINMA);
- overall score and level, including the downgrade explanation if it applies, and the six dimension scores;
- every question with the answer given;
- all next steps (not only the top 3), with links written out as full URLs;
- the AI security initial assessment with per-area status and the "what this does not cover" note;
- the disclaimer.

Footer on every page:
- **EN:** Self-assessment on aicompliant.ch, question set version {version}, {date}. Based on the company's own answers; not a certification.
- **DE:** Selbsteinschätzung auf aicompliant.ch, Fragenset Version {version}, {date}. Beruht auf den Angaben des Unternehmens; keine Zertifizierung.

Answers are kept in memory only while the page is open, so closing or reloading the page clears them. That is intended; the printout is the record. The page says so in two places, at the start of the check and next to the print button:
- **EN:** Your answers are kept only while this page is open. If you close or reload it, they are gone. To keep your result, print it or save it as a PDF.
- **DE:** Ihre Antworten bleiben nur erhalten, solange diese Seite geöffnet ist. Wenn Sie die Seite schliessen oder neu laden, gehen sie verloren. Um Ihr Ergebnis aufzubewahren, drucken Sie es aus oder speichern Sie es als PDF.

---

## 7. Disclaimer (shown before and after)

- **EN:** This check gives an initial orientation. It is not legal advice and not a certification. The result depends on your answers and covers only selected topics of the Swiss Data Protection Act (nDSG) and the EU AI Act. The AI security part is an initial assessment of three specific risks, not a full security assessment. Your answers are processed only in your browser and are not stored or sent.
- **DE:** Dieser Check bietet eine erste Orientierung. Er ist keine Rechtsberatung und keine Zertifizierung. Das Ergebnis beruht auf Ihren Angaben und deckt nur ausgewählte Themen des Datenschutzgesetzes (DSG) und des EU AI Act ab. Der Teil zur KI-Sicherheit ist eine Ersteinschätzung zu drei konkreten Risiken, keine umfassende Sicherheitsprüfung. Ihre Antworten werden nur in Ihrem Browser verarbeitet und weder gespeichert noch übermittelt.

---

## 8. Partners: not in v1

**Decision:** v1 launches neutral, with no partner section, no referral links and no "send my result" button. The result page ends with the next steps, the benchmark and the survey invitation.

Before partners are added in a later version, these need to be in place:
- Published inclusion criteria for advisors and implementers.
- Clear labelling of any commercial relationship ("Partner" / «Partner»), in line with UWG.
- If results can be sent to a partner: a consent checkbox naming the recipient, a Worker with Turnstile like the survey, an updated Datenschutzerklärung, and a lawyer review.

---

## 9. Decisions and open questions

**Decided:**

| Topic | Decision |
|---|---|
| Tier names | Getting started / In progress / Well set up (DE: Am Anfang / Im Aufbau / Gut aufgestellt). |
| Red flags | They lower the tier (capped at In progress), with an explanation when the score alone would have been Well set up (section 5.3). |
| Policy template | Drafted as [ai-policy-template-de.md](ai-policy-template-de.md) and [ai-policy-template-en.md](ai-policy-template-en.md); Q5 links to it. |
| Partners | Not in v1 (section 8). |
| Template format | Editable Word file (.docx), generated from the Markdown at build time. |
| Legal review | The legal hooks (nDSG Art. 5, 8, 9, 16–17, 19, 21, 22, 24; DSV Art. 1–6; EU AI Act Art. 4, 50; ArGV 3 Art. 26) and the DE wording of the check, the policy template and the AI security guide go into the T29 lawyer review. |
| AI security | Separate section S1–S3, not part of the main score (section 4a). AI add-ons (browser extensions, connectors) are covered by Q2. A dedicated guide `ai-security-risks` is built for it. |
| Security framing | Labelled an *initial assessment*: status per risk area plus an overall risk level (Low / Medium / High), and an always-visible "what this does not cover" note. Not called "exposure", since three questions can't measure it. |
| Security in main next steps | Yes: with a High risk level, the first security gap enters the main top 3 after red flags. |
| Incident guidance (Q12) | Covered in the AI security guide; Q12 links there. |
| FINMA question (P3) | Kept: FINMA-supervised firms are an important part of the Swiss market. |
| Printable result | Yes, client-side print view (section 6a). The page states that answers are kept only while it is open. |
| Deep links | Every action links to the matching guide section, not the page top (section 1a; plan T56–T59). |

