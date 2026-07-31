import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/common/PageHeader";
import Divider from "@/components/ui/Divider";
import MethodologyPrinciples from "@/components/methodology/MethodologyPrinciples";
import ResearchLifecycle from "@/components/methodology/ResearchLifecycle";
import DataSources from "@/components/methodology/DataSources";
import ValidationFramework from "@/components/methodology/ValidationFramework";
import RiskManagement from "@/components/methodology/RiskManagement";
import FAQ from "@/components/methodology/FAQ";

export default function MethodologyPage() {
  return (
    <main>
      <Container className="py-20">
        <PageHeader
          title="Methodology"
          description="Our research process transforms investment hypotheses into disciplined, evidence-based investment strategies through systematic testing and continuous validation."
        />
      </Container>

      <Section spacing="lg">
        <Container size="default">
          <MethodologyPrinciples />
        </Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="lg">
        <Container size="default">
          <ResearchLifecycle />
        </Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="lg">
        <Container size="default">
          <DataSources />
        </Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="lg">
        <Container size="default">
          <ValidationFramework />
        </Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="lg">
        <Container size="default">
          <RiskManagement />
        </Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="lg">
        <Container size="narrow">
          <h2 className="text-2xl font-semibold tracking-tight text-center">
            Frequently Asked Questions
          </h2>
          <div className="mt-8">
            <FAQ />
          </div>
        </Container>
      </Section>
    </main>
  );
}