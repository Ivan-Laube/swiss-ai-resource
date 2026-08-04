export {

  matchGlossaryTerms,

  type MatchedGlossaryTerm,

} from "./glossary-match";



export {

  buildTranslationPrompt,

  type TranslateTargetLocale,

  type TranslationPrompt,

} from "./prompt";



export {

  getTranslateModel,

  requireAnthropicApiKey,

  translateWithAnthropic,

} from "./client";



export {

  assembleTranslationMarkdown,

  parseLlmTranslation,

  translationOutputPath,

  writeTranslation,

  type LlmTranslationParts,

} from "./write";



export {

  verifyGlossaryTermsInTranslation,

  type GlossaryVerifyResult,

} from "./verify";



export {

  canonicalContentEquals,

  extractCanonicalContent,

  isNullGitSha,

  listChangedCanonicalDeSlugs,

  resolveChangedDeSlugs,

  type CanonicalContent,

  type ResolveChangedDeSlugsOptions,

} from "./changed-de";

