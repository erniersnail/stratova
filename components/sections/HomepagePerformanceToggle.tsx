"use client";

import { useState } from "react";
import EquityCurveChart, {
  type ChartSeries,
} from "@/components/strategies/EquityCurveChart";

type Region = "nse" | "us";

export type RegionData = {
  series: ChartSeries[];
  combinedReturn: number | null;
  benchmarkReturn: number | null;
  benchmarkLabel: string | null;
  caption: string;
};

type Props = {
  nse: RegionData;
  us: RegionData;
  height?: number;
};

function fmtPct(n: number): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

export default function HomepagePerformanceToggle({
  nse,
  us,
  height = 280,
}: Props) {
  const [region, setRegion] = useState<Region>("nse");
  const active = region === "nse" ? nse : us;

  const hasSeries = active.series.length > 0;
  const showAlpha =
    active.combinedReturn !== null && active.benchmarkReturn !== null;

  return (
    <div className="rounded-md border border-border bg-surface px-6 py-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-foreground/70">
          Live from daily snapshots · {active.caption}
        </p>
        <label className="flex items-center gap-2">
          <span className="sr-only">Region</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as Region)}
            className="rounded border border-border bg-surface px-2 py-1 text-xs text-foreground"
          >
            <option value="nse">India (NSE)</option>
            <option value="us">U.S. (Nasdaq)</option>
          </select>
        </label>
      </div>

      {hasSeries ? (
        <>
          <div className="mt-6">
            <EquityCurveChart series={active.series} height={height} />
          </div>
          {active.combinedReturn !== null && (
            <div className="mt-4 flex items-center justify-between gap-4 text-xs">
              <span className="text-secondary">
                Combined Portfolio{" "}
                <strong className="text-foreground">
                  {fmtPct(active.combinedReturn)}
                </strong>
              </span>
              {active.benchmarkReturn !== null && active.benchmarkLabel && (
                <span className="text-secondary">
                  {active.benchmarkLabel}{" "}
                  <strong className="text-foreground">
                    {fmtPct(active.benchmarkReturn)}
                  </strong>
                </span>
              )}
              {showAlpha && (
                <span className="text-secondary">
                  <strong className="text-foreground">
                    {fmtPct(active.combinedReturn! - active.benchmarkReturn!)}{" "}
                    alpha
                  </strong>
                </span>
              )}
            </div>
          )}
          <div className="mt-3 flex items-center gap-4 text-xs text-secondary">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 bg-foreground" />
              Strategy
            </span>
            {active.benchmarkLabel && (
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-4 bg-[#b08900]" />
                Benchmark
              </span>
            )}
          </div>
        </>
      ) : (
        <div
          className="mt-6 flex h-[200px] w-full items-center justify-center rounded-md border border-border"
          role="img"
          aria-label="No performance data available yet."
        >
          <p className="text-sm text-tertiary">No performance data yet.</p>
        </div>
      )}
    </div>
  );
}