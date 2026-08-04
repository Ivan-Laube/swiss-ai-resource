---
title: "LLM ospitati negli USA sotto la LPD"
description: "Quando le imprese svizzere possono comunicare dati personali a modelli linguistici ospitati negli USA: adeguatezza, Swiss-U.S. Data Privacy Framework, garanzie contrattuali e controlli pratici."
last_verified: "2026-07-10"
volatility: "fast"
translation_status: "draft"
reviewed_by: null
review_date: null
review_scope: null
sources:
  - title: "EDÖB – Bekanntgabe von Personendaten ins Ausland"
    url: "https://www.edoeb.admin.ch/de/bekanntgabe-von-personendaten-ins-ausland"
  - title: "EDÖB – Einsatz von ChatGPT und vergleichbaren KI-gestützten Anwendungen"
    url: "https://www.edoeb.admin.ch/de/04042023-einsatz-von-chatgpt-und-vergleichbaren-ki-gestuetzten-anwendungen"
  - title: "Fedlex – Bundesgesetz über den Datenschutz (DSG), Art. 16"
    url: "https://www.fedlex.admin.ch/eli/cc/2022/491/de"
  - title: "Data Privacy Framework – Participant List"
    url: "https://www.dataprivacyframework.gov/list"
---

Molti modelli linguistici generativi (LLM) sono gestiti negli USA. Non appena i **dati personali** lasciano la Svizzera, si applicano le regole sulla **Comunicazione di dati personali all'estero** (art. 16 e 17 LPD). Questa pagina spiega il quadro per le imprese svizzere — senza sostituire una consulenza legale.

## Punto di partenza: dati personali e trasferimento all'estero

I dati personali possono in linea di principio essere comunicati all'estero solo se nel Paese di destinazione esiste una **protezione adeguata** oppure se si applicano **garanzie idonee**. Se uno Stato offre una protezione adeguata è stabilito dal Consiglio federale nell'**allegato 1 dell'Ordinanza sulla protezione dei dati (OPDa)**.

La persona interessata deve essere informata di una comunicazione di dati all'estero (art. 19 cpv. 4 LPD). Paesi e garanzie figurano tra le indicazioni obbligatorie del registro delle attività di trattamento (art. 12 LPD).

## USA e Swiss-U.S. Data Privacy Framework

Il **15 settembre 2024** è entrata in vigore la modifica dell'elenco degli Stati (allegato 1 OPDa) relativa agli USA. Il quadro giuridico correlato — lo **Swiss-U.S. Data Privacy Framework (DPF)** — si applica alle organizzazioni USA **certificate**.

Controllo pratico prima di utilizzare un fornitore USA:

1. Il destinatario concreto è attivamente certificato nell'elenco pubblico dei partecipanti al DPF?
2. La certificazione copre espressamente l'estensione **Swiss-U.S.** (non solo EU-U.S.)?
3. La finalità di trattamento certificata corrisponde al vostro utilizzo (p. es. IA cloud, supporto, analytics)?

Senza una certificazione adeguata, «il fornitore ha sede negli USA» da solo **non** costituisce una base di adeguatezza.

## Quando non si applica una decisione di adeguatezza

In assenza di una decisione di adeguatezza (o se non si applica al destinatario concreto), i trasferimenti possono comunque essere ammessi se la protezione dei dati è altrimenti assicurata — in particolare mediante:

- **clausole tipo di protezione dei dati** (riconosciute o approvate dall'Incaricato federale della protezione dei dati e della trasparenza (IFPDT); le SCC dell'UE e le MCC del CdE sono riconosciute dall'IFPDT);
- **clausole di protezione dei dati in un contratto specifico** (con obbligo di comunicazione all'IFPDT);
- **norme vincolanti d'impresa (BCR)**.

Il titolare del trattamento deve assicurarsi che il destinatario possa rispettare le clausole e che il diritto del Paese terzo non vi si opponga. Misure tecniche possono essere necessarie se minacciano accessi sproporzionati delle autorità.

## Punti specifici per gli LLM

L'IFPDT invita le utenti e gli utenti a un **uso consapevole** delle applicazioni di IA e ricorda alle imprese i loro obblighi — in particolare un'informazione trasparente sulle finalità e sulla natura del trattamento.

Chiarire inoltre:

- Gli input vengono usati per l'**addestramento del modello**? Esiste un opt-out?
- Esiste un **contratto con il responsabile del trattamento (DPA)**?
- Quali categorie di dati possono essere inserite (nessun dato personale particolarmente degno di protezione senza base giuridica chiara e misure di protezione)?
- Dove si trovano log, embedding e ticket di supporto?

## Checklist breve

| Domanda | Perché è rilevante |
|---|---|
| I prompt contengono dati personali? | Senza dati personali, nessun tema di trasferimento all'estero sotto la LPD |
| Il destinatario USA è certificato Swiss-U.S. DPF? | Possibile base di adeguatezza dal 15.09.2024 |
| Altrimenti SCC/DPA e esame del trasferimento? | Art. 16 cpv. 2 LPD |
| Informazione delle persone interessate? | Art. 19 cpv. 4 LPD |
| Uso per l'addestramento e opt-out chiariti? | Trasparenza e limitazione delle finalità |

## Avvertenza

Questa pagina è **informativa e non costituisce consulenza legale**. I dispiegamenti di IA transfrontalieri vanno esaminati caso per caso.
