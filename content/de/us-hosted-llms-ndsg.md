---
title: "US-gehostete LLMs unter dem nDSG"
description: "Wann Schweizer Unternehmen Personendaten an US-gehostete Sprachmodelle übermitteln dürfen: Angemessenheit, Swiss-U.S. Data Privacy Framework, vertragliche Garantien und Praxischecks."
last_verified: "2026-07-10"
volatility: "fast"
translation_status: "canonical"
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

Viele generative Sprachmodelle (LLMs) werden in den USA betrieben. Sobald **Personendaten** die Schweiz verlassen, greifen die Regeln zur **Bekanntgabe ins Ausland** (Art. 16 und 17 DSG). Diese Seite erklärt den Rahmen für Schweizer Unternehmen – ohne Rechtsberatung zu ersetzen.

## Ausgangspunkt: Personendaten und Auslandstransfer

Personendaten dürfen grundsätzlich nur ins Ausland bekanntgegeben werden, wenn im Empfängerland ein **angemessenes Datenschutzniveau** besteht oder **geeignete Garantien** greifen. Ob ein Staat angemessen ist, legt der Bundesrat in **Anhang 1 der Datenschutzverordnung (DSV)** fest.

Über eine Datenbekanntgabe ins Ausland muss die betroffene Person informiert werden (Art. 19 Abs. 4 DSG). Länder und Garantien gehören zu den Pflichtangaben im Verzeichnis der Bearbeitungstätigkeiten (Art. 12 DSG).

## USA und Swiss-U.S. Data Privacy Framework

Am **15. September 2024** trat die Ergänzung der Staatenliste (Anhang 1 DSV) in Bezug auf die USA in Kraft. Der damit verbundene Rechtsrahmen – das **Swiss-U.S. Data Privacy Framework (DPF)** – gilt für **zertifizierte** US-Organisationen.

Praxischeck vor dem Einsatz eines US-Anbieters:

1. Ist der konkrete Empfänger auf der öffentlichen DPF-Teilnehmerliste aktiv zertifiziert?
2. Deckt die Zertifizierung ausdrücklich die **Swiss-U.S.**-Erweiterung (nicht nur EU-U.S.)?
3. Passt der zertifizierte Verarbeitungszweck zu Ihrem Einsatz (z. B. Cloud-KI, Support, Analytics)?

Ohne passende Zertifizierung reicht «der Anbieter sitzt in den USA» allein **nicht** als Angemessenheitsgrundlage.

## Wenn kein Angemessenheitsbeschluss greift

Fehlt ein Angemessenheitsbeschluss (oder greift er für den konkreten Empfänger nicht), können Transfers trotzdem zulässig sein, wenn der Datenschutz anders sichergestellt wird – insbesondere durch:

- **Standarddatenschutzklauseln** (vom EDÖB anerkannt oder genehmigt; die EU-SCC und CoE-MCC sind vom EDÖB anerkannt);
- **Datenschutzklauseln in einem spezifischen Vertrag** (mit Mitteilungspflicht an den EDÖB);
- **verbindliche unternehmensinterne Datenschutzvorschriften (BCR)**.

Der Verantwortliche muss sicherstellen, dass der Empfänger die Klauseln einhalten kann und dass das Recht des Drittlandes dem nicht entgegensteht. Technische Massnahmen können nötig sein, wenn unverhältnismässige Behördenzugriffe drohen.

## LLM-spezifische Punkte

Der EDÖB rät Nutzerinnen und Nutzern zu einem **bewussten Umgang** mit KI-Anwendungen und erinnert Unternehmen an ihre Pflichten – insbesondere transparente Information über Zwecke und Art der Bearbeitung.

Zusätzlich klären:

- Werden Eingaben zum **Modelltraining** verwendet? Gibt es einen Opt-out?
- Liegt ein **Auftragsbearbeitungsvertrag (DPA)** vor?
- Welche Datenkategorien dürfen überhaupt eingegeben werden (keine besonders schützenswerten Daten ohne klare Rechtsgrundlage und Schutzmassnahmen)?
- Wo liegen Logs, Embeddings und Support-Tickets?

## Kurz-Checkliste

| Frage | Warum relevant |
|---|---|
| Enthalten Prompts Personendaten? | Ohne Personendaten kein Auslandstransfer-Thema unter dem DSG |
| Ist der US-Empfänger Swiss-U.S.-DPF-zertifiziert? | Mögliche Angemessenheitsgrundlage seit 15.09.2024 |
| Sonst SCC/DPA und Transferprüfung? | Art. 16 Abs. 2 DSG |
| Information der Betroffenen? | Art. 19 Abs. 4 DSG |
| Trainingsnutzung und Opt-out geklärt? | Transparenz und Zweckbindung |

## Hinweis

Diese Seite ist **informativ und keine Rechtsberatung**. Grenzüberschreitende KI-Einsätze sollten fallbezogen geprüft werden.
