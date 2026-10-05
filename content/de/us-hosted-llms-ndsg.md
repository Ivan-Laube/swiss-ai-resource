---
title: "US-gehostete LLMs unter dem nDSG"
description: "Wann Schweizer Unternehmen Personendaten an Sprachmodelle in den USA übermitteln dürfen: Swiss-U.S. Data Privacy Framework, Standarddatenschutzklauseln, Informationspflichten und eine Checkliste für die Praxis."
last_verified: "2026-10-01"
volatility: "fast"
translation_status: "canonical"
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

Viele generative Sprachmodelle (Large Language Models, LLMs) werden in den USA betrieben. Sobald **Personendaten** dorthin gelangen, gelten die Regeln zur **Bekanntgabe ins Ausland** (Art. 16 und 17 DSG). Als Bekanntgabe gilt nicht nur das Übermitteln, sondern auch das Zugänglichmachen von Daten (Art. 5 lit. e DSG), etwa wenn ein Anbieter aus den USA auf Daten zugreifen kann, die in der Schweiz gespeichert sind.

## Grundregel: angemessener Schutz oder Garantien {#transfer-abroad}

Personendaten dürfen ins Ausland bekanntgegeben werden, wenn der Bundesrat festgestellt hat, dass der Empfängerstaat einen **angemessenen Schutz** gewährleistet (Art. 16 Abs. 1 DSG). Die Liste dieser Staaten steht in **Anhang 1 der Datenschutzverordnung (DSV)**; dazu gehören unter anderem alle Staaten der EU und des EWR. Für andere Staaten braucht es **geeignete Garantien** (Art. 16 Abs. 2 DSG) oder einen Ausnahmefall nach Art. 17 DSG.

Das Unternehmen muss die betroffenen Personen über den Staat und gegebenenfalls über die Garantien oder die angewendete Ausnahme informieren (Art. 19 Abs. 4 DSG). Wer ein Verzeichnis der Bearbeitungstätigkeiten führt, hält diese Angaben auch dort fest (Art. 12 DSG). Unternehmen mit weniger als 250 Mitarbeitenden sind von der Verzeichnispflicht in den meisten Fällen befreit (Art. 24 DSV).

## USA: Swiss-U.S. Data Privacy Framework {#swiss-us-dpf}

Seit dem **15. September 2024** anerkennt der Bundesrat für die USA einen angemessenen Schutz, allerdings nur für US-Unternehmen, die unter dem **Swiss-U.S. Data Privacy Framework (DPF)** zertifiziert sind (Anhang 1 DSV). Für alle anderen Empfänger in den USA gilt das nicht.

Prüfen Sie vor dem Einsatz eines US-Anbieters:

1. Ist genau die Gesellschaft, die Ihre Daten erhält, auf der öffentlichen DPF-Teilnehmerliste aktiv zertifiziert?
2. Umfasst die Zertifizierung ausdrücklich das **Swiss-U.S. DPF** und nicht nur das EU-U.S. DPF?
3. Deckt sie die betroffenen Daten ab? Personaldaten (HR-Daten) werden separat zertifiziert.

Ist der Empfänger nicht passend zertifiziert, braucht es eine andere Grundlage (nächster Abschnitt). Bedenken Sie zudem, dass die Angemessenheit am Fortbestand des DPF hängt. Die Vorgängerregelung (Privacy Shield) hat der Gerichtshof der EU 2020 für ungültig erklärt, und der EDÖB stufte sie danach auch für die Schweiz als ungenügend ein. Viele Unternehmen vereinbaren deshalb mit wichtigen US-Anbietern zusätzlich Standarddatenschutzklauseln.

## Ohne DPF: Garantien und Ausnahmen {#safeguards}

Fehlt eine passende DPF-Zertifizierung, ist die Bekanntgabe trotzdem zulässig, wenn ein geeigneter Datenschutz auf andere Weise gewährleistet ist (Art. 16 Abs. 2 DSG), insbesondere durch:

- **Standarddatenschutzklauseln**, die der EDÖB genehmigt, ausgestellt oder anerkannt hat, namentlich die Standardvertragsklauseln der EU-Kommission mit den für die Schweiz nötigen Anpassungen;
- **Datenschutzklauseln in einem individuellen Vertrag**, die dem EDÖB vorgängig mitgeteilt wurden;
- **verbindliche unternehmensinterne Datenschutzvorschriften** (Binding Corporate Rules), die nur innerhalb eines Konzerns gelten.

Wer sich auf solche Klauseln stützt, muss prüfen, ob der Empfänger sie einhalten kann und ob das Recht des Empfängerstaats, etwa beim Zugriff von Behörden, dem nicht entgegensteht (Transfer Impact Assessment, TIA). Je nach Ergebnis braucht es zusätzliche technische Massnahmen, zum Beispiel das Entfernen oder Pseudonymisieren von Namen in den Eingaben.

In Einzelfällen erlaubt Art. 17 DSG eine Bekanntgabe auch ohne angemessenen Schutz, etwa mit ausdrücklicher Einwilligung der betroffenen Person oder wenn die Bekanntgabe unmittelbar für einen Vertrag mit ihr nötig ist. Für den laufenden Einsatz eines KI-Tools eignen sich diese Ausnahmen kaum.

## Besonderheiten bei Sprachmodellen {#llm-specifics}

Der EDÖB rät zu einem **bewussten Umgang** mit KI-Anwendungen und erinnert Unternehmen an ihre Pflichten, insbesondere an die transparente Information über Zweck und Art der Bearbeitung.

Klären Sie zusätzlich:

- Werden Eingaben zum **Training** des Modells verwendet, und lässt sich das ausschliessen?
- Liegt ein **Auftragsbearbeitungsvertrag** (engl. Data Processing Agreement, DPA) vor (Art. 9 DSG)?
- Welche Daten dürfen überhaupt eingegeben werden? Besonders schützenswerte Personendaten (z. B. Gesundheitsdaten) und Daten unter Berufsgeheimnis nur, wenn das ausdrücklich geprüft und abgesichert ist.
- Wo werden Protokolle (Logs), Embeddings und Support-Anfragen gespeichert, und wie lange?

## Kurz-Checkliste {#checklist}

| Frage | Warum relevant |
|---|---|
| Enthalten Eingaben oder Ergebnisse Personendaten? | Ohne Personendaten gelten die Regeln zur Bekanntgabe ins Ausland nicht |
| Ist der US-Empfänger unter dem Swiss-U.S. DPF zertifiziert? | Angemessener Schutz seit 15.9.2024, nur für zertifizierte Empfänger (Anhang 1 DSV) |
| Falls nicht: Standarddatenschutzklauseln und Transferprüfung (TIA) vorhanden? | Art. 16 Abs. 2 DSG |
| Auftragsbearbeitungsvertrag abgeschlossen? | Art. 9 DSG |
| Betroffene über Staat und Garantien informiert? | Art. 19 Abs. 4 DSG |
| Training mit Ihren Daten ausgeschlossen? | Zweckbindung und Transparenz (Art. 6 Abs. 3 und Art. 19 DSG) |

Grenzüberschreitende KI-Einsätze sollten im Einzelfall geprüft werden, vor allem bei besonders schützenswerten Personendaten.
