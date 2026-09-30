import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Zod must come from src/lib/zod.ts (jitless: true). Plain "zod" probes
  // eval on first parse, which our CSP blocks and reports as a violation.
  {
    files: ["src/**/*.{ts,tsx}", "workers/**/*.ts", "scripts/**/*.ts"],
    ignores: ["src/lib/zod.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "zod",
              message: 'Import { z } from "@/lib/zod" (sets jitless for the CSP).',
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Wrangler local build artifacts (not source):
    ".wrangler/**",
    "workers/**/.wrangler/**",
    // Playwright e2e (fixture `use` is not React):
    "e2e/**",
    "out-e2e/**",
    "out-e2e-unconfigured/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
