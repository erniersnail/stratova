import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const PRINCIPLES = [
  {
    number: "01",
    title: "Evidence over opinion",
    description:
      "Every investment hypothesis must be grounded in empirical evidence. We do not rely on market narratives, macroeconomic forecasts, or intuition. Decisions emerge from data, testing, and observable outcomes.",
  },
  {
    number: "02",
    title: "Repeatability",
    description:
      "A strategy is only valid if its results can be reproduced by an independent researcher using the same methodology and data. All research is documented with sufficient detail to enable independent verification.",
  },
  {
    number: "03",
    title: "Transparency",
    description:
      "We publish what we can and are explicit about what we do not. Universe rules, rebalance cadence, weighting scheme, portfolio constraints, and the validation approach are disclosed for every strategy. The specific filter criteria are proprietary and remain undisclosed — the only material aspect of the process we do not publish.",
  },
  {
    number: "04",
    title: "Continuous improvement",
    description:
      "Markets evolve, and research must evolve with them. Strategies are monitored, reviewed, and refined as new data, techniques, and academic research become available.",
  },
];

export default function MethodologyPrinciples() {
  return (
    <div>
      <SectionHeader
        title="Core Research Principles"
        description="Four principles guide every research decision at Simplicial Capital."
        centered={false}
      />
      <div className="mt-8 space-y-8">
        {PRINCIPLES.map((principle, index) => (
          <div key={principle.number}>
            {index > 0 && <hr className="mb-8 border-t border-border" />}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[80px_1fr]">
              <span className="text-4xl font-light leading-none text-tertiary">
                {principle.number}
              </span>
              <div>
                <h3 className="text-xl font-medium">{principle.title}</h3>
                <p className={`${typography.body} mt-2 text-secondary`}>
                  {principle.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}