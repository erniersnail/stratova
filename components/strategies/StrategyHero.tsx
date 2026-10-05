import Container from "@/components/layout/Container";
import { typography } from "@/lib/typography";
import type { Strategy } from "@/lib/strategies";

type StrategyHeroProps = {
  strategy: Strategy;
};

export default function StrategyHero({ strategy }: StrategyHeroProps) {
  return (
    <section className="border-b border-border bg-surface">
      <Container className="py-12 lg:py-16">
        <div className="max-w-[720px]">
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium tracking-widest text-tertiary uppercase">
            <span>{strategy.category}</span>
            <span aria-hidden="true" className="text-border">/</span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-[#059669]"
                aria-hidden="true"
              />
              {strategy.status}
            </span>
            <span aria-hidden="true" className="text-border">/</span>
            <span>Research Period: {strategy.researchPeriod}</span>
          </div>
          <h1 className={`${typography.h1} mt-6`}>{strategy.heroTitle}</h1>
          <p className={`${typography.body} mt-6 max-w-[620px] text-secondary`}>
            {strategy.heroDescription}
          </p>
        </div>
      </Container>
    </section>
  );
}