/// <reference types="@cloudflare/workers-types" />

export interface Env {
  SCANNER_RATE_LIMITER: {
    limit: (options: { key: string }) => Promise<{ success: boolean }>;
  };
  SITE_ORIGIN: string;
  /** Anonymous usage counter; absent in local dev. */
  USAGE?: AnalyticsEngineDataset;
  TURNSTILE_SECRET_KEY: string;
}
