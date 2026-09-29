import { readFileSync } from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";

/**
 * wrangler pages dev silently drops CSP lines over 2000 chars (hashed
 * script-src from postbuild). Assert the built _headers still allow the
 * scanner API + Turnstile hosts so a CSP regression fails CI even when
 * the runtime header is truncated locally.
 */
test.describe("e2e build headers", () => {
  test("out-e2e/_headers allow scan API and Turnstile", () => {
    const headersPath = path.join(process.cwd(), "out-e2e", "_headers");
    const raw = readFileSync(headersPath, "utf8");
    const cspLine = raw
      .split(/\r?\n/)
      .find((line) => /^\s*Content-Security-Policy:/i.test(line));
    expect(cspLine, "Content-Security-Policy header missing").toBeTruthy();

    const csp = cspLine!;
    expect(csp).toMatch(/connect-src[^;]*https:\/\/api\.aicompliant\.ch/);
    expect(csp).toMatch(
      /connect-src[^;]*https:\/\/challenges\.cloudflare\.com/,
    );
    expect(csp).toMatch(
      /script-src[^;]*https:\/\/challenges\.cloudflare\.com/,
    );
    expect(csp).toMatch(
      /frame-src[^;]*https:\/\/challenges\.cloudflare\.com/,
    );
  });
});
