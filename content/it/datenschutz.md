---
title: "Informativa sulla protezione dei dati"
description: "Come aicompliant.ch tratta i dati personali (art. 19 LPD): titolare del trattamento, finalità, Cloudflare quale responsabile del trattamento, comunicazione all'estero, conservazione e i vostri diritti."
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

La presente informativa sulla protezione dei dati vi informa, conformemente all'**art. 19 LPD**, su quali dati personali trattiamo sul sito **aicompliant.ch**, per quali finalità e per quanto tempo.

## 1. Titolare del trattamento

Il titolare del trattamento dei dati è:

| | |
|---|---|
| **Nome** | Ivan Laube |
| **E-mail** | [i.laube@gmail.com](mailto:i.laube@gmail.com) |

Ulteriori indicazioni: [Impressum](/de/impressum/).

## 2. Quali dati trattiamo

### 2.1 Visita del sito web

Alla visita del sito vengono generati dati tecnici di connessione (ad es. indirizzo IP, momento di accesso, browser e sistema operativo). Il nostro fornitore di hosting Cloudflare ne ha bisogno per erogare le pagine e proteggerle da attacchi. Il sito è costituito da pagine statiche; noi stessi non creiamo profili delle persone che lo visitano.

### 2.2 Sondaggio (facoltativo con indirizzo e-mail)

Se partecipate al sondaggio sull'utilizzo dell'IA, salviamo:

- le vostre **risposte**, insieme a lingua, versione del sondaggio e momento della partecipazione;
- facoltativamente il vostro **indirizzo e-mail**, se richiedete il rapporto di benchmark, insieme a lingua e settimana civile dell'iscrizione.

Le risposte e gli indirizzi e-mail sono salvati in **tabelle separate** di un database Cloudflare D1, con **identificatori propri e senza chiave comune**. Per le risposte non viene annotato se è stato indicato un indirizzo e-mail, e per l'indirizzo e-mail salviamo solo la settimana civile, non il momento esatto. Non esiste quindi alcun nesso memorizzato tra indirizzo e-mail e risposta. Non colleghiamo i due dati né li valutiamo congiuntamente. Senza indirizzo e-mail la vostra partecipazione è anonima.

### 2.3 Protezione dagli abusi (Turnstile e limitazione degli invii)

All'invio del sondaggio e al Website Quick-Check, Cloudflare Turnstile verifica se la richiesta proviene da un essere umano. A tale scopo vengono trasmessi a Cloudflare dati tecnici del vostro browser e il vostro indirizzo IP.

Per limitare gli abusi del sondaggio, salviamo inoltre temporaneamente un **valore hash del vostro indirizzo IP** con la data e un contatore (al massimo 20 invii al giorno). Il valore hash viene generato con una chiave segreta e la relativa data (HMAC-SHA-256); cambia quindi ogni giorno e, senza questa chiave, non può essere ricondotto all'indirizzo IP. L'indirizzo IP stesso non viene salvato. Queste voci vengono cancellate automaticamente al più tardi dopo dieci giorni. Servono unicamente alla prevenzione degli abusi e non vengono collegate a risposte o indirizzi e-mail.

### 2.4 Website Quick-Check

Se fate verificare un URL, il vostro browser trasmette l'URL e un token Turnstile al nostro scanner. Lo scanner richiama il sito indicato e valuta caratteristiche visibili pubblicamente. **Gli URL inseriti e i risultati non vengono salvati in modo permanente.**

### 2.5 KI-Check e strumenti decisionali

Le vostre risposte nel KI-Check e negli strumenti decisionali vengono elaborate solo nel vostro browser e non ci vengono trasmesse. Un link copiato verso un risultato degli strumenti decisionali contiene le vostre risposte; sta a voi decidere a chi lo inoltrate.

### 2.6 Nessun cookie, nessun tracciamento; statistica di utilizzo

Questo sito **non utilizza cookie** e **non impiega strumenti di analisi o tracciamento** come pixel di tracciamento. Ad eccezione di Cloudflare Turnstile all'invio di moduli (cifra 2.3), non carichiamo script di terzi. Per il passaggio di un URL dalla pagina iniziale al Quick-Check, il sito deposita brevemente una voce nella memoria di sessione (sessionStorage) del vostro browser. Viene cancellata immediatamente alla lettura e non ci viene trasmessa.

Per vedere quanto vengono utilizzati il sito e gli strumenti, usiamo solo **conteggi lato server**:

