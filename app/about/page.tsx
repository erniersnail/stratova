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
  description: "Stratova applies the same rigor quant funds use — algorithms, data, discipline — bringing institutional-grade systematic research to individual investors.",
};

export default function AboutPage() {
  return (
    <main>
      <Container size="default" className="pt-16 pb-12">
        <PageHeader title="About" description="We apply the same rigor quant funds use to build systematic strategies for individual investors." />
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