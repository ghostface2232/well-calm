import Link from "next/link";
import { AppShell } from "./components/AppShell";
import { MetricCard } from "./components/MetricCard";

export default function StatePage() {
  return (
    <AppShell active="state">
      <div className="space-y-[10px]">
        <Link href="/state" className="block">
          <MetricCard
            preset="calm"
            title="Calm"
            label="Overall Mental State"
            size="wide"
            showWave
          />
        </Link>

        <div className="grid grid-cols-2 gap-[10px]">
          <MetricCard
            preset="heart"
            title={
              <span className="block leading-none">
                65-
                <br />
                127
              </span>
            }
            unit="BPM"
            label="Heart Rate Range"
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
          />
          <MetricCard
            preset="breathing"
            title="16.7"
            label="Breathing Rate"
          >
            <span className="mt-1 text-[20px] font-medium text-white/70 tracking-[-0.4px] leading-none">
              breathes/min
            </span>
          </MetricCard>
          <MetricCard preset="hrv" title="Balanced" label="HRV" />
        </div>

        <MetricCard
          preset="focusing"
          title="Focusing"
          label=""
          size="wide"
        />
      </div>
    </AppShell>
  );
}
