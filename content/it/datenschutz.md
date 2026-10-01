---
title: "Informativa sulla protezione dei dati"
description: "Informazioni sul trattamento di dati personali su aicompliant.ch (art. 19 LPD): titolare del trattamento, finalità, responsabile del trattamento, conservazione e cancellazione."
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

## 1. Titolare del trattamento

Responsabile del trattamento dei dati:

| | |
|---|---|
| **Nome** | Ivan Laube |
| **Indirizzo** | Vorhaldenstrasse 10, 8049 Zurigo, Svizzera |
| **E-mail** | [i.laube@gmail.com](mailto:i.laube@gmail.com) |

Ulteriori indicazioni sul fornitore: [Impressum](/de/impressum/).

## 2. Quali dati trattiamo

### 2.1 Accesso al sito web (tecnico)

Al momento dell'accesso al sito web possono generarsi dati tecnici di connessione (ad es. indirizzo IP, timestamp, user agent), nella misura in cui ciò sia necessario al fornitore di hosting/CDN (Cloudflare) per l'erogazione e la protezione del sito. Il sito web è strutturato come **esportazione statica** e il nostro codice applicativo **non** memorizza profili dei visitatori.

### 2.2 Sondaggio (facoltativo, incl. e-mail)

Se partecipate al sondaggio sull'adozione dell'IA, memorizziamo:

- le vostre **risposte** (senza identificazione), insieme a lingua, versione del sondaggio e timestamp;
- facoltativamente il vostro **indirizzo e-mail**, se richiedete il rapporto di benchmark (opt-in).

Le risposte e gli indirizzi e-mail vengono archiviati in **tabelle separate** in un database Cloudflare D1, ciascuna con **identificatori propri e senza chiave comune**. Un collegamento tecnico tra e-mail e singola risposta non è pertanto possibile. Le risposte **senza** e-mail sono anonime; anche in caso di opt-in, la risposta rimane separata dall'indirizzo e-mail e non collegabile.

### 2.3 Protezione anti-spam (Turnstile e limitazione della frequenza)

Al momento dell'invio del sondaggio e del Quick-Check del sito web, Cloudflare Turnstile può effettuare un controllo di sicurezza. In tale ambito possono essere trasmessi dati tecnici a Cloudflare per ostacolare invii automatizzati.

Per limitare gli abusi, per il sondaggio memorizziamo brevemente un **hash unidirezionale dell'IP del client** (SHA-256, senza IP in chiaro) insieme al giorno UTC e a un contatore (al massimo 20 invii riusciti al giorno per hash). Queste voci di quota vengono cancellate automaticamente dopo pochi giorni e servono esclusivamente alla prevenzione degli abusi — non sono collegate alle risposte del sondaggio né agli indirizzi e-mail.

### 2.4 Quick-Check del sito web

Se fate verificare un URL, il vostro browser invia l'URL e un token Turnstile al nostro worker scanner. Il worker richiama la pagina di destinazione e valuta segnali pubblicamente visibili. **Non vengono memorizzati in modo permanente presso di noi né i risultati della scansione né gli URL inseriti.**

### 2.5 Nessun cookie, nessun tracciamento; statistiche di utilizzo

Questo sito web **non utilizza cookie** e **non impiega strumenti di analisi o tracciamento** (nessun pixel di tracciamento, nessun fingerprinting, nessuno script di terzi ad eccezione di Turnstile). Un banner sui cookie non è pertanto necessario. Il Quick-Check memorizza brevemente, per il passaggio di un URL dalla pagina iniziale al modulo, una voce nella memoria di sessione (sessionStorage) del vostro browser; questa viene cancellata immediatamente dopo la lettura e non ci viene trasmessa.

Per rilevare l'utilizzo del sito e degli strumenti utilizziamo esclusivamente **conteggi lato server**:

- **Visualizzazioni di pagina:** le statistiche di traffico aggregate di Cloudflare (ad es. numero di richieste per pagina), generate a partire dai dati di connessione comunque presenti (cfr. punto 2.1) – senza script, cookie o identificatore nel vostro browser.
- **Utilizzo degli strumenti:** per ogni Quick-Check o invio del sondaggio, i nostri worker registrano un punto dati con strumento, esito (ad es. riuscito, rifiutato) e stato HTTP. **Nessun** indirizzo IP, URL, risposta del sondaggio o altro identificatore; un punto dati non può essere ricondotto a una persona.

## 3. Finalità del trattamento

