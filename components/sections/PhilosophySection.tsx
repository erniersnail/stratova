import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";

type PhilosophyBlock = {
  number: string;
  heading: string;
  body: string;
};

const PHILOSOPHY_BLOCKS: PhilosophyBlock[] = [
  {
    number: "01",
    heading: "Evidence over opinion",
    body: "Investment decisions should emerge from research, testing, and observable data rather than narratives.",
  },
  {
    number: "02",
    heading: "Process over prediction",
    body: "We believe disciplined investment processes are more reliable than attempting to forecast short-term market movements.",
  },
  {
    number: "03",
    heading: "Continuous improvement",
    body: "Every strategy is monitored, reviewed, and refined as new information and market conditions evolve.",
  },
];

export default function PhilosophySection() {
  return (
    <Section spacing="md">
      <Container size="default">
        {/* Centered header */}
        <div className="text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Our Investment Philosophy
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-base leading-[1.75] text-secondary">
            Our approach to investment research is guided by principles
            that emphasize evidence, discipline, and adaptability over
            intuition, timing, and rigidity.
          </p>
        </div>

        {/* 3-column grid */}
        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {PHILOSOPHY_BLOCKS.map((block) => (
            <div key={block.number}>
              <div className="font-serif text-6xl font-semibold text-foreground">
                {block.number}
              </div>
              <h3 className="mt-4 text-lg font-medium text-foreground">
                {block.heading}
              </h3>
              <p className="mt-2 text-sm leading-[1.7] text-secondary">
                {block.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}