/** Approximate reading time in minutes (words ÷ 200, rounded, minimum 1). */
export function readingTimeMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
