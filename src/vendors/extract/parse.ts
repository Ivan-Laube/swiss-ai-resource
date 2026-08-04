import { stripCodeFence } from "@/lib/llm-output";

import {
  llmVendorExtractSchema,
  type LlmVendorExtract,
} from "./schema";

export function parseLlmVendorExtract(raw: string): LlmVendorExtract {
  const cleaned = stripCodeFence(raw);
  let data: unknown;
  try {
    data = JSON.parse(cleaned) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`LLM output is not valid JSON: ${message}`);
  }

  return llmVendorExtractSchema.parse(data);
}
