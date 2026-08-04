import { validateRules } from "../src/rules/load";

try {
  const count = validateRules();
  console.log(
    `Rules check passed (${count} tree${count === 1 ? "" : "s"}).`,
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
