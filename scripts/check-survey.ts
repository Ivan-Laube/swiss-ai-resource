import { validateSurvey } from "../src/survey/load";

try {
  const count = validateSurvey();
  console.log(
    `Survey check passed (${count} question${count === 1 ? "" : "s"}).`,
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
