/**
 * OKLCH color utilities.
 *
 * The mesh-gradient module manipulates colour in the OKLCH space because it is
 * perceptually uniform: scaling chroma changes the apparent "saturation"
 * without dragging the hue or lightness along with it. That keeps the
 * value-driven modulation (see `mesh.ts`) smooth and predictable.
 *
 * Conversion matrices: Björn Ottosson — https://bottosson.github.io/posts/oklab/
 */

export interface RGB {
  /** 0-255 */ r: number;
  /** 0-255 */ g: number;
  /** 0-255 */ b: number;
}

export interface Oklch {
  /** perceptual lightness, 0-1 */ l: number;
  /** chroma, roughly 0-0.37 */ c: number;
  /** hue, degrees 0-360 */ h: number;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const clamp01 = (n: number) => clamp(n, 0, 1);
const round = (n: number, p = 2) => {
  const f = 10 ** p;
  return Math.round(n * f) / f;
};

/** Parse `#rgb` or `#rrggbb` into 0-255 channels. */
export function parseHex(hex: string): RGB {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

const srgbToLinear = (c: number) => {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
};
const linearToSrgb = (c: number) => {
  const x = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.round(clamp01(x) * 255);
};

function linearToOklab(r: number, g: number, b: number): { L: number; A: number; B: number } {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    A: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    B: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  };
}

function oklabToLinear(L: number, A: number, B: number): { r: number; g: number; b: number } {
  const l_ = L + 0.3963377774 * A + 0.2158037573 * B;
  const m_ = L - 0.1055613458 * A - 0.0638541728 * B;
  const s_ = L - 0.0894841775 * A - 1.291485548 * B;
  const l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_;
  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

/** sRGB hex → OKLCH. */
export function hexToOklch(hex: string): Oklch {
  const { r, g, b } = parseHex(hex);
  const { L, A, B } = linearToOklab(srgbToLinear(r), srgbToLinear(g), srgbToLinear(b));
  let h = (Math.atan2(B, A) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l: L, c: Math.hypot(A, B), h };
}

const EPS = 1e-4;
function linearForChroma(l: number, c: number, h: number) {
  const rad = (h * Math.PI) / 180;
  return oklabToLinear(l, c * Math.cos(rad), c * Math.sin(rad));
}
function inGamut({ r, g, b }: { r: number; g: number; b: number }) {
  return (
    r >= -EPS && r <= 1 + EPS &&
    g >= -EPS && g <= 1 + EPS &&
    b >= -EPS && b <= 1 + EPS
  );
}

/**
 * OKLCH → sRGB. If the colour falls outside the sRGB gamut, chroma is reduced
 * (lightness and hue preserved) until it fits — this avoids the ugly channel
 * clipping you get from a naive clamp.
 */
export function oklchToRgb(o: Oklch): RGB {
  const l = clamp01(o.l);
  let lin = linearForChroma(l, o.c, o.h);
  if (!inGamut(lin)) {
    let lo = 0, hi = o.c;
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(linearForChroma(l, mid, o.h))) lo = mid;
      else hi = mid;
    }
    lin = linearForChroma(l, lo, o.h);
  }
  return { r: linearToSrgb(lin.r), g: linearToSrgb(lin.g), b: linearToSrgb(lin.b) };
}

/** Modern-syntax CSS colour string, e.g. `rgb(255 63 191 / 0.5)`. */
export function rgbToCss({ r, g, b }: RGB, alpha = 1): string {
  return alpha >= 1 ? `rgb(${r} ${g} ${b})` : `rgb(${r} ${g} ${b} / ${round(alpha, 3)})`;
}

export function oklchToCss(o: Oklch, alpha = 1): string {
  return rgbToCss(oklchToRgb(o), alpha);
}

export interface OklchDelta {
  /** add to lightness */ l?: number;
  /** add to chroma */ c?: number;
  /** add to hue (degrees) */ h?: number;
  /** multiply lightness */ scaleL?: number;
  /** multiply chroma */ scaleC?: number;
}

/** Apply additive/multiplicative tweaks to an OKLCH colour, kept in range. */
export function adjustOklch(o: Oklch, d: OklchDelta): Oklch {
  let { l, c, h } = o;
  if (d.scaleL != null) l *= d.scaleL;
  if (d.scaleC != null) c *= d.scaleC;
  if (d.l != null) l += d.l;
  if (d.c != null) c += d.c;
  if (d.h != null) h += d.h;
  return { l: clamp01(l), c: Math.max(0, c), h: ((h % 360) + 360) % 360 };
}

export { clamp, clamp01, round };
