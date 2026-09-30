/**
 * Project-wide Zod entry point: import `z` from here, not from "zod".
 *
 * `jitless: true` stops Zod 4 from probing for eval support with
 * `Function("")` on first parse. Our pages run under a strict CSP without
 * 'unsafe-eval', so the probe was blocked and logged a CSP violation on
 * every page that parses in the browser (survey, website-check, vendors).
 * Zod already fell back to its non-JIT path, so behaviour is unchanged.
 */
import { z } from "zod";

z.config({ jitless: true });

export { z };
