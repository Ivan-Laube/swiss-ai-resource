import type { Messages } from "../types";

export const it: Messages = {
  meta: {
    title: "aicompliant.ch",
    description:
      "Informazioni pratiche sul deployment dell'IA in Svizzera: conformità, confronto fornitori e strumenti decisionali interattivi.",
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
    eyebrow: "PMI svizzere · uso dell'IA",
    title: "Usare l'IA in Svizzera — su basi documentate.",
    lead:
      "Guide su LPD, AI Act UE e FINMA, strumenti decisionali, confronto fornitori basato su fonti e controllo del sito. Indipendente, senza tracking, verificato mensilmente rispetto alle fonti.",
    note:
      "Il tedesco è la lingua di riferimento di questo progetto. Le traduzioni EN, FR e IT sono bozze fino a revisione.",
    ctaTools: "Avvia uno strumento decisionale",
    ctaVendors: "Confronta i fornitori",
    quickCheckTitle: "Quick-Check sito web",
    quickCheckLead:
      "Controlla segnali pubblici del vostro sito — informativa privacy, impressum, strumenti cookie, tracker, header di sicurezza. Non è una valutazione di conformità.",
    quickCheckUrlLabel: "URL del sito",
    quickCheckSubmit: "Controlla il sito",
    quickCheckPrivacy:
      "L'URL viene inviato una sola volta al nostro scanner e non viene memorizzato in modo permanente.",
    quickCheckChecksHeading: "Cosa viene controllato",
    statsHeading: "In sintesi",
    statsGuides: "Guide",
    statsTools: "Strumenti decisionali",
    statsVendors: "Fornitori",
    statsLastSource: "Ultima verifica delle fonti",
    guidesHeading: "Guide",
    guidesLead:
      "Basi documentate su protezione dei dati, AI Act UE, FINMA e approvvigionamento.",
    guidesAction: "Tutte le guide",
    categoryDatenschutz: "Protezione dei dati",
    categoryEuAiAct: "AI Act UE",
    categoryFinanzmarkt: "Mercati finanziari",
    categoryBeschaffung: "Approvvigionamento",
    categorySicherheit: "Sicurezza",
    readingTime: "{n} min di lettura",
    toolsHeading: "Strumenti decisionali",
    toolsLead:
      "Alberi interattivi con fonti citate. Nessun semaforo di conformità.",
    toolsMaxQuestions: "max. {n} domande",
    toolsAction: "Tutti gli strumenti",
    vendorsHeading: "Confronto fornitori",
    vendorsLead:
      "Fatti su hosting, DPA e certificazioni — solo con fonte, altrimenti non verificato.",
    vendorsListed: "{n} fornitori elencati",
    vendorsSwissHosting: "{n} con hosting svizzero documentato",
    vendorsDpa: "{n} con DPA documentata",
    vendorsUnverifiedNote:
      "Le celle senza fonte contano come non verificate. Nessuna raccomandazione o punteggio.",
    vendorsAction: "Apri il confronto",
    surveyHeading: "Sondaggio & benchmark",
    surveyLead:
      "Breve sondaggio sull'adozione dell'IA nelle aziende svizzere. I risultati anonimi alimentano il benchmark.",
    surveyCta: "Compila il sondaggio",
    benchmarkLink: "Vai al benchmark",
    benchmarkPending: "Risultati da n ≥ {n}",
    methodologyHeading: "Metodo",
    methodologySourcesTitle: "Fonti ufficiali",
    methodologySourcesBody:
      "Guide e strumenti si basano su fonti normative e legali primarie — con URL indicato.",
    methodologyChecksTitle: "Verifica mensile delle fonti",
    methodologyChecksBody:
      "Un job automatico controlla ogni mese le fonti registrate e aggiorna le date di verifica nel repository.",
    methodologyIndependenceTitle: "Indipendente",
    methodologyIndependenceBody:
      "Nessun link di affiliazione o sponsor, nessun tracking sul sito e nessuna consulenza legale.",
  },
  websiteCheck: {
    metaTitle: "Quick-Check sito web",
    metaDescription:
      "Prima stima di un sito: HTTPS, link privacy, impressum, strumenti cookie, tracker e header di sicurezza — con citazioni legali. Non è consulenza legale.",
    title: "Quick-Check sito web",
    lead:
      "Inserisca un URL. La scansione verifica segnali pubblici e restituisce fatti con stato trovato / non trovato / indeterminato — non un verdetto di conformità.",
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
      "La pagina sembra dinamica (es. GTM o shell SPA). Una scansione statica può non vedere script e banner iniettati — i risultati possono essere incompleti.",
    disclaimer:
      "Questo Quick-Check è una prima stima da segnali pubblici e non costituisce consulenza legale né un audit di conformità. Verifichi le fonti e consulti professionisti se necessario.",
    notFoundNote:
      "«Non trovato» significa che la scansione non ha rilevato il segnale sulle pagine controllate — non che manchi sul sito.",
    siteOwnerNote:
      "Gestite un sito verificato e ritenete errato un risultato? I nostri contatti si trovano nelle",
    siteOwnerLinkLabel: "note legali",
    scanAgain: "Nuova verifica",
    surveyPrompt:
      "Aiuti a costruire il benchmark svizzero — circa {minutes} minuti.",
    surveyPromptCta: "Vai al sondaggio",
  },
  benchmark: {
    metaTitle: "Benchmark",
    metaDescription:
      "Risultati aggregati anonimi del sondaggio sull'adozione dell'IA in Svizzera. Le celle con meno di cinque risposte non vengono mostrate.",
    indexTitle: "Benchmark di adozione dell'IA",
    indexLead:
      "Risultati anonimi del sondaggio. Solo le celle pubblicate (n ≥ 5) sono mostrate — i gruppi piccoli restano soppressi.",
    backHome: "← Torna alla home",
    sampleSize: "Risposte totali: {n}",
    generatedAt: "Aggregato al: {date}",
    emptyTitle: "Ancora non abbastanza risposte",
    emptyLead:
      "Il benchmark compare quando ci sono abbastanza risposte anonime (almeno cinque per cella pubblicata). Partecipate al sondaggio per contribuire.",
    suppressionNote:
      "Privacy: opzioni e fasce dimensionali con meno di cinque risposte non vengono mostrate.",
    questionSample: "n = {n}",
    comparisonHeading: "La vostra dimensione rispetto alla mediana",
    comparisonLead:
      "Selezionate la dimensione aziendale. Mostriamo la mediana pubblicata della spesa mensile per l'IA in quella fascia — quando ci sono abbastanza risposte.",
    comparisonSelectLabel: "Dimensione aziendale",
    comparisonSelectPlaceholder: "Scegliere una fascia …",
    comparisonMedianLabel: "Mediana spesa IA (CHF/mese) nella vostra fascia",
    comparisonInsufficient:
      "Ancora non abbastanza risposte per questo gruppo dimensionale (n < 5).",
    comparisonNoMedian:
      "Nessuna mediana pubblicata è ancora disponibile per questo gruppo.",
    surveyCta: "Vai al sondaggio",
    disclaimer:
      "Questo benchmark è uno snapshot pilota anonimo e non costituisce consulenza legale. I risultati descrivono il campione, non l'intera economia svizzera.",
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
      "Il sondaggio serve a un benchmark anonimo. Le risposte senza e-mail sono completamente anonime. Gli indirizzi e-mail sono memorizzati separatamente dalle risposte e usati solo per la notifica del rapporto. Non costituisce consulenza legale.",
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
      "Questa traduzione è una bozza generata da LLM e non è ancora stata revisionata da una persona.",
    translationCanonicalNote:
      "Fa fede la versione tedesca; le traduzioni possono differire.",
  },
  guides: {
    indexTitle: "Guide",
    indexLead:
      "Guide basate su fonti su protezione dei dati, EU AI Act, FINMA e appalti. Non costituiscono consulenza legale.",
    backHome: "← Torna alla home",
  },
  tools: {
    indexTitle: "Strumenti decisionali",
    indexLead:
      "Alberi decisionali interattivi basati su regole strutturate. Non costituiscono consulenza legale.",
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
      "Aiutate a costruire il benchmark svizzero — circa {minutes} minuti",
    surveyCta: "Vai al sondaggio",
    disclaimer:
      "Questo strumento ha solo scopo informativo e non costituisce consulenza legale. I risultati sono orientativi — verificate le fonti e consultate professionisti qualificati se necessario.",
    verdictLikely: "Piuttosto sostenibile",
    verdictUnlikely: "Piuttosto non sostenibile",
    verdictUnclear: "Poco chiaro",
    verdictDepends: "Dipende",
  },
  vendors: {
    indexTitle: "Confronto fornitori",
    indexLead:
      "Confronta i fornitori di IA per hosting, DPA, certificazioni e altri criteri. Le celle senza fonte verificabile sono indicate come non verificate.",
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
    certFinmaRelevant: "Rilevante FINMA",
    certOther: "Altro",
    pricingFree: "Gratuito",
    pricingUsage: "A consumo",
    pricingSubscription: "Abbonamento",
    pricingEnterprise: "Enterprise",
    pricingContact: "Su richiesta",
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
