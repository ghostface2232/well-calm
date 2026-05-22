/**
 * well-calm mesh-gradient module
 * ------------------------------
 * Generates soft, organic, per-card mesh gradients instead of hard linear
 * sweeps. Every card gets a distinct-but-coherent composition (deterministic
 * from a seed), and the gradient's saturation, warmth and depth shift gently
 * with the card's current state via the `value` option.
 *
 * Quick start:
 *
 *   import { cardGradient } from "@/app/lib/gradient";
 *   import { MeshGradient } from "@/app/components/MeshGradient";
 *
 *   const spec = cardGradient("calm", { value: 0.3 });
 *   <MeshGradient spec={spec} className="absolute inset-0" />
 *
 * See ./README.md for the full picture.
 */

export * from "./color";
export * from "./prng";
export * from "./palettes";
export * from "./mesh";

import { Archetype, BuildOptions, GradientSpec, buildGradient } from "./mesh";
import { PALETTES, PresetName } from "./palettes";

/**
 * Each preset gets a hand-picked composition so the six cards read as
 * deliberately varied rather than six takes on the same layout. Callers can
 * still override via `opts.archetype`.
 */
const PRESET_ARCHETYPE: Record<PresetName, Archetype> = {
  calm: "aura",       // a calm, centred glow for the hero card
  heart: "eclipse",   // a bright field with a deep ember core
  bed: "dawn",        // light welling up from below — twilight
  breathing: "dusk",  // light settling at the top
  hrv: "corner",      // a diagonal composition
  focusing: "twotone", // the most dynamic, dual-tone template
};

/**
 * Build a gradient for one of the named card presets.
 *
 * The preset name doubles as the default seed, so each preset has its own
 * stable composition. Pass `value` (0-1) to tint it by the card's state, or an
 * explicit `seed` / `archetype` to vary it while keeping the colour scheme.
 */
export function cardGradient(preset: PresetName, opts: BuildOptions = {}): GradientSpec {
  return buildGradient(PALETTES[preset], {
    seed: preset,
    archetype: PRESET_ARCHETYPE[preset],
    ...opts,
  });
}
