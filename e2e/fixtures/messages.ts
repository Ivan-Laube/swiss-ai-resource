/** Locale message snippets used by e2e assertions (mirrors src/i18n/messages). */
export type Locale = "de" | "en" | "fr" | "it";

export const LOCALES: Locale[] = ["de", "en", "fr", "it"];

type WebsiteCheckCopy = {
  title: string;
  lead: string;
  urlLabel: string;
  submit: string;
  scanning: string;
  unavailable: string;
  errorBadUrl: string;
  errorRateLimit: string;
  errorUpstream: string;
  errorNetwork: string;
  errorServer: string;
  turnstileLabel: string;
  errorTurnstile: string;
  statusFound: string;
  statusNotFound: string;
  statusIndeterminate: string;
  severityHigh: string;
  severityMedium: string;
  severityLow: string;
  severityInfo: string;
  scannedUrl: string;
  finalUrl: string;
  relatedPage: string;
  legalBasis: string;
  evidence: string;
  staticScanCaveat: string;
  disclaimer: string;
  scanAgain: string;
  surveyPrompt: string;
  surveyPromptCta: string;
};

export const copy: Record<Locale, WebsiteCheckCopy> = {
  en: {
    title: "Website Quick-Check",
    lead: "Enter a URL. The scan checks publicly visible signals and returns facts with status found / not found / indeterminate — not a compliance verdict.",
    urlLabel: "Website URL",
    submit: "Scan",
    scanning: "Scanning …",
    unavailable:
      "Website check is not configured right now. Please try again later.",
    errorBadUrl: "Please enter a valid http or https URL.",
    errorRateLimit: "Too many requests. Please wait a minute and try again.",
    errorUpstream:
      "Could not load the target page (timeout, redirects, or server error).",
    errorNetwork:
      "Could not reach the scanner. Check your connection and try again.",
    errorServer: "Something went wrong during the scan. Please try again.",
    turnstileLabel: "Security check",
    errorTurnstile: "Security check failed. Please try again.",
    statusFound: "Found",
    statusNotFound: "Not found",
    statusIndeterminate: "Indeterminate",
    severityHigh: "High",
    severityMedium: "Medium",
    severityLow: "Low",
    severityInfo: "Info",
    scannedUrl: "Scanned URL",
    finalUrl: "Final URL",
    relatedPage: "Related page",
    legalBasis: "Legal basis",
    evidence: "Evidence",
    staticScanCaveat:
      "The page looks dynamic (e.g. GTM or an SPA shell). A static scan may miss injected scripts and banners — results may be incomplete.",
    disclaimer:
      "This Quick-Check is a first assessment from publicly visible signals and is not legal advice or a compliance audit. Check the sources and consult qualified professionals when needed.",
    scanAgain: "New check",
    surveyPrompt: "Help build the Swiss benchmark — about {minutes} minutes.",
    surveyPromptCta: "Go to survey",
  },
  de: {
    title: "Website Quick-Check",
    lead: "Geben Sie eine URL ein. Der Scan prüft öffentlich sichtbare Signale und liefert Fakten mit Status gefunden / nicht gefunden / unklar — keine Compliance-Bewertung.",
    urlLabel: "Website-URL",
    submit: "Scannen",
    scanning: "Scan läuft …",
    unavailable:
      "Der Website-Check ist derzeit nicht konfiguriert. Bitte versuchen Sie es später erneut.",
    errorBadUrl: "Bitte geben Sie eine gültige http- oder https-URL ein.",
    errorRateLimit:
      "Zu viele Anfragen. Bitte warten Sie eine Minute und versuchen Sie es erneut.",
    errorUpstream:
      "Die Zielseite konnte nicht geladen werden (Timeout, Weiterleitungen oder Serverfehler).",
    errorNetwork:
      "Die Verbindung zum Scanner ist fehlgeschlagen. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
    errorServer:
      "Beim Scan ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
    turnstileLabel: "Sicherheitsprüfung",
    errorTurnstile:
      "Sicherheitsprüfung fehlgeschlagen. Bitte versuchen Sie es erneut.",
    statusFound: "Gefunden",
    statusNotFound: "Nicht gefunden",
    statusIndeterminate: "Unklar",
    severityHigh: "Hoch",
    severityMedium: "Mittel",
    severityLow: "Niedrig",
    severityInfo: "Info",
    scannedUrl: "Gescannte URL",
    finalUrl: "Endgültige URL",
    relatedPage: "Weiterführende Seite",
    legalBasis: "Rechtsgrundlage",
    evidence: "Hinweise",
    staticScanCaveat:
      "Die Seite wirkt dynamisch (z. B. GTM oder SPA-Shell). Ein statischer Scan sieht möglicherweise nicht alle Skripte und Banner — die Ergebnisse können unvollständig sein.",
    disclaimer:
      "Dieser Quick-Check ist eine erste Einschätzung anhand öffentlich sichtbarer Signale und stellt keine Rechtsberatung oder Compliance-Prüfung dar. Prüfen Sie die Quellen und holen Sie bei Bedarf Fachberatung ein.",
    scanAgain: "Neue Prüfung",
    surveyPrompt:
      "Helfen Sie beim Schweizer Benchmark — ca. {minutes} Minuten.",
    surveyPromptCta: "Zur Umfrage",
  },
  fr: {
    title: "Quick-Check site web",
    lead: "Saisissez une URL. Le scan vérifie des signaux publics et renvoie des faits avec le statut trouvé / non trouvé / indéterminé — pas un verdict de conformité.",
    urlLabel: "URL du site",
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
    scanAgain: "Nouvelle analyse",
    surveyPrompt:
      "Aidez à constituer le benchmark suisse — environ {minutes} minutes.",
    surveyPromptCta: "Aller à l'enquête",
  },
  it: {
    title: "Quick-Check sito web",
    lead: "Inserisca un URL. La scansione verifica segnali pubblici e restituisce fatti con stato trovato / non trovato / indeterminato — non un verdetto di conformità.",
    urlLabel: "URL del sito",
    submit: "Scansiona",
    scanning: "Scansione in corso …",
    unavailable:
      "Il Quick-Check non è configurato al momento. Riprovi più tardi.",
    errorBadUrl: "Inserisca un URL http o https valido.",
    errorRateLimit: "Troppe richieste. Attenda un minuto e riprovi.",
    errorUpstream:
      "Impossibile caricare la pagina di destinazione (timeout, redirect o errore server).",
    errorNetwork:
      "Impossibile raggiungere lo scanner. Controlli la connessione e riprovi.",
    errorServer:
      "Si è verificato un errore durante la scansione. Riprovi.",
    turnstileLabel: "Verifica di sicurezza",
    errorTurnstile: "Verifica di sicurezza non riuscita. Riprovi.",
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
    scanAgain: "Nuova verifica",
    surveyPrompt:
      "Aiuti a costruire il benchmark svizzero — circa {minutes} minuti.",
    surveyPromptCta: "Vai al sondaggio",
  },
};

