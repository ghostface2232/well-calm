import { ReactNode } from "react";
import { Squircle } from "@squircle-js/react";
import { MeshGradient } from "./MeshGradient";
import { PresetName, cardGradient } from "../lib/gradient";

export function MetricCard({
  preset,
  title,
  label,
  value = 0.5,
  size = "square",
  showWave = false,
  heroName,
  titleTransitionName,
  labelTransitionName,
  className = "",
  children,
}: {
  preset: PresetName;
  title: ReactNode;
  label: string;
  /**
   * Card state, 0-1. Gently tints the generated gradient — lower reads calmer
   * and more muted, higher reads more saturated and warm. Defaults to 0.5.
   */
  value?: number;
  size?: "square" | "wide";
  showWave?: boolean;
  /**
   * View-transition name for the card's gradient. When this card and another
   * element share a name across a `startViewTransition()`, the gradient morphs
   * between them — see app/components/HomeCalmCard.tsx.
   */
  heroName?: string;
  titleTransitionName?: string;
  labelTransitionName?: string;
  className?: string;
  children?: ReactNode;
}) {
  const isSquare = size === "square";
  // Square cards fill their grid column (fluid) so they always line up with
  // the full-width "wide" cards; a fixed width left a gap at the edges.
  const dimensions = isSquare ? "aspect-square w-full" : "h-[180px] w-full";
  const gradient = cardGradient(preset, { value });

  return (
    <Squircle
      cornerRadius={40}
      cornerSmoothing={0.7}
      asChild
    >
      <div className={`relative ${dimensions} overflow-hidden ${className}`}>
        {/* As a hero, the gradient carries its own rounding so the morph
            snapshot keeps the card's corners while it expands. */}
        <MeshGradient
          spec={gradient}
          viewTransitionName={heroName}
          className={`absolute inset-0${heroName ? " rounded-[40px]" : ""}`}
        />

        {showWave && (
          <div className="absolute inset-x-0 top-[44%] -translate-y-1/2 pointer-events-none">
            <img
              src="/images/wave.png"
              alt=""
              aria-hidden
              className="w-full h-auto opacity-90"
            />
          </div>
        )}

        <div className="relative h-full px-[18px] py-[24px] flex flex-col text-white">
          <div
            className="text-[36px] font-normal leading-none max-[380px]:text-[32px] max-[340px]:text-[29px]"
            style={{ viewTransitionName: titleTransitionName }}
          >
            {title}
          </div>
          {children}
          <span
            className="mt-auto text-[16px] font-medium text-white/75 leading-none max-[340px]:text-[14px]"
            style={{ viewTransitionName: labelTransitionName }}
          >
            {label}
          </span>
        </div>
      </div>
    </Squircle>
  );
}
