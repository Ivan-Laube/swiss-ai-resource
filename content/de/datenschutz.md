---
title: "Datenschutzerklärung"
description: "Informationen zur Bearbeitung von Personendaten auf aicompliant.ch (Art. 19 DSG): Verantwortliche, Zwecke, Auftragsbearbeiter, Aufbewahrung und Löschung."
last_verified: "2026-09-28"
volatility: "stable"
translation_status: "canonical"
reviewed_by: null
review_date: null
review_scope: null
sources:
  - title: "Fedlex – Bundesgesetz über den Datenschutz (DSG), Art. 19"
    url: "https://www.fedlex.admin.ch/eli/cc/2022/491/de#art_19"
  - title: "EDÖB – KI und Datenschutz"
    url: "https://www.edoeb.admin.ch/de/ki-und-datenschutz"
---

Diese Datenschutzerklärung informiert Sie gemäss **Art. 19 DSG** darüber, wie auf **aicompliant.ch** Personendaten bearbeitet werden.

## 1. Verantwortliche Stelle

Verantwortlich für die Datenbearbeitung:

| | |
|---|---|
| **Name** | Ivan Laube |
| **Adresse** | Vorhaldenstrasse 10, 8049 Zürich, Schweiz |
| **E-Mail** | [i.laube@gmail.com](mailto:i.laube@gmail.com) |

Weitere Anbieterangaben: [Impressum](/de/impressum/).

## 2. Welche Daten wir bearbeiten

### 2.1 Website-Aufruf (technisch)

Beim Aufruf der Website können technische Verbindungsdaten anfallen (z. B. IP-Adresse, Zeitstempel, User-Agent), soweit dies durch den Hosting-/CDN-Anbieter (Cloudflare) zur Auslieferung und Absicherung der Seite erforderlich ist. Die Website selbst ist als **statischer Export** aufgebaut und speichert in unserem Anwendungscode **keine** Besucherprofile.

### 2.2 Umfrage (optional inkl. E-Mail)

Wenn Sie an der KI-Adoptionsumfrage teilnehmen, speichern wir:

- Ihre **Antworten** (ohne Identifikation), zusammen mit Sprache, Umfrageversion und Zeitstempel;
- optional Ihre **E-Mail-Adresse**, wenn Sie den Benchmark-Bericht anfordern (Opt-in).

Antworten und E-Mail-Adressen werden in **getrennten Tabellen** in einer Cloudflare-D1-Datenbank abgelegt, jeweils mit **eigenen Kennungen und ohne gemeinsamen Schlüssel**. Eine technische Zuordnung von E-Mail und Einzelantwort ist damit nicht möglich. Antworten **ohne** E-Mail sind anonym; auch bei Opt-in bleibt die Antwort von der E-Mail-Adresse getrennt und nicht verknüpfbar.

### 2.3 Spam-Schutz (Turnstile und Ratenbegrenzung)

Beim Absenden der Umfrage und beim Website Quick-Check kann Cloudflare Turnstile eine Sicherheitsprüfung durchführen. Dabei können technische Daten an Cloudflare übermittelt werden, um automatisierte Einsendungen zu erschweren.

Zur Begrenzung von Missbrauch speichern wir für die Umfrage kurzzeitig einen **Einweg-Hash der Client-IP** (SHA-256, ohne Klartext-IP) zusammen mit dem UTC-Tag und einem Zähler (höchstens 20 erfolgreiche Einsendungen pro Tag und Hash). Diese Quoten-Einträge werden nach wenigen Tagen automatisch gelöscht und dienen ausschliesslich der Missbrauchsabwehr — sie sind nicht mit Umfrageantworten oder E-Mail-Adressen verknüpft.

### 2.4 Website Quick-Check

Wenn Sie eine URL prüfen lassen, sendet Ihr Browser die URL und ein Turnstile-Token an unseren Scanner-Worker. Der Worker ruft die Zielseite ab und wertet öffentlich sichtbare Signale aus. **Es werden keine Scan-Ergebnisse und keine eingegebenen URLs dauerhaft bei uns gespeichert.**

### 2.5 Keine Cookies, kein Tracking; Nutzungsstatistik

Diese Website setzt **keine Cookies** und verwendet **keine Analyse- oder Tracking-Werkzeuge** (keine Tracking-Pixel, kein Fingerprinting, keine Skripte von Drittanbietern ausser Turnstile). Ein Cookie-Banner ist daher nicht nötig. Der Quick-Check legt für die Übergabe einer URL von der Startseite an das Formular kurzzeitig einen Eintrag im Sitzungsspeicher (sessionStorage) Ihres Browsers ab; dieser wird beim Lesen sofort gelöscht und nicht an uns übermittelt.

Um zu sehen, wie stark die Seite und die Werkzeuge genutzt werden, verwenden wir ausschliesslich **serverseitige Zählungen**:

