import Anthropic from "@anthropic-ai/sdk";

export type AnthropicPrompt = {
  system: string;
  user: string;
};

export type CallAnthropicOptions = AnthropicPrompt & {
  maxTokens?: number;
  model?: string;
};

const DEFAULT_MAX_TOKENS = 8192;

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

/** Call Anthropic Messages API and return the assistant text. */
export async function callAnthropic(
  options: CallAnthropicOptions,
): Promise<string> {
  const apiKey = requireAnthropicApiKey();
  const model = options.model ?? getModel("TRANSLATE_MODEL", "claude-sonnet-5");
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model,
    max_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
    system: options.system,
    messages: [{ role: "user", content: options.user }],
  });

  const textBlocks = response.content.filter(
    (block): block is Anthropic.TextBlock => block.type === "text",
  );

  if (textBlocks.length === 0) {
    throw new Error("Anthropic response contained no text blocks");
  }

  return textBlocks.map((block) => block.text).join("\n");
}
