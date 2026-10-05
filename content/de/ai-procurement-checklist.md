---
title: "Checkliste: KI-Beschaffung für Schweizer KMU"
description: "Praktische Fragen an Anbieter und an das eigene Unternehmen, bevor Sie ein KI-Tool einkaufen: Datenschutz, Hosting, Verträge, Governance und EU-Bezug."
last_verified: "2026-10-01"
volatility: "stable"
translation_status: "canonical"
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

Diese Checkliste fasst die wichtigsten Fragen zu **Datenschutz**, **Hosting im Ausland**, **EU AI Act** und, wo relevant, **FINMA-Governance** zusammen. Sie hilft bei der Auswahl und Prüfung eines KI-Tools, ersetzt aber weder eine rechtliche Prüfung noch den Freigabeentscheid im Unternehmen.

Gehen Sie die Fragen vor dem Pilotprojekt durch und noch einmal vor dem produktiven Einsatz.

## 1. Anwendungsfall und Daten

- Welches Problem soll das Tool lösen, und welche **Personendaten** fliessen ein?
- Sind besonders schützenswerte Personendaten, Profiling oder automatisierte Einzelentscheide mit erheblicher Wirkung im Spiel?
- Lässt sich der Anwendungsfall mit **synthetischen oder anonymisierten** Daten starten?
- Wer ist intern verantwortlich (Fachbereich, IT, Datenschutz)?

## 2. Datenschutz und Transparenz (DSG)

- Lassen sich Zweck, Funktionsweise und Datenquellen für die Betroffenen **verständlich erklären**, und steht das in der Datenschutzerklärung?
- Ist bei hohem Risiko eine **Datenschutz-Folgenabschätzung** geplant (Art. 22 DSG)?
- Entscheidet das Tool ausschliesslich automatisiert über Personen? Dann müssen Betroffene informiert werden und eine **Überprüfung durch einen Menschen** verlangen können (Art. 21 DSG).
- Ist das Tool im Verzeichnis der Bearbeitungstätigkeiten erfasst, mit Angaben zu Ausland und Garantien? Pflicht ist das Verzeichnis ab 250 Mitarbeitenden oder bei Bearbeitungen mit hohem Risiko (Art. 12 DSG, Art. 24 DSV).

## 3. Hosting und Bekanntgabe ins Ausland {#hosting-transfer}

- In welchen Ländern werden die Daten gespeichert und bearbeitet (CH / EU / USA / andere), und von wo aus hat der Anbieter Zugriff, etwa für den Support?
- Bei US-Empfängern: Ist die Zertifizierung unter dem **Swiss-U.S. Data Privacy Framework** geprüft?
- Sonst: Sind anerkannte **Standarddatenschutzklauseln** vereinbart und ist die Transferprüfung dokumentiert?
- Werden Eingaben zum **Training** verwendet, und lässt sich das ausschliessen?

## 4. Vertrag und Betrieb {#contract-operations}

- Liegt ein **Auftragsbearbeitungsvertrag** (DPA) vor, mit klaren Regeln für Unterauftragsbearbeiter?
- Sind Löschfristen, Datenexport, Meldung von Sicherheitsvorfällen und Prüfrechte geregelt?
- Sind Verfügbarkeit, Support-Standort und die Liste der Unterauftragsbearbeiter bekannt?
- Exit-Plan: Können Sie Daten und Konfigurationen bei einem Wechsel mitnehmen?

## 5. EU AI Act (bei EU-Bezug) {#eu-ai-act}

- Wird das System oder sein **Output in der EU** angeboten oder verwendet?
- Welche Rolle haben Sie (Anbieter, Betreiber, Einführer, Händler)?
- Wie ist das System grob eingestuft (verboten, Hochrisiko, Transparenzpflicht, GPAI oder ohne besondere Pflichten)?
- Sind die geltenden Fristen dem Produkt zugeordnet (siehe [Zeitplan](/de/eu-ai-act-swiss-exporters/#timeline))?

## 6. Governance (besonders im Finanzsektor)

- Ist die Anwendung im KI-Inventar erfasst und eingestuft?
- Gibt es Tests zu Genauigkeit, Robustheit und Bias sowie eine Überwachung auf Veränderungen (Drift)?
- Lassen sich Ergebnisse gegenüber Kundschaft, Prüfgesellschaft und Aufsicht erklären?
- Werden wesentliche Anwendungen unabhängig überprüft?

## 7. Kompetenz und Schulung {#ai-literacy}

- Wissen die Personen, die das Tool nutzen oder freigeben, genug über KI, ihre Grenzen und Risiken? Fällt Ihr Unternehmen unter den EU AI Act, müssen Sie Massnahmen treffen, um diese **KI-Kompetenz** zu fördern (Art. 4, in der seit 27. Juli 2026 geltenden Fassung).
- Sind Schulungen und Rollen klar geregelt (Fachbereich, IT, Datenschutz)? Beaufsichtigte Finanzinstitute berücksichtigen dabei auch die Erwartung der FINMA an breit angelegte Schulungen.
- Gibt es ein Modell, an dem sich die Schulungen orientieren? Ein frei verfügbares Beispiel ist das [AI Fluency 4D-Framework](https://www.anthropic.com/ai-fluency) (Delegation, Description, Discernment, Diligence).

## 8. Entscheidungsregel (vereinfachte Ampel)

| Ampel | Typische Situation |
|---|---|
| Grün | Keine Personendaten, oder Hosting in der Schweiz bzw. EU mit Auftragsbearbeitungsvertrag; geringe Auswirkungen auf Personen |
| Gelb | Personendaten mit Bekanntgabe ins Ausland oder automatisierte Entscheide: Freigabe nur mit Massnahmen |
| Rot | Besonders schützenswerte Personendaten ohne Schutzkonzept, unklare Trainingsnutzung, fehlender Auftragsbearbeitungsvertrag oder fehlende Grundlage für die Bekanntgabe ins Ausland |

Bei Gelb und Rot gilt: nicht «ausprobieren und später aufräumen». Erst die Grundlagen klären, dann das Pilotprojekt starten. Bei regulierten Instituten und sensiblen Daten empfiehlt es sich, Datenschutz- oder Rechtsfachpersonen beizuziehen.

## Weiterlesen

- [nDSG und KI: Grundlagen](/de/ndsg-ai-basics/)
- [US-gehostete LLMs unter dem nDSG](/de/us-hosted-llms-ndsg/)
- [EU AI Act: Reichweite für Schweizer Unternehmen](/de/eu-ai-act-swiss-exporters/)
- [FINMA-Erwartungen an KI-Governance](/de/finma-ai-expectations/)
- [KI und Cybersicherheit: Risiken für KMU](/de/ai-security-risks/)
- [Vorlage für eine KI-Richtlinie (Word)](download:ai-policy-template)
