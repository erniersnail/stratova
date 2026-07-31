import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { typography } from "@/lib/typography";

export default function Hero() {
  return (
    <Section spacing="none" className="min-h-[90vh]">
      <Container size="default">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-0">
          {/* Left column - Text (60%) */}
          <div className="flex flex-col justify-center py-20 lg:py-28 lg:pr-16">
            <h1 className={`${typography.hero} text-foreground`}>
              Systematic investing.
              <br />
              Disciplined for the long term.
            </h1>
            <p className="mt-12 max-w-[520px] text-base leading-[1.75] text-secondary">
              Stratova Quant develops disciplined, evidence-based systematic
              investment research for long-term investors across U.S. and Indian
              equity markets.
            </p>
            <div className="mt-14 flex flex-wrap items-center gap-4">
              <Button href="/research" variant="primary" size="md">
                Explore Research
              </Button>
              <Button href="/methodology" variant="secondary" size="md">
                Our Methodology
              </Button>
            </div>
            <p className={`${typography.muted} mt-12`}>
              Independent quantitative investment research.
            </p>
          </div>

          {/* Right column - Image (40%) */}
          <div className="relative h-[50vh] lg:h-auto lg:min-h-[90vh]">
              <Image
                src="/images/hero-architecture.svg"
                alt=""
                fill
                priority
                className="object-cover"
                style={{
                  filter: 'grayscale(100%) brightness(1.08)',
                }}
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            {/* White gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent" />
          </div>
        </div>
      </Container>
    </Section>
  );
}