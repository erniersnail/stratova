import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const STEPS = [
  {
    number: "01",
    title: "Rules-Based",
    description:
      "Every strategy is defined by a fixed set of rules. Rules are established before a strategy is published and are not adjusted based on recent performance or discretionary judgement.",
  },
  {
    number: "02",
    title: "Systematic Selection",
    description:
      "Securities are selected through a systematic process applied to a defined universe. The selection methodology is not disclosed.",
  },
  {
    number: "03",
    title: "Portfolio Construction",
    description:
      "Positions are equally weighted. Every position receives the same allocation. No conviction bets, no overweights. The number of positions per portfolio is fixed and published alongside each strategy.",
  },
  {
    number: "04",
    title: "Rebalancing",
    description:
      "Each strategy rebalances on a fixed cadence. Rebalance dates are published in advance. Strategies do not deviate from their schedule.",
  },
];

export default function ResearchLifecycle() {
  return (
    <div>
      <SectionHeader
        title="Strategy Design"
        description="Every strategy follows a fixed set of rules — decided in advance, applied consistently, and never overridden by discretion."
        centered={false}
      />
      <div className="mt-8 space-y-8">
        {STEPS.map((step, index) => (
          <div key={step.number}>
            {index > 0 && <hr className="mb-8 border-t border-border" />}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[80px_1fr]">
              <span className="text-4xl font-light leading-none text-tertiary">
                {step.number}
              </span>
              <div>
                <h3 className="text-xl font-medium">{step.title}</h3>
                <p className={`${typography.body} mt-2 text-secondary`}>
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}