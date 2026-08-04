import { getTerms, type GlossaryTerm } from "@/glossary";

export type MatchedGlossaryTerm = GlossaryTerm;

function isWordChar(char: string | undefined): boolean {
  if (!char) {
    return false;
  }
  return /[\p{L}\p{N}_]/u.test(char);
}

/** Case-sensitive, word-boundary-ish search for `needle` in `haystack`. */
function findAllOccurrences(haystack: string, needle: string): number[] {
  if (!needle) {
    return [];
  }

  const positions: number[] = [];
  let from = 0;

  while (from <= haystack.length - needle.length) {
    const index = haystack.indexOf(needle, from);
    if (index === -1) {
      break;
    }

    const before = haystack[index - 1];
    const after = haystack[index + needle.length];
    if (!isWordChar(before) && !isWordChar(after)) {
      positions.push(index);
    }

    from = index + 1;
  }

  return positions;
}

type Candidate = {
  term: GlossaryTerm;
  label: string;
};

/**
 * Scan DE title, description, and body for glossary hits.
 * Matches longest `de` labels first, then `abbreviations.de`, skipping overlaps.
 */
export function matchGlossaryTerms(
  title: string,
  description: string,
  body: string,
): MatchedGlossaryTerm[] {
  const text = `${title}\n${description}\n${body}`;
  const terms = getTerms();

  const candidates: Candidate[] = [];
  for (const term of terms) {
    candidates.push({ term, label: term.de });
    const abbr = term.abbreviations?.de;
    if (abbr && abbr !== term.de) {
      candidates.push({ term, label: abbr });
    }
  }

  candidates.sort((a, b) => b.label.length - a.label.length);

  const covered = new Array<boolean>(text.length).fill(false);
  const matched = new Map<string, GlossaryTerm>();

  for (const { term, label } of candidates) {
    if (matched.has(term.id)) {
      continue;
    }

    for (const index of findAllOccurrences(text, label)) {
      const end = index + label.length;
      let overlaps = false;
      for (let i = index; i < end; i += 1) {
        if (covered[i]) {
          overlaps = true;
          break;
        }
      }
      if (overlaps) {
        continue;
      }

      for (let i = index; i < end; i += 1) {
        covered[i] = true;
      }
      matched.set(term.id, term);
      break;
    }
  }

  return [...matched.values()].sort((a, b) => a.id.localeCompare(b.id));
}
