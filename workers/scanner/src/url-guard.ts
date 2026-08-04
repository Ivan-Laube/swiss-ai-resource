/** SSRF guards for scanner target URLs (T34). */

const DOH_ENDPOINT = "https://cloudflare-dns.com/dns-query";

export type SafeUrlResult =
  | { ok: true; url: URL }
  | { ok: false; error: string };

/**
 * Returns true for loopback, private, link-local, CGNAT, ULA, metadata,
 * multicast, and unspecified addresses (IPv4 and IPv6).
 */
export function isPrivateOrLocalIp(ip: string): boolean {
  const trimmed = ip.trim().toLowerCase();
  if (trimmed.includes(":")) {
    return isPrivateOrLocalIpv6(trimmed);
  }
  return isPrivateOrLocalIpv4(trimmed);
}

function isPrivateOrLocalIpv4(ip: string): boolean {
  const parts = ip.split(".");
  if (parts.length !== 4) {
    return true; // unparseable → fail closed
  }
  const octets = parts.map((p) => Number(p));
  if (octets.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return true;
  }
  const [a, b] = octets;

  // 0.0.0.0/8
  if (a === 0) return true;
  // 10.0.0.0/8
  if (a === 10) return true;
  // 127.0.0.0/8
  if (a === 127) return true;
  // 169.254.0.0/16 (link-local / cloud metadata)
  if (a === 169 && b === 254) return true;
  // 172.16.0.0/12
  if (a === 172 && b >= 16 && b <= 31) return true;
  // 192.168.0.0/16
  if (a === 192 && b === 168) return true;
  // 100.64.0.0/10 (CGNAT)
  if (a === 100 && b >= 64 && b <= 127) return true;
  // 255.255.255.255 broadcast
  if (octets.every((n) => n === 255)) return true;

  return false;
}

function parseIpv6Groups(ip: string): number[] | null {
  // Strip zone id (fe80::1%eth0)
  const bare = ip.split("%")[0] ?? ip;
  // IPv4-mapped / IPv4-compatible: ::ffff:192.0.2.1 or ::192.0.2.1
  const v4Tail = bare.match(/^(.*:)(\d{1,3}(?:\.\d{1,3}){3})$/);
  let head = bare;
  let v4Octets: number[] | null = null;
  if (v4Tail) {
    head = v4Tail[1]!;
    const octets = v4Tail[2]!.split(".").map((p) => Number(p));
    if (octets.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
      return null;
    }
    v4Octets = octets;
  }

  if ((head.match(/::/g) ?? []).length > 1) {
    return null;
  }

  let groups: string[];
  if (head.includes("::")) {
    const [left, right] = head.split("::");
    const leftParts = left === "" ? [] : left.split(":").filter(Boolean);
    const rightParts = right === "" ? [] : right.split(":").filter(Boolean);
    const missing = 8 - leftParts.length - rightParts.length - (v4Octets ? 2 : 0);
    if (missing < 0) return null;
    groups = [...leftParts, ...Array(missing).fill("0"), ...rightParts];
  } else {
    groups = head.split(":").filter((g) => g.length > 0);
  }

  if (v4Octets) {
    groups.push(
      ((v4Octets[0]! << 8) | v4Octets[1]!).toString(16),
      ((v4Octets[2]! << 8) | v4Octets[3]!).toString(16),
    );
  }

  if (groups.length !== 8) return null;

  const nums: number[] = [];
  for (const g of groups) {
    if (!/^[0-9a-f]{1,4}$/i.test(g)) return null;
    nums.push(parseInt(g, 16));
  }
  return nums;
}

