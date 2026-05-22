import { CSSProperties } from "react";
import { GradientLayer, GradientSpec } from "../lib/gradient";

/**
 * Renders a {@link GradientSpec}.
 *
 * The base field is painted on the frame itself; each soft radial light is
 * then its own layer on top. Glow layers drift and breathe on a slow, seeded
 * loop (`.wc-mesh-glow` in app/globals.css) so the gradient reads as
 * volumetric and quietly alive — while the vignette stays pinned, keeping the
 * card frame steady. The grain sits on top as one faintly-drifting overlay.
 *
 * The motion is pure CSS animation, so this stays a Server Component: the spec
 * is computed at render time and there is no client JavaScript.
 *
 * Place it inside a positioned, `overflow-hidden` parent (e.g. a card):
 *
 *   <MeshGradient spec={spec} className="absolute inset-0" />
 */
export function MeshGradient({
  spec,
  className = "",
  viewTransitionName,
  showRim = false,
}: {
  spec: GradientSpec;
  className?: string;
  /**
   * Marks this gradient as a view-transition shared element. Two elements
   * with the same name on either side of a `document.startViewTransition()`
   * morph between each other — used for the Calm card → modal expand.
   */
  viewTransitionName?: string;
  /**
   * Draw the inner-glow rim — a soft light catch hugging the inside of the
   * card edge. On for cards; off by default (e.g. the full-screen detail).
   */
  showRim?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={`overflow-hidden ${className}`}
      // the base field is the frame's own background
      style={{ viewTransitionName, background: spec.base }}
    >
      {/* soft radial lights — glows drift, the vignette stays put */}
      {spec.layers.map((layer, i) => (
        <GradientLayerView key={i} layer={layer} />
      ))}

      {/* inner-glow rim — sits above the layers so the edge reads as lit, and
          below the grain so the same texture unifies it with the gradient */}
      {showRim && (
        <div
          className="wc-mesh-rim absolute inset-0"
          style={{ "--wc-rim": spec.rim } as CSSProperties}
        />
      )}

      {/* fine grain — dithers away banding and adds a tactile finish */}
      <div
        className="wc-mesh-grain absolute inset-0"
        style={{ opacity: spec.grain }}
      />
    </div>
  );
}

/** One mesh layer: an animated soft light, or the static vignette. */
function GradientLayerView({ layer }: { layer: GradientLayer }) {
  if (layer.kind !== "glow" || !layer.motion) {
    return (
      <div
        className="absolute inset-0"
        style={{ background: layer.background }}
      />
    );
  }

  // Per-layer motion params feed two superimposed keyframe loops — see
  // app/globals.css. The keyframes animate the gradient's centre/size/falloff
  // (not the element), so the light shifts inside a frame that never moves;
  // the two loops run at unrelated tempos, so the motion never quite repeats.
  const { primary: p, secondary: s } = layer.motion;
  const style = {
    background: layer.background,
    // [primary loop, secondary loop]
    animationDuration: `${p.dur}s, ${s.dur}s`,
    animationDelay: `${p.delay}s, ${s.delay}s`,
    "--wc-x1": `${p.nodes[0][0]}%`,
    "--wc-y1": `${p.nodes[0][1]}%`,
    "--wc-x2": `${p.nodes[1][0]}%`,
    "--wc-y2": `${p.nodes[1][1]}%`,
    "--wc-x3": `${p.nodes[2][0]}%`,
    "--wc-y3": `${p.nodes[2][1]}%`,
    "--wc-rhi": `${p.rhi}`,
    "--wc-mhi": `${p.mhi}%`,
    "--wc-hhi": `${p.hue}deg`,
    "--wc-wx1": `${s.nodes[0][0]}%`,
    "--wc-wy1": `${s.nodes[0][1]}%`,
    "--wc-wx2": `${s.nodes[1][0]}%`,
    "--wc-wy2": `${s.nodes[1][1]}%`,
    "--wc-rhi2": `${s.rhi}`,
    "--wc-mhi2": `${s.mhi}%`,
    "--wc-hhi2": `${s.hue}deg`,
    "--wc-o0": `${layer.motion.o0}`,
    "--wc-o1": `${layer.motion.o1}`,
  } as CSSProperties;

  return <div className="wc-mesh-glow absolute inset-0" style={style} />;
}
