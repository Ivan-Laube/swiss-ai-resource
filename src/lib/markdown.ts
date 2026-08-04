import { marked } from "marked";

/** Render author-controlled Markdown to HTML (build-time / server). */
export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}
