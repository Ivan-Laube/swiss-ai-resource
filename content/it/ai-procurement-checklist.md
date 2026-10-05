---
title: "Lista di controllo: acquisto di soluzioni IA per le PMI svizzere"
description: "Domande pratiche da porre ai fornitori e alla propria azienda prima di acquistare uno strumento di IA: protezione dei dati, hosting, contratti, governance e rilevanza per l'UE."
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
  - title: "EUR-Lex – Verordnung (EU) 2026/1744 (Digital Omnibus on AI)"
    url: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32026R1744"
  - title: "FINMA Guidance 08/2024 (PDF)"
    url: "https://www.finma.ch/en/~/media/finma/dokumente/dokumentencenter/myfinma/4dokumentation/finma-aufsichtsmitteilungen/20241218-finma-aufsichtsmitteilung-08-2024.pdf"
  - title: "Anthropic – AI Fluency framework (4D)"
    url: "https://www.anthropic.com/ai-fluency"
---

Questa checklist riassume le domande principali su protezione dei dati, hosting all'estero, EU AI Act e, laddove rilevante, governance FINMA. Aiuta nella selezione e nella verifica di uno strumento di IA, ma non sostituisce né una verifica legale né la decisione di autorizzazione aziendale.

Esaminate queste domande prima del progetto pilota e di nuovo prima dell'impiego in produzione.

## 1. Caso d'uso e dati

- Quale problema deve risolvere lo strumento e quali **dati personali** vengono trattati?
- Sono coinvolti dati personali degni di particolare protezione, profilazione o decisioni individuali automatizzate con effetti significativi?
- Il caso d'uso può essere avviato con dati **sintetici o anonimizzati**?
- Chi è responsabile internamente (settore specializzato, IT, protezione dei dati)?

## 2. Protezione dei dati e trasparenza (LPD)

- È possibile spiegare in modo comprensibile alle persone interessate lo scopo, il funzionamento e le fonti dei dati, ed è ciò indicato nella dichiarazione sulla protezione dei dati?
- In caso di rischio elevato, è prevista una **valutazione d'impatto sulla protezione dei dati** (art. 22 LPD)?
- Lo strumento decide in merito a persone esclusivamente in modo automatizzato? In tal caso le persone interessate devono essere informate e poter richiedere una **verifica da parte di una persona fisica** (art. 21 LPD).
- Lo strumento è registrato nel registro delle attività di trattamento, con indicazioni relative all'estero e alle garanzie? Il registro è obbligatorio a partire da 250 collaboratori o in caso di trattamenti con rischio elevato (art. 12 LPD, art. 24 OPDa).

## 3. Hosting e comunicazione all'estero {#hosting-transfer}

- In quali paesi vengono memorizzati ed elaborati i dati (CH / UE / USA / altri), e da dove ha accesso il fornitore, ad esempio per l'assistenza?
- In caso di destinatari negli USA: è stata verificata la certificazione nell'ambito dello **Swiss-U.S. Data Privacy Framework**?
- In caso contrario: sono state concordate **clausole tipo di protezione dei dati** riconosciute ed è documentata la verifica del trasferimento?
- Gli input vengono utilizzati per l'**addestramento**, ed è possibile escluderlo?

## 4. Contratto e gestione operativa {#contract-operations}

- È disponibile un **contratto per il trattamento dei dati su incarico** (DPA), con regole chiare per i subincaricati del trattamento?
- Sono disciplinati i termini di cancellazione, l'esportazione dei dati, la notifica di incidenti di sicurezza e i diritti di audit?
- Sono noti la disponibilità, la sede dell'assistenza e l'elenco dei subincaricati del trattamento?
- Piano di uscita: in caso di cambio di fornitore, è possibile portare con sé dati e configurazioni?

## 5. EU AI Act (in caso di rilevanza per l'UE) {#eu-ai-act}

- Il sistema o il suo **output viene offerto o utilizzato nell'UE**?
- Quale ruolo ricoprite (fornitore, deployer, importatore, distributore)?
- Come viene classificato approssimativamente il sistema (vietato, ad alto rischio, con obbligo di trasparenza, GPAI o senza obblighi particolari)?
- I termini applicabili sono stati assegnati al prodotto (cfr. [calendario](/de/eu-ai-act-swiss-exporters/#timeline))?

## 6. Governance (in particolare nel settore finanziario)

- L'applicazione è registrata e classificata nell'inventario IA?
- Esistono test su accuratezza, robustezza e bias, nonché un monitoraggio delle variazioni (drift)?
- I risultati possono essere spiegati alla clientela, alla società di revisione e all'autorità di vigilanza?
- Le applicazioni rilevanti vengono verificate in modo indipendente?

## 7. Competenza e formazione {#ai-literacy}

- Le persone che utilizzano o autorizzano lo strumento conoscono sufficientemente l'IA, i suoi limiti e i rischi? Se la vostra azienda rientra nell'ambito di applicazione dell'EU AI Act, dovete adottare misure per promuovere questa **alfabetizzazione in materia di IA** (art. 4, nella versione in vigore dal 27 luglio 2026).
- Le formazioni e i ruoli sono chiaramente disciplinati (settore specializzato, IT, protezione dei dati)? Gli istituti finanziari sottoposti a vigilanza tengono conto anche delle aspettative della FINMA riguardo a formazioni ad ampio raggio.
- Esiste un modello di riferimento per le formazioni? Un esempio liberamente disponibile è l'[AI Fluency 4D-Framework](https://www.anthropic.com/ai-fluency) (Delegation, Description, Discernment, Diligence).

## 8. Regola decisionale (semaforo semplificato)

| Semaforo | Situazione tipica |
|---|---|
| Verde | Nessun dato personale, oppure hosting in Svizzera o nell'UE con contratto per il trattamento dei dati su incarico; effetti ridotti sulle persone |
| Giallo | Dati personali con comunicazione all'estero o decisioni automatizzate: autorizzazione solo con misure adeguate |
| Rosso | Dati personali degni di particolare protezione senza concetto di protezione, utilizzo poco chiaro a fini di addestramento, assenza di un contratto per il trattamento dei dati su incarico o mancanza di una base per la comunicazione all'estero |

Per il giallo e il rosso vale il principio: non «provare e sistemare in seguito». Prima chiarire le basi, poi avviare il progetto pilota. Per gli istituti regolamentati e i dati sensibili è consigliabile coinvolgere specialisti in protezione dei dati o esperti legali.

## Per approfondire

- [nLPD e IA: nozioni di base](/de/ndsg-ai-basics/)
- [LLM ospitati negli USA secondo la nLPD](/de/us-hosted-llms-ndsg/)
- [EU AI Act: portata per le aziende svizzere](/de/eu-ai-act-swiss-exporters/)
- [Aspettative della FINMA in materia di governance dell'IA](/de/finma-ai-expectations/)
- [IA e cibersicurezza: rischi per le PMI](/de/ai-security-risks/)
- [Modello di direttiva sull'IA (Word)](download:ai-policy-template)
