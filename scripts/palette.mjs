// The Flying Dutchman — master palette
// ---------------------------------------------------------------------------
// One source of truth for every editor and every variant. Colours are authored
// in HSL so the three variants stay true tonal siblings: they share hues and
// only move lightness / saturation. Never hand-edit the generated theme files —
// change a number here and run `npm run build:themes`.
//
// The story: an abyssal blue-black hull, misted in fog. Aged brass and gold from
// Davy Jones' organ. A bioluminescent teal glow rising from the deep. Seafoam on
// the wake. A cold storm-blue in the rigging, and a single warm coral for the
// living things clinging to the ship. Nothing shouts; every colour is tuned to
// the same brightness so the whole palette reads as one weathered instrument.

/** Convert HSL (h 0–360, s/l 0–100) to a #rrggbb hex string. */
export function hsl(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const c = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/** Append an 8-bit alpha (0–255) to a hex colour. */
export function alpha(hex, a) {
  return hex + a.toString(16).padStart(2, '0');
}

// Shared hues — identical across variants so the family never drifts.
const H = {
  neutral: 214, // fog / abyss spine
  keyword: 204, // storm blue
  string: 157, // seafoam
  func: 184, // bioluminescent teal
  type: 39, // aged brass
  constant: 45, // gold
  property: 194, // shoal cyan
  coral: 11, // living warmth (tags, this)
  error: 2, // danger
  warn: 37, // signal lamp
  green: 150, // additions
  info: 200, // information blue
  magenta: 328, // weathered maritime rose (terminal ANSI, charts, SCM graph)
};

// Each variant defines the same roles at different lightness / saturation.
// standard = balanced · high-contrast = brighter on near-black · soft = muted.
const VARIANTS = {
  standard: {
    // neutrals
    bg: hsl(H.neutral, 27, 10),
    bgChrome: hsl(216, 30, 7),
    bgPanel: hsl(215, 29, 8),
    bgElev: hsl(H.neutral, 24, 13),
    bgLine: hsl(H.neutral, 24, 12),
    bgHover: hsl(213, 22, 16),
    bgSel: hsl(208, 34, 26),
    bgSelMuted: hsl(212, 20, 18),
    borderSubtle: hsl(H.neutral, 20, 16),
    border: hsl(210, 22, 26),
    fg: hsl(213, 25, 80),
    fgBright: hsl(206, 33, 92),
    fgMuted: hsl(212, 15, 60),
    fgDim: hsl(208, 13, 48),
    fgFaint: hsl(H.neutral, 18, 20),
    // accents
    keyword: hsl(H.keyword, 50, 64),
    string: hsl(H.string, 40, 57),
    func: hsl(H.func, 52, 58),
    type: hsl(H.type, 56, 61),
    constant: hsl(H.constant, 64, 66),
    property: hsl(H.property, 42, 68),
    coral: hsl(H.coral, 60, 70),
    error: hsl(H.error, 72, 64),
    warn: hsl(H.warn, 72, 61),
    green: hsl(H.green, 46, 57),
    info: hsl(H.info, 58, 64),
    magenta: hsl(H.magenta, 34, 66),
    // Terminal bright row — authored per variant so "bright" always reads
    // brighter than its normal counterpart in that variant's own tonality.
    brightRed: hsl(H.error, 72, 74),
    brightGreen: hsl(H.string, 46, 67),
    brightYellow: hsl(H.constant, 58, 76),
    brightBlue: hsl(H.info, 54, 74),
    brightMagenta: hsl(H.magenta, 34, 76),
    brightCyan: hsl(H.func, 48, 68),
  },
  'high-contrast': {
    bg: hsl(215, 42, 5),
    bgChrome: hsl(216, 46, 3),
    bgPanel: hsl(215, 44, 4),
    bgElev: hsl(H.neutral, 30, 10),
    bgLine: hsl(H.neutral, 30, 11),
    bgHover: hsl(212, 30, 15),
    bgSel: hsl(206, 55, 30),
    bgSelMuted: hsl(210, 28, 20),
    borderSubtle: hsl(H.neutral, 25, 22),
    border: hsl(206, 40, 42),
    fg: hsl(200, 22, 98),
    fgBright: hsl(0, 0, 100),
    fgMuted: hsl(210, 18, 72),
    fgDim: hsl(207, 17, 63),
    fgFaint: hsl(H.neutral, 22, 30),
    keyword: hsl(H.keyword, 66, 75),
    string: hsl(H.string, 52, 67),
    func: hsl(H.func, 64, 71),
    type: hsl(H.type, 78, 70),
    constant: hsl(H.constant, 86, 75),
    property: hsl(H.property, 60, 77),
    coral: hsl(H.coral, 72, 75),
    error: hsl(H.error, 86, 71),
    warn: hsl(H.warn, 88, 66),
    green: hsl(H.green, 58, 65),
    info: hsl(H.info, 70, 73),
    magenta: hsl(H.magenta, 52, 76),
    brightRed: hsl(H.error, 86, 81),
    brightGreen: hsl(H.string, 60, 77),
    brightYellow: hsl(H.constant, 78, 85),
    brightBlue: hsl(H.info, 65, 83),
    brightMagenta: hsl(H.magenta, 52, 86),
    brightCyan: hsl(H.func, 59, 81),
  },
  soft: {
    bg: hsl(H.neutral, 22, 13),
    bgChrome: hsl(215, 24, 10),
    bgPanel: hsl(H.neutral, 23, 11),
    bgElev: hsl(213, 20, 16),
    bgLine: hsl(H.neutral, 18, 17),
    bgHover: hsl(212, 17, 21),
    bgSel: hsl(208, 26, 29),
    bgSelMuted: hsl(211, 16, 22),
    borderSubtle: hsl(H.neutral, 16, 21),
    border: hsl(210, 18, 30),
    fg: hsl(213, 22, 79),
    fgBright: hsl(206, 28, 89),
    fgMuted: hsl(212, 13, 61),
    fgDim: hsl(208, 12, 51),
    fgFaint: hsl(H.neutral, 15, 25),
    keyword: hsl(H.keyword, 32, 66),
    string: hsl(H.string, 28, 60),
    func: hsl(H.func, 34, 61),
    type: hsl(H.type, 40, 64),
    constant: hsl(H.constant, 46, 68),
    property: hsl(H.property, 30, 70),
    coral: hsl(H.coral, 40, 71),
    error: hsl(H.error, 52, 67),
    warn: hsl(H.warn, 50, 64),
    green: hsl(H.green, 32, 60),
    info: hsl(H.info, 40, 67),
    magenta: hsl(H.magenta, 26, 68),
    brightRed: hsl(H.error, 44, 72),
    brightGreen: hsl(H.string, 32, 65),
    brightYellow: hsl(H.constant, 40, 74),
    brightBlue: hsl(H.info, 36, 72),
    brightMagenta: hsl(H.magenta, 24, 74),
    brightCyan: hsl(H.func, 30, 66),
  },
};

/**
 * Terminal ANSI 16-colour set for a variant, read entirely from that variant's
 * own roles. It takes no variant name: every call site used to pass the literal
 * 'standard', so the High Contrast and Soft themes shipped Standard's bright
 * row — and in High Contrast that made bright green, yellow and cyan *darker*
 * than their normal counterparts.
 */
export function ansi(p) {
  return {
    black: p.bgChrome,
    red: p.error,
    green: p.string,
    yellow: p.constant,
    blue: p.info,
    magenta: p.magenta,
    cyan: p.func,
    white: p.fg,
    brightBlack: p.fgMuted,
    brightRed: p.brightRed,
    brightGreen: p.brightGreen,
    brightYellow: p.brightYellow,
    brightBlue: p.brightBlue,
    brightMagenta: p.brightMagenta,
    brightCyan: p.brightCyan,
    brightWhite: p.fgBright,
  };
}

export function palette(variant) {
  const p = VARIANTS[variant];
  if (!p) throw new Error(`unknown variant: ${variant}`);
  return p;
}

export const variants = Object.keys(VARIANTS);
export const hues = H;
