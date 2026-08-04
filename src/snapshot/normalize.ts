/**
 * Normalize extracted source text for stable diffs.
 * Unicode NFC → collapse whitespace → trim → trailing newline.
 */
export function normalizeText(raw: string): string {
  const nfc = raw.normalize("NFC");
  const collapsed = nfc
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n");
  const trimmed = collapsed.trim();
  return trimmed.length > 0 ? `${trimmed}\n` : "\n";
}
