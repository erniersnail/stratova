import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const VALIDATION_STEPS = [
  {
    number: "01",
    title: "Historical Backtesting",
    description:
      "Strategies are tested against historical data to evaluate performance across multiple market cycles. Backtests account for survivorship bias, look-ahead bias, and incorporate realistic trading assumptions.",
  },
  {
    number: "02",
    title: "Walk-forward Testing",
    description:
      "Walk-forward analysis evaluates strategy performance on out-of-sample data by repeatedly training on historical periods and testing on subsequent unseen periods. This reduces the risk of overfitting.",
  },
  {
    number: "03",
    title: "Robustness Checks",
    description:
      "Strategies are tested across alternative parameter specifications, time periods, and market regimes to ensure results are not driven by specific methodological choices or data mining.",
  },
  {
    number: "04",
    title: "Sensitivity Analysis",
    description:
      "We measure how strategy performance changes in response to variations in key assumptions including formation periods, holding periods, rebalancing frequency, and transaction cost estimates.",
  },
  {
    number: "05",
    title: "Transaction Costs",
    description:
      "Realistic transaction cost models are applied including commissions, bid-ask spreads, market impact, and opportunity costs. Cost assumptions are validated against actual execution data where available.",
  },
  {
    number: "06",
    title: "Liquidity Constraints",
    description:
      "Strategies are evaluated under realistic liquidity assumptions including position size limits, trading volume constraints, and market impact. Capacity estimates are provided for each published strategy.",
  },
];

export default function ValidationFramework() {
  return (
    <div>
      <SectionHeader
        title="Validation Framework"
        description="Every strategy undergoes rigorous testing before publication. Our validation framework is designed to minimize overfitting and ensure robustness."
        centered={false}
      />
      <div className="mt-8 space-y-8">
        {VALIDATION_STEPS.map((step, index) => (
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