| Dati | Finalità |
|---|---|
| Dati tecnici di connessione | Erogazione, funzionamento e protezione del sito web |
| Risposte al sondaggio | Statistica anonimizzata e benchmark (aggregazione; le celle con meno di cinque risposte non vengono pubblicate) |
| E-mail facoltativa | Notifica una tantum o se necessario, non appena il rapporto di benchmark è disponibile |
| Turnstile / limitazione della frequenza | Protezione contro abusi/spam (incl. quote di hash IP a breve termine) |
| URL del Quick-Check | Valutazione una tantum dell'URL inviato; nessuna memorizzazione permanente presso di noi |

La base giuridica è in particolare il trattamento per l'adempimento di un contratto o di misure precontrattuali, nonché il nostro interesse legittimo al funzionamento delle offerte informative e alla prevenzione degli abusi, nella misura in cui la LPD lo richiede. L'e-mail facoltativa si fonda sul vostro **consenso** (opt-in), che potete revocare in qualsiasi momento.

## 4. Responsabile del trattamento e Cloudflare

Utilizziamo servizi di **Cloudflare, Inc.** (e società collegate) per:

- l'hosting/CDN del sito web (Cloudflare Pages);
- l'API del sondaggio e l'archiviazione in **Cloudflare D1**;
- lo scanner del sito web (Cloudflare Worker, senza memorizzazione permanente);
- conteggi anonimi di utilizzo (Cloudflare Workers Analytics Engine) e statistiche di traffico aggregate;
- facoltativamente **Cloudflare Turnstile**.

Cloudflare agisce in tale ambito come **responsabile del trattamento** nei limiti delle finalità da noi stabilite. A seconda della configurazione di Cloudflare, i trattamenti possono avvenire anche al di fuori della Svizzera o dell'UE/SEE. Selezioniamo fornitori e impostazioni in modo da perseguire un livello di protezione adeguato (tra l'altro mediante garanzie contrattuali del fornitore).

## 5. Conservazione

| Dati | Conservazione |
|---|---|
| Risposte al sondaggio | Fino alla valutazione e pubblicazione degli aggregati anonimizzati; le risposte grezze non vengono conservate oltre quanto necessario per la finalità del benchmark (obiettivo: cancellazione o anonimizzazione entro al massimo **24 mesi** dall'invio, salvo obbligo legale più lungo) |
| E-mail facoltative | Fino all'invio della notifica del rapporto o fino alla vostra richiesta di cancellazione; cancellazione automatica al massimo dopo **24 mesi**; cancellazione manuale dalla tabella delle iscrizioni su richiesta |
| Quote di hash IP (sondaggio) | Pochi giorni (cancellazione automatica delle voci giornaliere più vecchie); solo per la prevenzione degli abusi |
| Quick-Check | Nessuna memorizzazione permanente presso di noi |
| Conteggi di utilizzo (strumenti) | Tre mesi (cancellazione automatica da parte di Cloudflare); senza riferimento a persone |
| Log del server/CDN | Secondo le impostazioni standard di Cloudflare; tipicamente a breve termine per il funzionamento e la sicurezza |

## 6. I vostri diritti e la cancellazione

Potete richiedere informazioni, rettifica e cancellazione dei vostri dati personali, nonché opporvi al trattamento, nella misura in cui la LPD lo preveda. In caso di e-mail facoltativamente indicata, è di norma sufficiente un messaggio a **[i.laube@gmail.com](mailto:i.laube@gmail.com)** con la richiesta di cancellazione; procederemo quindi a cancellare l'indirizzo e-mail dalla tabella delle iscrizioni. Le risposte al sondaggio non ne sono interessate e non sono collegate all'e-mail.

Le risposte al sondaggio non possono successivamente essere ricondotte a una persona (nemmeno tramite l'e-mail facoltativa) e non possono pertanto essere cancellate in modo mirato.

Potete inoltre presentare reclamo presso l'**Incaricato federale della protezione dei dati e della trasparenza (IFPDT)**.

## 7. Nessun obbligo di fornire dati / conseguenze

L'utilizzo del sito web e della maggior parte delle funzioni è possibile senza indicare dati personali. Senza l'opt-in per l'e-mail non riceverete alcuna notifica relativa al rapporto di benchmark; la partecipazione anonima al sondaggio rimane possibile.

## 8. Modifiche

Possiamo adattare la presente informativa sulla protezione dei dati qualora cambino l'offerta o la situazione giuridica. Fa fede la versione pubblicata di volta in volta su questa pagina (`last_verified` nell'intestazione della pagina).
