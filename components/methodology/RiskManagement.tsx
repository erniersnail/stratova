import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const RISK_TOPICS = [
  {
    number: "01",
    title: "Position Weighting",
    description:
      "Positions are equally weighted. Every position receives the same allocation. No single position is larger than any other.",
  },
  {
    number: "02",
    title: "Concentration",
    description:
      "Portfolios are concentrated by design. Position count varies with each rebalance, determined by how many securities pass the strategy's filter criteria. Risk level is published alongside every strategy.",
  },
  {
    number: "03",
    title: "Portfolio Constraints",
    description:
      "Long-only. No leverage. No derivatives. No short positions.",
  },
];

export default function RiskManagement() {
  return (
    <div>
      <SectionHeader
        title="Risk Controls"
        description="Risk management is embedded in the strategy framework. It is not layered on after the fact."
        centered={false}
      />
      <div className="mt-8 space-y-8">
        {RISK_TOPICS.map((topic, index) => (
          <div key={topic.number}>
            {index > 0 && <hr className="mb-8 border-t border-border" />}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[80px_1fr]">
              <span className="text-4xl font-light leading-none text-tertiary">
                {topic.number}
              </span>
              <div>
                <h3 className="text-xl font-medium">{topic.title}</h3>
                <p className={`${typography.body} mt-2 text-secondary`}>
                  {topic.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}