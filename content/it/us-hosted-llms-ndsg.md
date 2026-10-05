---
title: "LLM ospitati negli USA secondo la nLPD"
description: "Quando le aziende svizzere possono trasmettere dati personali a modelli linguistici negli Stati Uniti: Swiss-U.S. Data Privacy Framework, clausole tipo di protezione dei dati, obblighi d'informazione e una checklist per la pratica."
last_verified: "2026-10-01"
volatility: "fast"
translation_status: "draft"
category: "datenschutz"
reviewed_by: null
review_date: null
review_scope: null
sources:
  - title: "EDÖB – Bekanntgabe von Personendaten ins Ausland"
    url: "https://www.edoeb.admin.ch/de/bekanntgabe-von-personendaten-ins-ausland"
  - title: "EDÖB – Einsatz von ChatGPT und vergleichbaren KI-gestützten Anwendungen"
    url: "https://www.edoeb.admin.ch/de/04042023-einsatz-von-chatgpt-und-vergleichbaren-ki-gestuetzten-anwendungen"
  - title: "Fedlex – Bundesgesetz über den Datenschutz (DSG), Art. 16 und 17"
    url: "https://www.fedlex.admin.ch/eli/cc/2022/491/de"
  - title: "Fedlex – Verordnung über den Datenschutz (DSV), Anhang 1"
    url: "https://www.fedlex.admin.ch/eli/cc/2022/568/de"
  - title: "Data Privacy Framework – Participant List"
    url: "https://www.dataprivacyframework.gov/list"
---

Molti modelli linguistici generativi (Large Language Models, LLM) sono gestiti negli Stati Uniti. Non appena **dati personali** vi giungono, si applicano le regole sulla **comunicazione all'estero** (art. 16 e 17 LPD). Per comunicazione si intende non solo la trasmissione, ma anche l'accesso reso possibile ai dati (art. 5 lett. e LPD), ad esempio quando un fornitore con sede negli USA può accedere a dati memorizzati in Svizzera.

## Regola di base: protezione adeguata o garanzie {#transfer-abroad}

I dati personali possono essere comunicati all'estero se il Consiglio federale ha accertato che lo Stato destinatario garantisce una **protezione adeguata** (art. 16 cpv. 1 LPD). L'elenco di questi Stati si trova nell'**allegato 1 dell'Ordinanza sulla protezione dei dati (OPDa)**; ne fanno parte, tra l'altro, tutti gli Stati dell'UE e dello SEE. Per gli altri Stati occorrono **garanzie appropriate** (art. 16 cpv. 2 LPD) oppure un caso eccezionale secondo l'art. 17 LPD.

L'azienda deve informare le persone interessate sullo Stato e, se del caso, sulle garanzie o sull'eccezione applicata (art. 19 cpv. 4 LPD). Chi tiene un registro delle attività di trattamento vi annota anche queste indicazioni (art. 12 LPD). Le aziende con meno di 250 collaboratori sono nella maggior parte dei casi esentate dall'obbligo di tenere il registro (art. 24 OPDa).

## USA: Swiss-U.S. Data Privacy Framework {#swiss-us-dpf}

Dal **15 settembre 2024** il Consiglio federale riconosce per gli USA una protezione adeguata, tuttavia solo per le aziende statunitensi certificate secondo lo **Swiss-U.S. Data Privacy Framework (DPF)** (allegato 1 OPDa). Per tutti gli altri destinatari negli USA questo non si applica.

Prima di utilizzare un fornitore statunitense, verificate:

1. La società esatta che riceve i vostri dati è attivamente certificata nell'elenco pubblico dei partecipanti al DPF?
2. La certificazione copre espressamente lo **Swiss-U.S. DPF** e non solo l'EU-U.S. DPF?
3. Copre i dati interessati? I dati del personale (dati HR) vengono certificati separatamente.

Se il destinatario non dispone di una certificazione adeguata, è necessaria un'altra base giuridica (vedi sezione seguente). Considerate inoltre che l'adeguatezza dipende dal mantenimento in vigore del DPF. La Corte di giustizia dell'UE ha dichiarato invalida la normativa precedente (Privacy Shield) nel 2020, e successivamente l'IFPDT l'ha classificata come insufficiente anche per la Svizzera. Per questo molte aziende concordano, in aggiunta, clausole tipo di protezione dei dati con i principali fornitori statunitensi.

## Senza DPF: garanzie ed eccezioni {#safeguards}

In assenza di una certificazione DPF adeguata, la comunicazione resta comunque ammessa se una protezione adeguata dei dati è garantita in altro modo (art. 16 cpv. 2 LPD), in particolare tramite:

- **clausole tipo di protezione dei dati** approvate, rilasciate o riconosciute dall'IFPDT, segnatamente le clausole contrattuali tipo della Commissione UE con gli adattamenti necessari per la Svizzera;
- **clausole di protezione dei dati in un contratto individuale**, previamente comunicate all'IFPDT;
- **norme interne d'impresa vincolanti in materia di protezione dei dati** (Binding Corporate Rules), applicabili solo all'interno di un gruppo aziendale.

Chi si basa su tali clausole deve verificare se il destinatario è in grado di rispettarle e se il diritto dello Stato destinatario, ad esempio in caso di accesso da parte delle autorità, non vi si opponga (Transfer Impact Assessment, TIA). A seconda del risultato, possono essere necessarie misure tecniche supplementari, ad esempio la rimozione o la pseudonimizzazione di nomi negli input.

In singoli casi, l'art. 17 LPD consente una comunicazione anche senza protezione adeguata, ad esempio con il consenso esplicito della persona interessata o se la comunicazione è direttamente necessaria per un contratto con quest'ultima. Per l'impiego continuativo di uno strumento di IA, queste eccezioni si prestano scarsamente.

## Particolarità dei modelli linguistici {#llm-specifics}

L'IFPDT raccomanda un **approccio consapevole** nell'utilizzo delle applicazioni di IA e ricorda alle aziende i loro obblighi, in particolare l'informazione trasparente sullo scopo e sul tipo di trattamento.

Chiarite inoltre:

- Gli input vengono utilizzati per l'**addestramento** del modello, e ciò può essere escluso?
- Esiste un **contratto di trattamento dei dati su mandato** (ingl. Data Processing Agreement, DPA) (art. 9 LPD)?
- Quali dati possono essere inseriti? I dati personali degni di particolare protezione (ad es. dati sanitari) e i dati soggetti a segreto professionale solo se ciò è stato espressamente verificato e garantito.
- Dove vengono memorizzati i log, gli embedding e le richieste di supporto, e per quanto tempo?

## Checklist sintetica {#checklist}

| Domanda | Perché è rilevante |
|---|---|
| Gli input o i risultati contengono dati personali? | Senza dati personali le regole sulla comunicazione all'estero non si applicano |
| Il destinatario statunitense è certificato secondo lo Swiss-U.S. DPF? | Protezione adeguata dal 15.9.2024, solo per destinatari certificati (allegato 1 OPDa) |
| In caso contrario: sono presenti clausole tipo di protezione dei dati e una verifica del trasferimento (TIA)? | Art. 16 cpv. 2 LPD |
| È stato concluso un contratto di trattamento dei dati su mandato? | Art. 9 LPD |
| Le persone interessate sono state informate sullo Stato e sulle garanzie? | Art. 19 cpv. 4 LPD |
| L'addestramento con i vostri dati è escluso? | Vincolo di scopo e trasparenza (art. 6 cpv. 3 e art. 19 LPD) |

Gli impieghi transfrontalieri di IA dovrebbero essere verificati caso per caso, in particolare in presenza di dati personali degni di particolare protezione.
