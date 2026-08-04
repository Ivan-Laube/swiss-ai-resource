import { createTwoFilesPatch } from "diff";

export const DEFAULT_DIFF_MAX_CHARS = 14_000;

export type DiffStats = {
  additions: number;
  deletions: number;
  hunks: number;
};

/** Build a unified diff between previous and current normalized snapshot text. */
export function createUnifiedDiff(
  id: string,
  previous: string,
  current: string,
): string {
  return createTwoFilesPatch(
    `snapshots/${id}.txt`,
    `snapshots/${id}.txt`,
    previous,
    current,
    undefined,
    undefined,
    { context: 3 },
  );
}

/** Count +/- lines and @@ hunks in a unified diff patch. */
export function diffStats(patch: string): DiffStats {
  let additions = 0;
  let deletions = 0;
  let hunks = 0;

  for (const line of patch.split("\n")) {
    if (line.startsWith("@@")) {
      hunks += 1;
      continue;
    }
    if (line.startsWith("+++") || line.startsWith("---") || line.startsWith("@@")) {
      continue;
    }
    if (line.startsWith("+")) {
      additions += 1;
    } else if (line.startsWith("-")) {
      deletions += 1;
    }
  }

  return { additions, deletions, hunks };
}

/**
 * Truncate a diff for LLM input. Keeps the header and as many hunks as fit.
 */
export function truncateDiff(
  patch: string,
  maxChars: number = DEFAULT_DIFF_MAX_CHARS,
): { patch: string; truncated: boolean } {
  if (patch.length <= maxChars) {
    return { patch, truncated: false };
  }

  const lines = patch.split("\n");
  const headerEnd = lines.findIndex((line) => line.startsWith("@@"));
  const header =
    headerEnd >= 0 ? lines.slice(0, headerEnd).join("\n") : lines[0] ?? "";
  const hunkLines = headerEnd >= 0 ? lines.slice(headerEnd) : lines;

  const kept: string[] = header ? [header] : [];
  let length = kept.join("\n").length;

  for (const line of hunkLines) {
    const nextLength = length + (kept.length > 0 ? 1 : 0) + line.length;
    if (nextLength > maxChars - 40) {
      kept.push("… [truncated]");
      return { patch: kept.join("\n"), truncated: true };
    }
    kept.push(line);
    length = nextLength;
  }

  return { patch: kept.join("\n"), truncated: true };
}
