import { validateVendors } from "../src/vendors/load";

try {
  const count = validateVendors();
  console.log(
    `Vendors check passed (${count} vendor${count === 1 ? "" : "s"}).`,
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
