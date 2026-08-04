export {
  extractHtmlText,
  extractJsonText,
  extractPdfText,
  extractText,
  ExtractError,
  isJsonSource,
  isPdfSource,
} from "./extract";

export {
  BROWSER_USER_AGENT,
  delayBetweenFetches,
  FETCH_202_MAX_EXTRA_ATTEMPTS,
  FETCH_202_RETRY_DELAY_MS,
  FETCH_DELAY_MS,
  FETCH_RETRY_DELAY_MS,
  FETCH_SIZE_CAP_BYTES,
  FETCH_TIMEOUT_MS,
  fetchSource,
  FetchError,
  mergeSetCookieHeaders,
  USER_AGENT,
  type FetchAttempt,
  type FetchResult,
} from "./fetch";

export { normalizeText } from "./normalize";

export {
  createUnifiedDiff,
  DEFAULT_DIFF_MAX_CHARS,
  diffStats,
  truncateDiff,
  type DiffStats,
} from "./diff";

export {
  formatResultLine,
  runSnapshots,
  seedSnapshotFromFile,
  type SnapshotRunOptions,
  type SnapshotRunSummary,
} from "./run";

export {
  ACT_BRIEF_PATH,
  ACT_DIR,
  ACT_FAILURES_BRIEF_PATH,
  ACT_REPORT_PATH,
  buildFailuresSummary,
  CLASSIFY_REPORT_PATH,
  ensureSnapshotDirs,
  readSnapshotMeta,
  readSnapshotText,
  RUN_REPORT_PATH,
  sha256Text,
  SNAPSHOTS_DIR,
  SNAPSHOTS_DIFFS_DIR,
  SNAPSHOTS_META_DIR,
  snapshotDiffPath,
  snapshotMetaPath,
  snapshotTextPath,
  writeFailedSnapshot,
  writeRunReport,
  writeSuccessfulSnapshot,
  type RunReport,
  type SnapshotChange,
  type SnapshotMeta,
  type SourceRunFailure,
  type SourceRunResult,
} from "./write";
