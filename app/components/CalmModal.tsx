"use client";

import { useEffect } from "react";
import { StateDetail } from "./StateDetail";

/**
 * The Calm detail presented as an iOS-style full-screen modal — it covers the
 * home screen, which stays mounted underneath. The expand/shrink animation is
 * driven by the caller via `document.startViewTransition()`; this component is
 * just the overlay (escape-to-close + background scroll lock).
 */
export function CalmModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Calm — Overall Mental State"
      className="fixed inset-0 z-50"
    >
      <div className="relative h-full w-full">
        <StateDetail onClose={onClose} />
      </div>
    </div>
  );
}
