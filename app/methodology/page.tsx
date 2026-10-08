import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/common/PageHeader";
import SectionHeader from "@/components/common/SectionHeader";
import Divider from "@/components/ui/Divider";
import MethodologyPrinciples from "@/components/methodology/MethodologyPrinciples";
import ResearchLifecycle from "@/components/methodology/ResearchLifecycle";
import DataSources from "@/components/methodology/DataSources";
import ValidationFramework from "@/components/methodology/ValidationFramework";
import RiskManagement from "@/components/methodology/RiskManagement";
import FAQ from "@/components/methodology/FAQ";

export const metadata = {
  title: "Methodology — Stratova Quant",
  description:
    "Our research process transforms investment hypotheses into disciplined, evidence-based investment strategies through systematic testing and continuous validation.",
};

export default function MethodologyPage() {
  return (
    <main>
      <Container size="default" className="pt-16">
        <PageHeader
          title="Methodology"
          description="How we design, test, and operate systematic equity strategies."
        />
      </Container>

      <Section spacing="sm">
        <Container size="default">
          <MethodologyPrinciples />
        </Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="sm">
        <Container size="default">
          <ResearchLifecycle />
        </Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="sm">
        <Container size="default">
          <DataSources />
        </Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="sm">
        <Container size="default">
          <ValidationFramework />
        </Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="sm">
        <Container size="default">
          <RiskManagement />
        </Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="sm">
        <Container size="default">
          <SectionHeader
            title="Investor FAQ"
            description="Answers to common questions about subscribing to and following our strategies."
            centered={false}
          />
          <div className="mt-6">
            <FAQ />
          </div>
        </Container>
      </Section>
    </main>
  );
}