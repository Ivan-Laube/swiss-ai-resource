// Ad-hoc smoke test for the local scanner Worker (T33–T35). Not part of CI.
// Usage: node workers/scanner/smoke-test.mjs [baseUrl]
// Local CORS override: npx wrangler dev -c workers/scanner/wrangler.jsonc --var SITE_ORIGIN:http://localhost:3000
const base = process.argv[2] ?? "http://127.0.0.1:8787";
const origin = "https://aicompliant.ch";
const FINDING_STATUSES = new Set(["found", "not_found", "indeterminate"]);

async function post(body, raw) {
  const res = await fetch(`${base}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: raw ?? JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // leave json null
  }
  return { status: res.status, text, json, headers: res.headers };
}

/** POST once; on 429 wait for the local 60s limiter window and retry once. */
async function postAllowingRateLimit(body, raw) {
  const first = await post(body, raw);
  if (first.status !== 429) return first;
  console.log("  (rate limited — waiting 65s for limiter window)");
  await new Promise((r) => setTimeout(r, 65_000));
  return post(body, raw);
}

let failures = 0;
function check(name, cond, detail) {
  const mark = cond ? "PASS" : "FAIL";
  if (!cond) failures++;
  console.log(`[${mark}] ${name}${detail ? ` — ${detail}` : ""}`);
}

// --- T34 URL guards first (before burning the 5/60s budget on other cases) ---

const ftp = await postAllowingRateLimit({ url: "ftp://example.com/" });
check(
  "ftp scheme -> 400",
  ftp.status === 400 && typeof ftp.json?.error === "string",
  `status ${ftp.status} ${ftp.text}`,
);

const fileScheme = await postAllowingRateLimit({ url: "file:///etc/passwd" });
check(
  "file scheme -> 400",
  fileScheme.status === 400 && typeof fileScheme.json?.error === "string",
  `status ${fileScheme.status} ${fileScheme.text}`,
);

const loopback = await postAllowingRateLimit({ url: "http://127.0.0.1/" });
check(
  "127.0.0.1 -> 400",
  loopback.status === 400 && typeof loopback.json?.error === "string",
  `status ${loopback.status} ${loopback.text}`,
);

const localhost = await postAllowingRateLimit({ url: "http://localhost/" });
check(
  "localhost -> 400",
  localhost.status === 400 && typeof localhost.json?.error === "string",
  `status ${localhost.status} ${localhost.text}`,
);

const ipv6Loop = await postAllowingRateLimit({ url: "http://[::1]/" });
check(
  "[::1] -> 400",
  ipv6Loop.status === 400 && typeof ipv6Loop.json?.error === "string",
  `status ${ipv6Loop.status} ${ipv6Loop.text}`,
);

const rfc1918 = await postAllowingRateLimit({ url: "http://192.168.1.1/" });
check(
  "192.168.1.1 -> 400",
  rfc1918.status === 400 && typeof rfc1918.json?.error === "string",
  `status ${rfc1918.status} ${rfc1918.text}`,
);

// --- Body / routing (T33) ---

const missing = await postAllowingRateLimit({});
check("missing url -> 400", missing.status === 400, `status ${missing.status} ${missing.text}`);

const badJson = await postAllowingRateLimit(undefined, "{not-json");
check("invalid JSON -> 400", badJson.status === 400, `status ${badJson.status} ${badJson.text}`);

const opt = await fetch(`${base}/scan`, { method: "OPTIONS", headers: { Origin: origin } });
check(
  "OPTIONS -> 204 + CORS origin",
  opt.status === 204 && opt.headers.get("access-control-allow-origin") === origin,
  `status ${opt.status} allow-origin ${opt.headers.get("access-control-allow-origin")}`,
);

const nf = await fetch(`${base}/scan`, { method: "GET", headers: { Origin: origin } });
check("GET /scan -> 404", nf.status === 404, `status ${nf.status}`);
const nope = await fetch(`${base}/nope`, { method: "GET", headers: { Origin: origin } });
check("unknown route -> 404", nope.status === 404, `status ${nope.status}`);

// Valid public fetch + heuristic findings (T35)
const ok = await postAllowingRateLimit({ url: "https://example.com" });
const findings = Array.isArray(ok.json?.findings) ? ok.json.findings : [];
const httpsFinding = findings.find((f) => f?.id === "https");
const allStatusesOk = findings.every(
  (f) => f && typeof f.id === "string" && FINDING_STATUSES.has(f.status),
);
// example.com is reachable over HTTPS but serves plain HTTP without redirecting,
// so tls status is not_found with https:true / http_redirects_to_https:false.
check(
  "valid scan -> 200 findings (no stub)",
  ok.status === 200 &&
    ok.json?.ok === true &&
    ok.json?.stub !== true &&
    typeof ok.json?.url === "string" &&
    typeof ok.json?.finalUrl === "string" &&
    typeof ok.json?.status === "number" &&
    typeof ok.json?.byteLength === "number" &&
    ok.json.byteLength > 0 &&
    ok.json?.checks_version === 1 &&
    findings.length === 7 &&
    allStatusesOk &&
    typeof ok.json?.static_scan_incomplete === "boolean" &&
    httpsFinding?.evidence?.https === true &&
    FINDING_STATUSES.has(httpsFinding?.status),
  `status ${ok.status} findings=${findings.length} https=${httpsFinding?.status} evidence=${JSON.stringify(httpsFinding?.evidence)} ${ok.text?.slice?.(0, 200) ?? ok.text}`,
);

// Rate limit soft check last (limit 5/60s per IP)
let got429 = false;
for (let i = 0; i < 10; i++) {
  const r = await post({ url: "https://example.com" });
  if (r.status === 429) {
    got429 = true;
    break;
  }
}
if (got429) {
  console.log("[PASS] burst -> 429");
} else {
  console.log("[WARN] burst -> 429 — no 429 seen (rate limiter may be permissive locally)");
}

console.log(failures === 0 ? "\nALL SMOKE CHECKS PASSED" : `\n${failures} SMOKE CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
