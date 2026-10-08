import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const VALIDATION_STEPS = [
  {
    number: "01",
    title: "Historical Backtesting",
    description:
      "Strategies are validated against point-in-time historical data with survivorship-bias-free universes. Backtests incorporate realistic transaction costs and liquidity constraints. Results are reported net of costs.",
  },
  {
    number: "02",
    title: "Out-of-Sample Testing",
    description:
      "Performance is evaluated on data not used during strategy construction. Live results are compared against the strategy's benchmark on an ongoing basis.",
  },
  {
    number: "03",
    title: "Regime and Robustness Testing",
    description:
      "Strategies are tested across multiple time periods and market regimes to ensure results are not driven by a single favorable window.",
  },
  {
    number: "04",
    title: "Net-of-Cost Performance",
    description:
      "All performance figures are net of transaction costs. Strategies are evaluated against their benchmark on a net-return basis — gross-return comparisons are not used.",
  },
  {
    number: "05",
    title: "Known Limitation: Seed Period",
    description:
      "Strategies seeded in August 2026 used a current-snapshot universe to construct their initial portfolios. This introduces survivorship bias for the seed period only. Live signals from November 2026 onward use point-in-time constituent lists.",
  },
  {
    number: "06",
    title: "Known Limitation: Short Live History",
    description:
      "Live tracking began in August 2026. The track record is short. Returns over a few months carry no statistical significance. Past performance does not indicate future results.",
  },
];

export default function ValidationFramework() {
  return (
    <div>
      <SectionHeader
        title="Validation & Limitations"
        description="We test what we can test, and we state clearly what we have not tested."
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