import type { Metadata } from "next";
import PageHeader from "@/components/common/PageHeader";
import Container from "@/components/layout/Container";
import EquityCurveChart, { type ChartSeries } from "@/components/strategies/EquityCurveChart";
import { typography } from "@/lib/typography";
import {
  getPublicStrategies,
  getStrategyPerformance,
  getBenchmark,
} from "@/lib/strategies/fetch";

export const metadata: Metadata = {
  title: "Performance — Stratova Quant",
  description:
    "Live results for every Stratova strategy. Net of costs. Benchmarked against the corresponding NSE cap-segment index.",
};

// Refresh the rendered data every 5 minutes instead of freezing at build.
export const revalidate = 300;

const START_DATE = "2026-08-03";

type NormPoint = { date: string; value: number };

/** Normalize points to 100 at the first point on/after START_DATE.
 *  Returns [] if fewer than 2 points or base is falsy. */
function normalize(points: { date: string; value: number }[]): NormPoint[] {
  const filtered = points.filter((p) => p.date >= START_DATE);
  if (filtered.length < 2) return [];
  const base = filtered[0].value;
  if (!base) return [];
  return filtered.map((p) => ({ date: p.date, value: (100 * p.value) / base }));
}

function returnPct(series: NormPoint[]): number | null {
  if (series.length === 0) return null;
  return series[series.length - 1].value - 100;
}

function fmt(v: number): string {
  return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
}

export default async function PerformancePage() {
  const strategies = (await getPublicStrategies()).filter((s) => s.region === "india");

  const strategyData = await Promise.all(
    strategies.map(async (s) => {
      const [perf, bench] = await Promise.all([
        getStrategyPerformance(s.id),
        s.benchmark ? getBenchmark(s.benchmark, START_DATE) : Promise.resolve([]),
      ]);
      return { strategy: s, perf, bench };
    }),
  );

  const cards = strategyData
    .map(({ strategy, perf, bench }) => {
      const strategySeries = normalize(
        perf.map((p) => ({ date: p.date, value: p.total_value })),
      );
      const benchmarkSymbol = strategy.benchmark;
      const benchmarkSeries = benchmarkSymbol
        ? normalize(bench.map((p) => ({ date: p.date, value: p.close })))
        : [];
      return { strategy, strategySeries, benchmarkSymbol, benchmarkSeries };
    })
    .filter((c) => c.strategySeries.length >= 2 && c.benchmarkSeries.length >= 2);

  // Combined equal-weighted portfolio: per-date average of normalized values.
  const dateMap = new Map<string, { sum: number; count: number }>();
  for (const { strategySeries } of cards) {
    for (const pt of strategySeries) {
      const entry = dateMap.get(pt.date) ?? { sum: 0, count: 0 };
      entry.sum += pt.value;
      entry.count += 1;
      dateMap.set(pt.date, entry);
    }
  }
  const combinedSeries: NormPoint[] = [...dateMap.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([date, { sum, count }]) => ({ date, value: sum / count }));

  const nifty500Series = normalize(
    (await getBenchmark("NIFTY 500", START_DATE)).map((p) => ({
      date: p.date,
      value: p.close,
    })),
  );

  const combinedReturn = returnPct(combinedSeries);
  const niftyReturn = returnPct(nifty500Series);
  const showCombined = combinedSeries.length >= 2 && nifty500Series.length >= 2;

  const combinedChart: ChartSeries[] = [
    { name: "Combined Portfolio", color: "#111111", data: combinedSeries, emphasis: "primary" },
    { name: "NIFTY 500", color: "#b08900", data: nifty500Series, emphasis: "secondary" },
  ];

  return (
    <main>
      <Container size="default" className="py-20">
        <PageHeader
          title="Performance"
          description="Live results for every Stratova strategy. Net of costs. Benchmarked against the corresponding NSE cap-segment index."
        />

        {/* Combined portfolio vs NIFTY 500 */}
        <section className="mt-16">
          <div className="rounded-md border border-border bg-surface px-6 py-8">
            <h2 className={`${typography.h3} text-foreground`}>
              Combined portfolio vs NIFTY 500
            </h2>
            <p className="mt-1 text-sm text-tertiary">
              Equal-weighted across all active India strategies. Rebased to 100 on 3 Aug
              2026.
            </p>
            <div className="mt-6">
              <EquityCurveChart series={combinedChart} height={400} />
            </div>
            {showCombined && combinedReturn !== null && niftyReturn !== null && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 text-sm">
                <span className="text-secondary">
                  Combined Portfolio{" "}
                  <strong className="text-foreground">{fmt(combinedReturn)}</strong>
                </span>
                <span className="text-secondary">
                  NIFTY 500 <strong className="text-foreground">{fmt(niftyReturn)}</strong>
                </span>
                <span className="text-foreground">
                  <strong>{fmt(combinedReturn - niftyReturn)} alpha</strong>
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Per-strategy cards */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {cards.map(
            ({ strategy, strategySeries, benchmarkSymbol, benchmarkSeries }) => {
              const sReturn = returnPct(strategySeries);
              const bReturn = returnPct(benchmarkSeries);
              const alpha =
                sReturn !== null && bReturn !== null ? sReturn - bReturn : null;
              const cardSeries: ChartSeries[] = [
                { name: strategy.name, color: "#111111", data: strategySeries, emphasis: "primary" },
                ...(benchmarkSymbol
                  ? [
                      {
                        name: benchmarkSymbol,
                        color: "#b08900",
                        data: benchmarkSeries,
                        emphasis: "secondary" as const,
                      },
                    ]
                  : []),
              ];
              return (
                <section
                  key={strategy.id}
                  className="rounded-md border border-border bg-surface px-6 py-6"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground">
                      {strategy.name}
                    </h3>
                    <span className="text-xs uppercase tracking-wider text-tertiary">
                      {strategy.risk_level} risk
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-secondary">
                    {strategy.short_description}
                  </p>
                  <div className="mt-6">
                    <EquityCurveChart series={cardSeries} height={280} />
                  </div>
                  {sReturn !== null && bReturn !== null && alpha !== null && (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs text-secondary">
                      <span>Since 3 Aug 2026</span>
                      <span>
                        {strategy.name}{" "}
                        <strong className="text-foreground">{fmt(sReturn)}</strong>
                        &nbsp;·&nbsp;
                        {benchmarkSymbol}{" "}
                        <strong className="text-foreground">{fmt(bReturn)}</strong>
                        &nbsp;·&nbsp;
                        <strong className="text-foreground">{fmt(alpha)} alpha</strong>
                      </span>
                    </div>
                  )}
                </section>
              );
            },
          )}
        </div>

        {/* Disclaimer */}
        <p className="mt-12 text-sm text-tertiary">
          Past performance does not indicate future results. All returns are normalized to
          100 at 3 August 2026 and are net of transaction costs. Live tracking began August
          2026 — the track record is short and not statistically significant.
        </p>
      </Container>
    </main>
  );
}
