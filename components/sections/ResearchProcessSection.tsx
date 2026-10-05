import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import { typography } from "@/lib/typography";

type ProcessStep = {
  number: string;
  heading: string;
  body: string;
};

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    heading: "Hypothesis",
    body: "Every idea begins with a clearly defined investment hypothesis.",
  },
  {
    number: "02",
    heading: "Data Collection",
    body: "Relevant historical market and fundamental data are gathered and validated.",
  },
  {
    number: "03",
    heading: "Testing",
    body: "The hypothesis is evaluated through systematic backtesting and robustness checks.",
  },
  {
    number: "04",
    heading: "Portfolio Construction",
    body: "Promising ideas are translated into disciplined portfolio rules and risk constraints.",
  },
  {
    number: "05",
    heading: "Monitoring",
    body: "Strategies are continuously monitored and refined as markets evolve.",
  },
];

export default function ResearchProcessSection() {
  return (
    <Section spacing="sm">
      <Container size="default">
        <div className="text-center">
          <span className="text-sm font-semibold tracking-[0.15em] text-secondary">
            PROCESS
          </span>
          <h2 className={`${typography.h2} mt-4`}>
            How Research Becomes a Strategy
          </h2>
          <p
            className={`${typography.body} mx-auto mt-4 max-w-[620px] text-secondary`}
          >
            Every research publication follows a structured process designed to
            test ideas before they become investment strategies.
          </p>
          <div className="mx-auto mt-6 w-24 border-b border-border" />
        </div>

        <div className="mt-10 lg:mt-12">
          {/* Desktop: horizontal timeline */}
          <ol className="hidden lg:grid lg:grid-cols-5 lg:gap-8">
            {PROCESS_STEPS.map((step, index) => (
              <li key={step.number} className="relative">
                <div className="flex items-center">
                  <span className="shrink-0 text-7xl font-light leading-none text-stone-600">
                    {step.number}
                  </span>
                  {index < PROCESS_STEPS.length - 1 && (
                    <div
                      className="mx-4 h-[1.5px] flex-1 bg-stone-500"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <h3 className="mt-3 text-lg font-medium">{step.heading}</h3>
                <p
                  className={`${typography.body} mt-2 text-secondary`}
                >
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          {/* Mobile & tablet: vertical timeline */}
          <ol className="relative lg:hidden">
            <div
              className="absolute left-[23px] top-0 h-full w-[1.5px] bg-stone-500"
              aria-hidden="true"
            />
            {PROCESS_STEPS.map((step) => (
              <li
                key={step.number}
                className="relative pb-8 last:pb-0"
              >
                <div className="flex items-start gap-6">
                  <span className="relative inline-flex h-[46px] w-[46px] shrink-0 items-center justify-center bg-background text-lg font-light leading-none text-stone-600">
                    {step.number}
                  </span>
                  <div className="pt-2">
                    <h3 className="text-lg font-medium">{step.heading}</h3>
                    <p
                      className={`${typography.body} mt-2 text-secondary`}
                    >
                      {step.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}