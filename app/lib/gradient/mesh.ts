/**
 * Mesh-gradient generation.
 *
 * The look we're after (see the reference artwork) is a *two-tone* gradient:
 * one dominant hue for the card's field, and a second hue welling up as a
 * single broad, soft light. The first attempt was monochromatic and read as
 * flat; an earlier one mixed many small `screen`-blended blobs and read as
 * chaotic. The fix is the middle path:
 *
 *   base field (primary)  +  one companion light  +  one shade  +  grain
 *
 * - The companion light uses the scheme's accent hue — a genuine second
 *   colour — but it is ONE broad region, composited *normally* (no additive
 *   `screen`), so the two hues meet in a smooth transition instead of a
 *   neon seam.
 * - The primary field stays dominant; the companion enriches, never competes.
 *
 * `value` (0-1) then quietly modulates saturation, warmth and light so the
 * gradient reflects the card's state.
 */

import { RGB, clamp01, hexToOklch, oklchToRgb, round } from "./color";
import { Palette } from "./palettes";
import { createRng } from "./prng";

export type Archetype = "dawn" | "dusk" | "corner" | "aura" | "eclipse" | "twotone";

const ARCHETYPES: readonly Archetype[] = [
  "dawn", "dusk", "corner", "aura", "eclipse", "twotone",
];

export interface GradientLayer {
  /** a CSS radial-gradient string */
  background: string;
}

export interface GradientSpec {
  /** css colour for the base field */
  base: string;
  /** soft radial layers, ordered bottom-to-top, composited normally */
  layers: GradientLayer[];
  /** fractal-grain opacity, 0-1 */
  grain: number;
  /** the composition template used */
  archetype: Archetype;
}

export interface BuildOptions {
  /**
   * Card state, 0-1 — drives the *feel* of the gradient:
   *   0 → calm / low:    muted, cooler, softer light
   *   1 → intense / high: saturated, warmer, brighter light
   * Defaults to 0.5 (neutral).
   */
  value?: number;
  /** deterministic seed — the same seed always yields the same composition */
  seed?: string | number;
  /** force a composition template instead of deriving one from the seed */
  archetype?: Archetype;
}

const norm = (deg: number) => (((deg % 360) + 360) % 360);

/** Shortest-path hue rotation from `from` toward `to` by fraction `t` (degrees). */
function towardHue(from: number, to: number, t: number): number {
  const delta = (((to - from) % 360) + 540) % 360 - 180;
  return norm(from + delta * t);
}

function rgba({ r, g, b }: RGB, a: number): string {
  return `rgb(${r} ${g} ${b} / ${round(a, 3)})`;
}

/**
 * A soft radial that fades a colour out to nothing — the core building block.
 *
 * It fades to the colour's *own* alpha-0 form (never the `transparent`
 * keyword, which is premultiplied black and leaves a muddy grey halo).
 */
function softLight(
  x: number, y: number, rx: number, ry: number, color: RGB, alpha: number,
): string {
  return (
    `radial-gradient(${round(rx)}% ${round(ry)}% at ${round(x)}% ${round(y)}%, ` +
    `${rgba(color, alpha)} 0%, ${rgba(color, alpha * 0.62)} 50%, ${rgba(color, 0)} 100%)`
  );
}

/** An elliptical edge-darkening wash that seats the gradient inside the card. */
function vignetteWash(color: RGB, alpha: number): string {
  return (
    `radial-gradient(132% 120% at 50% 40%, ` +
    `${rgba(color, 0)} 46%, ${rgba(color, alpha)} 100%)`
  );
}

/**
 * Build a mesh-gradient spec for a card from a palette.
 *
 * Pure and deterministic: identical `(palette, opts)` always produce an
 * identical spec, so it is safe to run during server rendering.
 */
