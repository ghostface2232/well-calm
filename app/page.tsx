import { AppShell } from "./components/AppShell";
import { MetricCard } from "./components/MetricCard";
import { HomeCalmCard } from "./components/HomeCalmCard";

export default function StatePage() {
  return (
    <AppShell active="state">
      <div className="space-y-[6px]">
        {/* Tapping this opens the Calm detail as a full-screen modal that
            expands from the card — see HomeCalmCard. */}
        <HomeCalmCard />

        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[6px]">
          <MetricCard
            preset="heart"
            title={
              <span className="block leading-none">
                65-
                <br />
                127
                <span className="text-[19px] font-medium ml-1 text-white/70 max-[380px]:text-[17px] max-[340px]:text-[15px]">
                  BPM
                </span>
              </span>
            }
            label="Heart Rate Range"
            // a fairly wide heart-rate range → mid-energy
            value={0.52}
          />
          <MetricCard
            preset="bed"
            title={
              <span className="block leading-none">
                <span>6</span>
                <span className="text-white/60">hr</span>
                <br />
                <span>53</span>
                <span className="text-white/70">min</span>
              </span>
            }
            label="Time in Bed"
            // restful sleep → calm
            value={0.34}
          />
          <MetricCard
            preset="breathing"
            title="16.7"
            label="Breathing Rate"
            value={0.5}
          >
            <span className="mt-1 text-[19px] font-medium text-white/70 leading-none max-[380px]:text-[17px] max-[340px]:text-[15px]">
              breathes/min
            </span>
          </MetricCard>
          <MetricCard preset="hrv" title="Balanced" label="HRV" value={0.46} />
        </div>

        <MetricCard
          preset="focusing"
          title="Focusing"
          label=""
          size="wide"
          // engaged / focused → more saturated, warmer
          value={0.64}
        />
      </div>
    </AppShell>
  );
}
