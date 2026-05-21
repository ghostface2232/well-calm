import Link from "next/link";
import { ReactNode } from "react";
import { Squircle } from "@squircle-js/react";

type TabKey = "state" | "social" | "ambient" | "chat" | "settings";

const TABS: {
  key: TabKey;
  label: string;
  href: string;
  enabled: boolean;
  width: number;
}[] = [
  { key: "state", label: "State", href: "/", enabled: true, width: 83 },
  { key: "social", label: "Social", href: "/social", enabled: true, width: 86 },
  { key: "ambient", label: "Ambient", href: "/ambient", enabled: true, width: 104 },
  { key: "chat", label: "Chat", href: "#", enabled: false, width: 67 },
  { key: "settings", label: "Settings", href: "#", enabled: false, width: 92 },
];

export function AppShell({ active, children }: { active: TabKey; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[402px] min-h-screen bg-[#ededed] px-[14px] pt-[53px] pb-10">
      <h1 className="text-[40px] leading-[1.08] tracking-[-0.8px] text-black px-[9px]">
        Hi, Mingwan.
        <br />
        How are you doing today?
      </h1>

      <nav className="mt-[24px] flex gap-[5px] overflow-x-auto scrollbar-none -mx-[14px] px-[14px] pb-1">
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          const inner = (
            <div
              className={`h-[37px] rounded-[40px] flex items-center justify-center text-[20px] backdrop-blur-md ${
                isActive ? "bg-white text-[#333]" : "bg-[#d6d6d6] text-[#696969]"
              } ${tab.enabled ? "cursor-pointer" : "cursor-not-allowed"}`}
              style={{ width: `${tab.width}px` }}
            >
              {tab.label}
            </div>
          );

          const wrapped = (
            <Squircle
              cornerRadius={18.5}
              cornerSmoothing={0.7}
              defaultWidth={tab.width}
              defaultHeight={37}
              asChild
            >
              {inner}
            </Squircle>
          );

          return tab.enabled ? (
            <Link key={tab.key} href={tab.href} className="shrink-0">
              {wrapped}
            </Link>
          ) : (
            <span key={tab.key} aria-disabled className="shrink-0">
              {wrapped}
            </span>
          );
        })}
      </nav>

      <main className="mt-[24px]">{children}</main>
    </div>
  );
}
