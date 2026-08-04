export {
  localizedStringSchema,
  parseSurvey,
  pickLocalized,
  surveyInputs,
  surveyOptionSchema,
  surveyQuestionSchema,
  surveySchema,
  type LocalizedString,
  type Survey,
  type SurveyChoiceQuestion,
  type SurveyInput,
  type SurveyOption,
  type SurveyQuestion,
  type SurveyTextQuestion,
} from "./schema";

export {
  exclusiveNoneQuestionIds,
  isHoneypotTriggered,
  surveyIntakeSchema,
  surveyLocales,
  validateAnswers,
  validateIntake,
  type AnswerValue,
  type SurveyIntake,
  type SurveyLocale,
  type ValidateAnswersResult,
  type ValidateIntakeResult,
} from "./answers";

export { getSurvey, SURVEY_PATH, validateSurvey } from "./load";

export {
  assertAggregatesMatchSurvey,
  COMPANY_SIZE_QUESTION_ID,
  parseSurveyAggregates,
  SPEND_QUESTION_ID,
  SURVEY_SUPPRESSION_THRESHOLD,
  surveyAggregatesSchema,
  surveyCrossTabRowSchema,
  surveyQuestionAggregateSchema,
  type SurveyAggregates,
  type SurveyCrossTabRow,
  type SurveyQuestionAggregate,
} from "./aggregates";

export {
  getSurveyAggregates,
  SURVEY_AGGREGATES_PATH,
  validateSurveyAggregates,
} from "./aggregate-load";

export {
  buildBenchmarkQuestionViews,
  buildCompanySizeOptions,
  buildSpendMedianLookup,
  hasPublishableBenchmarkData,
  type BenchmarkComparisonOption,
  type BenchmarkCountRow,
  type BenchmarkMedianRow,
  type BenchmarkQuestionView,
} from "./benchmark";
