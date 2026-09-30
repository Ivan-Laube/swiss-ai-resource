/**
 * R51: WCAG AA contrast check for design-system §5.1 token pairs.
 * Values mirror src/app/globals.css (light :root + prefers-color-scheme dark).
 */

type Rgb = { r: number; g: number; b: number; a: number };

type ThemeTokens = {
  bg: Rgb;
  surface: Rgb;
  text: Rgb;
  textMuted: Rgb;
  textSubtle: Rgb;
  primary: Rgb;
  onPrimary: Rgb;
  accent: Rgb;
  status: Record<
    "success" | "warning" | "danger" | "info" | "neutral",
    { fg: Rgb; bg: Rgb }
  >;
};

const AA_NORMAL = 4.5;

function hex(hexColor: string): Rgb {
  const h = hexColor.replace("#", "");
  if (h.length !== 6) {
    throw new Error(`Expected #RRGGBB, got ${hexColor}`);
  }
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
    a: 1,
  };
}

function rgba(r: number, g: number, b: number, a: number): Rgb {
  return { r, g, b, a };
}

/** Alpha-composite `fg` over opaque `bg`. */
function blend(fg: Rgb, bg: Rgb): Rgb {
  const a = fg.a;
  return {
    r: Math.round(fg.r * a + bg.r * (1 - a)),
    g: Math.round(fg.g * a + bg.g * (1 - a)),
    b: Math.round(fg.b * a + bg.b * (1 - a)),
    a: 1,
  };
}

function srgbChannel(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(color: Rgb): number {
  const opaque = color.a < 1 ? blend(color, { r: 255, g: 255, b: 255, a: 1 }) : color;
  const R = srgbChannel(opaque.r);
  const G = srgbChannel(opaque.g);
  const B = srgbChannel(opaque.b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(fg: Rgb, bg: Rgb): number {
  const composedFg = fg.a < 1 ? blend(fg, bg) : fg;
  const composedBg = bg.a < 1 ? blend(bg, { r: 255, g: 255, b: 255, a: 1 }) : bg;
  const L1 = relativeLuminance(composedFg);
  const L2 = relativeLuminance(composedBg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

const light: ThemeTokens = {
  bg: hex("#f8fafc"),
  surface: hex("#ffffff"),
  text: hex("#0f172a"),
  textMuted: hex("#475569"),
  textSubtle: hex("#64748b"),
  primary: hex("#0f172a"),
  onPrimary: hex("#ffffff"),
  accent: hex("#dc2626"),
  status: {
    success: { fg: hex("#065f46"), bg: hex("#ecfdf5") },
    warning: { fg: hex("#92400e"), bg: hex("#fffbeb") },
    danger: { fg: hex("#991b1b"), bg: hex("#fef2f2") },
    info: { fg: hex("#1e40af"), bg: hex("#eff6ff") },
    neutral: { fg: hex("#334155"), bg: hex("#f1f5f9") },
  },
};

const dark: ThemeTokens = {
  bg: hex("#0b1220"),
  surface: hex("#0f172a"),
  text: hex("#f1f5f9"),
  textMuted: hex("#cbd5e1"),
  textSubtle: hex("#94a3b8"),
  primary: hex("#f1f5f9"),
  onPrimary: hex("#0f172a"),
  accent: hex("#ef4444"),
  status: {
    success: { fg: hex("#6ee7b7"), bg: rgba(110, 231, 183, 0.12) },
    warning: { fg: hex("#fcd34d"), bg: rgba(252, 211, 77, 0.12) },
    danger: { fg: hex("#fca5a5"), bg: rgba(252, 165, 165, 0.12) },
    info: { fg: hex("#93c5fd"), bg: rgba(147, 197, 253, 0.12) },
    neutral: { fg: hex("#cbd5e1"), bg: rgba(203, 213, 225, 0.12) },
  },
};

type Pair = { name: string; fg: Rgb; bg: Rgb; min: number };

function pairsForTheme(themeName: string, t: ThemeTokens): Pair[] {
  const pairs: Pair[] = [
    { name: `${themeName} text/bg`, fg: t.text, bg: t.bg, min: AA_NORMAL },
    { name: `${themeName} text/surface`, fg: t.text, bg: t.surface, min: AA_NORMAL },
    {
      name: `${themeName} text-muted/bg`,
      fg: t.textMuted,
      bg: t.bg,
      min: AA_NORMAL,
    },
    {
      name: `${themeName} text-muted/surface`,
      fg: t.textMuted,
      bg: t.surface,
      min: AA_NORMAL,
    },
    {
      name: `${themeName} text-subtle/bg`,
      fg: t.textSubtle,
      bg: t.bg,
      min: AA_NORMAL,
    },
    {
      name: `${themeName} text-subtle/surface`,
      fg: t.textSubtle,
      bg: t.surface,
      min: AA_NORMAL,
    },
    {
      name: `${themeName} on-primary/primary`,
      fg: t.onPrimary,
      bg: t.primary,
      min: AA_NORMAL,
    },
    {
      name: `${themeName} accent/bg`,
      fg: t.accent,
      bg: t.bg,
      min: AA_NORMAL,
    },
    {
      name: `${themeName} accent/surface`,
      fg: t.accent,
      bg: t.surface,
      min: AA_NORMAL,
    },
  ];

  for (const tone of Object.keys(t.status) as Array<keyof ThemeTokens["status"]>) {
    const { fg, bg } = t.status[tone];
    // Status pill fill sits on surface; blend translucent dark fills over surface.
    const pillBg = bg.a < 1 ? blend(bg, t.surface) : bg;
    pairs.push({
      name: `${themeName} status-${tone}-fg/bg@surface`,
      fg,
      bg: pillBg,
      min: AA_NORMAL,
    });
  }

  return pairs;
}

function main(): void {
  const pairs = [...pairsForTheme("light", light), ...pairsForTheme("dark", dark)];
  const failures: string[] = [];

  for (const pair of pairs) {
    const ratio = contrastRatio(pair.fg, pair.bg);
    if (ratio + 1e-9 < pair.min) {
      failures.push(
        `${pair.name}: ${ratio.toFixed(2)}:1 (need ≥ ${pair.min}:1)`,
      );
    }
  }

  if (failures.length > 0) {
    console.error("Contrast check failed (WCAG AA):");
    for (const line of failures) {
      console.error(`  - ${line}`);
    }
    process.exit(1);
  }

  console.log(`Contrast check passed (${pairs.length} pairs, AA ≥ ${AA_NORMAL}:1).`);
}

main();
