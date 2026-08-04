/// <reference types="@cloudflare/workers-types" />

export interface Env {
  SCANNER_RATE_LIMITER: {
    limit: (options: { key: string }) => Promise<{ success: boolean }>;
  };
  SITE_ORIGIN: string;
}
