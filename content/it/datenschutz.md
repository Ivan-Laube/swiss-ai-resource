---
title: "Informativa sulla privacy"
description: "Informazioni sul trattamento dei dati personali su aicompliant.ch (art. 19 LPD): titolare, finalità, responsabili del trattamento, conservazione e cancellazione."
last_verified: "2026-08-04"
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

La presente informativa sulla privacy La informa, ai sensi dell'**art. 19 LPD**, sul trattamento dei dati personali su **aicompliant.ch**. I campi contrassegnati con `PLACEHOLDER` devono essere sostituiti con i dati definitivi prima della messa in produzione.

## 1. Titolare del trattamento

Titolare del trattamento:

| | |
|---|---|
| **Nome / ragione sociale** | PLACEHOLDER_LEGAL_NAME |
| **Indirizzo** | PLACEHOLDER_STREET, PLACEHOLDER_POSTAL_CITY, Svizzera |
| **E-mail** | PLACEHOLDER_CONTACT_EMAIL |

Ulteriori indicazioni sul fornitore: [Note legali](/it/impressum/).

## 2. Quali dati trattiamo

### 2.1 Visita del sito (tecnico)

Durante la visita del sito possono essere generati dati tecnici di connessione (p. es. indirizzo IP, timestamp, user-agent) nella misura in cui il fornitore di hosting/CDN (Cloudflare) ne abbia bisogno per la consegna e la sicurezza del sito. Il sito stesso è un **export statico** e **non** memorizza profili visitatori nel nostro codice applicativo.

### 2.2 Sondaggio (e-mail facoltativa)

Se partecipa al sondaggio sull'adozione dell'IA, memorizziamo:

- le Sue **risposte** (senza identificazione), insieme a lingua, versione del sondaggio e timestamp;
- eventualmente il Suo **indirizzo e-mail**, se richiede il rapporto di benchmark (opt-in).

Le risposte e gli indirizzi e-mail sono memorizzati in **tabelle separate** in un database Cloudflare D1, ciascuna con **identificativi propri e senza chiave condivisa**. Un collegamento tecnico tra e-mail e singola risposta non è quindi possibile. Le risposte **senza** e-mail sono anonime; anche con opt-in la risposta resta separata dall'indirizzo e-mail e non collegabile.

### 2.3 Protezione antispam (Turnstile)

All'invio del sondaggio, Cloudflare Turnstile può eseguire un controllo di sicurezza. Dati tecnici possono essere trasmessi a Cloudflare per limitare gli invii automatizzati.

### 2.4 Quick-Check del sito web

Se fa verificare un URL, il Suo browser invia l'URL al nostro Worker di scansione. Il Worker recupera la pagina di destinazione e valuta segnali pubblicamente visibili. **Non memorizziamo in modo permanente i risultati della scansione né gli URL inviati.**

## 3. Finalità del trattamento

| Dati | Finalità |
|---|---|
| Dati tecnici di connessione | Consegna, esercizio e sicurezza del sito |
| Risposte al sondaggio | Statistiche anonimizzate e benchmark (aggregazione; le celle con meno di cinque risposte non sono pubblicate) |
| E-mail facoltativa | Notifica una tantum o secondo necessità quando il rapporto di benchmark è disponibile |
| Turnstile | Protezione da abusi / spam |
| URL Quick-Check | Valutazione una tantum dell'URL inviato; nessuna memorizzazione permanente da parte nostra |

La base giuridica è in particolare il trattamento per l'esecuzione di un contratto o di misure precontrattuali, ovvero il nostro interesse legittimo a gestire le offerte informative e a prevenire abusi, nella misura in cui la LPD lo richieda. L'e-mail facoltativa si basa sul Suo **consenso** (opt-in), che può revocare in qualsiasi momento.

## 4. Responsabili del trattamento e Cloudflare

Utilizziamo servizi di **Cloudflare, Inc.** (e società affiliate) per:

- hosting / CDN del sito (Cloudflare Pages);
- l'API del sondaggio e la memorizzazione in **Cloudflare D1**;
- lo scanner del sito (Cloudflare Worker, senza memorizzazione permanente);
- eventualmente **Cloudflare Turnstile**.

Cloudflare agisce come **responsabile del trattamento** nell'ambito delle finalità da noi definite. A seconda della configurazione Cloudflare, i trattamenti possono anche avvenire fuori dalla Svizzera o dall'UE/SEE. Scegliamo fornitori e impostazioni mirando a un livello di protezione adeguato (incluse le garanzie contrattuali del fornitore).

## 5. Conservazione

| Dati | Conservazione |
|---|---|
| Risposte al sondaggio | Fino alla valutazione e pubblicazione di aggregati anonimizzati; le risposte grezze non sono conservate più a lungo del necessario per il benchmark (obiettivo: cancellazione o anonimizzazione al più tardi **24 mesi** dopo l'invio, salvo obblighi di legge più lunghi) |
| E-mail facoltative | Fino all'invio della notifica del rapporto o fino alla Sua richiesta di cancellazione; cancellazione automatica al più tardi dopo **24 mesi**; cancellazione manuale dalla tabella di iscrizione su richiesta |
| Quick-Check | Nessuna memorizzazione permanente da parte nostra |
| Log server/CDN | Secondo le impostazioni standard di Cloudflare; di norma a breve termine per esercizio e sicurezza |

## 6. I Suoi diritti e la cancellazione

Può chiedere l'accesso, la rettifica e la cancellazione dei Suoi dati personali nonché opporsi al trattamento, nella misura in cui la LPD lo preveda. Per un'e-mail facoltativa registrata, di regola basta un messaggio a **PLACEHOLDER_CONTACT_EMAIL** con richiesta di cancellazione; cancelliamo quindi l'indirizzo e-mail dalla tabella di iscrizione. Le risposte al sondaggio non ne sono interessate e non sono collegate all'e-mail.

Le risposte al sondaggio non possono essere attribuite a una persona (nemmeno tramite l'e-mail facoltativa) e quindi non possono essere cancellate in modo mirato.

Può inoltre presentare reclamo al **Incaricato federale della protezione dei dati e della trasparenza (IFPDT / EDÖB)**.

## 7. Nessun obbligo di fornire dati / conseguenze

Può utilizzare il sito e la maggior parte delle funzioni senza indicare dati personali. Senza opt-in e-mail non riceverà la notifica sul rapporto di benchmark; la partecipazione anonima al sondaggio resta possibile.

## 8. Modifiche

Possiamo aggiornare la presente informativa se l'offerta o il diritto cambiano. Fa fede la versione pubblicata su questa pagina (`last_verified` nell'intestazione della pagina).
