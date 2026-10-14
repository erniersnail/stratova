import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const RISK_TOPICS = [
  {
    number: "01",
    title: "Concentration",
    description:
      "Portfolios are concentrated by design. The number of holdings varies at each rebalance based on filter output, so the portfolio's sector mix, market-cap distribution, and position count can shift meaningfully between rebalances. This is a deliberate feature of the strategy design, not a side effect.",
  },
  {
    number: "02",
    title: "Portfolio Constraints",
    description:
      "Long-only. No leverage. No derivatives. No short positions. Every strategy remains fully invested in listed equity at all times, with only the modest cash weight held between rebalances.",
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