"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import { MetricCard } from "./MetricCard";
import { CalmModal } from "./CalmModal";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => unknown;
};

/**
 * The Calm card on the home screen. Tapping it opens {@link CalmModal} as a
 * full-screen modal *over* the home screen (which stays put underneath).
 *
 * The toggle runs inside `document.startViewTransition()`, and the card's
 * gradient and the modal's gradient share `view-transition-name: calm-hero` —
 * so the browser morphs the gradient, expanding the card to fill the screen
 * (and shrinking it back on close).
 */
export function HomeCalmCard() {
  const [open, setOpen] = useState(false);

  const setOpenAnimated = (next: boolean) => {
    const doc = document as ViewTransitionDocument;
    if (!doc.startViewTransition) {
      // No View Transitions support (e.g. Firefox) — just toggle instantly.
      setOpen(next);
      return;
    }
    // `flushSync` applies the state change inside the transition callback so
    // the browser captures the "after" DOM and animates from old → new.
    doc.startViewTransition(() => {
      flushSync(() => setOpen(next));
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenAnimated(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="block w-full text-left cursor-pointer"
      >
        <MetricCard
          preset="calm"
          title="Calm"
          label="Overall Mental State"
          size="wide"
          // calm, settled state → muted, deep gradient
          value={0.3}
          // While the modal is open it owns `calm-hero`; drop it here so the
          // name is never duplicated across two elements.
          heroName={open ? undefined : "calm-hero"}
          titleTransitionName={open ? undefined : "calm-title"}
          labelTransitionName={open ? undefined : "calm-label"}
        />
      </button>

      {open && <CalmModal onClose={() => setOpenAnimated(false)} />}
    </>
  );
}
