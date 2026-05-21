"use client";

import { useState } from "react";
import { AppShell } from "../components/AppShell";

function Slider({
  value,
  onChange,
  showTicks = false,
}: {
  value: number;
  onChange: (v: number) => void;
  showTicks?: boolean;
}) {
  return (
    <div className="relative w-full h-[50px] flex flex-col justify-center">
      <div className="relative h-[6px] rounded-full bg-black/15">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-[38px] h-[24px] rounded-full bg-white shadow-[0_0.5px_4px_rgba(0,0,0,0.12),0_6px_13px_rgba(0,0,0,0.12)] cursor-pointer"
          style={{ left: `calc(${value}% - 19px)` }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="absolute inset-0 opacity-0 cursor-pointer"
        aria-label="slider"
      />
      {showTicks && (
        <div className="absolute left-0 right-0 top-[calc(50%+18px)] flex justify-between">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="w-2 h-2 rounded-full bg-neutral-300" />
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
        </div>
      )}
    </div>
  );
}

function ControlCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[40px] p-[20px] space-y-[12px]">{children}</div>
  );
}

function ControlRow({
  label,
  children,
  chevron = false,
}: {
  label: string;
  children?: React.ReactNode;
  chevron?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-[18px] text-black px-[5px] mb-1">
        <span>{label}</span>
        {chevron && <span className="text-neutral-400 text-[14px]">›</span>}
      </div>
      {children && <div className="px-[5px]">{children}</div>}
    </div>
  );
}

export default function AmbientPage() {
  const [ambient, setAmbient] = useState(8);
  const [brightness, setBrightness] = useState(18);
  const [colorTemp, setColorTemp] = useState(28);
  const [volumeCap, setVolumeCap] = useState(12);

  return (
    <AppShell active="ambient">
      <div className="space-y-[24px]">
        <ControlCard>
          <ControlRow label="Ambient Sensitivity">
            <Slider value={ambient} onChange={setAmbient} />
          </ControlRow>
        </ControlCard>

        <section>
          <h2 className="text-[28px] leading-[1.08] tracking-[-0.28px] text-black px-[9px] mb-[14px]">
            Lightings
          </h2>
          <ControlCard>
            <ControlRow label="Brightness">
              <Slider value={brightness} onChange={setBrightness} />
            </ControlRow>
            <div className="h-px bg-neutral-200" />
            <ControlRow label="Color Temperature">
              <Slider value={colorTemp} onChange={setColorTemp} showTicks />
            </ControlRow>
          </ControlCard>
        </section>

        <section>
          <h2 className="text-[28px] leading-[1.08] tracking-[-0.28px] text-black px-[9px] mb-[14px]">
            Sounds
          </h2>
          <ControlCard>
            <ControlRow label="Mood" chevron />
            <div className="h-px bg-neutral-200" />
            <ControlRow label="Volume Cap">
              <Slider value={volumeCap} onChange={setVolumeCap} showTicks />
            </ControlRow>
          </ControlCard>
        </section>
      </div>
    </AppShell>
  );
}
