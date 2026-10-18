import type { Metadata } from "next";
import PageHeader from "@/components/common/PageHeader";
import Container from "@/components/layout/Container";
import EquityCurveChart, {
  type ChartSeries,
} from "@/components/strategies/EquityCurveChart";
import IndividualChartsToggle, {
  type IndividualCardData,
} from "@/components/sections/IndividualChartsToggle";
import { typography } from "@/lib/typography";
import {
  getPublicStrategies,
  getStrategyPerformance,
  getBenchmark,
  type Strategy,
} from "@/lib/strategies/fetch";
import {
  buildCombinedCurve,
  type CombinedResult,
} from "@/lib/strategies/combined";

export const metadata: Metadata = {
  title: "Performance — Simplicial Capital",
  description:
    "Live results for every Simplicial Capital strategy. Net of costs. Benchmarked against the corresponding regional index.",
};

export const revalidate = 300;

const START_DATE = "2026-08-03";

function fmt(v: number): string {
  return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
}

function normalize(
  points: { date: string; value: number }[],
): { date: string; value: number }[] {
  const filtered = points.filter((p) => p.date >= START_DATE);
  if (filtered.length < 2) return [];
  const base = filtered[0].value;
  if (!base) return [];
  return filtered.map((p) => ({
    date: p.date,
    value: (100 * p.value) / base,
  }));
}

async function buildIndividualCards(
  strategies: Strategy[],
): Promise<IndividualCardData[]> {
  const data = await Promise.all(
    strategies.map(async (s) => {
      const [perf, bench] = await Promise.all([
        getStrategyPerformance(s.id),
        s.benchmark
          ? getBenchmark(s.benchmark, START_DATE)
          : Promise.resolve([]),
      ]);
      const strategySeries = normalize(
        perf.map((p) => ({ date: p.date, value: p.total_value })),
      );
      const benchmarkSymbol = s.benchmark;
      const benchmarkSeries = benchmarkSymbol
        ? normalize(bench.map((p) => ({ date: p.date, value: p.close })))
        : [];
      return { strategy: s, strategySeries, benchmarkSymbol, benchmarkSeries };
    }),
  );

  return data
    .filter((d) => d.strategySeries.length >= 2)
    .map(({ strategy, strategySeries, benchmarkSymbol, benchmarkSeries }) => {
      const sReturn =
        strategySeries.length > 0
          ? strategySeries[strategySeries.length - 1].value - 100
          : null;
      const hasBenchmark = benchmarkSeries.length >= 2;
      const bReturn = hasBenchmark
        ? benchmarkSeries[benchmarkSeries.length - 1].value - 100
        : null;
      const series: ChartSeries[] = [
        {
          name: strategy.name,
          color: "var(--color-foreground)",
          data: strategySeries,
          emphasis: "primary",
        },
        ...(hasBenchmark && benchmarkSymbol
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
      return {
        id: strategy.id,
        name: strategy.name,
        shortDescription: strategy.short_description,
        benchmarkSymbol: hasBenchmark ? benchmarkSymbol : null,
        href: strategy.region
          ? `/strategies/${strategy.region}/${strategy.slug}`
          : "/strategies",
        series,
        strategyReturn: sReturn,
        benchmarkReturn: bReturn,
      };
    });
}

function CombinedCard({
  title,
  result,
  height,
}: {
  title: string;
  result: CombinedResult;
  height: number;
}) {
  const hasData = result.series.length > 0;
  const showStats = result.combinedReturn !== null;
  const showAlpha =
    result.combinedReturn !== null && result.benchmarkReturn !== null;
  const showLegend = result.benchmarkLabel !== null;

  return (
    <div className="rounded-md border border-border bg-surface px-6 py-8">
      <h2 className={`${typography.h3} text-foreground`}>{title}</h2>
      <div className="mt-6">
        {hasData ? (
          <EquityCurveChart series={result.series} height={height} />
        ) : (
          <div
            style={{ height }}
            className="flex items-center justify-center rounded-md border border-border"
          >
            <p className="text-sm text-tertiary">No performance data yet.</p>
          </div>
        )}
      </div>
      {showStats && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 text-sm">
          <span className="text-secondary">
            Combined Portfolio{" "}
            <strong className="text-foreground">
              {fmt(result.combinedReturn!)}
            </strong>
          </span>
          {result.benchmarkReturn !== null && result.benchmarkLabel && (
            <span className="text-secondary">
              {result.benchmarkLabel}{" "}
              <strong className="text-foreground">
                {fmt(result.benchmarkReturn)}
              </strong>
            </span>
          )}
          {showAlpha && (
            <span className="text-foreground">
              <strong>
                {fmt(result.combinedReturn! - result.benchmarkReturn!)} alpha
              </strong>
            </span>
          )}
        </div>
      )}
      {showLegend && (
        <div className="mt-3 flex items-center gap-4 text-xs text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 bg-foreground" />
            Strategy
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 bg-[#b08900]" />
            Benchmark
          </span>
        </div>
      )}
    </div>
  );
}

export default async function PerformancePage() {
  const allStrategies = await getPublicStrategies();
  const india = allStrategies.filter((s) => s.region === "india");
  const us = allStrategies.filter((s) => s.region === "us");

  const [combinedNse, combinedUs, nseCards, usCards] = await Promise.all([
    buildCombinedCurve(india, START_DATE, "NIFTY 500", "NIFTY 500"),
    buildCombinedCurve(us, START_DATE, "QQQ", "Nasdaq-100"),
    buildIndividualCards(india),
    buildIndividualCards(us),
  ]);

  return (
    <main>
      <Container size="default" className="py-20">
        <PageHeader
          title="Performance"
          description="Live results for every Simplicial Capital strategy. Net of costs. Benchmarked against the corresponding regional index."
        />

        <section className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <CombinedCard
            title="Combined portfolio vs NIFTY 500"
            result={combinedNse}
            height={400}
          />
          <CombinedCard
            title="Combined portfolio vs Nasdaq-100"
            result={combinedUs}
            height={400}
          />
        </section>

        <section className="mt-16">
          <h2 className={`${typography.h3} text-foreground`}>
            Individual strategies
          </h2>
          <div className="mt-6">
            <IndividualChartsToggle nse={nseCards} us={usCards} />
          </div>
        </section>

        <p className="mt-12 text-sm text-tertiary">
          Past performance does not indicate future results. Track record is
          short and not statistically significant.
        </p>
      </Container>
    </main>
  );
}