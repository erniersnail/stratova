import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const STEPS = [
  {
    number: "01",
    title: "Hypothesis",
    description:
      "Every research project begins with a clearly defined, testable investment hypothesis. Hypotheses are drawn from academic literature, empirical observation, or market anomalies and must be falsifiable.",
  },
  {
    number: "02",
    title: "Data Collection",
    description:
      "Relevant historical data is gathered from multiple sources, cleaned, and validated. We account for survivorship bias, look-ahead bias, and data quality issues before any analysis begins.",
  },
  {
    number: "03",
    title: "Validation",
    description:
      "Hypotheses are tested through statistical analysis, backtesting, and robustness checks. We evaluate performance across multiple time periods, market regimes, and parameter specifications.",
  },
  {
    number: "04",
    title: "Portfolio Construction",
    description:
      "Validated ideas are translated into systematic portfolio rules with defined position sizing, rebalancing, and risk constraints. Transaction costs, liquidity, and capacity are modeled explicitly.",
  },
  {
    number: "05",
    title: "Monitoring",
    description:
      "Published strategies are continuously monitored for performance, risk, and structural changes. Findings — both positive and negative — are documented and published in our research library.",
  },
];

export default function ResearchLifecycle() {
  return (
    <div>
      <SectionHeader
        title="Research Lifecycle"
        description="From hypothesis to publication, every strategy follows a structured research lifecycle."
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