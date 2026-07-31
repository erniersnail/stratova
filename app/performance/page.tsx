import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/common/PageHeader";
import Divider from "@/components/ui/Divider";
import PerformancePhilosophy from "@/components/performance/PerformancePhilosophy";
import ReportingFramework from "@/components/performance/ReportingFramework";
import BenchmarkPolicy from "@/components/performance/BenchmarkPolicy";
import PerformanceFAQ from "@/components/performance/PerformanceFAQ";

export const metadata = {
  title: "Performance — Stratova Quant",
  description: "How performance is reported at Stratova Quant. Benchmark-relative evaluation, risk-adjusted measurement, and full disclosure of assumptions.",
};

export default function PerformancePage() {
  return (
    <main>
      <Container className="py-20">
        <PageHeader title="Performance" description="How performance is reported at Stratova Quant. Benchmark-relative evaluation, risk-adjusted measurement, and full disclosure of assumptions." />
      </Container>

      <Section spacing="lg">
        <Container size="default">
          <PerformancePhilosophy />
        </Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="lg">
        <Container size="default">
          <ReportingFramework />
        </Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="lg">
        <Container size="default">
          <BenchmarkPolicy />
        </Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="lg">
        <Container size="narrow">
          <h2 className="text-2xl font-semibold tracking-tight text-center">Frequently Asked Questions</h2>
          <div className="mt-8"><PerformanceFAQ /></div>
        </Container>
      </Section>
    </main>
  );
}