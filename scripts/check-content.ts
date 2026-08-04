import { validateAllContent } from "../src/content/load";

try {
  const count = validateAllContent();
  console.log(`Content check passed (${count} page${count === 1 ? "" : "s"}).`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