type SurveyCopy = {
  submit: string;
  submitting: string;
  success: string;
  successOptIn: string;
  emailLabel: string;
  reportOptInLabel: string;
  turnstileLabel: string;
  unavailable: string;
  errorValidation: string;
  errorTurnstile: string;
  errorRateLimit: string;
  errorNetwork: string;
  errorServer: string;
  requiredHint: string;
};

export const surveyCopy: Record<Locale, SurveyCopy> = {
  en: {
    submit: "Submit",
    submitting: "Submitting …",
    success:
      "Thank you. Your answers were recorded and will feed the anonymized benchmark.",
    successOptIn:
      "If you provided an email, we will notify you when the report is available.",
    emailLabel: "Email (optional)",
    reportOptInLabel:
      "Yes, email me the benchmark report when it is ready.",
    turnstileLabel: "Security check",
    unavailable:
      "Survey intake is not configured right now. Please try again later.",
    errorValidation:
      "Please check your answers. All required questions must be completed.",
    errorTurnstile: "Security check failed. Please try again.",
    errorRateLimit:
      "Too many requests. Please wait a minute and try again.",
    errorNetwork:
      "Could not reach the server. Check your connection and try again.",
    errorServer: "Something went wrong while saving. Please try again.",
    requiredHint: "Required",
  },
  de: {
    submit: "Absenden",
    submitting: "Wird gesendet …",
    success:
      "Vielen Dank. Ihre Antworten wurden erfasst und fliessen anonymisiert in den Benchmark ein.",
    successOptIn:
      "Wenn Sie eine E-Mail angegeben haben, benachrichtigen wir Sie, sobald der Bericht verfügbar ist.",
    emailLabel: "E-Mail (optional)",
    reportOptInLabel:
      "Ja, ich möchte den Benchmark-Bericht per E-Mail erhalten, sobald er vorliegt.",
    turnstileLabel: "Sicherheitsprüfung",
    unavailable:
      "Die Umfrage-Eingabe ist derzeit nicht konfiguriert. Bitte versuchen Sie es später erneut.",
    errorValidation:
      "Bitte prüfen Sie Ihre Antworten. Alle Pflichtfragen müssen ausgefüllt sein.",
    errorTurnstile:
      "Die Sicherheitsprüfung ist fehlgeschlagen. Bitte versuchen Sie es erneut.",
    errorRateLimit:
      "Zu viele Anfragen. Bitte warten Sie eine Minute und versuchen Sie es erneut.",
    errorNetwork:
      "Die Verbindung zum Server ist fehlgeschlagen. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
    errorServer:
      "Beim Speichern ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
    requiredHint: "Pflichtfrage",
  },
  fr: {
    submit: "Envoyer",
    submitting: "Envoi en cours …",
    success:
      "Merci. Vos réponses ont été enregistrées et alimenteront le benchmark anonymisé.",
    successOptIn:
      "Si vous avez fourni une adresse e-mail, nous vous préviendrons lorsque le rapport sera disponible.",
    emailLabel: "E-mail (facultatif)",
    reportOptInLabel:
      "Oui, envoyez-moi le rapport de benchmark par e-mail dès qu'il sera prêt.",
    turnstileLabel: "Vérification de sécurité",
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
    errorServer:
      "Une erreur s'est produite lors de l'enregistrement. Veuillez réessayer.",
    requiredHint: "Obligatoire",
  },
  it: {
    submit: "Invia",
    submitting: "Invio in corso …",
    success:
      "Grazie. Le risposte sono state registrate e alimenteranno il benchmark anonimo.",
    successOptIn:
      "Se avete indicato un'e-mail, vi avviseremo quando il rapporto sarà disponibile.",
    emailLabel: "E-mail (facoltativa)",
    reportOptInLabel:
      "Sì, inviatemi il rapporto di benchmark via e-mail quando sarà pronto.",
    turnstileLabel: "Verifica di sicurezza",
    unavailable:
      "L'invio del sondaggio non è configurato al momento. Riprovare più tardi.",
    errorValidation:
      "Controllare le risposte. Tutte le domande obbligatorie devono essere compilate.",
    errorTurnstile: "La verifica di sicurezza non è riuscita. Riprovare.",
    errorRateLimit: "Troppe richieste. Attendere un minuto e riprovare.",
    errorNetwork:
      "Impossibile raggiungere il server. Controllare la connessione e riprovare.",
    errorServer:
      "Si è verificato un errore durante il salvataggio. Riprovare.",
    requiredHint: "Obbligatoria",
  },
};

