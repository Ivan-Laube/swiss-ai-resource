import Anthropic from "@anthropic-ai/sdk";

export type AnthropicPrompt = {
  system: string;
  user: string;
};

export type CallAnthropicOptions = AnthropicPrompt & {
  maxTokens?: number;
  model?: string;
};

// Long guide pages (IT/FR run longer than DE) need headroom; truncation is an error.
const DEFAULT_MAX_TOKENS = 16000;

export function requireAnthropicApiKey(): string {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Export it or add it to a local .env file.",
    );
  }
  return key;
}

export function getModel(envVar: string, defaultModel: string): string {
  return process.env[envVar]?.trim() || defaultModel;
}

/** Attempts per call: an empty response is retried once before failing. */
const MAX_ATTEMPTS = 2;

/**
 * Call Anthropic Messages API and return the assistant text.
 *
 * Fails instead of returning partial output: an empty response (no text
 * blocks) is retried once, and a response cut off at `max_tokens` is an
 * error, since a truncated translation or extraction must never be written.
 * Errors name the `stop_reason` so a workflow log says why a call failed.
 */
export async function callAnthropic(
  options: CallAnthropicOptions,
): Promise<string> {
  const apiKey = requireAnthropicApiKey();
  const model = options.model ?? getModel("TRANSLATE_MODEL", "claude-sonnet-5");
  const client = new Anthropic({ apiKey });
  const maxTokens = options.maxTokens ?? DEFAULT_MAX_TOKENS;

  let stopReason: string | null = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system: options.system,
      messages: [{ role: "user", content: options.user }],
    });
    stopReason = response.stop_reason;

    if (stopReason === "max_tokens") {
      throw new Error(
        `Anthropic response was cut off at max_tokens (${maxTokens}); refusing truncated output`,
      );
    }

    const textBlocks = response.content.filter(
      (block): block is Anthropic.TextBlock => block.type === "text",
    );
    if (textBlocks.length > 0) {
      return textBlocks.map((block) => block.text).join("\n");
    }
    console.warn(
      `Anthropic response contained no text blocks (stop_reason: ${stopReason}, attempt ${attempt}/${MAX_ATTEMPTS})`,
    );
  }

  throw new Error(
    `Anthropic response contained no text blocks after ${MAX_ATTEMPTS} attempts (stop_reason: ${stopReason})`,
  );
}
