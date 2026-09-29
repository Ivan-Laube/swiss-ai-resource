import { validateScannerChecks } from "../src/scanner/load";
import { isPrivateOrLocalIp } from "../workers/scanner/src/url-guard";

const mustBlock = [
  "127.0.0.1",
  "10.0.0.1",
  "192.168.1.1",
  "172.16.0.1",
  "169.254.169.254",
  "100.64.0.1",
  "192.0.0.1",
  "192.0.2.1",
  "198.18.0.1",
  "198.51.100.1",
  "203.0.113.1",
  "224.0.0.1",
  "240.0.0.1",
  "255.255.255.255",
  "::1",
  "fc00::1",
  "fe80::1",
  "ff02::1",
  "::ffff:127.0.0.1",
  "64:ff9b::7f00:1",
  "2002:7f00:1::",
  "2001:0:4136:e378::",
  "2001:db8::1",
  "100::1",
];

const mustAllow = ["8.8.8.8", "1.1.1.1", "2001:4860:4860::8888"];

try {
  const count = validateScannerChecks();
  console.log(
    `Scanner checks check passed (${count} check${count === 1 ? "" : "s"}).`,
  );

  for (const ip of mustBlock) {
    if (!isPrivateOrLocalIp(ip)) {
      throw new Error(`Expected blocked IP passed guard: ${ip}`);
    }
  }
  for (const ip of mustAllow) {
    if (isPrivateOrLocalIp(ip)) {
      throw new Error(`Expected public IP blocked: ${ip}`);
    }
  }
  console.log(
    `SSRF IP guard check passed (${mustBlock.length} blocked, ${mustAllow.length} allowed).`,
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
