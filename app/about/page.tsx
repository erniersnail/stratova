import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/common/PageHeader";
import Divider from "@/components/ui/Divider";
import Mission from "@/components/about/Mission";
import InvestmentPhilosophy from "@/components/about/InvestmentPhilosophy";
import WhoWeServe from "@/components/about/WhoWeServe";
import Values from "@/components/about/Values";

export const metadata = {
  title: "About — Stratova Quant",
  description: "Stratova Quant is an independent quantitative investment research firm. Evidence-based research across U.S. and Indian equity markets.",
};

export default function AboutPage() {
  return (
    <main>
      <Container size="default" className="pt-16 pb-12">
        <PageHeader title="About" description="Stratova Quant is an independent quantitative investment research firm. Evidence-based research across U.S. and Indian equity markets." />
      </Container>

      <Section spacing="sm">
        <Container size="default"><Mission /></Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="sm">
        <Container size="default"><InvestmentPhilosophy /></Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="sm">
        <Container size="default"><WhoWeServe /></Container>
      </Section>

      <Divider spacing="none" className="my-0" />

      <Section spacing="sm">
        <Container size="default"><Values /></Container>
      </Section>
    </main>
  );
}