import type { Messages } from "../types";

export const en: Messages = {
  meta: {
    title: "aicompliant.ch",
    description:
      "Practical guidance for Swiss companies on using AI: data protection, the EU AI Act, FINMA, a vendor comparison and decision tools.",
  },
  nav: {
    brand: "aicompliant.ch",
    brandSubtitle: "Swiss AI Resource",
    wordmark: "aicompliant",
    wordmarkTld: ".ch",
    languagesLabel: "Languages",
    mainLabel: "Main navigation",
    skipToContent: "Skip to content",
    menu: "Menu",
    guides: "Guides",
    tools: "Decision tools",
    vendors: "Vendor comparison",
    survey: "Survey & Benchmark",
    websiteCheck: "Check website",
  },
  footer: {
    navLabel: "Footer",
    brandDescription:
      "Guides, decision tools, and a source-based vendor comparison for AI use in Switzerland.",
    lastSourceCheck: "Last source check: {date}",
    colGuides: "Guides",
    colTools: "Tools",
    colData: "Data",
    colLegal: "Legal",
    survey: "Survey",
    benchmark: "Benchmark",
    disclaimer:
      "This content is for information only and is not legal advice. Check the sources and seek professional advice where needed.",
    copyright: "© {year} aicompliant.ch",
    impressum: "Legal notice",
    privacy: "Privacy policy",
  },
  home: {
    eyebrow: "For Swiss SMEs",
    title: "Using AI in your business: what applies in Switzerland.",
    lead:
      "Guides on data protection, the EU AI Act, FINMA and AI security, plus decision tools, a vendor comparison and a website check. Independent, no tracking, and with sources that are checked automatically for changes every month.",
    note:
      "The German version is authoritative. The English, French and Italian translations are machine-generated drafts and have not been reviewed yet.",
    ctaTools: "Start a decision tool",
    ctaVendors: "Compare vendors",
    quickCheckTitle: "Website Quick-Check",
    quickCheckLead:
      "Checks publicly visible features of your website: privacy notice, impressum, cookie tools, trackers and security headers. Not a legal assessment.",
    quickCheckUrlLabel: "Website URL",
    quickCheckSubmit: "Check website",
    quickCheckPrivacy:
      "The URL is sent to our scanner only for this check and is not stored permanently.",
    quickCheckChecksHeading: "What it checks",
    statsHeading: "At a glance",
    statsGuides: "Guides",
    statsTools: "Decision tools",
    statsVendors: "Vendors",
    statsLastSource: "Last source check",
    guidesHeading: "Guides",
    guidesLead:
      "Primers on data protection, the EU AI Act, FINMA, procurement and AI security, each with sources.",
    guidesAction: "All guides",
    categoryDatenschutz: "Data protection",
    categoryEuAiAct: "EU AI Act",
    categoryFinanzmarkt: "Financial markets",
    categoryBeschaffung: "Procurement",
    categorySicherheit: "Security",
    readingTime: "{n} min read",
    toolsHeading: "Decision tools",
    toolsLead:
      "A few questions, a first assessment with sources. Not a substitute for a case-by-case review.",
    toolsMaxQuestions: "up to {n} questions",
    toolsAction: "All decision tools",
    vendorsHeading: "Vendor comparison",
    vendorsLead:
      "Hosting, data processing agreements (DPA) and certifications compared. Every fact has a source, otherwise it is marked as unverified.",
    vendorsListed: "{n} vendors listed",
    vendorsSwissHosting: "{n} with sourced Swiss hosting",
    vendorsDpa: "{n} with a sourced DPA",
    vendorsUnverifiedNote:
      "Information without a source counts as unverified. The comparison contains no recommendations or ratings.",
    vendorsAction: "Open vendor comparison",
    surveyHeading: "Survey & benchmark",
    surveyLead:
      "A short survey on AI use in Swiss companies. The results feed into the benchmark in anonymized form.",
    surveyCta: "Take the survey",
    benchmarkLink: "View benchmark",
    benchmarkPending: "Results from {n} responses",
    methodologyHeading: "Method",
    methodologySourcesTitle: "Official sources",
    methodologySourcesBody:
      "Guides and decision tools rely primarily on legal texts and publications by the authorities (e.g. FDPIC, FINMA, NCSC). Every page lists its sources with links.",
    methodologyChecksTitle: "Monthly source checks",
    methodologyChecksBody:
      "An automated job fetches the sources every month and reports changes. When a source changes in substance, the affected page is reviewed and updated.",
    methodologyIndependenceTitle: "Independent",
    methodologyIndependenceBody:
      "No affiliate or sponsored links and no tracking on the website.",
  },
  websiteCheck: {
    metaTitle: "Website Quick-Check",
    metaDescription:
      "A first look at a website: HTTPS, link to the privacy notice, impressum, cookie tools, trackers and security headers, with the legal references. Not legal advice.",
    title: "Website Quick-Check",
    lead:
      "Enter a URL. The scan checks publicly visible features and shows “found”, “not found” or “indeterminate” for each item. It does not assess whether the website complies with the law.",
    backHome: "← Back to home",
    urlLabel: "Website URL",
    urlPlaceholder: "example.ch",
    submit: "Scan",
    scanning: "Scanning …",
    unavailable:
      "Website check is not configured right now. Please try again later.",
    errorBadUrl: "Please enter a valid http or https URL.",
    errorRateLimit:
      "Too many requests. Please wait a minute and try again.",
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
      "The page appears to load dynamically (e.g. through a tag manager or as a single-page app). A static scan may then miss some scripts and banners, so the results may be incomplete.",
    disclaimer:
      "This Quick-Check is a first assessment based on publicly visible features and is not legal advice or a compliance audit. Check the sources and consult qualified professionals when needed.",
    notFoundNote:
      "“Not found” only means that the scan did not detect the feature on the pages it checked. It may still be present.",
    siteOwnerNote:
      "Do you run a scanned website and think a result is wrong? Contact details are in our",
    siteOwnerLinkLabel: "legal notice",
    scanAgain: "New check",
    surveyPrompt:
      "Take part in the Swiss AI survey (about {minutes} minutes).",
    surveyPromptCta: "Go to survey",
  },
  benchmark: {
    metaTitle: "Benchmark",
    metaDescription:
      "Anonymized results of the survey on AI use in Swiss companies. Values based on fewer than five responses are not shown.",
    indexTitle: "Benchmark: AI use in Swiss companies",
    indexLead:
      "Anonymized survey results. Only values based on at least five responses are shown; smaller groups stay hidden to protect participants.",
    backHome: "← Back to home",
    sampleSize: "Total responses: {n}",
    generatedAt: "Aggregate as of: {date}",
    emptyTitle: "Not enough responses yet",
    emptyLead:
      "The benchmark appears once enough responses are available (at least five per value shown). Taking part in the survey helps.",
    suppressionNote:
      "Privacy: answer options and size groups with fewer than five responses are not shown.",
    questionSample: "n = {n}",
    comparisonHeading: "Your size vs the median",
    comparisonLead:
      "Select your company size. If enough responses are available, you see the median monthly AI spend for that size band.",
    comparisonSelectLabel: "Company size",
    comparisonSelectPlaceholder: "Choose a band …",
    comparisonMedianLabel: "Median AI spend (CHF/month) in your band",
    comparisonInsufficient:
      "Not enough responses for this size group yet (n < 5).",
    comparisonNoMedian:
      "No published median is available for this group yet.",
    surveyCta: "Go to survey",
    disclaimer:
      "The benchmark is a pilot analysis. It describes only the companies that took part in the survey and is not representative of the Swiss economy.",
  },
  survey: {
    metaTitle: "Survey",
    metaDescription:
      "A short survey on AI use, spend, and hosting requirements in Swiss companies.",
    backHome: "← Back to home",
    estimatedTime: "Estimated time: about {minutes} minutes",
    progress: "Question {answered} of {total}",
    submit: "Submit",
    submitting: "Submitting …",
    success:
      "Thank you. Your answers were recorded and will feed the anonymized benchmark.",
    successOptIn:
      "If you provided an email, we will notify you when the report is available.",
    emailLabel: "Email (optional)",
    emailPlaceholder: "name@company.ch",
    reportOptInLabel:
      "Yes, email me the benchmark report when it is ready.",
    honeypotLabel: "Website",
    turnstileLabel: "Security check",
    requiredHint: "Required",
    disclaimer:
      "Answers are analysed only for the anonymized benchmark. Without an email address, your participation stays anonymous. If you give an email address, we store it separately from the answers and use it only to tell you about the report.",
    privacyLinkLabel: "Privacy policy",
    privacyNearEmail:
      "More on optional email and data processing:",
    unavailable:
      "Survey intake is not configured right now. Please try again later.",
    errorValidation:
      "Please check your answers. All required questions must be completed.",
    errorTurnstile:
      "Security check failed. Please try again.",
    errorRateLimit:
      "Too many requests. Please wait a minute and try again.",
    errorNetwork:
      "Could not reach the server. Check your connection and try again.",
    errorServer: "Something went wrong while saving. Please try again.",
  },
  content: {
    lastVerified: "Last verified",
    readingTime: "Reading time about {minutes} min.",
    sources: "Sources",
    disclaimer:
      "This page is for information only and is not legal advice. For specific projects, consult qualified professionals.",
    backHome: "← Back to home",
    breadcrumbLabel: "Breadcrumb",
    breadcrumbHome: "Home",
    tocLabel: "Contents",
    tocNavLabel: "Table of contents",
    relatedTools: "Related decision tool",
    counselBadge: "Reviewed by counsel · {date}",
    translationDraft:
      "This translation was machine-generated and has not yet been reviewed by a person.",
    translationCanonicalNote:
      "The German version is authoritative; this translation may differ from it.",
  },
  guides: {
    indexTitle: "Guides",
    indexLead:
      "Guides on data protection, the EU AI Act, FINMA, procurement and AI security, each with sources. Not legal advice.",
    backHome: "← Back to home",
  },
  tools: {
    indexTitle: "Decision tools",
    indexLead:
      "Answer a few questions and get a first assessment with sources. Not legal advice.",
    backHome: "← Back to home",
    backToIndex: "← All decision tools",
    back: "Back",
    restart: "Start over",
    progress: "Question {n} · max. {m}",
    maxQuestions: "max. {count} questions",
    caveats: "Caveats",
    sources: "Sources",
    relatedPages: "Related pages",
    answerRecap: "Your answers",
    copyLink: "Copy link",
    copyLinkDone: "Copied",
    print: "Print / save as PDF",
    surveyPrompt:
      "Take part in the Swiss AI survey (about {minutes} minutes).",
    surveyCta: "Go to survey",
    disclaimer:
      "This tool is for information only and is not legal advice. The result is an orientation aid; check the sources and consult qualified professionals when needed.",
    verdictLikely: "Likely workable",
    verdictUnlikely: "Likely not workable",
    verdictUnclear: "Unclear",
    verdictDepends: "It depends",
  },
  vendors: {
    indexTitle: "Vendor comparison",
    indexLead:
      "AI vendors compared: hosting, data processing agreement (DPA), certifications and other criteria. Information without a source is marked as unverified.",
    backHome: "← Back to home",
    disclaimer:
      "This overview is for information only and is not legal advice or a recommendation. Check the sources and consult qualified professionals when needed.",
    filtersLegend: "Filters",
    filterSwissHosting: "Swiss hosting",
    filterEuHosting: "EU hosting",
    filterDpaAvailable: "DPA available",
    filterTrainingOptOut: "Training opt-out",
    filterCertifications: "Certifications",
    clearFilters: "Clear filters",
    resultCount: "{shown} of {total} vendors",
    emptyFiltered: "No vendors match the selected filters.",
    colName: "Vendor",
    colHostingRegions: "Hosting regions",
    colSwissHosting: "CH hosting",
    colEuHosting: "EU hosting",
    colDpa: "DPA",
    colTrainingOptOut: "Training opt-out",
    colCertifications: "Certifications",
    colPricingTier: "Pricing",
    colSwissEntity: "CH entity",
    colEuEntity: "EU entity",
    colLastChecked: "Last checked",
    unverified: "unverified",
    yes: "Yes",
    no: "No",
    sourceLink: "Source",
    dpaLink: "Open DPA",
    certIso27001: "ISO 27001",
    certSoc2: "SOC 2",
    certFinmaRelevant: "FINMA (self-declared)",
    certOther: "Other",
    pricingFree: "Free",
    pricingUsage: "Usage-based",
    pricingSubscription: "Subscription",
    pricingEnterprise: "Enterprise",
    pricingContact: "Contact",
  },
  readiness: {
    cardMeta: "{count} questions, about 6 minutes",
    benchmarkTitle: "How other companies compare",
    benchmarkSource: "From {n} responses to the Swiss AI survey. Take part to make the comparison more precise.",
    draftNotice: "Preview: this check is still being finalised and translated.",
    profileTitle: "About your company",
    progress: "{answered} of {total} questions answered",
    showResult: "Show result",
    incomplete: "Please answer all questions. Open: {n}.",
    resultTitle: "Your result",
    scoreLabel: "Score",
    levelLabel: "Level",
    dimensionsTitle: "By area",
    notApplicable: "not applicable",
    nextStepsTitle: "Your most important next steps",
    showAllSteps: "Show all next steps ({n})",
    showFewerSteps: "Show fewer",
    noSteps: "No gaps found. Keep your measures up to date.",
    readMore: "Read more:",
    securityLevelLabel: "Risk level",
    securityStepsTitle: "Next steps for AI security",
    editAnswers: "Change answers",
    restart: "Start over",
    print: "Print or save as PDF",
    companyNameLabel: "Company name (only printed, not stored)",
    answersTitle: "Your answers",
    printFooter: "Self-assessment on aicompliant.ch, question set version {version}, {date}. Based on the company's own answers; not a certification.",
    downloadPolicyTemplate: "AI policy template (Word)",
    toolLinkSuffix: "(decision tool)",
  },
  rootRedirect: {
    message: "Redirecting to the German homepage …",
    link: "Go to homepage (DE)",
  },
  notFound: {
    title: "Page not found",
    message: "The page you requested does not exist or has been moved.",
    homeLink: "Go to homepage",
  },
};
