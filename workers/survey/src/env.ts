/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB: D1Database;
  SURVEY_RATE_LIMITER: {
    limit: (options: { key: string }) => Promise<{ success: boolean }>;
  };
  TURNSTILE_SECRET_KEY: string;
  /** HMAC key for the daily per-IP quota hash (store.ts); missing → 500. */
  IP_HASH_SECRET: string;
  SITE_ORIGIN: string;
  /** Anonymous usage counter; absent in local dev. */
  USAGE?: AnalyticsEngineDataset;
  GITHUB_TOKEN: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH: string;
  GITHUB_AGGREGATES_PATH: string;
}
