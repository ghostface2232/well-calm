"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Squircle } from "@squircle-js/react";
import type { AnimationEvent, KeyboardEvent, PointerEvent } from "react";

export type TabKey = "state" | "social" | "ambient" | "chat" | "settings";

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

let activeScrollFrame: number | null = null;

function restartTabPress(tab: HTMLElement) {
  tab.classList.remove("wc-tab-press");
  void tab.offsetWidth;
  tab.classList.add("wc-tab-press");
}

function cancelTabScroll() {
  if (activeScrollFrame !== null) {
    window.cancelAnimationFrame(activeScrollFrame);
    activeScrollFrame = null;
  }
}

function shouldReduceMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function scrollToTopBeforeTabChange(onDone: () => void) {
  cancelTabScroll();

  const startY = window.scrollY;
  let didHandOff = false;

  const handOff = () => {
    if (didHandOff) {
      return;
    }

    didHandOff = true;
    onDone();
  };

  if (startY <= 0) {
    handOff();
    return;
  }

  if (shouldReduceMotion()) {
    window.scrollTo(0, 0);
    handOff();
    return;
  }

  const startTime = performance.now();
  const duration = Math.min(260, Math.max(140, startY * 0.28));

  const step = (now: number) => {
    const progress = Math.min(1, (now - startTime) / duration);
    const remainingY = Math.round(startY * (1 - easeOutCubic(progress)));
    window.scrollTo(0, remainingY);

    // Start the route fade while the last few pixels of scroll are still
    // settling. This keeps the header/tab alignment motion visible without
    // making navigation wait for a fully serial scroll-then-fade sequence.
    if (progress >= 0.74 || remainingY <= 28) {
      handOff();
    }

    if (progress < 1) {
      activeScrollFrame = window.requestAnimationFrame(step);
      return;
    }

    activeScrollFrame = null;
    window.scrollTo(0, 0);
    handOff();
  };

  activeScrollFrame = window.requestAnimationFrame(step);
}

function handleTabAnimationEnd(event: AnimationEvent<HTMLElement>) {
  if (event.animationName === "wc-tab-press") {
    event.currentTarget.classList.remove("wc-tab-press");
  }
}

export function TabNav({ active }: { active: TabKey }) {
  const router = useRouter();

  return (
    <nav
      className="relative left-1/2 mt-[17px] mb-[-3px] flex w-screen -translate-x-1/2 gap-[5px] overflow-x-auto scrollbar-none pt-[7px] pb-[7px]"
      style={{
        paddingLeft: "max(14px, calc((100vw - 402px) / 2 + 14px))",
        paddingRight: "max(14px, calc((100vw - 402px) / 2 + 14px))",
      }}
    >
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        const inner = (
          <div
            className={`wc-tab-surface h-[37px] rounded-[40px] flex items-center justify-center text-[20px] font-medium backdrop-blur-md max-[340px]:text-[18px] ${
              isActive ? "bg-white/30 text-white/92" : "bg-white/10 text-white/55"
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
            scroll={false}
            className="wc-tab-link shrink-0"
            onNavigate={(event) => {
              if (window.scrollY <= 0) {
                return;
              }

              event.preventDefault();
              scrollToTopBeforeTabChange(() => {
                if (tab.key === active) {
                  return;
                }

                router.push(tab.href, { scroll: false, transitionTypes: ["tab"] });
              });
            }}
            onPointerDown={(event: PointerEvent<HTMLAnchorElement>) => {
              if (event.button === 0) {
                restartTabPress(event.currentTarget);
              }
            }}
            onKeyDown={(event: KeyboardEvent<HTMLAnchorElement>) => {
              if (event.key === "Enter" || event.key === " ") {
                restartTabPress(event.currentTarget);
              }
            }}
            onAnimationEnd={handleTabAnimationEnd}
          >
            {wrapped}
          </Link>
        ) : (
          <span key={tab.key} aria-disabled className="wc-tab-link shrink-0">
            {wrapped}
          </span>
        );
      })}
    </nav>
  );
}
