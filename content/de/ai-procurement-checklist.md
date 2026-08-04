---
title: "Checkliste: KI-Beschaffung für Schweizer KMU"
description: "Praktische Fragen an Anbieter und intern, bevor Sie ein KI-Tool einkaufen: Datenschutz, Hosting, Verträge, Governance und EU-Bezug."
last_verified: "2026-07-10"
volatility: "stable"
translation_status: "canonical"
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

Diese Checkliste bündelt Fragen aus den Themen **nDSG/KI**, **US-Hosting**, **EU AI Act** und – wo relevant – **FINMA-Governance**. Sie ist ein Beschaffungs- und Due-Diligence-Hilfsmittel, keine Rechtsberatung und keine Freigabeentscheidung.

Nutzen Sie sie vor dem Pilot und erneut vor dem Produktivgang.

## 1. Use Case und Daten

- Welches Geschäftsproblem löst das Tool – und welche **Personendaten** fliessen ein?
- Gibt es besonders schützenswerte Daten, Profiling oder automatisierte Einzelentscheide mit erheblicher Wirkung?
- Können Sie den Use Case mit **synthetischen oder anonymisierten** Daten starten?
- Wer ist intern Owner (Fach, IT, Datenschutz)?

## 2. Datenschutz und Transparenz (DSG)

- Sind Zweck, Funktionsweise und Datenquellen für Betroffene **transparent** erklärbar?
- Ist bei hohem Risiko eine **Datenschutz-Folgenabschätzung** geplant?
- Können Betroffene einer automatischen Bearbeitung widersprechen bzw. eine **menschliche Überprüfung** verlangen?
- Liegt ein aktuelles Verzeichnis der Bearbeitungstätigkeiten vor (inkl. Ausland und Garantien)?

## 3. Hosting und Auslandstransfer

- In welchen Regionen werden Daten gespeichert und verarbeitet (CH / EU / US / andere)?
- Bei US-Empfängern: aktive **Swiss-U.S. Data Privacy Framework**-Zertifizierung geprüft?
- Sonst: anerkannte **Standarddatenschutzklauseln**, DPA und Transferprüfung vorhanden?
- Werden Eingaben zum **Modelltraining** verwendet – und gibt es einen Opt-out?

## 4. Vertrag und Betrieb

- Auftragsbearbeitungsvertrag (DPA) mit klaren Unterauftragsregeln?
- Löschfristen, Export, Incident-Meldung und Audit-Rechte geregelt?
- Verfügbarkeit, Support-Standort und Subprozessorenliste bekannt?
- Exit-Plan: Können Sie Daten und Konfigurationen mitnehmen?

## 5. EU AI Act (falls EU-Bezug)

- Wird das System oder sein **Output in der EU** angeboten bzw. genutzt?
- Welche Rolle haben Sie (Anbieter / Betreiber / Einführer / Händler)?
- Risikoklasse grob eingeschätzt (verboten / Hochrisiko / Transparenz / GPAI)?
- Fristen der gestaffelten Anwendbarkeit dem Produkt zugeordnet?

## 6. Governance (besonders Finanzsektor)

- Inventar-Eintrag und Risikoklasse für die Anwendung?
- Tests zu Genauigkeit, Robustheit, Bias und Monitoring von Drift?
- Erklärbarkeit gegenüber Kunden, Audit und Aufsicht?
- Unabhängige Review bei wesentlichen Anwendungen?

## 7. Kompetenz und Schulung

- Haben die Personen, die das Tool bedienen oder freigeben, ausreichende **KI-Kompetenz** (EU AI Act Art. 4, in Kraft seit 2. Februar 2025)?
- Sind Schulungen und Rollen klar (Fach, IT, Datenschutz) – auch im Sinne der FINMA-Erwartung an «broad training measures» bei beaufsichtigten Instituten?
- Gibt es ein strukturiertes Kompetenzmodell für den Alltag mit KI? Ein frei lizenziertes Beispiel ist das [AI Fluency 4D-Framework](https://www.anthropic.com/ai-fluency) (Delegation, Description, Discernment, Diligence).

## 8. Entscheidungsregel (pragmatisch)

| Ampel | Bedeutung |
|---|---|
| Grün | Keine Personendaten / CH- oder EU-Hosting mit klarem Vertrag / niedriger Impact |
| Gelb | Personendaten + Ausland oder automatisierte Entscheide – Freigabe mit Massnahmen |
| Rot | Besonders schützenswerte Daten ohne Schutzkonzept, unklare Trainingsnutzung, fehlende DPA/Transfergrundlage |

Gelb und Rot: nicht «ausprobieren und später aufräumen». Erst Grundlagen klären, dann Pilot.

## Weiterlesen

- [nDSG und KI: Grundlagen](/de/ndsg-ai-basics/)
- [US-gehostete LLMs unter dem nDSG](/de/us-hosted-llms-ndsg/)
- [EU AI Act für Schweizer Unternehmen](/de/eu-ai-act-swiss-exporters/)
- [FINMA-Erwartungen an KI-Governance](/de/finma-ai-expectations/)

## Hinweis

Diese Checkliste ist **informativ und keine Rechtsberatung**. Bei regulierten Instituten und sensiblen Datenkategorien Fachstellen und ggf. Rechtsberatung einbeziehen.
