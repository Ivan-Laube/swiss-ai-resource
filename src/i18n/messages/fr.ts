import type { Messages } from "../types";

export const fr: Messages = {
  meta: {
    title: "Swiss AI Deployment Resource",
    description:
      "Informations pratiques sur le déploiement de l'IA en Suisse : conformité, comparatif des fournisseurs et outils d'aide à la décision.",
  },
  nav: {
    brand: "Swiss AI Resource",
    languagesLabel: "Langues",
  },
  footer: {
    navLabel: "Mentions légales",
    impressum: "Mentions légales",
    privacy: "Politique de confidentialité",
  },
  home: {
    eyebrow: "PME suisses · adoption de l'IA",
    title: "Swiss AI Deployment Resource",
    lead:
      "Informations pratiques sur le déploiement de l'IA en Suisse : conformité, comparatif des fournisseurs et outils d'aide à la décision.",
    note:
      "L'allemand est la langue de référence de ce projet. Les traductions EN, FR et IT sont des brouillons jusqu'à relecture.",
    complianceHeading: "Bases de conformité",
    toolsHeading: "Outils d'aide à la décision",
    vendorsHeading: "Comparatif des fournisseurs",
    surveyHeading: "Enquête",
    surveyLead:
      "Courte enquête sur l'adoption de l'IA dans les entreprises suisses. Les résultats anonymisés alimentent le rapport de référence.",
    benchmarkLink: "Voir le benchmark",
    websiteCheckHeading: "Quick-Check site web",
    websiteCheckLead:
      "Première estimation d'un site à partir de signaux publics (HTTPS, lien vie privée, trackers). Pas un audit de conformité.",
  },
  websiteCheck: {
    metaTitle: "Quick-Check site web · Swiss AI Resource",
    metaDescription:
      "Première estimation d'un site : HTTPS, lien vie privée, mentions légales, outils cookies, trackers et en-têtes de sécurité — avec références légales. Pas un conseil juridique.",
    title: "Quick-Check site web",
    lead:
      "Saisissez une URL. Le scan vérifie des signaux publics et renvoie des faits avec le statut trouvé / non trouvé / indéterminé — pas un verdict de conformité.",
    backHome: "← Retour à l'accueil",
    urlLabel: "URL du site",
    urlPlaceholder: "https://exemple.ch",
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
    scanAgain: "Analyser une autre URL",
  },
  benchmark: {
    metaTitle: "Benchmark · Swiss AI Resource",
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
    metaTitle: "Enquête · Swiss AI Resource",
    metaDescription:
      "Courte enquête sur l'utilisation de l'IA, les dépenses et les exigences d'hébergement dans les entreprises suisses.",
    backHome: "← Retour à l'accueil",
    estimatedTime: "Durée estimée : environ {minutes} minutes",
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
    sources: "Sources",
    disclaimer:
      "Cette page est fournie à titre informatif et ne constitue pas un conseil juridique. Pour un projet concret, consultez des professionnels qualifiés.",
    backHome: "← Retour à l'accueil",
    translationDraft:
      "Cette traduction est un brouillon généré par LLM et n'a pas encore été relue par un humain.",
    translationCanonicalNote:
      "La version allemande fait foi ; les traductions peuvent différer.",
  },
  tools: {
    indexTitle: "Outils d'aide à la décision",
    indexLead:
      "Arbres de décision interactifs basés sur des règles structurées. Pas un conseil juridique.",
    backHome: "← Retour à l'accueil",
    backToIndex: "← Tous les outils",
    back: "Retour",
    restart: "Recommencer",
    caveats: "Mises en garde",
    sources: "Sources",
    relatedPages: "Pages associées",
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
  rootRedirect: {
    message: "Redirection vers la page d'accueil allemande …",
    link: "Vers la page d'accueil (DE)",
  },
};
