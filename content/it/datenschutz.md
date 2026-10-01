---
title: "Informativa sulla protezione dei dati"
description: "Informazioni sul trattamento dei dati personali su aicompliant.ch (art. 19 LPD): responsabile, finalità, responsabile del trattamento, conservazione e cancellazione."
last_verified: "2026-09-28"
volatility: "stable"
translation_status: "draft"
reviewed_by: null
review_date: null
review_scope: null
sources:
  - title: "Fedlex – Bundesgesetz über den Datenschutz (DSG), Art. 19"
    url: "https://www.fedlex.admin.ch/eli/cc/2022/491/de#art_19"
  - title: "EDÖB – KI und Datenschutz"
    url: "https://www.edoeb.admin.ch/de/ki-und-datenschutz"
---

La presente informativa sulla protezione dei dati vi informa, conformemente all'**art. 19 LPD**, su come vengono trattati i dati personali su **aicompliant.ch**.

## 1. Responsabile del trattamento

Responsabile del trattamento dei dati:

| | |
|---|---|
| **Nome** | Ivan Laube |
| **Indirizzo** | Vorhaldenstrasse 10, 8049 Zürich, Svizzera |
| **E-mail** | [i.laube@gmail.com](mailto:i.laube@gmail.com) |

Ulteriori indicazioni sul fornitore: [Impressum](/de/impressum/).

## 2. Quali dati trattiamo

### 2.1 Accesso al sito web (tecnico)

Al momento dell'accesso al sito web possono essere generati dati tecnici di connessione (ad es. indirizzo IP, timestamp, user agent), nella misura in cui ciò sia necessario al fornitore di hosting/CDN (Cloudflare) per la fornitura e la protezione del sito. Il sito web stesso è strutturato come **export statico** e nel nostro codice applicativo **non** memorizza profili dei visitatori.

### 2.2 Sondaggio (opzionale, incl. e-mail)

Se partecipate al sondaggio sull'adozione dell'IA, memorizziamo:

- le vostre **risposte** (senza identificazione), insieme a lingua, versione del sondaggio e timestamp;
- facoltativamente il vostro **indirizzo e-mail**, se richiedete il rapporto di benchmark (opt-in).

Le risposte e gli indirizzi e-mail vengono archiviati in **tabelle separate** in un database Cloudflare D1, ciascuna con **identificatori propri e senza chiave comune**. Non è quindi tecnicamente possibile associare l'e-mail alla singola risposta. Le risposte **senza** e-mail sono anonime; anche in caso di opt-in, la risposta rimane separata dall'indirizzo e-mail e non collegabile.

### 2.3 Protezione antispam (Turnstile e limitazione della frequenza)

Al momento dell'invio del sondaggio e durante il Website Quick-Check, Cloudflare Turnstile può effettuare un controllo di sicurezza. In tale contesto possono essere trasmessi dati tecnici a Cloudflare per rendere più difficili gli invii automatizzati.

Per limitare gli abusi, per il sondaggio memorizziamo temporaneamente un **hash monodirezionale dell'IP del client** (SHA-256, senza IP in chiaro) insieme alla data UTC e a un contatore (al massimo 20 invii riusciti al giorno per hash). Queste voci di quota vengono cancellate automaticamente dopo pochi giorni e servono esclusivamente alla prevenzione degli abusi — non sono collegate alle risposte del sondaggio né agli indirizzi e-mail.

### 2.4 Website Quick-Check

Se fate verificare un URL, il vostro browser invia l'URL e un token Turnstile al nostro scanner-worker. Il worker recupera la pagina di destinazione e valuta i segnali pubblicamente visibili. **Non vengono memorizzati in modo permanente presso di noi né i risultati della scansione né gli URL inseriti.**

### 2.5 Nessun cookie, nessun tracciamento; statistiche di utilizzo

Questo sito **non imposta cookie** e **non utilizza strumenti di analisi o di tracciamento** (nessun pixel di tracciamento, nessun fingerprinting, nessuno script di terzi oltre a Turnstile). Un banner per i cookie non è quindi necessario. Per trasferire un URL dalla pagina iniziale al modulo, il Quick-Check salva brevemente una voce nella memoria di sessione (sessionStorage) del vostro browser; viene cancellata non appena letta e non ci viene trasmessa.

Per sapere quanto vengono utilizzati il sito e i suoi strumenti, ci basiamo esclusivamente su **conteggi lato server**:

- **Visualizzazioni di pagina:** le statistiche di traffico aggregate di Cloudflare (ad es. numero di richieste per pagina), generate dai dati di connessione che si producono comunque (punto 2.1) — senza script, cookie o identificatori nel vostro browser.
- **Utilizzo degli strumenti:** per ogni Quick-Check o invio del sondaggio, i nostri worker contano un punto dati con lo strumento, l'esito (ad es. riuscito, respinto) e lo stato HTTP. **Nessun** indirizzo IP, URL, risposta al sondaggio o altro identificatore; un punto dati non può essere attribuito a una persona.

