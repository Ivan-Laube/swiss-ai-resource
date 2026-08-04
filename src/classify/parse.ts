import { stripCodeFence } from "@/lib/llm-output";

import {
  llmClassificationSchema,
  type LlmClassification,
} from "./schema";

export function parseLlmClassification(raw: string): LlmClassification {
  const cleaned = stripCodeFence(raw);
  let data: unknown;
  try {
    data = JSON.parse(cleaned) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`LLM output is not valid JSON: ${message}`);
  }

  return llmClassificationSchema.parse(data);
}
