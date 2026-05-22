# Mesh-gradient module

Generates soft, organic, per-card gradients for well-calm — instead of hard
linear/radial sweeps with many colour stops. Each card gets a distinct but
non-chaotic composition, and the gradient gently reflects the card's state.

## Why

The original cards painted a linear gradient that oscillated between two
far-apart hues (e.g. pink → yellow → pink). At small sizes that reads as busy
and banded. This module replaces it with a **mesh**: a deep base field plus a
few overlapping, softly-feathered radial colour blobs — the look in the
reference artwork.

## Design

- **Two-tone, not busy.** Each card has one dominant hue for its field and a
  second hue (the scheme's accent) welling up as a single broad, soft light.
  Two colours — but only ever two, meeting in one smooth transition.
- **Harmonious by construction.** Layers composite *normally* (no additive
  `screen` tricks that produce neon seams), the companion is nudged slightly
  toward the primary for cohesion, and the primary field always stays
  dominant. Rich, never chaotic.
- **Deterministic.** Every "random" choice comes from a seeded PRNG
  (`prng.ts`), so a card looks the same on every render and on server + client
  (no hydration mismatch). The preset name is the default seed.
- **Archetypes, not chaos.** The light is placed by one of six hand-tuned
  templates — `dawn`, `dusk`, `corner`, `aura`, `eclipse`, `twotone` — with
  seeded jitter. `cardGradient()` hand-picks one per preset for variety.
- **OKLCH colour.** Colour is manipulated in OKLCH (`color.ts`) so changing
  "saturation" (chroma) doesn't drag hue/lightness along. The original
  well-calm colour scheme is preserved — see `palettes.ts`.
- **State-driven.** A `value` in `0..1` modulates the gradient: low →
  calm/muted/cooler/softer light, high → intense/saturated/warm/brighter.
  Subtle by design — the gradient *quietly* tracks the metric.

## Layers (bottom → top)

1. base field colour (the primary hue)
2. one or two soft `radial-gradient` lights — a companion-hue glow, sometimes
   a primary-hue glow, plus a shade for depth
3. an elliptical vignette that seats the gradient inside the card
4. fractal-noise grain — dithers away banding, adds texture

Rendered by `<MeshGradient>` (`app/components/MeshGradient.tsx`), a Server
Component. The mesh composites normally, so it flattens onto a single static
element — pinned exactly to the card frame, with no client JavaScript.

## Usage

```tsx
import { cardGradient } from "@/app/lib/gradient";
import { MeshGradient } from "@/app/components/MeshGradient";

// inside a positioned, overflow-hidden element:
const spec = cardGradient("calm", { value: 0.3 });
<MeshGradient spec={spec} className="absolute inset-0" />;
```

Other entry points:

- `buildGradient(palette, opts)` — generate from an arbitrary palette.
- `meshGradientCSS(spec)` — flatten to a single CSS `background` string
  (drops blend modes / animation; handy for plain elements).
- `cardGradient(preset, { value, seed, archetype })` — per-preset helper.

## Files

| File          | Responsibility                                  |
| ------------- | ----------------------------------------------- |
| `color.ts`    | OKLCH ↔ sRGB conversion, gamut mapping           |
| `prng.ts`     | seeded deterministic randomness                 |
| `palettes.ts` | the named card colour schemes                   |
| `mesh.ts`     | composition archetypes + spec/CSS builders      |
| `index.ts`    | public API (`cardGradient`, re-exports)         |
