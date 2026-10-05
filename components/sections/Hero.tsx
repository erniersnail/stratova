import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { typography } from "@/lib/typography";

export default function Hero() {
  return (
    <Section spacing="none" className="relative min-h-[60vh] overflow-hidden">
      {/* Full-width background image - fades from right into the text area */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-architecture.svg"
          alt=""
          fill
          priority
          className="object-cover object-right"
          style={{
            filter: 'grayscale(100%) brightness(1.08)',
            maskImage: 'linear-gradient(to right, transparent 0%, transparent 35%, black 55%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 35%, black 55%, black 100%)',
          }}
          sizes="100vw"
        />
      </div>
      {/* White gradient overlay for extra smoothness */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-white via-white/60 to-transparent" />

      {/* Text content */}
      <Container size="default" className="relative z-10">
        <div className="max-w-[600px] py-10 lg:py-14">
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
            <Button href="/research" variant="primary" size="md">
              Explore Research
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