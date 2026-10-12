import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import HomepagePerformanceToggle from "@/components/sections/HomepagePerformanceToggle";
import { getPublicStrategies } from "@/lib/strategies/fetch";
import { buildCombinedCurve } from "@/lib/strategies/combined";
import { typography } from "@/lib/typography";

// Combined-curve window: Aug 3 2026 (both NSE and US seed start).
const WINDOW_START = "2026-08-03";

export default async function PerformancePreviewSection() {
  const strategies = await getPublicStrategies();
  const indiaStrategies = strategies.filter((s) => s.region === "india");
  const usStrategies = strategies.filter((s) => s.region === "us");

  const [nse, us] = await Promise.all([
    buildCombinedCurve(indiaStrategies, WINDOW_START, "NIFTY 500", "NIFTY 500"),
    // QQQ not yet in `benchmarks`; chart renders without a benchmark line
    // until the VM adds it. Label kept for when data lands.
    buildCombinedCurve(usStrategies, WINDOW_START, "QQQ", "Nasdaq-100"),
  ]);

  return (
    <Section spacing="md">
      <Container size="default">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className={`${typography.h2} text-foreground sm:text-4xl`}>
              Portfolio performance
            </h2>
            <p className="mt-3 text-lg text-foreground/85">
              Combined return vs benchmark.
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

          <div className="lg:col-span-3">
            <HomepagePerformanceToggle
              nse={{
                series: nse.series,
                combinedReturn: nse.combinedReturn,
                benchmarkReturn: nse.benchmarkReturn,
                benchmarkLabel: nse.benchmarkLabel,
                caption: "Combined India portfolio vs NIFTY 500",
              }}
              us={{
                series: us.series,
                combinedReturn: us.combinedReturn,
                benchmarkReturn: us.benchmarkReturn,
                benchmarkLabel: us.benchmarkLabel,
                caption: "U.S. Equity Leadership vs Nasdaq-100",
              }}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
