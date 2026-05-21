import { ReactNode } from "react";
import { Squircle } from "@squircle-js/react";

type GradientPreset =
  | "calm"
  | "heart"
  | "bed"
  | "breathing"
  | "hrv"
  | "focusing";

const PRESETS: Record<
  GradientPreset,
  { base: string; radial: string; highlight: string }
> = {
  calm: {
    base: "linear-gradient(180deg, #ff3fbf 23%, #ffd042 49%, #ffd042 63%, #ff3fbf 142%)",
    radial:
      "radial-gradient(ellipse at center, rgba(255,63,191,1) 0%, rgba(204,60,156,0.75) 25%, rgba(153,57,121,0.5) 50%, rgba(51,51,51,0) 100%)",
    highlight:
      "radial-gradient(ellipse 70% 22% at center, rgba(255,208,66,1) 0%, rgba(213,152,67,0.08) 70%)",
  },
  heart: {
    base: "linear-gradient(180deg, #f12203 23%, #06e06c 52%, #06e06c 64%, #f12203 142%)",
    radial:
      "radial-gradient(ellipse at center, rgba(241,34,3,1) 0%, rgba(241,34,3,0) 100%)",
    highlight:
      "radial-gradient(ellipse 80% 25% at center, rgba(255,177,67,1) 0%, rgba(213,152,67,0.08) 70%)",
  },
  bed: {
    base: "linear-gradient(180deg, #182b63 0%, #f09e2a 100%)",
    radial:
      "radial-gradient(ellipse at 50% 55%, rgba(24,43,99,1) 0%, rgba(55,70,116,0.5) 50%, rgba(86,98,134,0) 100%)",
    highlight:
      "radial-gradient(ellipse 75% 22% at 50% 70%, rgba(255,177,67,1) 0%, rgba(213,152,67,0.08) 70%)",
  },
  breathing: {
    base: "linear-gradient(180deg, #0b65f7 23%, #0b65f7 56%, #02c463 142%)",
    radial:
      "radial-gradient(ellipse at center, rgba(2,196,99,1) 0%, rgba(2,196,99,0) 100%)",
    highlight:
      "radial-gradient(ellipse 80% 25% at center, rgba(255,177,67,1) 0%, rgba(213,152,67,0.08) 70%)",
  },
  hrv: {
    base: "linear-gradient(180deg, #7012b3 0%, #f0522a 100%)",
    radial:
      "radial-gradient(ellipse at 50% 55%, rgba(112,18,179,1) 0%, rgba(112,18,179,0) 100%)",
    highlight:
      "radial-gradient(ellipse 70% 22% at 50% 70%, rgba(255,184,19,1) 0%, rgba(213,152,67,0.08) 70%)",
  },
  focusing: {
    base: "linear-gradient(180deg, #163ad8 23%, #aae612 52%, #aae612 64%, #163ad8 142%)",
    radial:
      "radial-gradient(ellipse at center, rgba(22,58,216,1) 0%, rgba(22,58,216,0) 100%)",
    highlight:
      "radial-gradient(ellipse 80% 25% at center, rgba(255,177,67,1) 0%, rgba(213,152,67,0.08) 70%)",
  },
};

export function MetricCard({
  preset,
  title,
  unit,
  label,
  size = "square",
  showWave = false,
  className = "",
  children,
}: {
  preset: GradientPreset;
  title: ReactNode;
  unit?: string;
  label: string;
  size?: "square" | "wide";
  showWave?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const { base, radial, highlight } = PRESETS[preset];
  const isSquare = size === "square";
  const dimensions = isSquare ? "h-[178px] w-[178px]" : "h-[180px] w-full";

  return (
    <Squircle
      cornerRadius={40}
      cornerSmoothing={0.7}
      defaultWidth={isSquare ? 178 : 374}
      defaultHeight={isSquare ? 178 : 180}
      asChild
    >
      <div
        className={`relative ${dimensions} overflow-hidden ${className}`}
        style={{ background: base }}
      >
        <div className="absolute inset-0" style={{ background: radial }} />
        <div
          className="absolute inset-0 mix-blend-soft-light"
          style={{ background: highlight, opacity: 0.66 }}
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

        <div className="relative h-full p-[18px] flex flex-col text-white">
          <div className="text-[36px] leading-none tracking-[-0.72px]">
            {title}
            {unit && (
              <span className="text-[20px] ml-1 text-white/70 tracking-[-0.4px]">
                {unit}
              </span>
            )}
          </div>
          {children}
          <span className="mt-auto text-[16px] font-medium text-white/75 leading-none">
            {label}
          </span>
        </div>
      </div>
    </Squircle>
  );
}