function isPrivateOrLocalIpv6(ip: string): boolean {
  const groups = parseIpv6Groups(ip);
  if (!groups) return true; // unparseable → fail closed

  // :: and ::1
  const allZero = groups.every((g) => g === 0);
  if (allZero) return true;
  if (groups.slice(0, 7).every((g) => g === 0) && groups[7] === 1) return true;

  // IPv4-mapped :ffff:x.x.x.x → check embedded IPv4
  if (
    groups[0] === 0 &&
    groups[1] === 0 &&
    groups[2] === 0 &&
    groups[3] === 0 &&
    groups[4] === 0 &&
    groups[5] === 0xffff
  ) {
    const a = (groups[6]! >> 8) & 0xff;
    const b = groups[6]! & 0xff;
    const c = (groups[7]! >> 8) & 0xff;
    const d = groups[7]! & 0xff;
    return isPrivateOrLocalIpv4(`${a}.${b}.${c}.${d}`);
  }

  // ULA fc00::/7
  if ((groups[0]! & 0xfe00) === 0xfc00) return true;
  // Link-local fe80::/10
  if ((groups[0]! & 0xffc0) === 0xfe80) return true;
  // Multicast ff00::/8
  if ((groups[0]! & 0xff00) === 0xff00) return true;

  return false;
}

function normalizeHostname(hostname: string): string {
  let host = hostname.trim().toLowerCase();
  // URL.hostname for IPv6 is without brackets
  while (host.endsWith(".")) {
    host = host.slice(0, -1);
  }
  return host;
}

function isBlockedHostname(hostname: string): boolean {
  if (hostname === "localhost") return true;
  if (hostname.endsWith(".localhost")) return true;
  return false;
}

function isLiteralIp(hostname: string): boolean {
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) return true;
  // IPv6 hostnames from URL are unbracketed
  if (hostname.includes(":")) return true;
  return false;
}

type DohAnswer = { data?: string; type?: number };

async function resolveViaDoh(hostname: string): Promise<string[]> {
  const ips: string[] = [];

  for (const type of ["A", "AAAA"] as const) {
    const url = `${DOH_ENDPOINT}?name=${encodeURIComponent(hostname)}&type=${type}`;
    const res = await fetch(url, {
      headers: { Accept: "application/dns-json" },
    });
    if (!res.ok) {
      throw new Error(`DoH lookup failed (${res.status})`);
    }
    const json = (await res.json()) as {
      Status?: number;
      Answer?: DohAnswer[];
    };
    // Status 0 = NOERROR; 3 = NXDOMAIN (no answers is fine)
    if (json.Status !== undefined && json.Status !== 0 && json.Status !== 3) {
      throw new Error(`DoH lookup status ${json.Status}`);
    }
    for (const ans of json.Answer ?? []) {
      if (typeof ans.data === "string" && ans.data.length > 0) {
        // A records: dotted quad; AAAA: colon hex. CNAME answers may appear — skip non-IP.
        const data = ans.data.trim();
        if (isLiteralIp(data) || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(data)) {
          ips.push(data);
        } else if (data.includes(":") && !data.includes(" ")) {
          ips.push(data);
        }
      }
    }
  }

  return ips;
}

/**
 * Validate a scan target URL: http(s) only, no userinfo, no localhost/private IPs.
 * Non-literal hosts are resolved via Cloudflare DoH and every answer must be public.
 */
export async function assertSafeScanUrl(raw: string): Promise<SafeUrlResult> {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return { ok: false, error: "url is not a valid URL" };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Only http/https URLs are allowed" };
  }

  if (parsed.username !== "" || parsed.password !== "") {
    return { ok: false, error: "URLs with credentials are not allowed" };
  }

  const hostname = normalizeHostname(parsed.hostname);
  if (hostname.length === 0) {
    return { ok: false, error: "url must include a hostname" };
  }

  if (isBlockedHostname(hostname)) {
    return { ok: false, error: "URL targets a private or local address" };
  }

  if (isLiteralIp(hostname)) {
    if (isPrivateOrLocalIp(hostname)) {
      return { ok: false, error: "URL targets a private or local address" };
    }
    // Rewrite hostname onto a normalized URL (keeps path/query)
    const safe = new URL(parsed.href);
    return { ok: true, url: safe };
  }

  let resolved: string[];
  try {
    resolved = await resolveViaDoh(hostname);
  } catch {
    return { ok: false, error: "Could not resolve hostname for safety check" };
  }

  if (resolved.length === 0) {
    return { ok: false, error: "Hostname did not resolve to any address" };
  }

  for (const ip of resolved) {
    if (isPrivateOrLocalIp(ip)) {
      return { ok: false, error: "URL targets a private or local address" };
    }
  }

  return { ok: true, url: parsed };
}
