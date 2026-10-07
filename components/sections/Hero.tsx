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
          className="object-cover object-right brightness-[0.95] contrast-[1.05]"
          sizes="100vw"
        />
      </div>

      {/* Gradient overlay - light on left for text legibility, fades to transparent */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#faf8f4] from-25% via-[#faf8f4]/90 via-55% to-transparent to-85%" />

      {/* Text content */}
      <Container size="default" className="relative z-10">
        <div className="flex max-w-[720px] flex-col justify-center min-h-[560px] lg:min-h-[640px]">
          <h1 className={`${typography.hero} text-foreground`}>
            Systematic investing.
            <br />
            Built to compound.
          </h1>
          <p className="mt-8 max-w-[560px] text-lg leading-[1.7] text-foreground/85">
            Stratova applies the same rigor quant funds use — algorithms,
            data, discipline — bringing institutional-grade systematic
            research to individual investors.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/strategies" variant="primary" size="md">
              View Strategies
            </Button>
            <Button href="/performance" variant="secondary" size="md">
              See Performance
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}