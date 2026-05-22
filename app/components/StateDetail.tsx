"use client";

import Link from "next/link";
import { Squircle } from "@squircle-js/react";
import { MeshGradient } from "./MeshGradient";
import { cardGradient } from "../lib/gradient";

const BACK_CLASS =
  "inline-flex items-center justify-center w-[54px] h-[54px] rounded-full bg-white/20 backdrop-blur-md text-white text-[28px] max-[340px]:text-[24px]";

function DetailCard({
  className,
}: {
  className: string;
}) {
  return (
    <Squircle
      cornerRadius={40}
      cornerSmoothing={0.7}
      asChild
    >
      <div className={`w-full bg-white/25 backdrop-blur-md ${className}`} />
    </Squircle>
  );
}

/**
 * The "Calm — Overall Mental State" detail surface.
 *
 * Shared by the fullscreen modal (app/components/CalmModal.tsx) and the
 * standalone /state route. Pass `onClose` for the modal (back becomes a
 * button); omit it for the route (back becomes a link home).
 *
 * The gradient carries `view-transition-name: calm-hero` so it morphs from the
 * Calm card; the content carries `calm-detail` so it eases in above it.
 */
export function StateDetail({ onClose }: { onClose?: () => void }) {
  // Identical spec to the Calm card's gradient — so the morph reads as one
  // surface expanding, not a cross-fade between two different gradients.
  const gradient = cardGradient("calm", { value: 0.3, archetype: "aura" });

  return (
    <div className="relative h-full w-full overflow-hidden">
      <MeshGradient
        spec={gradient}
        viewTransitionName="calm-hero"
        className="absolute inset-0"
      />

      <div
        className="relative h-full overflow-y-auto pt-[53px] px-[17px] pb-10"
      >
        <div style={{ viewTransitionName: "calm-detail" }}>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Back"
              className={`${BACK_CLASS} cursor-pointer`}
            >
              ←
            </button>
          ) : (
            <Link href="/" aria-label="Back" className={BACK_CLASS}>
              ←
            </Link>
          )}
        </div>

        <h1
          className="mt-[25px] text-white text-[48px] font-normal leading-none max-[380px]:text-[46px] max-[340px]:text-[42px]"
          style={{ viewTransitionName: "calm-title" }}
        >
          Calm
        </h1>
        <p
          className="mt-[14px] text-white/75 text-[20px] font-medium max-[340px]:text-[18px]"
          style={{ viewTransitionName: "calm-label" }}
        >
          Overall Mental State
        </p>

        <div style={{ viewTransitionName: "calm-detail-body" }}>
          <div className="mt-[40px] space-y-[6px]">
            <DetailCard className="h-[108px]" />
            <DetailCard className="h-[202px]" />
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[6px]">
              <DetailCard className="h-[184px]" />
              <DetailCard className="h-[184px]" />
            </div>
            <DetailCard className="h-[195px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
