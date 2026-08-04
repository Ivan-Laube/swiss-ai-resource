export {
  abbreviationsSchema,
  domains,
  glossaryFileSchema,
  glossaryTermSchema,
  parseGlossaryFile,
  parseGlossaryTerm,
  type Abbreviations,
  type Domain,
  type GlossaryFile,
  type GlossaryTerm,
} from "./schema";

export {
  getTermByDe,
  getTermById,
  getTerms,
  validateGlossary,
} from "./load";
