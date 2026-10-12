import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const BELIEFS = [
  {
    number: "01",
    title: "Markets reward patience",
    desc: "Short-term price movement is dominated by noise, but long-term value accumulates for those who let well-researched positions compound through full market cycles rather than reacting to every fluctuation.",
  },
  {
    number: "02",
    title: "Understanding beats prediction",
    desc: "We do not attempt to forecast where markets are heading next. Instead we study how markets actually behave and build rules that have performed consistently across diverse conditions.",
  },
  {
    number: "03",
    title: "Simple ideas, disciplined execution",
    desc: "The most robust strategies rest on simple, well-understood ideas applied with discipline. Complexity that merely overfits to historical data is a liability, not a strength.",
  },
  {
    number: "04",
    title: "Open research advances the field",
    desc: "We publish our methodology, assumptions, and findings openly so others can verify and build upon our work. The entire field benefits when research is reproducible.",
  },
];

export default function InvestmentPhilosophy() {
  return (
    <div>
      <SectionHeader
        title="What We Believe"
        description="The convictions that shape how we approach markets and research."
        centered={false}
      />
      <div className="mt-10 grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
        {BELIEFS.map((b) => (
          <div key={b.number} className="grid grid-cols-[64px_1fr] gap-4">
            <span className="text-3xl font-light leading-none text-tertiary">
              {b.number}
            </span>
            <div>
              <h3 className="text-lg font-medium text-foreground">{b.title}</h3>
              <p className={`${typography.body} mt-2 text-secondary`}>
                {b.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}