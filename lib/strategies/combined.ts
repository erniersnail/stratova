import type { ChartSeries } from "@/components/strategies/EquityCurveChart";
import { getBenchmark, getStrategyPerformance, type Strategy } from "./fetch";

export type CombinedResult = {
  series: ChartSeries[];
  combinedReturn: number | null;
  benchmarkReturn: number | null;
  benchmarkLabel: string | null;
};

/**
 * Build a normalized (rebased to 100 at window start) equal-weighted
 * combined curve across the given strategies, plus an optional benchmark
 * curve. Returns series ready to feed EquityCurveChart, plus headline
 * returns for the stats row.
 *
 * Degrades gracefully:
 * - No strategies with >=2 points -> empty series
 * - No benchmark data -> benchmark series omitted, benchmarkReturn null
 */
export async function buildCombinedCurve(
  strategies: Strategy[],
  windowStart: string,
  benchmarkSymbol: string | null,
  benchmarkLabel: string | null,
): Promise<CombinedResult> {
  const snapshots = await Promise.all(
    strategies.map(async (s) => ({
      perf: (await getStrategyPerformance(s.id)).filter(
        (p) => p.date >= windowStart,
      ),
    })),
  );

  const normByDate = new Map<string, { sum: number; count: number }>();
  for (const { perf } of snapshots) {
    if (perf.length < 2 || perf[0].total_value <= 0) continue;
    const first = perf[0].total_value;
    for (const p of perf) {
      const v = (100 * p.total_value) / first;
      const slot = normByDate.get(p.date);
      if (slot) {
        slot.sum += v;
        slot.count += 1;
      } else {
        normByDate.set(p.date, { sum: v, count: 1 });
      }
    }
  }

  const combined = [...normByDate.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([date, { sum, count }]) => ({ date, value: sum / count }));

  const combinedReturn =
    combined.length >= 2
      ? (combined[combined.length - 1].value / 100 - 1) * 100
      : null;

  let bmCurve: { date: string; value: number }[] = [];
  if (benchmarkSymbol) {
    const bm = await getBenchmark(benchmarkSymbol, windowStart);
    if (bm.length >= 2 && bm[0].close > 0) {
      bmCurve = bm.map((b) => ({
        date: b.date,
        value: (100 * b.close) / bm[0].close,
      }));
    }
  }

  const benchmarkReturn =
    bmCurve.length >= 2
      ? (bmCurve[bmCurve.length - 1].value / 100 - 1) * 100
      : null;

  const series: ChartSeries[] = [];
  if (combined.length >= 2) {
    series.push({
      name: "Combined Portfolio",
      color: "var(--color-foreground)",
      data: combined,
      emphasis: "primary",
    });
  }
  if (bmCurve.length >= 2 && benchmarkLabel) {
    series.push({
      name: benchmarkLabel,
      color: "#b08900",
      data: bmCurve,
      emphasis: "secondary",
    });
  }

  return {
    series,
    combinedReturn,
    benchmarkReturn,
    benchmarkLabel: bmCurve.length >= 2 ? benchmarkLabel : null,
  };
}