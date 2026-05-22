import { StateDetail } from "../components/StateDetail";

/**
 * Standalone /state route — the Calm detail as its own page (direct access /
 * no-JS fallback). The primary way in is the modal that expands from the Calm
 * card on the home screen; see app/components/HomeCalmCard.tsx.
 */
export default function StateFullscreenPage() {
  return (
    <div className="h-dvh w-full">
      <StateDetail />
    </div>
  );
}
