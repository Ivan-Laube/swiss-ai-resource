/** Strip optional markdown/JSON code fences the model sometimes wraps around output. */
export function stripCodeFence(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(
    /^```(?:json|markdown|md|yaml)?\s*\n([\s\S]*?)\n```$/i,
  );
  if (fenced) {
    return fenced[1].trim();
  }
  return trimmed;
}
