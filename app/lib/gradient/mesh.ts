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

import {
  Oklch, RGB, clamp01, hexToOklch, oklchToCss, oklchToRgb, round,
} from "./color";
import { Palette } from "./palettes";
import { Rng, createRng } from "./prng";

export type Archetype = "dawn" | "dusk" | "corner" | "aura" | "eclipse" | "twotone";

const ARCHETYPES: readonly Archetype[] = [
  "dawn", "dusk", "corner", "aura", "eclipse", "twotone",
];

/**
 * A slow drift/breathe profile for one soft light. Each glow gets its own,
 * derived deterministically from the seed — so layers wander at different
 * tempos and the field reads as volumetric rather than flat. Consumed by the
 * shared `wc-mesh-drift` keyframes (see app/globals.css).
 */
/** A 2-D offset in % of the card. */
export type Vec = readonly [number, number];

/**
 * One drifting oscillator: a centre wander through `nodes` plus a synced
 * radius/colour-falloff breathe, running on its own loop. The light moves
 * inside a fixed element (added to the gradient's base centre), so there is
 * never an edge gap.
 */
export interface DriftOscillator {
  /** loop duration, seconds */
  dur: number;
  /** negative start offset, seconds — desyncs it from siblings */
  delay: number;
  /** radius multiplier at the breathe peak — the light swells, then settles */
  rhi: number;
  /** mid-stop shift at the breathe peak, % — redistributes the colour falloff */
  mhi: number;
  /** hue swing amplitude, degrees — the colour drifts warmer, then cooler */
  hue: number;
  /** centre-wander nodes, each an [x, y] offset added to the base centre */
  nodes: readonly Vec[];
}

export interface LayerMotion {
  /** the main wander */
  primary: DriftOscillator;
  /**
   * A second wander at an unrelated tempo. The gradient sums the two, and
   * their loop lengths don't divide evenly — so the combined motion is
   * quasi-periodic: irregular, never settling into an obvious repeat.
   */
  secondary: DriftOscillator;
  /** opacity endpoints — a pulse in the light's intensity */
  o0: number;
  o1: number;
}

export interface GradientLayer {
  /** a CSS radial-gradient string */
  background: string;
  /** glow layers drift and breathe; the vignette stays pinned to the frame */
  kind: "glow" | "vignette";
  /** drift/breathe parameters — present on glow layers only */
  motion?: LayerMotion;
}

export interface GradientSpec {
  /** css colour for the base field */
  base: string;
  /** soft radial layers, ordered bottom-to-top, composited normally */
  layers: GradientLayer[];
  /** fractal-grain opacity, 0-1 */
  grain: number;
  /**
   * CSS colour for the inner-glow rim — a slightly brighter tint of the card's
   * own hue. <MeshGradient> renders it as a soft inset box-shadow hugging the
   * inside of the card edge (a Photoshop "Inner Glow"). Kept opaque here; the
   * component softens it with `color-mix`.
   */
  rim: string;
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
 * A glow colour as a CSS `oklch()` string at a given alpha — with the hue
 * offset by the two animatable hue oscillators (`--wc-hue` + `--wc-hue2`,
 * registered in app/globals.css). At their defaults the hue is unchanged;
 * when <MeshGradient> animates them the colour drifts warmer and cooler.
 *
 * Alpha 0 fades to the colour's *own* zero-alpha form (never the `transparent`
 * keyword, which is premultiplied black and leaves a muddy grey halo).
 */
function oklchStop(c: Oklch, alpha: number): string {
  return (
    `oklch(${round(c.l, 4)} ${round(c.c, 4)} ` +
    `calc(${round(c.h, 2)}deg + var(--wc-hue, 0deg) + var(--wc-hue2, 0deg)) ` +
    `/ ${round(alpha, 3)})`
  );
}

/**
 * A soft radial that fades a colour out to nothing — the core building block.
 *
 * Centre, radius, mid-stop and hue are all expressed against animatable
 * custom properties registered in app/globals.css. Two oscillators feed each
 * one — `--wc-cx` + `--wc-cx2` for the centre, `--wc-rs` * `--wc-rs2` for the
 * radius, `--wc-hue` + `--wc-hue2` for the hue, and so on — running at
 * unrelated tempos, so the summed motion is irregular and never settles into
 * an obvious repeat. At their defaults this is exactly the static gradient;
 * when <MeshGradient> animates them the light drifts, swells, redistributes
 * and shifts hue *inside* its element — the element never moves, so the
 * gradient always covers the card frame (no edge gap). Each `var()` carries a
 * fallback, so the gradient is valid even when unset.
 */
