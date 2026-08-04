export interface GitHubFileTarget {
  token: string;
  repository: string;
  branch: string;
  path: string;
}

export type GitHubWriteResult = "created" | "updated" | "unchanged";

interface GitHubFile {
  sha: string;
  content: string;
  encoding: "base64";
}

const API_VERSION = "2026-03-10";

function apiHeaders(token: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": API_VERSION,
  };
}

function contentUrl(target: GitHubFileTarget): string {
  const repository = target.repository
    .split("/")
    .map(encodeURIComponent)
    .join("/");
  const path = target.path.split("/").map(encodeURIComponent).join("/");
  return `https://api.github.com/repos/${repository}/contents/${path}`;
}

function utf8ToBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToUtf8(value: string): string {
  const binary = atob(value.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function errorMessage(response: Response): Promise<string> {
  const body = (await response.json().catch(() => null)) as {
    message?: unknown;
  } | null;
  return typeof body?.message === "string"
    ? body.message
    : `HTTP ${response.status}`;
}

async function getFile(
  target: GitHubFileTarget,
): Promise<{ sha: string; content: string } | null> {
  const url = new URL(contentUrl(target));
  url.searchParams.set("ref", target.branch);
  const response = await fetch(url, {
    headers: apiHeaders(target.token),
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`GitHub file read failed: ${await errorMessage(response)}`);
  }

  const body = (await response.json()) as Partial<GitHubFile>;
  if (
    typeof body.sha !== "string" ||
    typeof body.content !== "string" ||
    body.encoding !== "base64"
  ) {
    throw new Error("GitHub file read returned an unexpected response");
  }
  return { sha: body.sha, content: base64ToUtf8(body.content) };
}

function comparableAggregateJson(value: string): string {
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    return JSON.stringify({ ...parsed, generated_at: null });
  } catch {
    return value;
  }
}

export async function writeGitHubFile(
  target: GitHubFileTarget,
  content: string,
): Promise<GitHubWriteResult> {
  const existing = await getFile(target);
  if (
    existing &&
    comparableAggregateJson(existing.content) === comparableAggregateJson(content)
  ) {
    return "unchanged";
  }

  const body = {
    message: "chore(survey): refresh anonymized aggregates",
    content: utf8ToBase64(content),
    branch: target.branch,
    ...(existing ? { sha: existing.sha } : {}),
  };
  const response = await fetch(contentUrl(target), {
    method: "PUT",
    headers: {
      ...apiHeaders(target.token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`GitHub file write failed: ${await errorMessage(response)}`);
  }
  return existing ? "updated" : "created";
}
