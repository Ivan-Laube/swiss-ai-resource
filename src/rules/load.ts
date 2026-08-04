import fs from "node:fs";
import path from "node:path";

import { listPublishableContentSlugs } from "@/content";

import {
  parseDecisionTree,
  type DecisionTree,
  type LocalizedString,
  type QuestionNode,
} from "./schema";

const REQUIRED_LOCALES = ["en", "fr", "it"] as const;

const RULES_DIR = path.join(process.cwd(), "data", "rules");

function formatZodError(error: unknown, context: string): Error {
  if (
    error &&
    typeof error === "object" &&
    "issues" in error &&
    Array.isArray((error as { issues: unknown }).issues)
  ) {
    const issues = (
      error as {
        issues: Array<{ path: PropertyKey[]; message: string }>;
      }
    ).issues;
    const details = issues
      .map((issue) => {
        const field = issue.path.length > 0 ? issue.path.join(".") : "(root)";
        return `  - ${field}: ${issue.message}`;
      })
      .join("\n");
    return new Error(`Invalid decision tree (${context}):\n${details}`);
  }

  if (error instanceof Error) {
    return new Error(`Invalid decision tree (${context}): ${error.message}`);
  }

  return new Error(`Invalid decision tree (${context})`);
}

function assertAnswerIdsUnique(tree: DecisionTree, filePath: string): void {
  for (const [nodeId, node] of Object.entries(tree.nodes)) {
    if (node.type !== "question") {
      continue;
    }
    const seen = new Set<string>();
    for (const answer of node.answers) {
      if (seen.has(answer.id)) {
        throw new Error(
          `Invalid decision tree (${filePath}): question "${nodeId}" has duplicate answer id "${answer.id}"`,
        );
      }
      seen.add(answer.id);
    }
  }
}

function assertGraph(tree: DecisionTree, filePath: string): void {
  const { nodes, start } = tree;
  const startNode = nodes[start];

  if (!startNode) {
    throw new Error(
      `Invalid decision tree (${filePath}): start "${start}" does not exist in nodes`,
    );
  }
  if (startNode.type !== "question") {
    throw new Error(
      `Invalid decision tree (${filePath}): start "${start}" must be a question node`,
    );
  }

  for (const [nodeId, node] of Object.entries(nodes)) {
    if (node.type !== "question") {
      continue;
    }
    for (const answer of node.answers) {
      if (!nodes[answer.next]) {
        throw new Error(
          `Invalid decision tree (${filePath}): question "${nodeId}" answer "${answer.id}" targets unknown node "${answer.next}"`,
        );
      }
    }
  }

  const reachable = new Set<string>();
  const visiting = new Set<string>();

  function walk(nodeId: string): void {
    if (visiting.has(nodeId)) {
      throw new Error(
        `Invalid decision tree (${filePath}): cycle detected at node "${nodeId}"`,
      );
    }
    if (reachable.has(nodeId)) {
      return;
    }

    visiting.add(nodeId);
    reachable.add(nodeId);

    const node = nodes[nodeId];
    if (node.type === "question") {
      for (const answer of (node as QuestionNode).answers) {
        walk(answer.next);
      }
    }

    visiting.delete(nodeId);
  }

  walk(start);

  for (const nodeId of Object.keys(nodes)) {
    if (!reachable.has(nodeId)) {
      throw new Error(
        `Invalid decision tree (${filePath}): node "${nodeId}" is not reachable from start`,
      );
    }
  }

  for (const [nodeId, node] of Object.entries(nodes)) {
    if (node.type === "question" && node.answers.length === 0) {
      throw new Error(
        `Invalid decision tree (${filePath}): question "${nodeId}" has no answers (leaf must be an outcome)`,
      );
    }
  }
}

function assertRelatedPages(tree: DecisionTree, filePath: string): void {
  const publishable = new Set(listPublishableContentSlugs("de"));

  for (const [nodeId, node] of Object.entries(tree.nodes)) {
    if (node.type !== "outcome") {
      continue;
    }
    for (const slug of node.related_pages) {
      if (!publishable.has(slug)) {
        throw new Error(
          `Invalid decision tree (${filePath}): outcome "${nodeId}" related_pages references unknown DE content slug "${slug}"`,
        );
      }
    }
  }
}

function missingLocales(value: LocalizedString): string[] {
  return REQUIRED_LOCALES.filter((locale) => {
    const text = value[locale];
    return typeof text !== "string" || text.trim().length === 0;
  });
}

function assertLocalizedComplete(
  value: LocalizedString,
  filePath: string,
  pathLabel: string,
): void {
  const missing = missingLocales(value);
  if (missing.length > 0) {
    throw new Error(
      `Invalid decision tree (${filePath}): ${pathLabel} missing locale(s): ${missing.join(", ")}`,
    );
  }
}

/** Launch tools must ship DE + EN + FR + IT on every LocalizedString (T14). */
function assertFullLocales(tree: DecisionTree, filePath: string): void {
  assertLocalizedComplete(tree.title, filePath, "title");
  assertLocalizedComplete(tree.description, filePath, "description");

  for (const [nodeId, node] of Object.entries(tree.nodes)) {
    if (node.type === "question") {
      assertLocalizedComplete(node.prompt, filePath, `nodes.${nodeId}.prompt`);
      if (node.help) {
        assertLocalizedComplete(node.help, filePath, `nodes.${nodeId}.help`);
      }
      for (const answer of node.answers) {
        assertLocalizedComplete(
          answer.label,
          filePath,
          `nodes.${nodeId}.answers.${answer.id}.label`,
        );
      }
      continue;
    }

    assertLocalizedComplete(node.summary, filePath, `nodes.${nodeId}.summary`);
    node.caveats.forEach((caveat, index) => {
      assertLocalizedComplete(
        caveat,
        filePath,
        `nodes.${nodeId}.caveats[${index}]`,
      );
    });
  }
}

function ruleFilePath(id: string): string {
  return path.join(RULES_DIR, `${id}.json`);
}

/** List kebab-case rule ids from data/rules/*.json (sorted). */
export function listRuleIds(): string[] {
  if (!fs.existsSync(RULES_DIR)) {
    return [];
  }

  return fs
    .readdirSync(RULES_DIR)
    .filter((name) => name.endsWith(".json"))
    .map((name) => name.slice(0, -".json".length))
    .sort();
}

/** Load and validate a single decision tree. Throws on invalid shape or graph. */
export function getRule(id: string): DecisionTree {
  const filePath = ruleFilePath(id);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Decision tree not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf8");
  let data: unknown;
  try {
    data = JSON.parse(raw) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON in ${filePath}: ${message}`);
  }

  let tree: DecisionTree;
  try {
    tree = parseDecisionTree(data);
  } catch (error) {
    throw formatZodError(error, filePath);
  }

  if (tree.id !== id) {
    throw new Error(
      `Invalid decision tree (${filePath}): id "${tree.id}" must match filename stem "${id}"`,
    );
  }

  assertAnswerIdsUnique(tree, filePath);
  assertGraph(tree, filePath);
  assertRelatedPages(tree, filePath);
  assertFullLocales(tree, filePath);

  return tree;
}

/** Load every tree under data/rules/. */
export function getAllRules(): DecisionTree[] {
  return listRuleIds().map((id) => getRule(id));
}

/** Validate all decision trees. Returns tree count. */
export function validateRules(): number {
  return getAllRules().length;
}