function softLight(
  x: number, y: number, rx: number, ry: number, color: Oklch, alpha: number,
): string {
  return (
    `radial-gradient(` +
    `calc(${round(rx)}% * var(--wc-rs, 1) * var(--wc-rs2, 1)) ` +
    `calc(${round(ry)}% * var(--wc-rs, 1) * var(--wc-rs2, 1)) ` +
    `at calc(${round(x)}% + var(--wc-cx, 0%) + var(--wc-cx2, 0%)) ` +
    `calc(${round(y)}% + var(--wc-cy, 0%) + var(--wc-cy2, 0%)), ` +
    `${oklchStop(color, alpha)} 0%, ` +
    `${oklchStop(color, alpha * 0.62)} calc(50% + var(--wc-mid, 0%) + var(--wc-mid2, 0%)), ` +
    `${oklchStop(color, 0)} 100%)`
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
 * Build one oscillator: `count` centre-wander nodes spaced *unevenly* around
 * a loop — jittered both in angle and in radius, so the path is an irregular
 * wander, not a tidy polygon — plus a radius/colour breathe and its own tempo.
 */
function oscillator(
  rng: Rng,
  count: number,
  reach: number,
  dur: Vec,
  rhi: Vec,
  mhi: Vec,
  hue: Vec,
): DriftOscillator {
  let a = rng.range(0, Math.PI * 2);
  const nodes: Vec[] = [];
  for (let i = 0; i < count; i++) {
    // uneven angular steps — the loop never closes into a regular shape
    a += ((Math.PI * 2) / count) * rng.range(0.6, 1.5);
    const r = rng.jitter(reach, reach * 0.5);
    nodes.push([round(Math.cos(a) * r, 2), round(Math.sin(a) * r, 2)]);
  }
  const d = round(rng.range(dur[0], dur[1]), 2);
  return {
    dur: d,
    delay: -round(rng.range(0, d), 2),
    rhi: round(rng.range(rhi[0], rhi[1]), 3),
    mhi: round(rng.range(mhi[0], mhi[1]), 1),
    hue: round(rng.range(hue[0], hue[1]), 1),
    nodes,
  };
}

/**
 * An organic drift profile for one glow layer.
 *
 * Only the gradient's *interior* moves — the element never does, so the
 * gradient always covers the card frame (no edge gap). Two oscillators are
 * superimposed: a broad primary wander and a smaller secondary one running at
 * an unrelated tempo. Because their loop lengths don't divide evenly, the
 * summed motion is *quasi-periodic* — it wanders irregularly and never settles
 * into a recognisable repeat — and the wander nodes themselves are unevenly
 * placed. Each oscillator also swings the hue a little, so the colour itself
 * drifts warmer and cooler. The field reads as volumetric, restless and alive.
 */
function motionFor(rng: Rng): LayerMotion {
  return {
    // reach, [dur], [radius], [mid-stop], [hue°]
    primary: oscillator(
      rng, 3, rng.range(10, 15), [3, 5], [1.18, 1.36], [14, 22], [5, 11],
    ),
    secondary: oscillator(
      rng, 2, rng.range(4.5, 7.5), [6, 10], [1.05, 1.13], [7, 12], [3, 6],
    ),
    o0: 1,
    o1: round(rng.range(0.76, 0.88), 3),
  };
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
  // A separate stream for motion, so adding/tuning the drift never disturbs
  // the (deterministic) colour and composition derived from `rng`.
  const motionRng = createRng(`${opts.seed ?? "well-calm"}~motion`);
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

  // Glow colours stay in OKLCH so their hue can be shifted at render time by
  // the animated `--wc-hue` properties (see oklchStop / softLight).
  const field: Oklch = { l: 0.44 + 0.07 * value, c: chroma * 0.95, h: hue };
  const brightField: Oklch = { l: 0.57 + 0.07 * value, c: chroma, h: hue };
  const primaryLight: Oklch = { l: 0.71 + 0.05 * value, c: chroma * 0.9, h: hue };
  const companion: Oklch = { l: 0.63 + 0.08 * value, c: companionChroma * 0.95, h: companionHue };
  const deep: Oklch = { l: 0.17 + 0.05 * value, c: chroma * 0.6, h: hue };
  // the vignette wash is static (no hue drift), so it wants a concrete sRGB
  const deepRgb = oklchToRgb(deep);
  // A brighter tint of the card's own hue for the inner-glow rim — same hue,
  // similar chroma, just lifted in lightness so the card edge reads as
  // catching light. Kept opaque; <MeshGradient> softens it with color-mix.
  const rimTint: Oklch = { l: 0.9 + 0.04 * value, c: chroma * 0.78, h: hue };

  const j = (v: number, amt: number) => rng.jitter(v, amt);
  const layers: GradientLayer[] = [];
  const glow = (
    x: number, y: number, rx: number, ry: number, color: Oklch, alpha: number,
  ) => layers.push({
    background: softLight(x, y, rx, ry, color, alpha),
    kind: "glow",
    motion: motionFor(motionRng),
  });
  const shadeWash = (alpha: number) =>
    layers.push({ background: vignetteWash(deepRgb, alpha), kind: "vignette" });

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
    base: oklchToCss(base),
    layers,
    grain: 0.18,
    rim: oklchToCss(rimTint),
    archetype,
  };
}

/**
 * Flatten a spec into a single CSS `background` value — every layer composites
 * normally, so the whole mesh can live on one element. This is a *static*
 * flattening: it drops the per-layer drift animation. `<MeshGradient>` renders
 * the layers as separate elements instead, so the soft lights can move.
 */
export function meshGradientCSS(spec: GradientSpec): string {
  return [...spec.layers]
    .reverse()
    .map((l) => l.background)
    .concat(spec.base)
    .join(", ");
}
