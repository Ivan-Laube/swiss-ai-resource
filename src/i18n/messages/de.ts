export const de = {
  meta: {
    title: "Swiss AI Deployment Resource",
    description:
      "Praxisnahe Informationen zum KI-Einsatz in der Schweiz: Compliance, Anbietervergleich und interaktive Entscheidungshilfen.",
  },
  nav: {
    brand: "Swiss AI Resource",
    languagesLabel: "Sprachen",
  },
  footer: {
    navLabel: "Rechtliche Hinweise",
    impressum: "Impressum",
    privacy: "Datenschutzerklärung",
  },
  home: {
    eyebrow: "Schweizer KMU · KI-Einsatz",
    title: "Swiss AI Deployment Resource",
    lead:
      "Praxisnahe Informationen zu KI-Deployment in der Schweiz: Compliance, Anbietervergleich und interaktive Entscheidungshilfen.",
    note:
      "Deutsch ist die kanonische Sprache dieses Projekts. Übersetzungen in EN, FR und IT sind Entwürfe, bis sie geprüft wurden.",
    complianceHeading: "Compliance-Grundlagen",
    toolsHeading: "Entscheidungshilfen",
    vendorsHeading: "Anbietervergleich",
    surveyHeading: "Umfrage",
    surveyLead:
      "Kurze Umfrage zur KI-Adoption in Schweizer Unternehmen. Ergebnisse fliessen anonymisiert in den Benchmark-Bericht ein.",
    benchmarkLink: "Zum Benchmark",
    websiteCheckHeading: "Website Quick-Check",
    websiteCheckLead:
      "Erste Einschätzung einer Website anhand öffentlich sichtbarer Signale (HTTPS, Datenschutzlink, Tracker). Keine Compliance-Prüfung.",
  },
  websiteCheck: {
    metaTitle: "Website Quick-Check · Swiss AI Resource",
    metaDescription:
      "Erste Einschätzung einer Website: HTTPS, Datenschutzlink, Impressum, Cookie-Tools, Tracker und Sicherheitsheader — mit rechtlichen Bezügen. Keine Rechtsberatung.",
    title: "Website Quick-Check",
    lead:
      "Geben Sie eine URL ein. Der Scan prüft öffentlich sichtbare Signale und liefert Fakten mit Status gefunden / nicht gefunden / unklar — keine Compliance-Bewertung.",
    backHome: "← Zur Startseite",
    urlLabel: "Website-URL",
    urlPlaceholder: "https://beispiel.ch",
    submit: "Scannen",
    scanning: "Scan läuft …",
    unavailable:
      "Der Website-Check ist derzeit nicht konfiguriert. Bitte versuchen Sie es später erneut.",
    errorBadUrl:
      "Bitte geben Sie eine gültige http- oder https-URL ein.",
    errorRateLimit:
      "Zu viele Anfragen. Bitte warten Sie eine Minute und versuchen Sie es erneut.",
    errorUpstream:
      "Die Zielseite konnte nicht geladen werden (Timeout, Weiterleitungen oder Serverfehler).",
    errorNetwork:
      "Die Verbindung zum Scanner ist fehlgeschlagen. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
    errorServer:
      "Beim Scan ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
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
    scanAgain: "Andere URL prüfen",
  },
  benchmark: {
    metaTitle: "Benchmark · Swiss AI Resource",
    metaDescription:
      "Anonymisierte Aggregatergebnisse der Schweizer KI-Adoptionsumfrage. Zellen mit weniger als fünf Antworten werden nicht ausgewiesen.",
    indexTitle: "KI-Adoptions-Benchmark",
    indexLead:
      "Anonymisierte Auswertung der Umfrage. Nur veröffentlichte Zellen (n ≥ 5) werden gezeigt — kleine Gruppen bleiben unterdrückt.",
    backHome: "← Zur Startseite",
    sampleSize: "Antworten gesamt: {n}",
    generatedAt: "Stand der Auswertung: {date}",
    emptyTitle: "Noch nicht genug Antworten",
    emptyLead:
      "Der Benchmark erscheint, sobald genügend anonymisierte Antworten vorliegen (mindestens fünf pro ausgewiesener Zelle). Nehmen Sie an der Umfrage teil, um beizutragen.",
    suppressionNote:
      "Datenschutz: Optionen und Grössengruppen mit weniger als fünf Antworten werden nicht angezeigt.",
    questionSample: "n = {n}",
    comparisonHeading: "Ihre Grösse im Vergleich",
    comparisonLead:
      "Wählen Sie Ihre Unternehmensgrösse. Wir zeigen den veröffentlichten Median der monatlichen KI-Ausgaben für diese Bandbreite — sofern genügend Antworten vorliegen.",
    comparisonSelectLabel: "Unternehmensgrösse",
    comparisonSelectPlaceholder: "Bandbreite wählen …",
    comparisonMedianLabel: "Median KI-Ausgaben (CHF/Monat) in Ihrer Bandbreite",
    comparisonInsufficient:
      "Für diese Grössengruppe liegen noch nicht genug Antworten vor (n < 5).",
    comparisonNoMedian:
      "Für diese Gruppe gibt es noch keinen veröffentlichten Median.",
    surveyCta: "Zur Umfrage",
    disclaimer:
      "Dieser Benchmark ist eine anonymisierte Pilotauswertung und stellt keine Rechtsberatung dar. Ergebnisse beschreiben die Stichprobe, nicht die gesamte Schweizer Wirtschaft.",
  },
  survey: {
    metaTitle: "Umfrage · Swiss AI Resource",
    metaDescription:
      "Kurze Umfrage zu KI-Nutzung, Ausgaben und Hosting-Anforderungen in Schweizer Unternehmen.",
    backHome: "← Zur Startseite",
    estimatedTime: "Geschätzte Dauer: ca. {minutes} Minuten",
    submit: "Absenden",
    submitting: "Wird gesendet …",
    success:
      "Vielen Dank. Ihre Antworten wurden erfasst und fliessen anonymisiert in den Benchmark ein.",
    successOptIn:
      "Wenn Sie eine E-Mail angegeben haben, benachrichtigen wir Sie, sobald der Bericht verfügbar ist.",
    emailLabel: "E-Mail (optional)",
    emailPlaceholder: "name@firma.ch",
    reportOptInLabel:
      "Ja, ich möchte den Benchmark-Bericht per E-Mail erhalten, sobald er vorliegt.",
    honeypotLabel: "Website",
    turnstileLabel: "Sicherheitsprüfung",
    requiredHint: "Pflichtfrage",
    disclaimer:
      "Die Umfrage dient der anonymisierten Benchmark-Auswertung. Antworten ohne E-Mail sind vollständig anonym. E-Mail-Adressen werden getrennt von den Antworten gespeichert und nur für die Bericht-Benachrichtigung genutzt. Keine Rechtsberatung.",
    privacyLinkLabel: "Datenschutzerklärung",
    privacyNearEmail:
      "Weitere Hinweise zur optionalen E-Mail und zur Datenbearbeitung:",
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
    errorServer: "Beim Speichern ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
  },
  content: {
    lastVerified: "Zuletzt geprüft",
    sources: "Quellen",
    disclaimer:
      "Diese Seite dient nur der Information und stellt keine Rechtsberatung dar. Für konkrete Vorhaben empfiehlt sich die Prüfung durch Fachpersonen.",
    backHome: "← Zur Startseite",
    translationDraft:
      "Diese Übersetzung ist ein LLM-Entwurf und wurde noch nicht menschlich geprüft.",
    translationCanonicalNote:
      "Massgeblich ist die deutsche Fassung; Übersetzungen können abweichen.",
  },
  tools: {
    indexTitle: "Entscheidungshilfen",
    indexLead:
      "Interaktive Entscheidungsbäume auf Basis strukturierter Regeln. Keine Rechtsberatung.",
    backHome: "← Zur Startseite",
    backToIndex: "← Alle Entscheidungshilfen",
    back: "Zurück",
    restart: "Von vorn",
    caveats: "Hinweise",
    sources: "Quellen",
    relatedPages: "Weiterführende Seiten",
    disclaimer:
      "Dieses Tool dient nur der Information und stellt keine Rechtsberatung dar. Ergebnisse sind Orientierungshilfen — prüfen Sie die Quellen und holen Sie bei Bedarf Fachberatung ein.",
    verdictLikely: "Eher vertretbar",
    verdictUnlikely: "Eher nicht vertretbar",
    verdictUnclear: "Unklar",
    verdictDepends: "Kommt darauf an",
  },
  vendors: {
    indexTitle: "Anbietervergleich",
    indexLead:
      "Vergleich von KI-Anbietern nach Hosting, DPA, Zertifizierungen und weiteren Kriterien. Zellen ohne belegbare Quelle gelten als ungeprüft.",
    backHome: "← Zur Startseite",
    disclaimer:
      "Diese Übersicht dient nur der Information und stellt keine Rechtsberatung oder Empfehlung dar. Prüfen Sie die Quellen und holen Sie bei Bedarf Fachberatung ein.",
    filtersLegend: "Filter",
    filterSwissHosting: "Schweizer Hosting",
    filterEuHosting: "EU-Hosting",
    filterDpaAvailable: "DPA verfügbar",
    filterTrainingOptOut: "Training-Opt-out",
    filterCertifications: "Zertifizierungen",
    clearFilters: "Filter zurücksetzen",
    resultCount: "{shown} von {total} Anbietern",
    emptyFiltered: "Keine Anbieter entsprechen den gewählten Filtern.",
    colName: "Anbieter",
    colHostingRegions: "Hosting-Regionen",
    colSwissHosting: "CH-Hosting",
    colEuHosting: "EU-Hosting",
    colDpa: "DPA",
    colTrainingOptOut: "Training-Opt-out",
    colCertifications: "Zertifizierungen",
    colPricingTier: "Preismodell",
    colSwissEntity: "CH-Gesellschaft",
    colEuEntity: "EU-Gesellschaft",
    colLastChecked: "Zuletzt geprüft",
    unverified: "ungeprüft",
    yes: "Ja",
    no: "Nein",
    sourceLink: "Quelle",
    dpaLink: "DPA öffnen",
    certIso27001: "ISO 27001",
    certSoc2: "SOC 2",
    certFinmaRelevant: "FINMA-relevant",
    certOther: "Sonstige",
    pricingFree: "Kostenlos",
    pricingUsage: "Nutzungsbasiert",
    pricingSubscription: "Abo",
    pricingEnterprise: "Enterprise",
    pricingContact: "Auf Anfrage",
  },
  rootRedirect: {
    message: "Weiterleitung zur deutschen Startseite …",
    link: "Zur Startseite (DE)",
  },
  notFound: {
    title: "Seite nicht gefunden",
    message:
      "Die angeforderte Seite existiert nicht oder wurde verschoben.",
    homeLink: "Zur Startseite",
  },
} as const;
