import Link from "next/link";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import EquityCurveChart, {
  SERIES_COLORS,
  type ChartSeries,
} from "@/components/strategies/EquityCurveChart";
import {
  getBenchmark,
  getPublicStrategies,
  getStrategyPerformance,
} from "@/lib/strategies/fetch";
import { typography } from "@/lib/typography";

export default async function PerformancePreviewSection() {
  // Combined India portfolio vs NIFTY 500, normalized to 100 at window start.
  const WINDOW_START = "2026-08-03";
  const strategies = (await getPublicStrategies()).filter(
    (s) => s.region === "india",
  );
  const snapshots = await Promise.all(
    strategies.map(async (strategy) => ({
      name: strategy.name,
      perf: (await getStrategyPerformance(strategy.id)).filter(
        (p) => p.date >= WINDOW_START,
      ),
    })),
  );

  // Equal-weighted combined curve: per date, average normalized values
  // across strategies that have data on that date.
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

  const bm = await getBenchmark("NIFTY 500", WINDOW_START);
  const bmCurve =
    bm.length >= 2 && bm[0].close > 0
      ? bm.map((b) => ({
          date: b.date,
          value: (100 * b.close) / bm[0].close,
        }))
      : [];

  const series: ChartSeries[] =
    combined.length >= 2 && bmCurve.length >= 2
      ? [
          { name: "Combined Portfolio", color: "#111111", data: combined },
          { name: "NIFTY 500", color: "#b08900", data: bmCurve },
        ]
      : [];
  const legend: { name: string; returnPct: string; color: string }[] =
    series.map((s) => ({
      name: s.name,
      returnPct: (
        (s.data[s.data.length - 1].value / 100 - 1) *
        100
      ).toFixed(2),
      color: s.color ?? SERIES_COLORS[0],
    }));
  return (
    <Section spacing="sm">
      <Container size="default">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left column */}
          <div className="lg:col-span-2">
            <h2 className={`${typography.h2}`}>Portfolio performance</h2>
            <p className={`${typography.body} mt-4 text-secondary`}>
              Combined return across all active strategies, vs NIFTY 500.
            </p>
            <p className={`${typography.body} mt-4 text-secondary`}>
              Performance should always be interpreted alongside methodology,
              benchmark selection, assumptions, portfolio construction,
              turnover, and risk characteristics.
            </p>
            <p className={`${typography.body} mt-3 text-secondary`}>
              Our reporting framework is designed to emphasize transparency
              over headline numbers.
            </p>
            <div className="mt-4">
              <Button href="/methodology" variant="secondary" size="md">
                View Methodology
              </Button>
            </div>
            <div className="mt-6 border-b border-border" />
          </div>

          {/* Right column */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-border bg-surface p-6">
              {/* Paper header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium">Strategy performance</h3>
                  <p className="mt-1 text-sm text-secondary">
                    Normalized to 100 at inception
                  </p>
                </div>
                <span className="shrink-0 text-xs text-secondary">
                  Live from daily snapshots.
                </span>
              </div>

              {series.length > 0 ? (
                <>
                  {/* Live multi-strategy chart */}
                  <div className="mt-6">
                    <EquityCurveChart series={series} height={280} />
                  </div>
                  <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {legend.map((item) => (
                      <li
                        key={item.name}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span
                          aria-hidden="true"
                          className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-foreground">{item.name}</span>
                        <span className="text-secondary">
                          {item.returnPct.startsWith("-")
                            ? `${item.returnPct}%`
                            : `+${item.returnPct}%`}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/strategies"
                    className="mt-4 inline-block text-sm font-medium text-foreground underline hover:no-underline"
                  >
                    See all strategies &rarr;
                  </Link>
                </>
              ) : (
                /* Original empty placeholder — shown until strategies publish data */
                <div
                  className="relative mt-6 h-[200px] w-full rounded-md border border-border"
                  role="img"
                  aria-label="Chart placeholder. Empty plotting area with labeled axes. No data is displayed because performance is presented alongside methodology in a private setting."
                >
                <svg
                  viewBox="0 0 600 240"
                  className="h-full w-full"
                  preserveAspectRatio="none"
                >
                  {/* Y-axis */}
                  <line
                    x1="80"
                    y1="20"
                    x2="80"
                    y2="200"
                    stroke="#E5E4E0"
                    strokeWidth="1"
                  />
                  {/* X-axis */}
                  <line
                    x1="80"
                    y1="200"
                    x2="580"
                    y2="200"
                    stroke="#E5E4E0"
                    strokeWidth="1"
                  />
                  {/* Grid lines */}
                  <line
                    x1="80"
                    y1="65"
                    x2="580"
                    y2="65"
                    stroke="#E5E4E0"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1="80"
                    y1="110"
                    x2="580"
                    y2="110"
                    stroke="#E5E4E0"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1="80"
                    y1="155"
                    x2="580"
                    y2="155"
                    stroke="#E5E4E0"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                  />
                  {/* Axis labels */}
                  <text
                    x="85"
                    y="204"
                    fill="#A8A6A1"
                    fontSize="10"
                    fontFamily="Inter, sans-serif"
                  >
                    0
                  </text>
                  <text
                    x="85"
                    y="69"
                    fill="#A8A6A1"
                    fontSize="10"
                    fontFamily="Inter, sans-serif"
                  >
                    100
                  </text>
                  <text
                    x="85"
                    y="114"
                    fill="#A8A6A1"
                    fontSize="10"
                    fontFamily="Inter, sans-serif"
                  >
                    50
                  </text>
                </svg>
                </div>
              )}
            </div>

            {/* Muted note */}
            <p className="mt-3 text-xs leading-relaxed text-secondary">
              Historical performance includes benchmark comparisons and full
              methodology notes.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}