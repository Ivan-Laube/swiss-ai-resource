import type { Messages } from "../types";

export const en: Messages = {
  meta: {
    title: "aicompliant.ch",
    description:
      "Practical guidance on AI deployment in Switzerland: compliance, vendor comparison, and interactive decision tools.",
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
    eyebrow: "Swiss SMEs · AI use",
    title: "Deploy AI in Switzerland — on a sourced footing.",
    lead:
      "Guides on the FADP, EU AI Act and FINMA, decision tools, a source-based vendor comparison, and a website check. Independent, no tracking, checked monthly against the sources.",
    note:
      "German is the canonical language of this project. EN, FR, and IT translations are drafts until reviewed.",
    ctaTools: "Start a decision tool",
    ctaVendors: "Compare vendors",
    quickCheckTitle: "Website Quick-Check",
    quickCheckLead:
      "Checks publicly visible signals on your site — privacy notice, impressum, cookie tools, trackers, security headers. Not a compliance assessment.",
    quickCheckUrlLabel: "Website URL",
    quickCheckSubmit: "Check website",
    quickCheckPrivacy:
      "The URL is sent once to our scanner and is not stored permanently.",
    quickCheckChecksHeading: "What it checks",
    statsHeading: "At a glance",
    statsGuides: "Guides",
    statsTools: "Decision tools",
    statsVendors: "Vendors",
    statsLastSource: "Last source check",
    guidesHeading: "Guides",
    guidesLead:
      "Source-based primers on data protection, the EU AI Act, FINMA, and procurement.",
    guidesAction: "All guides",
    categoryDatenschutz: "Data protection",
    categoryEuAiAct: "EU AI Act",
    categoryFinanzmarkt: "Financial markets",
    categoryBeschaffung: "Procurement",
    categorySicherheit: "Security",
    readingTime: "{n} min read",
    toolsHeading: "Decision tools",
    toolsLead:
      "Interactive trees with cited sources. No compliance traffic lights.",
    toolsMaxQuestions: "up to {n} questions",
    toolsAction: "All decision tools",
    vendorsHeading: "Vendor comparison",
    vendorsLead:
      "Facts on hosting, DPAs and certifications — only with a source, otherwise unverified.",
    vendorsListed: "{n} vendors listed",
    vendorsSwissHosting: "{n} with sourced Swiss hosting",
    vendorsDpa: "{n} with a sourced DPA",
    vendorsUnverifiedNote:
      "Cells without a source count as unverified. No recommendations or scores.",
    vendorsAction: "Open vendor comparison",
    surveyHeading: "Survey & benchmark",
    surveyLead:
      "A short survey on AI adoption in Swiss companies. Anonymized results feed the benchmark.",
    surveyCta: "Take the survey",
    benchmarkLink: "View benchmark",
    benchmarkPending: "Results from n ≥ {n}",
    methodologyHeading: "Method",
    methodologySourcesTitle: "Official sources",
    methodologySourcesBody:
      "Guides and decision tools rely on primary regulatory and statutory sources — with the URL stated.",
    methodologyChecksTitle: "Monthly source checks",
    methodologyChecksBody:
      "An automated job checks registered sources each month and updates verification dates in the repository.",
    methodologyIndependenceTitle: "Independent",
    methodologyIndependenceBody:
      "No affiliate or sponsor links, no tracking on the site, and no legal advice.",
  },
  websiteCheck: {
    metaTitle: "Website Quick-Check",
    metaDescription:
      "A first look at a website: HTTPS, privacy link, impressum, cookie tools, trackers, and security headers — with legal citations. Not legal advice.",
    title: "Website Quick-Check",
    lead:
      "Enter a URL. The scan checks publicly visible signals and returns facts with status found / not found / indeterminate — not a compliance verdict.",
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
      "The page looks dynamic (e.g. GTM or an SPA shell). A static scan may miss injected scripts and banners — results may be incomplete.",
    disclaimer:
      "This Quick-Check is a first assessment from publicly visible signals and is not legal advice or a compliance audit. Check the sources and consult qualified professionals when needed.",
    notFoundNote:
      "“Not found” means the scan did not detect the signal on the pages it checked — not that it is missing from the website.",
    siteOwnerNote:
      "Do you run a scanned website and think a result is wrong? Contact details are in our",
    siteOwnerLinkLabel: "legal notice",
    scanAgain: "New check",
    surveyPrompt:
      "Help build the Swiss benchmark — about {minutes} minutes.",
    surveyPromptCta: "Go to survey",
  },
  benchmark: {
    metaTitle: "Benchmark",
    metaDescription:
      "Anonymized aggregate results from the Swiss AI adoption survey. Cells with fewer than five responses are not shown.",
    indexTitle: "AI adoption benchmark",
    indexLead:
      "Anonymized survey results. Only published cells (n ≥ 5) are shown — small groups stay suppressed.",
    backHome: "← Back to home",
    sampleSize: "Total responses: {n}",
    generatedAt: "Aggregate as of: {date}",
    emptyTitle: "Not enough responses yet",
    emptyLead:
      "The benchmark appears once enough anonymized responses are available (at least five per published cell). Take the survey to contribute.",
    suppressionNote:
      "Privacy: options and size groups with fewer than five responses are not shown.",
    questionSample: "n = {n}",
    comparisonHeading: "Your size vs the median",
    comparisonLead:
      "Select your company size. We show the published median monthly AI spend for that band — when enough responses exist.",
    comparisonSelectLabel: "Company size",
    comparisonSelectPlaceholder: "Choose a band …",
    comparisonMedianLabel: "Median AI spend (CHF/month) in your band",
    comparisonInsufficient:
      "Not enough responses for this size group yet (n < 5).",
    comparisonNoMedian:
      "No published median is available for this group yet.",
    surveyCta: "Go to survey",
    disclaimer:
      "This benchmark is an anonymized pilot snapshot and is not legal advice. Results describe the sample, not the whole Swiss economy.",
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
      "This survey supports an anonymized benchmark. Answers without email are fully anonymous. Email addresses are stored separately from answers and used only for report notification. Not legal advice.",
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
      "This translation is an LLM draft and has not yet been human-reviewed.",
    translationCanonicalNote:
      "The German version is canonical; translations may differ.",
  },
  guides: {
    indexTitle: "Guides",
    indexLead:
      "Source-based guides on Swiss data protection, the EU AI Act, FINMA, and procurement. Not legal advice.",
    backHome: "← Back to home",
  },
  tools: {
    indexTitle: "Decision tools",
    indexLead:
      "Interactive decision trees driven by structured rules. Not legal advice.",
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
      "Help build the Swiss benchmark — about {minutes} minutes",
    surveyCta: "Go to survey",
    disclaimer:
      "This tool is for information only and is not legal advice. Outcomes are orientation aids — check the sources and consult qualified professionals when needed.",
    verdictLikely: "Likely workable",
    verdictUnlikely: "Likely not workable",
    verdictUnclear: "Unclear",
    verdictDepends: "It depends",
  },
  vendors: {
    indexTitle: "Vendor comparison",
    indexLead:
      "Compare AI vendors by hosting, DPA, certifications, and related criteria. Cells without a verifiable source are shown as unverified.",
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
    certFinmaRelevant: "FINMA-relevant",
    certOther: "Other",
    pricingFree: "Free",
    pricingUsage: "Usage-based",
    pricingSubscription: "Subscription",
    pricingEnterprise: "Enterprise",
    pricingContact: "Contact",
  },
  readiness: {
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