export function buildGradient(palette: Palette, opts: BuildOptions = {}): GradientSpec {
  const value = clamp01(opts.value ?? 0.5);
  const rng = createRng(opts.seed ?? "well-calm");
  const archetype = opts.archetype ?? rng.pick(ARCHETYPES);

  // --- colour, modulated by `value` (kept subtle on purpose) ---
  const chromaScale = 0.78 + 0.42 * value; // muted → vivid
  const warmShift = (value - 0.5) * 5; // degrees toward warmer hues
  const primary = hexToOklch(palette.primary);
  const accent = hexToOklch(palette.accent);

  const hue = norm(primary.h + warmShift);
  const chroma = primary.c * chromaScale;
  // The companion is the scheme's accent hue, nudged just 12% toward the
  // primary — enough cohesion that the two tones feel related, not clashing.
  const companionHue = towardHue(norm(accent.h + warmShift), primary.h, 0.12);
  const companionChroma = accent.c * chromaScale;

  const field = oklchToRgb({ l: 0.44 + 0.07 * value, c: chroma * 0.95, h: hue });
  const brightField = oklchToRgb({ l: 0.57 + 0.07 * value, c: chroma, h: hue });
  const primaryLight = oklchToRgb({ l: 0.71 + 0.05 * value, c: chroma * 0.9, h: hue });
  const companion = oklchToRgb({ l: 0.63 + 0.08 * value, c: companionChroma * 0.95, h: companionHue });
  const deep = oklchToRgb({ l: 0.17 + 0.05 * value, c: chroma * 0.6, h: hue });

  const j = (v: number, amt: number) => rng.jitter(v, amt);
  const layers: GradientLayer[] = [];
  const glow = (
    x: number, y: number, rx: number, ry: number, color: RGB, alpha: number,
  ) => layers.push({ background: softLight(x, y, rx, ry, color, alpha) });
  const shadeWash = (alpha: number) =>
    layers.push({ background: vignetteWash(deep, alpha) });

  let base = field;

  switch (archetype) {
    // companion light wells up from below; depth gathers at the top
    case "dawn": {
      const gx = j(50, 13);
      glow(gx, j(90, 6), j(120, 10), j(104, 8), companion, j(0.78, 0.05));
      glow(j(100 - gx, 16), j(4, 5), j(116, 10), j(94, 8), deep, j(0.68, 0.05));
      shadeWash(0.2);
      break;
    }
    // companion light settles at the top; depth pools below
    case "dusk": {
      const gx = j(50, 13);
      glow(gx, j(12, 6), j(120, 10), j(104, 8), companion, j(0.74, 0.05));
      glow(j(100 - gx, 16), j(96, 5), j(116, 10), j(94, 8), deep, j(0.68, 0.05));
      shadeWash(0.2);
      break;
    }
    // companion light from one corner, depth diagonally opposite
    case "corner": {
      const corners = [
        { x: 20, y: 22 }, { x: 80, y: 22 },
        { x: 22, y: 80 }, { x: 80, y: 78 },
      ];
      const ci = rng.int(0, 3);
      const lit = corners[ci];
      const dark = corners[3 - ci];
      glow(j(lit.x, 7), j(lit.y, 7), j(128, 10), j(122, 10), companion, j(0.78, 0.05));
      glow(j(dark.x, 7), j(dark.y, 7), j(118, 10), j(112, 10), deep, j(0.62, 0.05));
      shadeWash(0.18);
      break;
    }
    // a calm central companion light, depth pooled around the edges
    case "aura": {
      glow(j(50, 7), j(45, 7), j(118, 8), j(114, 8), companion, j(0.74, 0.04));
      shadeWash(j(0.44, 0.04));
      break;
    }
    // a bright field with a deep core — the reference "ember" look (one hue)
    case "eclipse": {
      base = brightField;
      glow(j(50, 6), j(50, 6), j(84, 7), j(82, 7), deep, j(0.84, 0.04));
      shadeWash(0.12);
      break;
    }
    // primary light and companion light on opposite diagonals — the most
    // colourful template, with the field reading between them
    case "twotone": {
      const flip = rng.next() < 0.5;
      const aX = flip ? 74 : 28;
      const bX = flip ? 28 : 74;
      glow(j(aX, 7), j(31, 7), j(104, 8), j(100, 8), primaryLight, j(0.72, 0.05));
      glow(j(bX, 7), j(73, 7), j(108, 8), j(104, 8), companion, j(0.82, 0.05));
      shadeWash(0.22);
      break;
    }
  }

  return {
    base: `rgb(${base.r} ${base.g} ${base.b})`,
    layers,
    grain: 0.18,
    archetype,
  };
}

/**
 * Flatten a spec into a single CSS `background` value — every layer composites
 * normally, so the whole mesh can live on one element. This is the path the
 * `<MeshGradient>` component uses; the grain is applied as a separate overlay.
 */
export function meshGradientCSS(spec: GradientSpec): string {
  return [...spec.layers]
    .reverse()
    .map((l) => l.background)
    .concat(spec.base)
    .join(", ");
}
