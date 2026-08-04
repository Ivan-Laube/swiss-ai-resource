import { validateScannerChecks } from "../src/scanner/load";

try {
  const count = validateScannerChecks();
  console.log(
    `Scanner checks check passed (${count} check${count === 1 ? "" : "s"}).`,
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
