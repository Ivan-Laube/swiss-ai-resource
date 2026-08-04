/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB: D1Database;
  SURVEY_RATE_LIMITER: {
    limit: (options: { key: string }) => Promise<{ success: boolean }>;
  };
  TURNSTILE_SECRET_KEY: string;
  SITE_ORIGIN: string;
  GITHUB_TOKEN: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH: string;
  GITHUB_AGGREGATES_PATH: string;
}
