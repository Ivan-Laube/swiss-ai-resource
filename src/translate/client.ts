import { callAnthropic, getModel } from "@/lib/anthropic";



import type { TranslationPrompt } from "./prompt";



const DEFAULT_MODEL = "claude-sonnet-5";



export function getTranslateModel(): string {

  return getModel("TRANSLATE_MODEL", DEFAULT_MODEL);

}



export { requireAnthropicApiKey } from "@/lib/anthropic";



/** Call Anthropic Messages API and return the assistant text. */

export async function translateWithAnthropic(

  prompt: TranslationPrompt,

): Promise<string> {

  return callAnthropic({

    system: prompt.system,

    user: prompt.user,

    model: getTranslateModel(),

  });

}


