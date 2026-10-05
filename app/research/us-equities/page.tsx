import Container from "@/components/layout/Container";
import PageHeader from "@/components/common/PageHeader";
import StrategyCard from "@/components/strategies/StrategyCard";
import { STRATEGIES } from "@/lib/strategies";
import { typography } from "@/lib/typography";

export const metadata = {
  title: "U.S. Equity Strategies — Stratova Quant",
  description:
    "Explore Stratova's quantitative investment strategies for U.S. equities, developed through rigorous research, disciplined portfolio construction, and institutional-grade backtesting.",
};

export default function USEquityStrategiesPage() {
  const usStrategies = STRATEGIES.filter((s) => s.region === "us");

  return (
    <main>
      <Container className="py-20">
        <PageHeader
          title="U.S. Equity Strategies"
          description="Explore Stratova's quantitative investment strategies developed through rigorous research, disciplined portfolio construction, and institutional-grade backtesting."
        />

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {usStrategies.map((strategy) => (
            <StrategyCard key={strategy.slug} strategy={strategy} />
          ))}
        </div>

        <div className="mt-14 border-t border-border pt-8">
          <p className={`${typography.body} text-sm text-secondary`}>
            Additional U.S. equity strategies are currently in research and
            will be added to the library as they complete the validation
            process.
          </p>
        </div>
      </Container>
    </main>
  );
}