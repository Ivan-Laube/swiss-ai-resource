import type { Messages } from "../types";

export const en: Messages = {
  meta: {
    title: "Swiss AI Deployment Resource",
    description:
      "Practical guidance on AI deployment in Switzerland: compliance, vendor comparison, and interactive decision tools.",
  },
  nav: {
    brand: "Swiss AI Resource",
    languagesLabel: "Languages",
  },
  footer: {
    navLabel: "Legal",
    impressum: "Legal notice",
    privacy: "Privacy policy",
  },
  home: {
    eyebrow: "Swiss SMEs · AI adoption",
    title: "Swiss AI Deployment Resource",
    lead:
      "Practical information on AI deployment in Switzerland: compliance, vendor comparison, and interactive decision tools.",
    note:
      "German is the canonical language of this project. EN, FR, and IT translations are drafts until reviewed.",
    complianceHeading: "Compliance basics",
    toolsHeading: "Decision tools",
    vendorsHeading: "Vendor comparison",
    surveyHeading: "Survey",
    surveyLead:
      "A short survey on AI adoption in Swiss companies. Anonymized results feed the benchmark report.",
    benchmarkLink: "View benchmark",
    websiteCheckHeading: "Website Quick-Check",
    websiteCheckLead:
      "A first look at a website from publicly visible signals (HTTPS, privacy link, trackers). Not a compliance audit.",
  },
  websiteCheck: {
    metaTitle: "Website Quick-Check · Swiss AI Resource",
    metaDescription:
      "A first look at a website: HTTPS, privacy link, impressum, cookie tools, trackers, and security headers — with legal citations. Not legal advice.",
    title: "Website Quick-Check",
    lead:
      "Enter a URL. The scan checks publicly visible signals and returns facts with status found / not found / indeterminate — not a compliance verdict.",
    backHome: "← Back to home",
    urlLabel: "Website URL",
    urlPlaceholder: "https://example.ch",
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
    scanAgain: "Check another URL",
  },
  benchmark: {
    metaTitle: "Benchmark · Swiss AI Resource",
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
    metaTitle: "Survey · Swiss AI Resource",
    metaDescription:
      "A short survey on AI use, spend, and hosting requirements in Swiss companies.",
    backHome: "← Back to home",
    estimatedTime: "Estimated time: about {minutes} minutes",
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
    sources: "Sources",
    disclaimer:
      "This page is for information only and is not legal advice. For specific projects, consult qualified professionals.",
    backHome: "← Back to home",
    translationDraft:
      "This translation is an LLM draft and has not yet been human-reviewed.",
    translationCanonicalNote:
      "The German version is canonical; translations may differ.",
  },
  tools: {
    indexTitle: "Decision tools",
    indexLead:
      "Interactive decision trees driven by structured rules. Not legal advice.",
    backHome: "← Back to home",
    backToIndex: "← All decision tools",
    back: "Back",
    restart: "Start over",
    caveats: "Caveats",
    sources: "Sources",
    relatedPages: "Related pages",
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
  rootRedirect: {
    message: "Redirecting to the German homepage …",
    link: "Go to homepage (DE)",
  },
};
