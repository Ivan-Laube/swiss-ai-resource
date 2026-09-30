import type { DecisionTree, LocalizedString } from "./schema";

const KEBAB_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type ParseAnswerHashResult =
  | { ok: true; ids: string[] }
  | { ok: false };

export type PathStep = {
  questionId: string;
  answerId: string;
  prompt: LocalizedString;
  answerLabel: LocalizedString;
};

export type ReplayPathResult =
  | {
      ok: true;
      currentId: string;
      answerIds: string[];
      steps: PathStep[];
    }
  | { ok: false };

/**
 * Parse `#a=<answerId>.<answerId>…`.
 * Missing / empty hash (or bare `#`) means the start path.
 * `#a=` with no ids also means the start. Any other shape is invalid.
 */
export function parseAnswerHash(hash: string): ParseAnswerHashResult {
  if (!hash || hash === "#" || hash === "#a=") {
    return { ok: true, ids: [] };
  }

  if (!hash.startsWith("#a=")) {
    return { ok: false };
  }

  const payload = hash.slice("#a=".length);
  if (!payload) {
    return { ok: true, ids: [] };
  }

  const ids = payload.split(".");
  if (ids.some((id) => !KEBAB_ID.test(id))) {
    return { ok: false };
  }

  return { ok: true, ids };
}

export function formatAnswerHash(ids: string[]): string {
  if (ids.length === 0) {
    return "";
  }
  return `#a=${ids.join(".")}`;
}

/** Walk answer ids from `tree.start`. Mismatch → `{ ok: false }`. */
export function replayPath(
  tree: DecisionTree,
  ids: string[],
): ReplayPathResult {
  let currentId = tree.start;
  const steps: PathStep[] = [];

  for (const answerId of ids) {
    const node = tree.nodes[currentId];
    if (!node || node.type !== "question") {
      return { ok: false };
    }

    const answer = node.answers.find((a) => a.id === answerId);
    if (!answer) {
      return { ok: false };
    }

    steps.push({
      questionId: currentId,
      answerId,
      prompt: node.prompt,
      answerLabel: answer.label,
    });
    currentId = answer.next;
  }

  if (!tree.nodes[currentId]) {
    return { ok: false };
  }

  return { ok: true, currentId, answerIds: ids, steps };
}

/**
 * Number of question nodes on the longest path from `nodeId`,
 * including the current question and excluding the outcome.
 */
export function longestQuestionCount(
  tree: DecisionTree,
  nodeId: string,
): number {
  const node = tree.nodes[nodeId];
  if (!node) {
    return 0;
  }
  if (node.type === "outcome") {
    return 0;
  }

  let maxChild = 0;
  for (const answer of node.answers) {
    maxChild = Math.max(maxChild, longestQuestionCount(tree, answer.next));
  }
  return 1 + maxChild;
}