type BenchmarkCopy = {
  emptyTitle: string;
  surveyCta: string;
  comparisonSelectLabel: string;
  comparisonInsufficient: string;
  comparisonNoMedian: string;
  comparisonMedianLabel: string;
};

export const benchmarkCopy: Record<Locale, BenchmarkCopy> = {
  en: {
    emptyTitle: "Not enough responses yet",
    surveyCta: "Go to survey",
    comparisonSelectLabel: "Company size",
    comparisonInsufficient:
      "Not enough responses for this size group yet (n < 5).",
    comparisonNoMedian:
      "No published median is available for this group yet.",
    comparisonMedianLabel: "Median AI spend (CHF/month) in your band",
  },
  de: {
    emptyTitle: "Noch nicht genug Antworten",
    surveyCta: "Zur Umfrage",
    comparisonSelectLabel: "Unternehmensgrösse",
    comparisonInsufficient:
      "Für diese Grössengruppe liegen noch nicht genug Antworten vor (n < 5).",
    comparisonNoMedian:
      "Für diese Gruppe gibt es noch keinen veröffentlichten Median.",
    comparisonMedianLabel: "Median KI-Ausgaben (CHF/Monat) in Ihrer Bandbreite",
  },
  fr: {
    emptyTitle: "Pas encore assez de réponses",
    surveyCta: "Aller à l'enquête",
    comparisonSelectLabel: "Taille de l'entreprise",
    comparisonInsufficient:
      "Pas encore assez de réponses pour ce groupe de taille (n < 5).",
    comparisonNoMedian:
      "Aucune médiane publiée n'est encore disponible pour ce groupe.",
    comparisonMedianLabel:
      "Médiane des dépenses IA (CHF/mois) dans votre fourchette",
  },
  it: {
    emptyTitle: "Ancora non abbastanza risposte",
    surveyCta: "Vai al sondaggio",
    comparisonSelectLabel: "Dimensione aziendale",
    comparisonInsufficient:
      "Ancora non abbastanza risposte per questo gruppo dimensionale (n < 5).",
    comparisonNoMedian:
      "Nessuna mediana pubblicata è ancora disponibile per questo gruppo.",
    comparisonMedianLabel: "Mediana spesa IA (CHF/mese) nella vostra fascia",
  },
};
