---
title: "Datenschutzerklärung"
description: "Wie aicompliant.ch Personendaten bearbeitet (Art. 19 DSG): Verantwortlicher, Zwecke, Cloudflare als Auftragsbearbeiter, Bekanntgabe ins Ausland, Aufbewahrung und Ihre Rechte."
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

Diese Datenschutzerklärung informiert Sie nach **Art. 19 DSG** darüber, welche Personendaten wir auf **aicompliant.ch** bearbeiten, zu welchen Zwecken und wie lange.

## 1. Verantwortlicher

Verantwortlich für die Datenbearbeitung ist:

| | |
|---|---|
| **Name** | Ivan Laube |
| **E-Mail** | [i.laube@gmail.com](mailto:i.laube@gmail.com) |

Weitere Angaben: [Impressum](/de/impressum/).

## 2. Welche Daten wir bearbeiten

### 2.1 Aufruf der Website

Beim Aufruf der Website fallen technische Verbindungsdaten an (z. B. IP-Adresse, Zeitpunkt, Browser und Betriebssystem). Unser Hosting-Dienstleister Cloudflare benötigt sie, um die Seiten auszuliefern und vor Angriffen zu schützen. Die Website besteht aus statischen Seiten; wir selbst erstellen keine Profile von Besucherinnen und Besuchern.

### 2.2 Umfrage (optional mit E-Mail-Adresse)

Wenn Sie an der Umfrage zur KI-Nutzung teilnehmen, speichern wir:

- Ihre **Antworten**, zusammen mit Sprache, Umfrageversion und Zeitpunkt der Teilnahme;
- optional Ihre **E-Mail-Adresse**, wenn Sie den Benchmark-Bericht anfordern, zusammen mit Sprache und Kalenderwoche der Anmeldung.

Antworten und E-Mail-Adressen werden in **getrennten Tabellen** einer Cloudflare-D1-Datenbank gespeichert, mit **eigenen Kennungen und ohne gemeinsamen Schlüssel**. Bei den Antworten wird nicht vermerkt, ob eine E-Mail-Adresse angegeben wurde, und bei der E-Mail-Adresse speichern wir nur die Kalenderwoche, nicht den genauen Zeitpunkt. Es besteht damit kein gespeicherter Bezug zwischen E-Mail-Adresse und Antwort. Wir verknüpfen beide nicht und werten sie nicht gemeinsam aus. Ohne E-Mail-Adresse ist Ihre Teilnahme anonym.

### 2.3 Schutz vor Missbrauch (Turnstile und Begrenzung der Einsendungen)

Beim Absenden der Umfrage und beim Website Quick-Check prüft Cloudflare Turnstile, ob die Anfrage von einem Menschen stammt. Dazu werden technische Daten Ihres Browsers und Ihre IP-Adresse an Cloudflare übermittelt.

Um Missbrauch der Umfrage zu begrenzen, speichern wir zudem kurzzeitig einen **Hashwert Ihrer IP-Adresse** mit dem Datum und einem Zähler (höchstens 20 Einsendungen pro Tag). Der Hashwert wird mit einem geheimen Schlüssel und dem jeweiligen Datum gebildet (HMAC-SHA-256); er ändert sich daher täglich und lässt sich ohne diesen Schlüssel nicht auf die IP-Adresse zurückführen. Die IP-Adresse selbst speichern wir nicht. Diese Einträge werden spätestens nach zehn Tagen automatisch gelöscht. Sie dienen nur der Missbrauchsabwehr und werden nicht mit Antworten oder E-Mail-Adressen verknüpft.

### 2.4 Website Quick-Check

Wenn Sie eine URL prüfen lassen, übermittelt Ihr Browser die URL und ein Turnstile-Token an unseren Scanner. Der Scanner ruft die angegebene Website ab und wertet öffentlich sichtbare Merkmale aus. **Eingegebene URLs und Ergebnisse speichern wir nicht dauerhaft.**

### 2.5 KI-Check und Entscheidungshilfen

Ihre Antworten im KI-Check und in den Entscheidungshilfen werden nur in Ihrem Browser verarbeitet und nicht an uns übermittelt. Ein kopierter Link zu einem Ergebnis der Entscheidungshilfen enthält Ihre Antworten; wem Sie ihn weitergeben, entscheiden Sie selbst.

### 2.6 Keine Cookies, kein Tracking; Nutzungsstatistik

Diese Website setzt **keine Cookies** und verwendet **keine Analyse- oder Tracking-Werkzeuge** wie Tracking-Pixel. Ausser Cloudflare Turnstile beim Absenden von Formularen (Ziff. 2.3) laden wir keine Skripte von Drittanbietern. Für die Übergabe einer URL von der Startseite an den Quick-Check legt die Website kurz einen Eintrag im Sitzungsspeicher (sessionStorage) Ihres Browsers ab. Er wird beim Lesen sofort gelöscht und nicht an uns übermittelt.

Um zu sehen, wie stark die Website und die Werkzeuge genutzt werden, verwenden wir nur **serverseitige Zählungen**:

