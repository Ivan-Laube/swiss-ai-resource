---
title: "Checklist: approvvigionamento di IA per le PMI svizzere"
description: "Domande pratiche da porre ai fornitori e internamente prima di acquistare uno strumento di IA: protezione dei dati, hosting, contratti, governance e riferimento all'UE."
last_verified: "2026-10-01"
volatility: "stable"
translation_status: "draft"
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
  - title: "FINMA Guidance 08/2024 (PDF)"
    url: "https://www.finma.ch/en/~/media/finma/dokumente/dokumentencenter/myfinma/4dokumentation/finma-aufsichtsmitteilungen/20241218-finma-aufsichtsmitteilung-08-2024.pdf"
  - title: "Anthropic – AI Fluency framework (4D)"
    url: "https://www.anthropic.com/ai-fluency"
---

Questa checklist raccoglie domande dai temi **nLPD/IA**, **hosting negli USA**, **EU AI Act** e – ove rilevante – **governance FINMA**. È uno strumento di approvvigionamento e due diligence, non una consulenza legale né una decisione di approvazione.

Utilizzatela prima del pilota e nuovamente prima della messa in produzione.

## 1. Caso d'uso e dati

- Quale problema aziendale risolve lo strumento – e quali **dati personali** sono coinvolti?
- Vi sono dati particolarmente degni di protezione, profilazione o decisioni individuali automatizzate con effetti rilevanti?
- Potete avviare il caso d'uso con dati **sintetici o anonimizzati**?
- Chi è l'owner interno (settore specialistico, IT, protezione dei dati)?

## 2. Protezione dei dati e trasparenza (LPD)

- Scopo, funzionamento e fonti dei dati sono spiegabili in modo **trasparente** per gli interessati?
- In caso di rischio elevato, è prevista una **valutazione d'impatto sulla protezione dei dati**?
- Gli interessati possono opporsi a un trattamento automatizzato o esigere una **verifica umana**?
- Esiste un registro delle attività di trattamento aggiornato (incl. estero e garanzie)?

## 3. Hosting e trasferimento all'estero {#hosting-transfer}

- In quali regioni vengono archiviati ed elaborati i dati (CH / UE / USA / altre)?
- In caso di destinatari statunitensi: è stata verificata una certificazione attiva **Swiss-U.S. Data Privacy Framework**?
- Altrimenti: sono presenti **clausole tipo di protezione dei dati** riconosciute, un DPA e una verifica del trasferimento?
- I dati immessi vengono utilizzati per l'**addestramento del modello** – ed esiste un'opzione di opt-out?

## 4. Contratto e gestione operativa {#contract-operations}

- Esiste un contratto di trattamento dati (DPA) con regole chiare sui sub-incaricati?
- Sono disciplinati termini di cancellazione, esportazione, notifica di incidenti e diritti di audit?
- Sono noti disponibilità, sede del supporto ed elenco dei subprocessori?
- Piano di uscita: potete portare con voi dati e configurazioni?

## 5. EU AI Act (se vi è un riferimento all'UE) {#eu-ai-act}

- Il sistema o il suo **output viene offerto o utilizzato nell'UE**?
- Quale ruolo assumete (fornitore / deployer / importatore / distributore)?
- La classe di rischio è stata valutata approssimativamente (proibito / alto rischio / trasparenza / GPAI)?
- Le scadenze dell'applicabilità scaglionata sono state assegnate al prodotto?

## 6. Governance (in particolare settore finanziario)

- Voce nell'inventario e classe di rischio per l'applicazione?
- Test su accuratezza, robustezza, bias e monitoraggio del drift?
- Spiegabilità nei confronti di clienti, audit e autorità di vigilanza?
- Revisione indipendente per le applicazioni rilevanti?

## 7. Competenza e formazione {#ai-literacy}

- Le persone che utilizzano o approvano lo strumento dispongono di sufficiente **alfabetizzazione in materia di IA** (EU AI Act art. 4, in vigore dal 2 febbraio 2025)?
- Sono chiari formazione e ruoli (settore specialistico, IT, protezione dei dati) – anche nel senso dell'aspettativa FINMA di «broad training measures» per gli istituti vigilati?
- Esiste un modello di competenza strutturato per l'uso quotidiano dell'IA? Un esempio con licenza libera è l'[AI Fluency 4D-Framework](https://www.anthropic.com/ai-fluency) (Delegation, Description, Discernment, Diligence).

## 8. Regola decisionale (pragmatica)

| Semaforo | Significato |
|---|---|
| Verde | Nessun dato personale / hosting CH o UE con contratto chiaro / impatto basso |
| Giallo | Dati personali + estero o decisioni automatizzate – approvazione con misure |
| Rosso | Dati particolarmente degni di protezione senza concetto di protezione, uso di addestramento poco chiaro, DPA/base di trasferimento mancante |

Giallo e rosso: non vale il principio «provare e sistemare dopo». Prima chiarire le basi, poi avviare il pilota.

## Per approfondire

- [nLPD e IA: nozioni di base](/de/ndsg-ai-basics/)
- [LLM ospitati negli USA secondo la nLPD](/de/us-hosted-llms-ndsg/)
- [EU AI Act per le aziende svizzere](/de/eu-ai-act-swiss-exporters/)
- [Aspettative FINMA in materia di governance dell'IA](/de/finma-ai-expectations/)
- [Modello di direttiva sull'IA (Word)](download:ai-policy-template)

## Avvertenza

Questa checklist è **informativa e non costituisce una consulenza legale**. Per istituti regolamentati e categorie di dati sensibili, coinvolgere i servizi specialistici ed eventualmente una consulenza legale.
