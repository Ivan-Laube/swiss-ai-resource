import type { Messages } from "../types";

export const fr: Messages = {
  meta: {
    title: "aicompliant.ch",
    description:
      "Informations pratiques pour les entreprises suisses sur l'utilisation de l'IA : protection des données, AI Act de l'UE, FINMA, comparatif des fournisseurs et aides à la décision.",
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
    eyebrow: "Pour les PME suisses",
    title: "Utiliser l'IA dans l'entreprise : ce qui s'applique en Suisse.",
    lead:
      "Guides sur la protection des données, l'AI Act de l'UE, la FINMA et la sécurité de l'IA, ainsi que des aides à la décision, un comparatif des fournisseurs et un contrôle de site. Indépendant, sans suivi et avec des sources dont les modifications sont vérifiées automatiquement chaque mois.",
    note:
      "La version allemande fait foi. Les traductions anglaise, française et italienne sont des brouillons générés automatiquement et n'ont pas encore été relues.",
    ctaTools: "Lancer une aide à la décision",
    ctaVendors: "Comparer les fournisseurs",
    quickCheckTitle: "Quick-Check site web",
    quickCheckLead:
      "Vérifie les éléments visibles publiquement sur votre site : déclaration de protection des données, mentions légales, outils de cookies, traceurs et en-têtes de sécurité. Pas une évaluation juridique.",
    quickCheckUrlLabel: "URL du site",
    quickCheckSubmit: "Vérifier le site",
    quickCheckPrivacy:
      "L'URL est transmise à notre scanner uniquement pour ce contrôle et n'est pas conservée durablement.",
    quickCheckChecksHeading: "Ce qui est vérifié",
    statsHeading: "En un coup d'œil",
    statsGuides: "Guides",
    statsTools: "Aides à la décision",
    statsVendors: "Fournisseurs",
    statsLastSource: "Dernière vérification des sources",
    guidesHeading: "Guides",
    guidesLead:
      "Bases sur la protection des données, l'AI Act de l'UE, la FINMA, les achats et la sécurité de l'IA, chacune avec ses sources.",
    guidesAction: "Tous les guides",
    categoryDatenschutz: "Protection des données",
    categoryEuAiAct: "AI Act de l'UE",
    categoryFinanzmarkt: "Marchés financiers",
    categoryBeschaffung: "Achats",
    categorySicherheit: "Sécurité",
    readingTime: "{n} min de lecture",
    toolsHeading: "Aides à la décision",
    toolsLead:
      "Quelques questions, une première évaluation avec sources. Ne remplace pas un examen au cas par cas.",
    toolsMaxQuestions: "max. {n} questions",
    toolsAction: "Toutes les aides",
    vendorsHeading: "Comparatif des fournisseurs",
    vendorsLead:
      "Hébergement, contrats de sous-traitance (DPA) et certifications comparés. Chaque information a une source, sinon elle est marquée comme non vérifiée.",
    vendorsListed: "{n} fournisseurs listés",
    vendorsSwissHosting: "{n} avec hébergement suisse sourcé",
    vendorsDpa: "{n} avec DPA sourcée",
    vendorsUnverifiedNote:
      "Les informations sans source sont considérées comme non vérifiées. Le comparatif ne contient ni recommandations ni notes.",
    vendorsAction: "Ouvrir le comparatif",
    surveyHeading: "Enquête & benchmark",
    surveyLead:
      "Courte enquête sur l'utilisation de l'IA dans les entreprises suisses. Les résultats alimentent le benchmark sous forme anonymisée.",
    surveyCta: "Participer à l'enquête",
    benchmarkLink: "Voir le benchmark",
    benchmarkPending: "Résultats dès {n} réponses",
    methodologyHeading: "Méthode",
    methodologySourcesTitle: "Sources officielles",
    methodologySourcesBody:
      "Les guides et aides à la décision s'appuient avant tout sur des textes légaux et des publications des autorités (p. ex. PFPDT, FINMA, OFCS). Chaque page indique ses sources avec un lien.",
    methodologyChecksTitle: "Vérification mensuelle des sources",
    methodologyChecksBody:
      "Un processus automatisé consulte les sources chaque mois et signale les modifications. Si une source change sur le fond, la page concernée est vérifiée et mise à jour.",
    methodologyIndependenceTitle: "Indépendant",
    methodologyIndependenceBody:
      "Pas de liens d'affiliation ou sponsorisés et pas de suivi sur le site.",
  },
  websiteCheck: {
    metaTitle: "Quick-Check site web",
    metaDescription:
      "Première évaluation d'un site : HTTPS, lien vers la déclaration de protection des données, mentions légales, outils de cookies, traceurs et en-têtes de sécurité, avec les références légales. Pas un conseil juridique.",
    title: "Quick-Check site web",
    lead:
      "Saisissez une URL. Le scan vérifie les éléments visibles publiquement et indique pour chaque point « trouvé », « non trouvé » ou « indéterminé ». Il n'évalue pas la conformité du site au droit.",
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
      "La page semble se charger de manière dynamique (p. ex. via un gestionnaire de balises ou en tant qu'application monopage). Un scan statique peut alors manquer certains scripts et bannières ; les résultats peuvent être incomplets.",
    disclaimer:
      "Ce Quick-Check est une première évaluation fondée sur des éléments visibles publiquement et ne constitue ni un conseil juridique ni un audit de conformité. Vérifiez les sources et consultez des professionnels si nécessaire.",
    notFoundNote:
      "« Non trouvé » signifie seulement que le scan n'a pas détecté l'élément sur les pages examinées. Il peut tout de même être présent.",
    siteOwnerNote:
      "Vous exploitez un site analysé et pensez qu’un résultat est erroné ? Nos coordonnées figurent dans les",
    siteOwnerLinkLabel: "mentions légales",
    scanAgain: "Nouvelle analyse",
    surveyPrompt:
      "Participez à l'enquête suisse sur l'IA (environ {minutes} minutes).",
    surveyPromptCta: "Aller à l'enquête",
  },
  benchmark: {
    metaTitle: "Benchmark",
    metaDescription:
      "Résultats anonymisés de l'enquête sur l'utilisation de l'IA dans les entreprises suisses. Les valeurs fondées sur moins de cinq réponses ne sont pas affichées.",
    indexTitle: "Benchmark : l'IA dans les entreprises suisses",
    indexLead:
      "Résultats anonymisés de l'enquête. Seules les valeurs fondées sur au moins cinq réponses sont affichées ; les groupes plus petits restent masqués pour protéger les participants.",
    backHome: "← Retour à l'accueil",
    sampleSize: "Réponses au total : {n}",
    generatedAt: "Agrégat au : {date}",
    emptyTitle: "Pas encore assez de réponses",
    emptyLead:
      "Le benchmark apparaît dès que suffisamment de réponses sont disponibles (au moins cinq par valeur affichée). Votre participation à l'enquête y contribue.",
    suppressionNote:
      "Protection des données : les options de réponse et les groupes de taille avec moins de cinq réponses ne sont pas affichés.",
    questionSample: "n = {n}",
    comparisonHeading: "Votre taille par rapport à la médiane",
    comparisonLead:
      "Sélectionnez la taille de votre entreprise. S'il y a suffisamment de réponses, vous voyez la médiane des dépenses mensuelles en IA pour cette catégorie de taille.",
    comparisonSelectLabel: "Taille de l'entreprise",
    comparisonSelectPlaceholder: "Choisir une fourchette …",
    comparisonMedianLabel: "Médiane des dépenses IA (CHF/mois) dans votre fourchette",
    comparisonInsufficient:
      "Pas encore assez de réponses pour ce groupe de taille (n < 5).",
    comparisonNoMedian:
      "Aucune médiane publiée n'est encore disponible pour ce groupe.",
    surveyCta: "Aller à l'enquête",
    disclaimer:
      "Le benchmark est une évaluation pilote. Il ne décrit que les entreprises ayant participé à l'enquête et n'est pas représentatif de l'économie suisse.",
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
      "Les réponses sont analysées uniquement pour le benchmark anonymisé. Sans adresse e-mail, votre participation reste anonyme. Si vous indiquez une adresse e-mail, nous la conservons séparément des réponses et l'utilisons uniquement pour vous informer du rapport.",
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
      "Cette traduction a été générée automatiquement et n'a pas encore été relue par une personne.",
    translationCanonicalNote:
      "La version allemande fait foi ; cette traduction peut s'en écarter.",
  },
  guides: {
    indexTitle: "Guides",
    indexLead:
      "Guides sur la protection des données, l'AI Act de l'UE, la FINMA, les achats et la sécurité de l'IA, chacun avec ses sources. Pas un conseil juridique.",
    backHome: "← Retour à l'accueil",
  },
  tools: {
    indexTitle: "Outils d'aide à la décision",
    indexLead:
      "Répondez à quelques questions et obtenez une première évaluation avec sources. Pas un conseil juridique.",
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
      "Participez à l'enquête suisse sur l'IA (environ {minutes} minutes).",
    surveyCta: "Aller au sondage",
    disclaimer:
      "Cet outil est fourni à titre informatif et ne constitue pas un conseil juridique. Le résultat est une aide à l'orientation ; consultez les sources et des professionnels qualifiés si nécessaire.",
    verdictLikely: "Plutôt envisageable",
    verdictUnlikely: "Plutôt peu envisageable",
    verdictUnclear: "Peu clair",
    verdictDepends: "Cela dépend",
  },
  vendors: {
    indexTitle: "Comparatif des fournisseurs",
    indexLead:
      "Fournisseurs d'IA comparés : hébergement, contrat de sous-traitance (DPA), certifications et autres critères. Les informations sans source sont marquées comme non vérifiées.",
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
    certFinmaRelevant: "FINMA (auto-déclaration)",
    certOther: "Autre",
    pricingFree: "Gratuit",
    pricingUsage: "À l'usage",
    pricingSubscription: "Abonnement",
    pricingEnterprise: "Entreprise",
    pricingContact: "Sur demande",
  },
  readiness: {
    cardMeta: "{count} questions, environ 6 minutes",
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
