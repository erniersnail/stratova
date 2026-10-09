import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import EquityCurveChart, {
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
          { name: "Combined Portfolio", color: "#111111", data: combined, emphasis: "primary" },
          { name: "NIFTY 500", color: "#b08900", data: bmCurve, emphasis: "secondary" },
        ]
      : [];
  // Headline returns for the stats block (same math as the chart series).
  const combinedReturn =
    combined.length >= 2
      ? (combined[combined.length - 1].value / 100 - 1) * 100
      : null;
  const niftyReturn =
    bmCurve.length >= 2
      ? (bmCurve[bmCurve.length - 1].value / 100 - 1) * 100
      : null;
  return (
    <Section spacing="md">
      <Container size="default">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">

          {/* LEFT: 2 columns of 5 — title, copy, CTA, stats */}
          <div className="lg:col-span-2">
            <h2 className={`${typography.h2} text-foreground sm:text-4xl`}>
              Portfolio performance
            </h2>
            <p className="mt-3 text-lg text-foreground/85">
              Combined return vs NIFTY 500.
            </p>
            <p className="mt-4 text-base leading-[1.75] text-secondary">
              Performance is best read alongside methodology, benchmark
              selection, and portfolio construction. Our reporting favors
              transparency over headline numbers.
            </p>

            <Button
              href="/methodology"
              variant="primary"
              size="md"
              className="mt-8"
            >
              View Methodology
            </Button>
          </div>

          {/* RIGHT: 3 columns of 5 — chart card only */}
          <div className="lg:col-span-3">
            <div className="rounded-md border border-border bg-surface px-6 py-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-secondary">
                  Rebased to 100 on 3 Aug 2026
                </p>
                <p className="text-sm text-tertiary">
                  Live from daily snapshots.
                </p>
              </div>

              {series.length > 0 ? (
                <>
                  <div className="mt-6">
                    <EquityCurveChart series={series} height={280} />
                  </div>
                  {combinedReturn !== null && niftyReturn !== null && (
                    <>
                      <div className="mt-4 flex items-center justify-between gap-4 text-xs">
                        <span className="text-secondary">
                          Combined Portfolio{" "}
                          <strong className="text-foreground">
                            {combinedReturn >= 0 ? "+" : ""}
                            {combinedReturn.toFixed(2)}%
                          </strong>
                        </span>
                        <span className="text-secondary">
                          NIFTY 500{" "}
                          <strong className="text-foreground">
                            {niftyReturn >= 0 ? "+" : ""}
                            {niftyReturn.toFixed(2)}%
                          </strong>
                        </span>
                        <span className="text-secondary">
                          <strong className="text-foreground">
                            {combinedReturn - niftyReturn >= 0 ? "+" : ""}
                            {(combinedReturn - niftyReturn).toFixed(2)}% alpha
                          </strong>
                        </span>
                      </div>
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
                    </>
                  )}
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
          </div>
        </div>

        <p className="mt-8 text-sm text-secondary">
          Historical performance includes benchmark comparisons and full
          methodology notes.
        </p>
      </Container>
    </Section>
  );
}