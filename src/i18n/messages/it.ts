import type { Messages } from "../types";

export const it: Messages = {
  meta: {
    title: "aicompliant.ch",
    description:
      "Informazioni pratiche per le aziende svizzere sull'uso dell'IA: protezione dei dati, AI Act UE, FINMA, confronto dei fornitori e strumenti decisionali.",
  },
  nav: {
    brand: "aicompliant.ch",
    brandSubtitle: "Swiss AI Resource",
    wordmark: "aicompliant",
    wordmarkTld: ".ch",
    languagesLabel: "Lingue",
    mainLabel: "Navigazione principale",
    skipToContent: "Vai al contenuto",
    menu: "Menu",
    guides: "Guide",
    tools: "Strumenti decisionali",
    vendors: "Confronto fornitori",
    survey: "Sondaggio & Benchmark",
    websiteCheck: "Controlla sito",
  },
  footer: {
    navLabel: "Piè di pagina",
    brandDescription:
      "Guide, strumenti decisionali e un confronto fornitori basato su fonti per l'uso dell'IA in Svizzera.",
    lastSourceCheck: "Ultimo controllo delle fonti: {date}",
    colGuides: "Guide",
    colTools: "Strumenti",
    colData: "Dati",
    colLegal: "Note legali",
    survey: "Sondaggio",
    benchmark: "Benchmark",
    disclaimer:
      "I contenuti hanno solo scopo informativo e non costituiscono consulenza legale. Verificate le fonti e consultate specialisti se necessario.",
    copyright: "© {year} aicompliant.ch",
    impressum: "Note legali",
    privacy: "Informativa sulla privacy",
  },
  home: {
    eyebrow: "Per le PMI svizzere",
    title: "L'IA in azienda – i requisiti svizzeri a colpo d'occhio",
    lead:
      "Guide su protezione dei dati, AI Act UE, FINMA e sicurezza dell'IA, oltre a strumenti decisionali, un confronto dei fornitori e un controllo del sito. Indipendente, senza tracking e con fonti verificate automaticamente ogni mese per eventuali modifiche.",
    note:
      "Fa fede la versione tedesca. Le traduzioni inglese, francese e italiana sono bozze generate automaticamente e non sono ancora state riviste.",
    ctaTools: "Avvia uno strumento decisionale",
    ctaVendors: "Confronta i fornitori",
    quickCheckTitle: "Quick-Check sito web",
    quickCheckLead:
      "Verifica gli elementi visibili pubblicamente sul vostro sito: informativa sulla protezione dei dati, impressum, strumenti per i cookie, tracker e header di sicurezza. Non è una valutazione giuridica.",
    quickCheckUrlLabel: "URL del sito",
    quickCheckSubmit: "Controlla il sito",
    quickCheckPrivacy:
      "L'URL viene trasmesso al nostro scanner solo per questo controllo e non viene memorizzato in modo permanente.",
    quickCheckChecksHeading: "Cosa viene controllato",
    statsHeading: "In sintesi",
    statsGuides: "Guide",
    statsTools: "Strumenti decisionali",
    statsVendors: "Fornitori",
    statsLastSource: "Ultima verifica delle fonti",
    guidesHeading: "Guide",
    guidesLead:
      "Basi su protezione dei dati, AI Act UE, FINMA, acquisti e sicurezza dell'IA, ciascuna con le relative fonti.",
    guidesAction: "Tutte le guide",
    categoryDatenschutz: "Protezione dei dati",
    categoryEuAiAct: "AI Act UE",
    categoryFinanzmarkt: "Mercati finanziari",
    categoryBeschaffung: "Approvvigionamento",
    categorySicherheit: "Sicurezza",
    readingTime: "{n} min di lettura",
    toolsHeading: "Strumenti decisionali",
    toolsLead:
      "Poche domande, una prima valutazione con fonti. Non sostituisce un esame caso per caso.",
    toolsMaxQuestions: "max. {n} domande",
    toolsAction: "Tutti gli strumenti",
    vendorsHeading: "Confronto fornitori",
    vendorsLead:
      "Hosting, contratti con il responsabile del trattamento (DPA) e certificazioni a confronto. Ogni dato ha una fonte, altrimenti è indicato come non verificato.",
    vendorsListed: "{n} fornitori elencati",
    vendorsSwissHosting: "{n} con hosting svizzero documentato",
    vendorsDpa: "{n} con DPA documentata",
    vendorsUnverifiedNote:
      "Le informazioni senza fonte sono considerate non verificate. Il confronto non contiene raccomandazioni né valutazioni.",
    vendorsAction: "Apri il confronto",
    surveyHeading: "Sondaggio & benchmark",
    surveyLead:
      "Breve sondaggio sull'uso dell'IA nelle aziende svizzere. I risultati confluiscono in forma anonima nel benchmark.",
    surveyCta: "Compila il sondaggio",
    benchmarkLink: "Vai al benchmark",
    benchmarkPending: "Risultati da {n} risposte",
    methodologyHeading: "Metodo",
    methodologySourcesTitle: "Fonti ufficiali",
    methodologySourcesBody:
      "Guide e strumenti decisionali si basano soprattutto su testi di legge e pubblicazioni delle autorità (p. es. IFPDT, FINMA, UFCS). Ogni pagina indica le proprie fonti con un link.",
    methodologyChecksTitle: "Verifica mensile delle fonti",
    methodologyChecksBody:
      "Un processo automatico consulta le fonti ogni mese e segnala le modifiche. Se una fonte cambia nella sostanza, la pagina interessata viene verificata e aggiornata.",
    methodologyIndependenceTitle: "Indipendente",
    methodologyIndependenceBody:
      "Nessun link di affiliazione o sponsorizzato e nessun tracking sul sito.",
  },
  websiteCheck: {
    metaTitle: "Quick-Check sito web",
    metaDescription:
      "Prima valutazione di un sito: HTTPS, link all'informativa sulla protezione dei dati, impressum, strumenti per i cookie, tracker e header di sicurezza, con i riferimenti giuridici. Non è consulenza legale.",
    title: "Quick-Check sito web",
    lead:
      "Inserisca un URL. La scansione verifica gli elementi visibili pubblicamente e indica per ogni punto «trovato», «non trovato» o «indeterminato». Non valuta se il sito è conforme al diritto.",
    backHome: "← Torna alla home",
    urlLabel: "URL del sito",
    urlPlaceholder: "esempio.ch",
    submit: "Scansiona",
    scanning: "Scansione in corso …",
    unavailable:
      "Il Quick-Check non è configurato al momento. Riprovi più tardi.",
    errorBadUrl: "Inserisca un URL http o https valido.",
    errorRateLimit:
      "Troppe richieste. Attenda un minuto e riprovi.",
    errorUpstream:
      "Impossibile caricare la pagina di destinazione (timeout, redirect o errore server).",
    errorNetwork:
      "Impossibile raggiungere lo scanner. Controlli la connessione e riprovi.",
    errorServer:
      "Si è verificato un errore durante la scansione. Riprovi.",
    turnstileLabel: "Verifica di sicurezza",
    errorTurnstile:
      "Verifica di sicurezza non riuscita. Riprovi.",
    statusFound: "Trovato",
    statusNotFound: "Non trovato",
    statusIndeterminate: "Indeterminato",
    severityHigh: "Alto",
    severityMedium: "Medio",
    severityLow: "Basso",
    severityInfo: "Info",
    scannedUrl: "URL scansionato",
    finalUrl: "URL finale",
    relatedPage: "Pagina correlata",
    legalBasis: "Base giuridica",
    evidence: "Evidenze",
    staticScanCaveat:
      "La pagina sembra caricarsi in modo dinamico (p. es. tramite un tag manager o come single-page app). Una scansione statica può quindi non rilevare alcuni script e banner; i risultati possono essere incompleti.",
    disclaimer:
      "Questo Quick-Check è una prima valutazione basata su elementi visibili pubblicamente e non costituisce consulenza legale né un audit di conformità. Verifichi le fonti e consulti professionisti se necessario.",
    notFoundNote:
      "«Non trovato» significa solo che la scansione non ha rilevato l'elemento sulle pagine controllate. Potrebbe comunque essere presente.",
    siteOwnerNote:
      "Gestite un sito verificato e ritenete errato un risultato? I nostri contatti si trovano nelle",
    siteOwnerLinkLabel: "note legali",
    scanAgain: "Nuova verifica",
    surveyPrompt:
      "Partecipi al sondaggio svizzero sull'IA (circa {minutes} minuti).",
    surveyPromptCta: "Vai al sondaggio",
  },
  benchmark: {
    metaTitle: "Benchmark",
    metaDescription:
      "Risultati anonimi del sondaggio sull'uso dell'IA nelle aziende svizzere. I valori basati su meno di cinque risposte non vengono mostrati.",
    indexTitle: "Benchmark: l'IA nelle aziende svizzere",
    indexLead:
      "Risultati anonimi del sondaggio. Vengono mostrati solo i valori basati su almeno cinque risposte; i gruppi più piccoli restano nascosti per proteggere i partecipanti.",
    backHome: "← Torna alla home",
    sampleSize: "Risposte totali: {n}",
    generatedAt: "Aggregato al: {date}",
    emptyTitle: "Ancora non abbastanza risposte",
    emptyLead:
      "Il benchmark compare non appena sono disponibili abbastanza risposte (almeno cinque per valore mostrato). Partecipare al sondaggio aiuta.",
    suppressionNote:
      "Protezione dei dati: le opzioni di risposta e le fasce dimensionali con meno di cinque risposte non vengono mostrate.",
    questionSample: "n = {n}",
    comparisonHeading: "La vostra dimensione rispetto alla mediana",
    comparisonLead:
      "Selezionate la dimensione aziendale. Se ci sono abbastanza risposte, vedete la mediana della spesa mensile per l'IA in quella fascia.",
    comparisonSelectLabel: "Dimensione aziendale",
    comparisonSelectPlaceholder: "Scegliere una fascia …",
    comparisonMedianLabel: "Mediana spesa IA (CHF/mese) nella vostra fascia",
    comparisonInsufficient:
      "Ancora non abbastanza risposte per questo gruppo dimensionale (n < 5).",
    comparisonNoMedian:
      "Nessuna mediana pubblicata è ancora disponibile per questo gruppo.",
    surveyCta: "Vai al sondaggio",
    disclaimer:
      "Il benchmark è un'analisi pilota. Descrive solo le aziende che hanno partecipato al sondaggio e non è rappresentativo dell'economia svizzera.",
  },
  survey: {
    metaTitle: "Sondaggio",
    metaDescription:
      "Breve sondaggio su utilizzo dell'IA, spesa e requisiti di hosting nelle aziende svizzere.",
    backHome: "← Torna alla home",
    estimatedTime: "Durata stimata: circa {minutes} minuti",
    progress: "Domanda {answered} di {total}",
    submit: "Invia",
    submitting: "Invio in corso …",
    success:
      "Grazie. Le risposte sono state registrate e alimenteranno il benchmark anonimo.",
    successOptIn:
      "Se avete indicato un'e-mail, vi avviseremo quando il rapporto sarà disponibile.",
    emailLabel: "E-mail (facoltativa)",
    emailPlaceholder: "nome@azienda.ch",
    reportOptInLabel:
      "Sì, inviatemi il rapporto di benchmark via e-mail quando sarà pronto.",
    honeypotLabel: "Sito web",
    turnstileLabel: "Verifica di sicurezza",
    requiredHint: "Obbligatoria",
    disclaimer:
      "Le risposte vengono analizzate solo per il benchmark anonimo. Senza indirizzo e-mail la sua partecipazione resta anonima. Se indica un indirizzo e-mail, lo conserviamo separatamente dalle risposte e lo usiamo solo per informarla sul rapporto.",
    privacyLinkLabel: "Informativa sulla privacy",
    privacyNearEmail:
      "Ulteriori informazioni sull'e-mail facoltativa e sul trattamento dei dati:",
    unavailable:
      "L'invio del sondaggio non è configurato al momento. Riprovare più tardi.",
    errorValidation:
      "Controllare le risposte. Tutte le domande obbligatorie devono essere compilate.",
    errorTurnstile:
      "La verifica di sicurezza non è riuscita. Riprovare.",
    errorRateLimit:
      "Troppe richieste. Attendere un minuto e riprovare.",
    errorNetwork:
      "Impossibile raggiungere il server. Controllare la connessione e riprovare.",
    errorServer: "Si è verificato un errore durante il salvataggio. Riprovare.",
  },
  content: {
    lastVerified: "Ultima verifica",
    readingTime: "Tempo di lettura circa {minutes} min.",
    sources: "Fonti",
    disclaimer:
      "Questa pagina ha solo scopo informativo e non costituisce consulenza legale. Per progetti concreti, consultare professionisti qualificati.",
    backHome: "← Torna alla home",
    breadcrumbLabel: "Percorso di navigazione",
    breadcrumbHome: "Inizio",
    tocLabel: "Indice",
    tocNavLabel: "Indice dei contenuti",
    relatedTools: "Strumento decisionale correlato",
    counselBadge: "Revisionato da un legale · {date}",
    translationDraft:
      "Questa traduzione è stata generata automaticamente e non è ancora stata rivista da una persona.",
    translationCanonicalNote:
      "Fa fede la versione tedesca; questa traduzione può discostarsene.",
  },
  guides: {
    indexTitle: "Guide",
    indexLead:
      "Guide su protezione dei dati, AI Act UE, FINMA, acquisti e sicurezza dell'IA, ciascuna con le relative fonti. Non costituiscono consulenza legale.",
    backHome: "← Torna alla home",
  },
  tools: {
    indexTitle: "Strumenti decisionali",
    indexLead:
      "Risponda ad alcune domande e ottenga una prima valutazione con fonti. Non costituisce consulenza legale.",
    backHome: "← Torna alla home",
    backToIndex: "← Tutti gli strumenti",
    back: "Indietro",
    restart: "Ricomincia",
    progress: "Domanda {n} · max. {m}",
    maxQuestions: "max. {count} domande",
    caveats: "Avvertenze",
    sources: "Fonti",
    relatedPages: "Pagine correlate",
    answerRecap: "Le vostre risposte",
    copyLink: "Copia link",
    copyLinkDone: "Copiato",
    print: "Stampa / come PDF",
    surveyPrompt:
      "Partecipate al sondaggio svizzero sull'IA (circa {minutes} minuti).",
    surveyCta: "Vai al sondaggio",
    disclaimer:
      "Questo strumento ha solo scopo informativo e non costituisce consulenza legale. Il risultato è un aiuto all'orientamento; verificate le fonti e consultate professionisti qualificati se necessario.",
    verdictLikely: "Piuttosto sostenibile",
    verdictUnlikely: "Piuttosto non sostenibile",
    verdictUnclear: "Poco chiaro",
    verdictDepends: "Dipende",
  },
  vendors: {
    indexTitle: "Confronto fornitori",
    indexLead:
      "Fornitori di IA a confronto: hosting, contratto con il responsabile del trattamento (DPA), certificazioni e altri criteri. Le informazioni senza fonte sono indicate come non verificate.",
    backHome: "← Torna alla home",
    disclaimer:
      "Questa panoramica ha solo scopo informativo e non costituisce consulenza legale né una raccomandazione. Verificate le fonti e consultate professionisti qualificati se necessario.",
    filtersLegend: "Filtri",
    filterSwissHosting: "Hosting svizzero",
    filterEuHosting: "Hosting UE",
    filterDpaAvailable: "DPA disponibile",
    filterTrainingOptOut: "Opt-out training",
    filterCertifications: "Certificazioni",
    clearFilters: "Reimposta filtri",
    resultCount: "{shown} di {total} fornitori",
    emptyFiltered: "Nessun fornitore corrisponde ai filtri selezionati.",
    colName: "Fornitore",
    colHostingRegions: "Regioni di hosting",
    colSwissHosting: "Hosting CH",
    colEuHosting: "Hosting UE",
    colDpa: "DPA",
    colTrainingOptOut: "Opt-out training",
    colCertifications: "Certificazioni",
    colPricingTier: "Prezzi",
    colSwissEntity: "Entità CH",
    colEuEntity: "Entità UE",
    colLastChecked: "Ultima verifica",
    unverified: "non verificato",
    yes: "Sì",
    no: "No",
    sourceLink: "Fonte",
    dpaLink: "Apri DPA",
    certIso27001: "ISO 27001",
    certSoc2: "SOC 2",
    certFinmaRelevant: "FINMA (autodichiarazione)",
    certOther: "Altro",
    pricingFree: "Gratuito",
    pricingUsage: "A consumo",
    pricingSubscription: "Abbonamento",
    pricingEnterprise: "Enterprise",
    pricingContact: "Su richiesta",
  },
  readiness: {
    cardMeta: "{count} domande, circa 6 minuti",
    benchmarkTitle: "Come si posizionano le altre aziende",
    benchmarkSource: "Da {n} risposte al sondaggio svizzero sull'IA. Partecipate per rendere il confronto più preciso.",
    draftNotice: "Anteprima: questo check è ancora in fase di completamento e traduzione.",
    profileTitle: "Sulla vostra azienda",
    progress: "{answered} di {total} domande con risposta",
    showResult: "Mostra il risultato",
    incomplete: "Rispondete a tutte le domande. Mancanti: {n}.",
    resultTitle: "Il vostro risultato",
    scoreLabel: "Punteggio",
    levelLabel: "Livello",
    dimensionsTitle: "Per ambito",
    notApplicable: "non applicabile",
    nextStepsTitle: "I vostri prossimi passi più importanti",
    showAllSteps: "Mostra tutti i prossimi passi ({n})",
    showFewerSteps: "Mostra meno",
    noSteps: "Nessuna lacuna riscontrata. Mantenete aggiornate le vostre misure.",
    readMore: "Per saperne di più:",
    securityLevelLabel: "Livello di rischio",
    securityStepsTitle: "Prossimi passi per la sicurezza dell'IA",
    editAnswers: "Modifica le risposte",
    restart: "Ricomincia",
    print: "Stampa o salva come PDF",
    companyNameLabel: "Nome dell'azienda (solo per la stampa, non salvato)",
    answersTitle: "Le vostre risposte",
    printFooter: "Autovalutazione su aicompliant.ch, versione del questionario {version}, {date}. Basata sulle indicazioni dell'azienda; non è una certificazione.",
    downloadPolicyTemplate: "Modello di direttiva IA (Word)",
    toolLinkSuffix: "(strumento decisionale)",
  },
  rootRedirect: {
    message: "Reindirizzamento alla homepage tedesca …",
    link: "Vai alla homepage (DE)",
  },
  notFound: {
    title: "Pagina non trovata",
    message:
      "La pagina richiesta non esiste o è stata spostata.",
    homeLink: "Vai alla homepage",
  },
};
