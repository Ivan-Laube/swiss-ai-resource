// Ad-hoc smoke test for the local survey Worker (T23). Not part of CI.
// Usage: node workers/survey/smoke-test.mjs [baseUrl]
const base = process.argv[2] ?? "http://127.0.0.1:8787";
const origin = "https://aicompliant.ch";

const validAnswers = {
  "company-size": "10-49",
  sector: "ict-software",
  "language-region": "german-speaking",
  "ai-maturity": "piloting",
  "ai-tools": ["chatgpt", "deepl"],
  "primary-use-cases": ["translation"],
  "monthly-spend-chf": "1-500",
  "hosting-requirement": "switzerland",
  "personal-data-in-ai": "no",
  "eu-market-exposure": "no",
  "deployment-blockers": ["none"],
  "vendor-decision-factors": ["swiss-entity-support"],
};

function payload(overrides = {}) {
  return {
    survey_id: "swiss-ai-adoption-2026",
    survey_version: 2,
    locale: "de",
    answers: validAnswers,
    email: "bench@example.com",
    report_opt_in: true,
    website: "",
    turnstile_token: "XXXX.DUMMY.TOKEN.XXXX",
    ...overrides,
  };
}

async function post(body) {
  const res = await fetch(`${base}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return { status: res.status, text, headers: res.headers };
}

let failures = 0;
function check(name, cond, detail) {
  const mark = cond ? "PASS" : "FAIL";
  if (!cond) failures++;
  console.log(`[${mark}] ${name}${detail ? ` — ${detail}` : ""}`);
}

// 1. Valid submit
const ok = await post(payload());
check("valid submit -> 201", ok.status === 201, `status ${ok.status} ${ok.text}`);

// 2. Honeypot filled -> 204, no body
const hp = await post(payload({ website: "http://spam.example" }));
check("honeypot -> 204", hp.status === 204, `status ${hp.status}`);

// 3. Bad answer option -> 400
const bad = await post(payload({ answers: { ...validAnswers, "company-size": "nope" } }));
check("bad answer -> 400", bad.status === 400, `status ${bad.status} ${bad.text}`);

// 4. Wrong version -> 400
const ver = await post(payload({ survey_version: 999 }));
check("wrong version -> 400", ver.status === 400, `status ${ver.status} ${ver.text}`);

// 5. Exclusive none violation -> 400
const excl = await post(payload({ answers: { ...validAnswers, "ai-tools": ["chatgpt", "none"] } }));
check("exclusive none -> 400", excl.status === 400, `status ${excl.status} ${excl.text}`);

// 6. OPTIONS preflight CORS
const opt = await fetch(`${base}/submit`, { method: "OPTIONS", headers: { Origin: origin } });
check(
  "OPTIONS -> 204 + CORS origin",
  opt.status === 204 && opt.headers.get("access-control-allow-origin") === origin,
  `status ${opt.status} allow-origin ${opt.headers.get("access-control-allow-origin")}`,
);

// 6b. Origin enforcement (missing / wrong → 403, no CORS headers)
const noOrigin = await fetch(`${base}/submit`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload()),
});
check(
  "POST without Origin -> 403",
  noOrigin.status === 403 && !noOrigin.headers.get("access-control-allow-origin"),
  `status ${noOrigin.status} allow-origin ${noOrigin.headers.get("access-control-allow-origin")}`,
);

const badOrigin = await fetch(`${base}/submit`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Origin: "https://evil.example",
  },
  body: JSON.stringify(payload()),
});
check(
  "POST wrong Origin -> 403",
  badOrigin.status === 403 && !badOrigin.headers.get("access-control-allow-origin"),
  `status ${badOrigin.status} allow-origin ${badOrigin.headers.get("access-control-allow-origin")}`,
);

// 7. Unknown route -> 404
const nf = await fetch(`${base}/nope`, { method: "GET", headers: { Origin: origin } });
check("unknown route -> 404", nf.status === 404, `status ${nf.status}`);

// 8. Rate limit -> 429 within burst (limit 5/60s per IP; all localhost -> same key)
let got429 = false;
for (let i = 0; i < 10; i++) {
  const r = await post(payload());
  if (r.status === 429) {
    got429 = true;
    break;
  }
}
check("burst -> 429", got429, got429 ? "" : "no 429 seen (rate limiter may be permissive locally)");

console.log(failures === 0 ? "\nALL SMOKE CHECKS PASSED" : `\n${failures} SMOKE CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