- **Seitenaufrufe:** aggregierte Statistiken von Cloudflare (z. B. Anzahl Aufrufe pro Seite), die aus den Verbindungsdaten nach Ziff. 2.1 entstehen, ohne Skript, Cookie oder Kennung in Ihrem Browser.
- **Nutzung der Werkzeuge:** Für jeden Quick-Check und jede Umfrage-Einsendung zählen wir einen Datenpunkt mit Werkzeug, Ergebnis (z. B. erfolgreich, abgelehnt) und technischem Status. Er enthält **keine** IP-Adresse, URL, Antwort oder andere Kennung und lässt sich keiner Person zuordnen.

## 3. Zwecke und Grundsätze der Bearbeitung

| Daten | Zweck |
|---|---|
| Technische Verbindungsdaten | Auslieferung, Betrieb und Schutz der Website |
| Umfrageantworten | Anonymisierte Statistik und Benchmark (Werte mit weniger als fünf Antworten werden nicht veröffentlicht) |
| E-Mail-Adresse (optional) | Benachrichtigung, sobald der Benchmark-Bericht verfügbar ist |
| Turnstile und IP-Hashwert | Schutz vor Missbrauch und Spam |
| Quick-Check-URL | Einmalige Prüfung der eingegebenen Website |

Wir bearbeiten Personendaten nach den Grundsätzen des DSG (Art. 6), nur für die genannten Zwecke und nur so weit wie nötig. Die E-Mail-Adresse bearbeiten wir mit Ihrer **Einwilligung**, die Sie jederzeit widerrufen können. Die übrigen Bearbeitungen dienen unserem Interesse an einem sicheren und funktionsfähigen Angebot.

## 4. Auftragsbearbeiter und Bekanntgabe ins Ausland

Wir nutzen Dienste von **Cloudflare, Inc.** (USA) und ihren verbundenen Unternehmen für:

- Hosting und Auslieferung der Website (Cloudflare Pages);
- die Umfrage und die Speicherung in **Cloudflare D1**;
- den Website-Scanner (Cloudflare Workers, ohne dauerhafte Speicherung);
- anonyme Nutzungszählungen (Cloudflare Workers Analytics Engine) und aggregierte Verkehrsstatistiken;
- den Spam-Schutz **Cloudflare Turnstile**.

Cloudflare bearbeitet die Daten als **Auftragsbearbeiter** in unserem Auftrag. Cloudflare, Inc. hat ihren Sitz in den USA und betreibt Rechenzentren in vielen Ländern; Daten können deshalb in den USA und in weiteren Staaten bearbeitet werden. Für die USA stützen wir uns auf die Zertifizierung von Cloudflare unter dem **Swiss-U.S. Data Privacy Framework** (Anhang 1 DSV). Für Staaten ohne angemessenen Datenschutz gelten die Standardvertragsklauseln im Auftragsbearbeitungsvertrag (Data Processing Addendum) von Cloudflare.

## 5. Aufbewahrung

| Daten | Aufbewahrung |
|---|---|
| Umfrageantworten | Automatische Löschung nach **24 Monaten**; veröffentlicht werden nur anonymisierte Gesamtergebnisse |
| E-Mail-Adressen | Bis zur Benachrichtigung über den Bericht oder bis zu Ihrem Widerruf, spätestens **24 Monate** (automatische Löschung) |
| IP-Hashwerte (Umfrage) | Automatische Löschung spätestens nach zehn Tagen |
| Quick-Check | Keine dauerhafte Speicherung |
| Nutzungszählungen | Drei Monate (automatische Löschung durch Cloudflare); ohne Personenbezug |
| Server- und CDN-Protokolle | Nach den Standardeinstellungen von Cloudflare, in der Regel kurzfristig für Betrieb und Sicherheit |

## 6. Ihre Rechte

Sie können Auskunft über Ihre Personendaten verlangen, ihre Berichtigung oder Löschung verlangen, einer Bearbeitung widersprechen und Ihre Daten unter den Voraussetzungen von Art. 28 DSG herausverlangen (Art. 25 ff. und Art. 32 DSG). Eine Einwilligung können Sie jederzeit widerrufen.

Um Ihre E-Mail-Adresse löschen zu lassen, genügt eine kurze Nachricht an **[i.laube@gmail.com](mailto:i.laube@gmail.com)**. Wir löschen die Adresse dann aus der Anmeldetabelle.

Weil wir Umfrageantworten nicht mit Personen verknüpfen, können wir sie nicht gezielt auf Anfrage löschen. Sie werden nach 24 Monaten automatisch gelöscht.

Sie können sich zudem an den **Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB)** wenden.

## 7. Freiwilligkeit

Sie können die Website und die meisten Funktionen nutzen, ohne Personendaten anzugeben. Ohne E-Mail-Adresse erhalten Sie keine Benachrichtigung zum Benchmark-Bericht; an der Umfrage können Sie trotzdem anonym teilnehmen.

## 8. Änderungen

Wir passen diese Datenschutzerklärung an, wenn sich das Angebot oder die Rechtslage ändert. Massgebend ist die jeweils auf dieser Seite veröffentlichte Fassung; das Datum der letzten Prüfung steht im Seitenkopf.
