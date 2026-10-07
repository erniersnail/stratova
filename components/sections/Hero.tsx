import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Button from "@/components/ui/Button";
import { typography } from "@/lib/typography";

export default function Hero() {
  return (
    <Section spacing="lg">
      {/* Text content */}
      <Container size="default">
        <div className="max-w-[720px]">
          <h1 className={`${typography.hero} text-foreground`}>
            Systematic investing.
            <br />
            Disciplined for the long term.
          </h1>
          <p className="mt-8 max-w-[520px] text-base leading-[1.75] text-secondary">
            Stratova Quant develops disciplined, evidence-based systematic
            investment research for long-term investors across U.S. and Indian
            equity markets.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/strategies" variant="primary" size="md">
              View Strategies
            </Button>
            <Button href="/methodology" variant="secondary" size="md">
              Our Methodology
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}