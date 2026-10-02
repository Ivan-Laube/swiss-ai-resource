import { loadReadinessCheck } from "../src/readiness/load";

try {
  const { check, warnings } = loadReadinessCheck();
  for (const warning of warnings) {
    console.warn(`warning: ${warning}`);
  }
  const pending = [...check.questions, ...check.security.questions].reduce(
    (n, q) => n + q.pending_links.length,
    0,
  );
  console.log(
    `Readiness check passed (v${check.version}, ${check.status}: ${check.questions.length} questions + ${check.security.questions.length} security, ${pending} pending link${pending === 1 ? "" : "s"}).`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
