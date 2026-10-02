// Server-side barrel (load.ts reads the filesystem). Client components import
// `@/readiness/schema` and `@/readiness/score` directly, like `@/rules/schema`.
export {
  DOWNLOADS,
  NA,
  SITE_PAGES,
  parseReadinessCheck,
  readinessCheckSchema,
  severities,
  type Condition,
  type ProfileQuestion,
  type ReadinessCheck,
  type ReadinessQuestion,
  type SecurityQuestion,
  type Severity,
} from "./schema";

export {
  READINESS_CHECK_PATH,
  getReadinessCheck,
  linkProblem,
  loadReadinessCheck,
  validateReadinessCheck,
} from "./load";

export {
  conditionHolds,
  effectiveSeverity,
  isVisible,
  missingAnswers,
  scoreReadiness,
  type Answers,
  type NextStep,
  type ReadinessResult,
  type SecurityArea,
} from "./score";
