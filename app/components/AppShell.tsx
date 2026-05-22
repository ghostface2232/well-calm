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
    <div className="mx-auto w-full max-w-[402px] min-h-screen px-[14px] pt-[32px] pb-10">
      <h1 className="text-[40px] font-normal leading-[1.08] text-white px-[9px] max-[380px]:text-[37px] max-[340px]:text-[34px]">
        Hi, Mingwan.
        <br />
        How are you doing today?
      </h1>

      <nav
        className="relative left-1/2 mt-[24px] flex w-screen -translate-x-1/2 gap-[5px] overflow-x-auto scrollbar-none pb-1"
        style={{
          paddingLeft: "max(14px, calc((100vw - 402px) / 2 + 14px))",
          paddingRight: "max(14px, calc((100vw - 402px) / 2 + 14px))",
        }}
      >
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          const inner = (
            <div
              className={`h-[37px] rounded-[40px] flex items-center justify-center text-[20px] font-medium backdrop-blur-md max-[340px]:text-[18px] ${
                isActive
                  ? "wc-tab-bounce bg-white/30 text-white/92"
                  : "bg-white/10 text-white/55"
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
            <Link
              key={tab.key}
              href={tab.href}
              // tags the navigation's view transition so app/globals.css can
              // give tab switches their own quick crossfade
              transitionTypes={["tab"]}
              className="shrink-0"
            >
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
