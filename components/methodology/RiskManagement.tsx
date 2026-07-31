import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const RISK_TOPICS = [
  {
    title: "Position Sizing",
    description:
      "Position sizes are determined by a systematic framework that accounts for volatility, correlation, concentration, and liquidity. No single position is permitted to exceed predefined risk limits relative to the total portfolio.",
  },
  {
    title: "Diversification",
    description:
      "Portfolios are constructed to achieve meaningful diversification across securities, sectors, and risk factors. Concentration limits are applied at the security, industry, and factor exposure levels.",
  },
  {
    title: "Turnover",
    description:
      "Portfolio turnover is managed explicitly through rebalancing rules, trading thresholds, and cost-aware execution. Turnover is monitored and reported alongside performance metrics for every published strategy.",
  },
  {
    title: "Capacity",
    description:
      "Each strategy includes an estimated capacity based on liquidity analysis, market impact modeling, and position size constraints. Capacity estimates are reviewed and updated as market conditions evolve.",
  },
  {
    title: "Portfolio Constraints",
    description:
      "Strategies operate within defined constraints including leverage limits, sector exposure limits, minimum and maximum position sizes, and liquidity requirements. Constraints are documented and transparent.",
  },
];

export default function RiskManagement() {
  return (
    <div>
      <SectionHeader
        label="RISK"
        title="Risk Management"
        description="Risk management is embedded in every stage of the research process, from hypothesis formulation to portfolio construction."
        centered={false}
      />
      <div className="mt-10 space-y-8">
        {RISK_TOPICS.map((topic) => (
          <div
            key={topic.title}
            className="rounded-lg border border-border bg-surface p-6"
          >
            <h3 className="text-sm font-medium text-foreground">
              {topic.title}
            </h3>
            <p className={`${typography.body} mt-2 text-secondary`}>
              {topic.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}