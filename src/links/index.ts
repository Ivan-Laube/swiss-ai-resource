export { collectPublishedUrls, type UrlCitationMap } from "./collect";

export {
  buildLinksBrief,
  buildLinksIssueTitle,
} from "./brief";

export { probeUrl, type ProbeResult } from "./probe";

export {
  checkLinks,
  formatLinksSummary,
  type CheckLinksOptions,
  type CheckLinksSummary,
} from "./run";

export {
  linkCitationKinds,
  linkCitationSchema,
  linkResultSchema,
  linksReportSchema,
  type LinkCitation,
  type LinkCitationKind,
  type LinkResult,
  type LinksReport,
} from "./schema";

export {
  ensureLinksDirs,
  LINKS_BRIEF_PATH,
  LINKS_DIR,
  LINKS_REPORT_PATH,
  writeLinksReport,
} from "./write";
