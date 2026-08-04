import { validateSources } from "../src/sources/load";

try {
  const count = validateSources();
  console.log(
    `Sources check passed (${count} source${count === 1 ? "" : "s"}).`,
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
