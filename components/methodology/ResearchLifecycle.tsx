import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const STEPS = [
  {
    number: "01",
    title: "Rules-Based",
    description:
      "Every strategy is defined by a fixed set of rules decided before publication. Rules do not change in response to recent performance, market conditions, or discretionary judgement.",
  },
  {
    number: "02",
    title: "Systematic Selection",
    description:
      "Securities are selected from a defined universe by a fully specified, systematic process. The specific filter criteria are proprietary — they form the core of our research process and are not published. Everything else about the strategy is.",
  },
  {
    number: "03",
    title: "Portfolio Construction",
    description:
      "Positions are equally weighted — every position receives the same allocation. The number of holdings is determined at each rebalance by how many securities pass the strategy's filter criteria. There is no fixed target count and no manual adjustment.",
  },
  {
    number: "04",
    title: "Rebalancing",
    description:
      "Each strategy rebalances on a fixed cadence — monthly for Broad Market, Multicap, and U.S. Equity Leadership; quarterly for Midcap and Smallcap. Rebalance dates are published in advance and are not deviated from.",
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