- **Visualizzazioni di pagina:** statistiche aggregate di Cloudflare (ad es. numero di visualizzazioni per pagina), generate a partire dai dati di connessione di cui alla cifra 2.1, senza script, cookie o identificatore nel vostro browser.
- **Utilizzo degli strumenti:** per ogni Quick-Check e ogni invio del sondaggio contiamo un punto dati con strumento, esito (ad es. riuscito, rifiutato) e stato tecnico. Non contiene **alcun** indirizzo IP, URL, risposta o altro identificatore e non può essere ricondotto a una persona.

## 3. Finalità e principi del trattamento

| Dati | Finalità |
|---|---|
| Dati tecnici di connessione | Erogazione, funzionamento e protezione del sito |
| Risposte al sondaggio | Statistica anonimizzata e benchmark (i valori con meno di cinque risposte non vengono pubblicati) |
| Indirizzo e-mail (facoltativo) | Notifica non appena il rapporto di benchmark è disponibile |
| Turnstile e valore hash dell'IP | Protezione da abusi e spam |
| URL del Quick-Check | Verifica una tantum del sito indicato |

Trattiamo i dati personali secondo i principi della LPD (art. 6), solo per le finalità indicate e solo nella misura necessaria. L'indirizzo e-mail viene trattato con il vostro **consenso**, che potete revocare in qualsiasi momento. Le altre operazioni di trattamento servono al nostro interesse a un'offerta sicura e funzionante.

## 4. Responsabili del trattamento e comunicazione all'estero

Utilizziamo servizi di **Cloudflare, Inc.** (USA) e delle sue società affiliate per:

- l'hosting e l'erogazione del sito (Cloudflare Pages);
- il sondaggio e la memorizzazione in **Cloudflare D1**;
- lo scanner del sito (Cloudflare Workers, senza memorizzazione permanente);
- conteggi anonimi di utilizzo (Cloudflare Workers Analytics Engine) e statistiche di traffico aggregate;
- la protezione antispam **Cloudflare Turnstile**.

Cloudflare tratta i dati quale **responsabile del trattamento** su nostro incarico. Cloudflare, Inc. ha sede negli USA e gestisce centri di calcolo in molti Paesi; i dati possono quindi essere trattati negli USA e in altri Stati. Per gli USA ci basiamo sulla certificazione di Cloudflare secondo lo **Swiss-U.S. Data Privacy Framework** (allegato 1 OPDa). Per gli Stati senza un livello di protezione dei dati adeguato si applicano le clausole contrattuali standard contenute nell'accordo sul trattamento dei dati (Data Processing Addendum) di Cloudflare.

## 5. Conservazione

| Dati | Conservazione |
|---|---|
| Risposte al sondaggio | Cancellazione automatica dopo **24 mesi**; vengono pubblicati solo risultati complessivi anonimizzati |
| Indirizzi e-mail | Fino alla notifica sul rapporto o fino alla vostra revoca, al più tardi **24 mesi** (cancellazione automatica) |
| Valori hash dell'IP (sondaggio) | Cancellazione automatica al più tardi dopo dieci giorni |
| Quick-Check | Nessuna memorizzazione permanente |
| Conteggi di utilizzo | Tre mesi (cancellazione automatica da parte di Cloudflare); senza riferimento a persone |
| Log del server e della CDN | Secondo le impostazioni standard di Cloudflare, di norma a breve termine per il funzionamento e la sicurezza |

## 6. I vostri diritti

Potete chiedere informazioni sui vostri dati personali, chiederne la rettifica o la cancellazione, opporvi a un trattamento e, alle condizioni di cui all'art. 28 LPD, richiederne la consegna (art. 25 segg. e art. 32 LPD). Un consenso può essere revocato in qualsiasi momento.

Per far cancellare il vostro indirizzo e-mail, è sufficiente un breve messaggio a **[i.laube@gmail.com](mailto:i.laube@gmail.com)**. Cancelleremo quindi l'indirizzo dalla tabella delle iscrizioni.

Poiché non colleghiamo le risposte al sondaggio a persone, non possiamo cancellarle in modo mirato su richiesta. Vengono cancellate automaticamente dopo 24 mesi.

Potete inoltre rivolgervi all'**Incaricato federale della protezione dei dati e della trasparenza (IFPDT)**.

## 7. Facoltatività

Potete utilizzare il sito e la maggior parte delle funzioni senza fornire dati personali. Senza indirizzo e-mail non riceverete alcuna notifica relativa al rapporto di benchmark; potete comunque partecipare in modo anonimo al sondaggio.

## 8. Modifiche

Adeguiamo questa informativa sulla protezione dei dati quando cambiano l'offerta o la situazione giuridica. Fa stato la versione di volta in volta pubblicata su questa pagina; la data dell'ultima verifica è indicata nell'intestazione della pagina.
