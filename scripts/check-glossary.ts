import { validateGlossary } from "../src/glossary/load";

try {
  const count = validateGlossary();
  console.log(
    `Glossary check passed (${count} term${count === 1 ? "" : "s"}).`,
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
