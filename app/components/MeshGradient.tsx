import { GradientSpec, meshGradientCSS } from "../lib/gradient";

/**
 * Renders a {@link GradientSpec}.
 *
 * The whole mesh composites normally, so it flattens onto a single element —
 * which also means the gradient is always pinned exactly to its frame (no
 * per-layer transforms that could drift). The grain sits on top as one overlay.
 *
 * This is a Server Component: the spec is computed at render time and there is
 * no client JavaScript.
 *
 * Place it inside a positioned, `overflow-hidden` parent (e.g. a card):
 *
 *   <MeshGradient spec={spec} className="absolute inset-0" />
 */
export function MeshGradient({
  spec,
  className = "",
  viewTransitionName,
}: {
  spec: GradientSpec;
  className?: string;
  /**
   * Marks this gradient as a view-transition shared element. Two elements
   * with the same name on either side of a `document.startViewTransition()`
   * morph between each other — used for the Calm card → modal expand.
   */
  viewTransitionName?: string;
}) {
  return (
    <div
      aria-hidden
      className={`overflow-hidden ${className}`}
      style={{ viewTransitionName }}
    >
      {/* base field + soft radial layers, flattened onto one element */}
      <div
        className="absolute inset-0"
        style={{ background: meshGradientCSS(spec) }}
      />

      {/* fine grain — dithers away banding and adds a tactile finish */}
      <div
        className="wc-mesh-grain absolute inset-0"
        style={{ opacity: spec.grain }}
      />
    </div>
  );
}