## 3. Finalità del trattamento

| Dati | Finalità |
|---|---|
| Dati tecnici di connessione | Fornitura, funzionamento e protezione del sito web |
| Risposte al sondaggio | Statistiche anonimizzate e benchmark (aggregazione; le celle con meno di cinque risposte non vengono pubblicate) |
| E-mail opzionale | Notifica singola o su richiesta non appena il rapporto di benchmark è disponibile |
| Turnstile / limitazione della frequenza | Protezione da abusi/spam (incl. quote basate su hash IP di breve durata) |
| URL del Quick-Check | Valutazione singola dell'URL inviato; nessuna memorizzazione permanente presso di noi |

La base giuridica è in particolare il trattamento per l'esecuzione di un contratto o di misure precontrattuali, ovvero il nostro interesse legittimo al funzionamento delle offerte informative e alla prevenzione degli abusi, nella misura in cui la LPD lo richieda. L'e-mail opzionale si basa sul vostro **consenso** (opt-in), che potete revocare in qualsiasi momento.

## 4. Responsabile del trattamento e Cloudflare

Utilizziamo servizi di **Cloudflare, Inc.** (e società collegate) per:

- l'hosting/CDN del sito web (Cloudflare Pages);
- l'API del sondaggio e l'archiviazione in **Cloudflare D1**;
- lo scanner del sito web (Cloudflare Worker, senza archiviazione permanente);
- conteggi di utilizzo anonimi (Cloudflare Workers Analytics Engine) e statistiche di traffico aggregate;
- facoltativamente **Cloudflare Turnstile**.

Cloudflare agisce in tal caso come **responsabile del trattamento** nell'ambito delle finalità da noi definite. A seconda della configurazione di Cloudflare, i trattamenti possono avvenire anche al di fuori della Svizzera o dello SEE/UE. Selezioniamo i fornitori e le impostazioni in modo da perseguire un livello di protezione adeguato (tra l'altro tramite garanzie contrattuali del fornitore).

## 5. Conservazione

| Dati | Conservazione |
|---|---|
| Risposte al sondaggio | Fino alla valutazione e pubblicazione degli aggregati anonimizzati; le risposte grezze non vengono conservate oltre quanto necessario per lo scopo di benchmark (obiettivo: cancellazione o anonimizzazione al più tardi **24 mesi** dopo l'invio, salvo obblighi legali di conservazione più lunga) |
| E-mail opzionali | Fino all'invio della notifica del rapporto ovvero fino alla vostra richiesta di cancellazione; cancellazione automatica al più tardi dopo **24 mesi**; cancellazione manuale dalla tabella di iscrizione su richiesta |
| Quote hash IP (sondaggio) | Alcuni giorni (cancellazione automatica delle voci giornaliere più vecchie); solo per la prevenzione degli abusi |
| Quick-Check | Nessuna memorizzazione permanente presso di noi |
| Conteggi di utilizzo (strumenti) | Tre mesi (cancellazione automatica da parte di Cloudflare); nessun dato personale |
| Log del server/CDN | Secondo le impostazioni standard di Cloudflare; tipicamente a breve termine per il funzionamento e la sicurezza |

## 6. I vostri diritti e la cancellazione

Potete richiedere informazioni, rettifica e cancellazione dei vostri dati personali, nonché opporvi al trattamento, nella misura in cui la LPD lo preveda. Per l'e-mail eventualmente registrata è di norma sufficiente un messaggio a **[i.laube@gmail.com](mailto:i.laube@gmail.com)** con la richiesta di cancellazione; provvederemo quindi a cancellare l'indirizzo e-mail dalla tabella di iscrizione. Le risposte al sondaggio non ne sono interessate e non sono collegate all'e-mail.

Le risposte al sondaggio non possono successivamente essere associate a una persona (nemmeno tramite l'e-mail opzionale) e non possono pertanto essere cancellate in modo mirato.

Potete inoltre presentare reclamo presso l'**Incaricato federale della protezione dei dati e della trasparenza (IFPDT)**.

## 7. Nessun obbligo di indicazione / conseguenze

L'utilizzo del sito web e della maggior parte delle funzioni è possibile senza fornire dati personali. Senza l'opt-in per l'e-mail non riceverete alcuna notifica relativa al rapporto di benchmark; la partecipazione anonima al sondaggio rimane possibile.

## 8. Modifiche

Possiamo adattare la presente informativa sulla protezione dei dati qualora l'offerta o la situazione giuridica cambino. Fa fede la versione di volta in volta pubblicata su questa pagina (`last_verified` nell'intestazione della pagina).
