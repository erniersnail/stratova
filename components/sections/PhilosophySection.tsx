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
    <Section spacing="sm">
      <Container size="default">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SectionHeader
              title="Our Investment Philosophy"
              description="Our approach to investment research is guided by principles that emphasize evidence, discipline, and adaptability over intuition, timing, and rigidity."
              centered={false}
            />
          </div>
          <div className="lg:col-span-3">
            {PHILOSOPHY_BLOCKS.map((block, index) => (
              <div key={block.number}>
                {index > 0 && <hr className="mb-6 border-t border-border" />}
                <div className="flex gap-6">
                  <span className="block text-5xl md:text-6xl lg:text-7xl font-light leading-none text-stone-600">
                    {block.number}
                  </span>
                  <div>
                    <h3 className="text-lg font-medium">{block.heading}</h3>
                    <p className={`${typography.body} mt-2 text-secondary`}>
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