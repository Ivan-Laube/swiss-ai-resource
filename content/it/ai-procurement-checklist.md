---
title: "Checklist: acquisto di IA per le PMI svizzere"
description: "Domande pratiche ai fornitori e internamente prima di acquistare uno strumento di IA: protezione dei dati, hosting, contratti, governance e nesso con l'UE."
last_verified: "2026-07-10"
volatility: "stable"
translation_status: "draft"
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

Questa checklist raggruppa domande dai temi **LPD/IA**, **hosting USA**, **regolamento sull'IA dell'UE** e — dove rilevante — **governance FINMA**. È uno strumento di acquisto e due diligence, non consulenza legale né una decisione di approvazione.

Usatela prima del pilota e di nuovo prima della messa in produzione.

## 1. Caso d'uso e dati

- Quale problema di business risolve lo strumento — e quali **dati personali** vi confluiscono?
- Ci sono dati personali particolarmente degni di protezione, profiling o decisioni individuali automatizzate con effetti rilevanti?
- Potete avviare il caso d'uso con dati **sintetici o anonimizzati**?
- Chi è owner interno (business, IT, protezione dei dati)?

## 2. Protezione dei dati e trasparenza (LPD)

- Finalità, funzionamento e fonti dei dati sono **trasparentemente** spiegabili alle persone interessate?
- In caso di rischio elevato è pianificata una **valutazione d'impatto sulla protezione dei dati**?
- Le persone interessate possono opporsi a un trattamento automatico o esigere un **controllo umano**?
- Esiste un registro delle attività di trattamento aggiornato (incl. estero e garanzie)?

## 3. Hosting e trasferimento all'estero

- In quali regioni i dati sono memorizzati e trattati (CH / UE / US / altri)?
- Per destinatari USA: certificazione attiva **Swiss-U.S. Data Privacy Framework** verificata?
- Altrimenti: **clausole tipo di protezione dei dati** riconosciute, DPA ed esame del trasferimento presenti?
- Gli input vengono usati per l'**addestramento del modello** — ed esiste un opt-out?

## 4. Contratto ed esercizio

- Contratto con il responsabile del trattamento (DPA) con regole chiare sui sub-responsabili?
- Termini di cancellazione, export, notifica di incidenti e diritti di audit regolati?
- Disponibilità, sede del supporto e elenco dei sub-processori noti?
- Piano di exit: potete portare con voi dati e configurazioni?

## 5. Regolamento sull'IA dell'UE (se nesso con l'UE)

- Il sistema o il suo **output nell'UE** è offerto o utilizzato?
- Quale ruolo avete (fornitore / deployer / importatore / distributore)?
- Classe di rischio stimata grossolanamente (vietato / sistema di IA ad alto rischio / trasparenza / modello di IA per finalità generali)?
- Scadenze dell'applicabilità graduale attribuite al prodotto?

## 6. Governance (soprattutto settore finanziario)

- Voce di inventario e classe di rischio per l'applicazione?
- Test di accuratezza, robustezza, bias e monitoraggio del drift?
- Spiegabilità verso clienti, audit e vigilanza?
- Esame indipendente per le applicazioni materiali?

## 7. Competenza e formazione

- Le persone che utilizzano o approvano lo strumento hanno un'**alfabetizzazione in materia di IA** sufficiente (regolamento (UE) 2024/1689 art. 4, in vigore dal 2 febbraio 2025)?
- Formazioni e ruoli sono chiari (business, IT, protezione dei dati) — anche nel senso dell'aspettativa FINMA di «broad training measures» per gli istituti assoggettati?
- Esiste un modello di competenza strutturato per il quotidiano con l'IA? Un esempio liberamente licenziato è il [framework AI Fluency 4D](https://www.anthropic.com/ai-fluency) (Delegation, Description, Discernment, Diligence).

## 8. Regola decisionale (pragmatica)

| Semaforo | Significato |
|---|---|
| Verde | Nessun dato personale / hosting CH o UE con contratto chiaro / impatto basso |
| Giallo | Dati personali + estero o decisioni automatizzate — approvazione con misure |
| Rosso | Dati particolarmente degni di protezione senza concetto di protezione, uso per l'addestramento poco chiaro, DPA/base di trasferimento mancante |

Giallo e rosso: non «provare prima e ripulire dopo». Prima chiarire le basi, poi il pilota.

## Per approfondire

- [LPD e IA: basi](/it/ndsg-ai-basics/)
- [LLM ospitati negli USA sotto la LPD](/it/us-hosted-llms-ndsg/)
- [Regolamento sull'IA dell'UE per le imprese svizzere](/it/eu-ai-act-swiss-exporters/)
- [Aspettative FINMA sulla governance dell'IA](/it/finma-ai-expectations/)

## Avvertenza

Questa checklist è **informativa e non costituisce consulenza legale**. Per istituti regolamentati e categorie di dati sensibili coinvolgere le funzioni specialistiche e, se del caso, una consulenza legale.
