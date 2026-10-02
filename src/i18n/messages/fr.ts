import type { Messages } from "../types";

export const fr: Messages = {
  meta: {
    title: "aicompliant.ch",
    description:
      "Informations pratiques sur le déploiement de l'IA en Suisse : conformité, comparatif des fournisseurs et outils d'aide à la décision.",
  },
  nav: {
    brand: "aicompliant.ch",
    brandSubtitle: "Swiss AI Resource",
    wordmark: "aicompliant",
    wordmarkTld: ".ch",
    languagesLabel: "Langues",
    mainLabel: "Navigation principale",
    skipToContent: "Aller au contenu",
    menu: "Menu",
    guides: "Guides",
    tools: "Aides à la décision",
    vendors: "Comparatif fournisseurs",
    survey: "Enquête & Benchmark",
    websiteCheck: "Vérifier un site",
  },
  footer: {
    navLabel: "Pied de page",
    brandDescription:
      "Guides, aides à la décision et comparatif des fournisseurs fondé sur des sources pour l'utilisation de l'IA en Suisse.",
    lastSourceCheck: "Dernière vérification des sources : {date}",
    colGuides: "Guides",
    colTools: "Outils",
    colData: "Données",
    colLegal: "Mentions légales",
    survey: "Enquête",
    benchmark: "Benchmark",
    disclaimer:
      "Ces contenus sont fournis à titre informatif uniquement et ne constituent pas un conseil juridique. Vérifiez les sources et consultez un spécialiste si nécessaire.",
    copyright: "© {year} aicompliant.ch",
    impressum: "Mentions légales",
    privacy: "Politique de confidentialité",
  },
  home: {
    eyebrow: "PME suisses · usage de l'IA",
    title: "Déployer l'IA en Suisse — sur des bases sourcées.",
    lead:
      "Guides sur la LPD, l'AI Act de l'UE et la FINMA, aides à la décision, comparatif d'offres sourcé et contrôle de site. Indépendant, sans suivi, vérifié chaque mois contre les sources.",
    note:
      "L'allemand est la langue de référence de ce projet. Les traductions EN, FR et IT sont des brouillons jusqu'à relecture.",
    ctaTools: "Lancer une aide à la décision",
    ctaVendors: "Comparer les fournisseurs",
    quickCheckTitle: "Quick-Check site web",
    quickCheckLead:
      "Vérifie des signaux publics de votre site — déclaration de confidentialité, mentions légales, outils cookies, trackers, en-têtes de sécurité. Pas une évaluation de conformité.",
    quickCheckUrlLabel: "URL du site",
    quickCheckSubmit: "Vérifier le site",
    quickCheckPrivacy:
      "L'URL est envoyée une seule fois à notre scanner et n'est pas conservée de façon durable.",
    quickCheckChecksHeading: "Ce qui est vérifié",
    statsHeading: "En un coup d'œil",
    statsGuides: "Guides",
    statsTools: "Aides à la décision",
    statsVendors: "Fournisseurs",
    statsLastSource: "Dernière vérification des sources",
    guidesHeading: "Guides",
    guidesLead:
      "Bases sourcées sur la protection des données, l'AI Act de l'UE, la FINMA et les achats.",
    guidesAction: "Tous les guides",
    categoryDatenschutz: "Protection des données",
    categoryEuAiAct: "AI Act de l'UE",
    categoryFinanzmarkt: "Marchés financiers",
    categoryBeschaffung: "Achats",
    categorySicherheit: "Sécurité",
    readingTime: "{n} min de lecture",
    toolsHeading: "Aides à la décision",
    toolsLead:
      "Arbres interactifs avec sources citées. Pas de feu de conformité.",
    toolsMaxQuestions: "max. {n} questions",
    toolsAction: "Toutes les aides",
    vendorsHeading: "Comparatif des fournisseurs",
    vendorsLead:
      "Faits sur l'hébergement, les DPA et les certifications — uniquement avec source, sinon non vérifié.",
    vendorsListed: "{n} fournisseurs listés",
    vendorsSwissHosting: "{n} avec hébergement suisse sourcé",
    vendorsDpa: "{n} avec DPA sourcée",
    vendorsUnverifiedNote:
      "Les cellules sans source sont non vérifiées. Pas de recommandations ni de notes.",
    vendorsAction: "Ouvrir le comparatif",
    surveyHeading: "Enquête & benchmark",
    surveyLead:
      "Courte enquête sur l'adoption de l'IA dans les entreprises suisses. Les résultats anonymisés alimentent le benchmark.",
    surveyCta: "Participer à l'enquête",
    benchmarkLink: "Voir le benchmark",
    benchmarkPending: "Résultats dès n ≥ {n}",
    methodologyHeading: "Méthode",
    methodologySourcesTitle: "Sources officielles",
    methodologySourcesBody:
      "Les guides et aides s'appuient sur des sources réglementaires et légales primaires — avec l'URL indiquée.",
    methodologyChecksTitle: "Vérification mensuelle des sources",
    methodologyChecksBody:
      "Un job automatisé contrôle chaque mois les sources enregistrées et met à jour les dates de vérification dans le dépôt.",
    methodologyIndependenceTitle: "Indépendant",
    methodologyIndependenceBody:
      "Pas de liens d'affiliation ou de sponsoring, pas de suivi sur le site, et pas de conseil juridique.",
  },
  websiteCheck: {
    metaTitle: "Quick-Check site web",
    metaDescription:
      "Première estimation d'un site : HTTPS, lien vie privée, mentions légales, outils cookies, trackers et en-têtes de sécurité — avec références légales. Pas un conseil juridique.",
    title: "Quick-Check site web",
    lead:
      "Saisissez une URL. Le scan vérifie des signaux publics et renvoie des faits avec le statut trouvé / non trouvé / indéterminé — pas un verdict de conformité.",
    backHome: "← Retour à l'accueil",
    urlLabel: "URL du site",
    urlPlaceholder: "exemple.ch",
    submit: "Analyser",
    scanning: "Analyse en cours …",
    unavailable:
      "Le Quick-Check n'est pas configuré pour le moment. Veuillez réessayer plus tard.",
    errorBadUrl: "Veuillez saisir une URL http ou https valide.",
    errorRateLimit:
      "Trop de requêtes. Veuillez patienter une minute et réessayer.",
    errorUpstream:
      "Impossible de charger la page cible (délai, redirections ou erreur serveur).",
    errorNetwork:
      "Impossible de joindre le scanner. Vérifiez votre connexion et réessayez.",
    errorServer:
      "Une erreur s'est produite pendant l'analyse. Veuillez réessayer.",
    turnstileLabel: "Vérification de sécurité",
    errorTurnstile:
      "La vérification de sécurité a échoué. Veuillez réessayer.",
    statusFound: "Trouvé",
    statusNotFound: "Non trouvé",
    statusIndeterminate: "Indéterminé",
    severityHigh: "Élevé",
    severityMedium: "Moyen",
    severityLow: "Faible",
    severityInfo: "Info",
    scannedUrl: "URL analysée",
    finalUrl: "URL finale",
    relatedPage: "Page associée",
    legalBasis: "Base légale",
    evidence: "Indices",
    staticScanCaveat:
      "La page semble dynamique (p. ex. GTM ou coquille SPA). Un scan statique peut manquer des scripts et bannières injectés — les résultats peuvent être incomplets.",
    disclaimer:
      "Ce Quick-Check est une première estimation à partir de signaux publics et ne constitue ni un conseil juridique ni un audit de conformité. Vérifiez les sources et consultez des professionnels si nécessaire.",
    notFoundNote:
      "« Non trouvé » signifie que l’analyse n’a pas détecté le signal sur les pages examinées — et non qu’il manque sur le site.",
    siteOwnerNote:
      "Vous exploitez un site analysé et pensez qu’un résultat est erroné ? Nos coordonnées figurent dans les",
    siteOwnerLinkLabel: "mentions légales",
    scanAgain: "Nouvelle analyse",
    surveyPrompt:
      "Aidez à constituer le benchmark suisse — environ {minutes} minutes.",
    surveyPromptCta: "Aller à l'enquête",
  },
  benchmark: {
    metaTitle: "Benchmark",
    metaDescription:
      "Résultats agrégés anonymisés de l'enquête d'adoption de l'IA en Suisse. Les cellules avec moins de cinq réponses ne sont pas affichées.",
    indexTitle: "Benchmark d'adoption de l'IA",
    indexLead:
      "Résultats anonymisés de l'enquête. Seules les cellules publiées (n ≥ 5) sont affichées — les petits groupes restent masqués.",
    backHome: "← Retour à l'accueil",
    sampleSize: "Réponses au total : {n}",
    generatedAt: "Agrégat au : {date}",
    emptyTitle: "Pas encore assez de réponses",
    emptyLead:
      "Le benchmark apparaît dès que suffisamment de réponses anonymisées sont disponibles (au moins cinq par cellule publiée). Participez à l'enquête pour contribuer.",
    suppressionNote:
      "Confidentialité : les options et groupes de taille avec moins de cinq réponses ne sont pas affichés.",
    questionSample: "n = {n}",
    comparisonHeading: "Votre taille par rapport à la médiane",
    comparisonLead:
      "Sélectionnez la taille de votre entreprise. Nous affichons la médiane publiée des dépenses mensuelles en IA pour cette fourchette — lorsqu'il y a assez de réponses.",
    comparisonSelectLabel: "Taille de l'entreprise",
    comparisonSelectPlaceholder: "Choisir une fourchette …",
    comparisonMedianLabel: "Médiane des dépenses IA (CHF/mois) dans votre fourchette",
    comparisonInsufficient:
      "Pas encore assez de réponses pour ce groupe de taille (n < 5).",
    comparisonNoMedian:
      "Aucune médiane publiée n'est encore disponible pour ce groupe.",
    surveyCta: "Aller à l'enquête",
    disclaimer:
      "Ce benchmark est un aperçu pilote anonymisé et ne constitue pas un conseil juridique. Les résultats décrivent l'échantillon, pas l'ensemble de l'économie suisse.",
  },
  survey: {
    metaTitle: "Enquête",
    metaDescription:
      "Courte enquête sur l'utilisation de l'IA, les dépenses et les exigences d'hébergement dans les entreprises suisses.",
    backHome: "← Retour à l'accueil",
    estimatedTime: "Durée estimée : environ {minutes} minutes",
    progress: "Question {answered} sur {total}",
    submit: "Envoyer",
    submitting: "Envoi en cours …",
    success:
      "Merci. Vos réponses ont été enregistrées et alimenteront le benchmark anonymisé.",
    successOptIn:
      "Si vous avez fourni une adresse e-mail, nous vous préviendrons lorsque le rapport sera disponible.",
    emailLabel: "E-mail (facultatif)",
    emailPlaceholder: "nom@entreprise.ch",
    reportOptInLabel:
      "Oui, envoyez-moi le rapport de benchmark par e-mail dès qu'il sera prêt.",
    honeypotLabel: "Site web",
    turnstileLabel: "Vérification de sécurité",
    requiredHint: "Obligatoire",
    disclaimer:
      "Cette enquête sert à un benchmark anonymisé. Les réponses sans e-mail sont entièrement anonymes. Les adresses e-mail sont stockées séparément des réponses et utilisées uniquement pour la notification du rapport. Pas un conseil juridique.",
    privacyLinkLabel: "Politique de confidentialité",
    privacyNearEmail:
      "Plus d'informations sur l'e-mail facultatif et le traitement des données :",
    unavailable:
      "La soumission de l'enquête n'est pas configurée pour le moment. Veuillez réessayer plus tard.",
    errorValidation:
      "Veuillez vérifier vos réponses. Toutes les questions obligatoires doivent être remplies.",
    errorTurnstile:
      "La vérification de sécurité a échoué. Veuillez réessayer.",
    errorRateLimit:
      "Trop de requêtes. Veuillez attendre une minute et réessayer.",
    errorNetwork:
      "Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.",
    errorServer: "Une erreur s'est produite lors de l'enregistrement. Veuillez réessayer.",
  },
  content: {
    lastVerified: "Dernière vérification",
    readingTime: "Temps de lecture env. {minutes} min.",
    sources: "Sources",
    disclaimer:
      "Cette page est fournie à titre informatif et ne constitue pas un conseil juridique. Pour un projet concret, consultez des professionnels qualifiés.",
    backHome: "← Retour à l'accueil",
    breadcrumbLabel: "Fil d'Ariane",
    breadcrumbHome: "Accueil",
    tocLabel: "Sommaire",
    tocNavLabel: "Table des matières",
    relatedTools: "Outil d'aide à la décision associé",
    counselBadge: "Revu par un conseil · {date}",
    translationDraft:
      "Cette traduction est un brouillon généré par LLM et n'a pas encore été relue par un humain.",
    translationCanonicalNote:
      "La version allemande fait foi ; les traductions peuvent différer.",
  },
  guides: {
    indexTitle: "Guides",
    indexLead:
      "Guides fondés sur des sources concernant la protection des données, l'AI Act de l'UE, la FINMA et les marchés publics. Pas un conseil juridique.",
    backHome: "← Retour à l'accueil",
  },
  tools: {
    indexTitle: "Outils d'aide à la décision",
    indexLead:
      "Arbres de décision interactifs basés sur des règles structurées. Pas un conseil juridique.",
    backHome: "← Retour à l'accueil",
    backToIndex: "← Tous les outils",
    back: "Retour",
    restart: "Recommencer",
    progress: "Question {n} · max. {m}",
    maxQuestions: "max. {count} questions",
    caveats: "Mises en garde",
    sources: "Sources",
    relatedPages: "Pages associées",
    answerRecap: "Vos réponses",
    copyLink: "Copier le lien",
    copyLinkDone: "Copié",
    print: "Imprimer / en PDF",
    surveyPrompt:
      "Aidez à construire le benchmark suisse — environ {minutes} minutes",
    surveyCta: "Aller au sondage",
    disclaimer:
      "Cet outil est fourni à titre informatif et ne constitue pas un conseil juridique. Les résultats sont des aides à l'orientation — consultez les sources et des professionnels qualifiés si nécessaire.",
    verdictLikely: "Plutôt envisageable",
    verdictUnlikely: "Plutôt peu envisageable",
    verdictUnclear: "Peu clair",
    verdictDepends: "Cela dépend",
  },
  vendors: {
    indexTitle: "Comparatif des fournisseurs",
    indexLead:
      "Comparez les fournisseurs d'IA selon l'hébergement, le DPA, les certifications et d'autres critères. Les cellules sans source vérifiable sont marquées comme non vérifiées.",
    backHome: "← Retour à l'accueil",
    disclaimer:
      "Ce comparatif est fourni à titre informatif et ne constitue ni un conseil juridique ni une recommandation. Consultez les sources et des professionnels qualifiés si nécessaire.",
    filtersLegend: "Filtres",
    filterSwissHosting: "Hébergement suisse",
    filterEuHosting: "Hébergement UE",
    filterDpaAvailable: "DPA disponible",
    filterTrainingOptOut: "Opt-out d'entraînement",
    filterCertifications: "Certifications",
    clearFilters: "Réinitialiser les filtres",
    resultCount: "{shown} sur {total} fournisseurs",
    emptyFiltered: "Aucun fournisseur ne correspond aux filtres sélectionnés.",
    colName: "Fournisseur",
    colHostingRegions: "Régions d'hébergement",
    colSwissHosting: "Hébergement CH",
    colEuHosting: "Hébergement UE",
    colDpa: "DPA",
    colTrainingOptOut: "Opt-out d'entraînement",
    colCertifications: "Certifications",
    colPricingTier: "Tarification",
    colSwissEntity: "Entité CH",
    colEuEntity: "Entité UE",
    colLastChecked: "Dernière vérification",
    unverified: "non vérifié",
    yes: "Oui",
    no: "Non",
    sourceLink: "Source",
    dpaLink: "Ouvrir le DPA",
    certIso27001: "ISO 27001",
    certSoc2: "SOC 2",
    certFinmaRelevant: "Pertinent FINMA",
    certOther: "Autre",
    pricingFree: "Gratuit",
    pricingUsage: "À l'usage",
    pricingSubscription: "Abonnement",
    pricingEnterprise: "Entreprise",
    pricingContact: "Sur demande",
  },
  readiness: {
    benchmarkTitle: "Comment se situent les autres entreprises",
    benchmarkSource: "D'après {n} réponses à l'enquête suisse sur l'IA. Participez pour rendre la comparaison plus précise.",
    draftNotice: "Aperçu : ce check est encore en cours de finalisation et de traduction.",
    profileTitle: "À propos de votre entreprise",
    progress: "{answered} sur {total} questions répondues",
    showResult: "Afficher le résultat",
    incomplete: "Veuillez répondre à toutes les questions. Restantes : {n}.",
    resultTitle: "Votre résultat",
    scoreLabel: "Score",
    levelLabel: "Niveau",
    dimensionsTitle: "Par domaine",
    notApplicable: "non applicable",
    nextStepsTitle: "Vos prochaines étapes les plus importantes",
    showAllSteps: "Afficher toutes les prochaines étapes ({n})",
    showFewerSteps: "Afficher moins",
    noSteps: "Aucune lacune constatée. Tenez vos mesures à jour.",
    readMore: "En savoir plus :",
    securityLevelLabel: "Niveau de risque",
    securityStepsTitle: "Prochaines étapes pour la sécurité de l'IA",
    editAnswers: "Modifier les réponses",
    restart: "Recommencer",
    print: "Imprimer ou enregistrer en PDF",
    companyNameLabel: "Nom de l'entreprise (uniquement pour l'impression, non enregistré)",
    answersTitle: "Vos réponses",
    printFooter: "Auto-évaluation sur aicompliant.ch, version du questionnaire {version}, {date}. Fondée sur les indications de l'entreprise ; pas une certification.",
    downloadPolicyTemplate: "Modèle de directive IA (Word)",
    toolLinkSuffix: "(outil d'aide à la décision)",
  },
  rootRedirect: {
    message: "Redirection vers la page d'accueil allemande …",
    link: "Vers la page d'accueil (DE)",
  },
  notFound: {
    title: "Page introuvable",
    message:
      "La page demandée n'existe pas ou a été déplacée.",
    homeLink: "Vers la page d'accueil",
  },
};
