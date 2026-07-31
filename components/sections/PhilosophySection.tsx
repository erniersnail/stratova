import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

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
    <Section spacing="lg">
      <Container size="default">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SectionHeader
              label="PHILOSOPHY"
              title="Our Investment Philosophy"
              description="Our approach to investment research is guided by principles that emphasize evidence, discipline, and adaptability over intuition, timing, and rigidity."
              centered={false}
            />
          </div>
          <div className="lg:col-span-3">
            {PHILOSOPHY_BLOCKS.map((block, index) => (
              <div key={block.number}>
                {index > 0 && <hr className="mb-10 border-t border-border" />}
                <div className="flex gap-8">
                  <span className="block text-6xl md:text-7xl lg:text-8xl font-light leading-none text-stone-600">
                    {block.number}
                  </span>
                  <div>
                    <h3 className="text-xl font-medium">{block.heading}</h3>
                    <p className={`${typography.body} mt-3 text-secondary`}>
                      {block.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}