- **Seitenaufrufe:** die aggregierten Verkehrsstatistiken von Cloudflare (z. B. Anzahl Anfragen pro Seite), die aus den ohnehin anfallenden Verbindungsdaten (Ziff. 2.1) erzeugt werden – ohne Skript, Cookie oder Kennung in Ihrem Browser.
- **Werkzeugnutzung:** Pro Quick-Check bzw. Umfrage-Einreichung zählen unsere Worker einen Datenpunkt mit Werkzeug, Ergebnis (z. B. erfolgreich, abgelehnt) und HTTP-Status. **Keine** IP-Adresse, URL, Umfrageantwort oder sonstige Kennung; ein Datenpunkt lässt sich keiner Person zuordnen.

## 3. Zwecke der Bearbeitung

| Daten | Zweck |
|---|---|
| Technische Verbindungsdaten | Auslieferung, Betrieb und Absicherung der Website |
| Umfrageantworten | Anonymisierte Statistik und Benchmark (Aggregation; Zellen mit weniger als fünf Antworten werden nicht veröffentlicht) |
| Optionale E-Mail | Einmalige oder bedarfsweise Benachrichtigung, sobald der Benchmark-Bericht verfügbar ist |
| Turnstile / Ratenbegrenzung | Schutz vor Missbrauch / Spam (inkl. kurzlebiger IP-Hash-Quoten) |
| Quick-Check-URL | Einmalige Auswertung der eingereichten URL; kein dauerhafter Speicher bei uns |

Rechtsgrundlage ist insbesondere die Bearbeitung zur Erfüllung eines Vertrags bzw. vorvertraglicher Massnahmen bzw. unser berechtigtes Interesse am Betrieb der Informationsangebote und an der Missbrauchsabwehr, soweit das DSG dies erfordert. Die optionale E-Mail stützt sich auf Ihre **Einwilligung** (Opt-in), die Sie jederzeit widerrufen können.

## 4. Auftragsbearbeiter und Cloudflare

Wir nutzen Dienste von **Cloudflare, Inc.** (und verbundene Unternehmen) für:

- Hosting / CDN der Website (Cloudflare Pages);
- die Umfrage-API und Speicherung in **Cloudflare D1**;
- den Website-Scanner (Cloudflare Worker, ohne dauerhafte Speicherung);
- anonyme Nutzungszählungen (Cloudflare Workers Analytics Engine) und aggregierte Verkehrsstatistiken;
- optional **Cloudflare Turnstile**.

Cloudflare handelt dabei als **Auftragsbearbeiter** im Rahmen der von uns vorgegebenen Zwecke. Je nach Cloudflare-Konfiguration können Bearbeitungen auch ausserhalb der Schweiz bzw. der EU/EWR stattfinden. Wir wählen Anbieter und Einstellungen so, dass ein angemessenes Schutzniveau angestrebt wird (u. a. vertragliche Absicherungen des Anbieters).

## 5. Aufbewahrung

| Daten | Aufbewahrung |
|---|---|
| Umfrageantworten | Bis zur Auswertung und Veröffentlichung anonymisierter Aggregate; Rohantworten werden nicht länger als für den Benchmark-Zweck erforderlich aufbewahrt (Ziel: Löschung oder Anonymisierung spätestens **24 Monate** nach Einreichung, sofern keine längere gesetzliche Pflicht besteht) |
| Optionale E-Mails | Bis zum Versand der Bericht-Benachrichtigung bzw. bis zu Ihrem Löschbegehren; automatische Löschung spätestens nach **24 Monaten**; manuelle Löschung aus der Anmeldetabelle auf Anfrage |
| IP-Hash-Quoten (Umfrage) | Wenige Tage (automatische Löschung älterer Tages-Einträge); nur Missbrauchsabwehr |
| Quick-Check | Keine dauerhafte Speicherung bei uns |
| Nutzungszählungen (Werkzeuge) | Drei Monate (automatische Löschung durch Cloudflare); ohne Personenbezug |
| Server-/CDN-Logs | Nach den Standard-Einstellungen von Cloudflare; typischerweise kurzfristig für Betrieb und Sicherheit |

## 6. Ihre Rechte und Löschung

Sie können Auskunft, Berichtigung und Löschung Ihrer Personendaten verlangen sowie der Bearbeitung widersprechen, soweit das DSG dies vorsieht. Bei optional hinterlegter E-Mail genügt in der Regel eine Nachricht an **[i.laube@gmail.com](mailto:i.laube@gmail.com)** mit dem Hinweis auf Löschung; wir löschen dann die E-Mail-Adresse aus der Anmeldetabelle. Die Umfrageantworten sind davon unberührt und nicht mit der E-Mail verknüpft.

Umfrageantworten lassen sich nachträglich nicht einer Person zuordnen (auch nicht über die optionale E-Mail) und können daher nicht gezielt gelöscht werden.

Sie können sich zudem beim **Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB)** beschweren.

## 7. Keine Pflichtangabe / Folgen

Die Nutzung der Website und der meisten Funktionen ist ohne Angabe von Personendaten möglich. Ohne E-Mail-Opt-in erhalten Sie keine Benachrichtigung zum Benchmark-Bericht; die anonyme Teilnahme an der Umfrage bleibt möglich.

## 8. Änderungen

Wir können diese Datenschutzerklärung anpassen, wenn sich Angebot oder Rechtslage ändern. Massgeblich ist die jeweils auf dieser Seite veröffentlichte Fassung (`last_verified` im Seitenkopf).
