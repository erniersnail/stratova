import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const VALIDATION_STEPS = [
  {
    title: "Historical Backtesting",
    description:
      "Strategies are tested against historical data to evaluate performance across multiple market cycles. Backtests account for survivorship bias, look-ahead bias, and incorporate realistic trading assumptions.",
  },
  {
    title: "Walk-forward Testing",
    description:
      "Walk-forward analysis evaluates strategy performance on out-of-sample data by repeatedly training on historical periods and testing on subsequent unseen periods. This reduces the risk of overfitting.",
  },
  {
    title: "Robustness Checks",
    description:
      "Strategies are tested across alternative parameter specifications, time periods, and market regimes to ensure results are not driven by specific methodological choices or data mining.",
  },
  {
    title: "Sensitivity Analysis",
    description:
      "We measure how strategy performance changes in response to variations in key assumptions including formation periods, holding periods, rebalancing frequency, and transaction cost estimates.",
  },
  {
    title: "Transaction Costs",
    description:
      "Realistic transaction cost models are applied including commissions, bid-ask spreads, market impact, and opportunity costs. Cost assumptions are validated against actual execution data where available.",
  },
  {
    title: "Liquidity Constraints",
    description:
      "Strategies are evaluated under realistic liquidity assumptions including position size limits, trading volume constraints, and market impact. Capacity estimates are provided for each published strategy.",
  },
];

export default function ValidationFramework() {
  return (
    <div>
      <SectionHeader
        label="VALIDATION"
        title="Validation Framework"
        description="Every strategy undergoes rigorous testing before publication. Our validation framework is designed to minimize overfitting and ensure robustness."
        centered={false}
      />
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {VALIDATION_STEPS.map((step) => (
          <div key={step.title} className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-sm font-medium text-foreground">
              {step.title}
            </h3>
            <p className={`${typography.body} mt-2 text-secondary`}>
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}