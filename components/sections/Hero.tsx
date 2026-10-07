import Image from "next/image";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Button from "@/components/ui/Button";
import { typography } from "@/lib/typography";

export default function Hero() {
  return (
    <Section
      spacing="none"
      className="relative min-h-[560px] overflow-hidden lg:min-h-[640px]"
    >
      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.png"
          alt=""
          fill
          priority
          className="object-cover object-right"
          sizes="100vw"
        />
      </div>

      {/* Gradient overlay - light on left for text legibility, fades to transparent */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#faf8f4] via-[#faf8f4]/85 to-transparent" />

      {/* Text content */}
      <Container size="default" className="relative z-10">
        <div className="flex max-w-[720px] flex-col justify-center min-h-[560px] lg:min-h-[640px]">
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