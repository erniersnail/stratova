import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Divider from "@/components/ui/Divider";
import { getStrategy, STRATEGIES } from "@/lib/strategies";
import StrategyHero from "@/components/strategies/StrategyHero";
import StrategyOverview from "@/components/strategies/StrategyOverview";
import PerformanceSnapshot from "@/components/strategies/PerformanceSnapshot";
import EquityCurveSection from "@/components/strategies/EquityCurveSection";
import DrawdownSection from "@/components/strategies/DrawdownSection";
import AnnualReturns from "@/components/strategies/AnnualReturns";
import InvestmentPrinciples from "@/components/strategies/InvestmentPrinciples";
import StrategyFAQ from "@/components/strategies/StrategyFAQ";
import RiskDisclosure from "@/components/strategies/RiskDisclosure";

export function generateStaticParams() {
  return STRATEGIES.map((strategy) => ({ slug: strategy.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function StrategyDetailsPage({ params }: Props) {
  const { slug } = await params;
  const strategy = getStrategy(slug);

  if (!strategy) {
    notFound();
  }

  return (
    <main>
      <StrategyHero strategy={strategy} />

      <Section spacing="sm">
        <Container size="default">
          <StrategyOverview paragraphs={strategy.overview} />
        </Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="sm">
        <Container size="default">
          <PerformanceSnapshot metrics={strategy.performanceMetrics} />
        </Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="sm">
        <Container size="default">
          <EquityCurveSection data={strategy.equityCurve} benchmarkLabel={strategy.benchmarkLabel} />
        </Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="sm">
        <Container size="default">
          <DrawdownSection data={strategy.drawdown} benchmarkLabel={strategy.benchmarkLabel} />
        </Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="sm">
        <Container size="default">
          <AnnualReturns rows={strategy.annualReturns} benchmarkLabel={strategy.benchmarkLabel} />
        </Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="sm">
        <Container size="default">
          <InvestmentPrinciples items={strategy.investmentPrinciples} />
        </Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="sm">
        <Container size="narrow">
          <StrategyFAQ items={strategy.faqs} />
        </Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="sm">
        <Container size="narrow">
          <RiskDisclosure disclosure={strategy.riskDisclosure} />
        </Container>
      </Section>
    </main>
  );
}