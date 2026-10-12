"use client";

import { useState } from "react";
import EquityCurveChart, {
  type ChartSeries,
} from "@/components/strategies/EquityCurveChart";

export type IndividualCardData = {
  id: string;
  name: string;
  shortDescription: string | null;
  benchmarkSymbol: string | null;
  series: ChartSeries[];
  strategyReturn: number | null;
  benchmarkReturn: number | null;
};

type Region = "nse" | "us";

function fmt(v: number): string {
  return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
}

export default function IndividualChartsToggle({
  nse,
  us,
}: {
  nse: IndividualCardData[];
  us: IndividualCardData[];
}) {
  const [region, setRegion] = useState<Region>("nse");
  const cards = region === "nse" ? nse : us;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-secondary">
          {cards.length} {cards.length === 1 ? "strategy" : "strategies"}
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
      {cards.length === 0 ? (
        <div className="mt-6 rounded-md border border-border bg-surface px-6 py-12 text-center">
          <p className="text-sm text-tertiary">
            No strategies to display yet.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {cards.map((card) => {
            const alpha =
              card.strategyReturn !== null && card.benchmarkReturn !== null
                ? card.strategyReturn - card.benchmarkReturn
                : null;
            return (
              <section
                key={card.id}
                className="rounded-md border border-border bg-surface px-6 py-6"
              >
                <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground">
                  {card.name}
                </h3>
                <p className="mt-1 text-sm text-secondary">
                  {card.shortDescription}
                </p>
                <div className="mt-6">
                  <EquityCurveChart series={card.series} height={280} />
                </div>
                {card.strategyReturn !== null &&
                  card.benchmarkReturn !== null &&
                  alpha !== null && (
                    <div className="mt-4 flex items-center justify-between gap-4 text-xs">
                      <span className="text-secondary">
                        {card.name}{" "}
                        <strong className="text-foreground">
                          {fmt(card.strategyReturn)}
                        </strong>
                      </span>
                      <span className="text-secondary">
                        {card.benchmarkSymbol}{" "}
                        <strong className="text-foreground">
                          {fmt(card.benchmarkReturn)}
                        </strong>
                      </span>
                      <span className="text-secondary">
                        <strong className="text-foreground">
                          {alpha >= 0 ? "+" : ""}
                          {alpha.toFixed(2)}% alpha
                        </strong>
                      </span>
                    </div>
                  )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
