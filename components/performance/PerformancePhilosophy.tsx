import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const PRINCIPLES = [
  {
    title: "Benchmark-relative evaluation",
    description:
      "Performance is measured against appropriate benchmarks that reflect the investment universe and strategy objectives. Absolute returns are reported alongside relative metrics to provide context.",
  },
  {
    title: "Risk-adjusted measurement",
    description:
      "Returns are evaluated in the context of the risks taken to achieve them. Volatility, drawdowns, and risk-adjusted ratios are reported alongside cumulative returns.",
  },
  {
    title: "Full disclosure of assumptions",
    description:
      "Every performance report includes the assumptions underlying the calculations, including benchmark selection, rebalancing frequency, rebalancing methodology, and cost estimates.",
  },
  {
    title: "Separation of gross and net",
    description:
      "Performance is reported both gross and net of estimated transaction costs, management fees, and other expenses. The difference between gross and net returns is explicitly documented.",
  },
];

export default function PerformancePhilosophy() {
  return (
    <div>
      <SectionHeader
        label="PHILOSOPHY"
        title="Performance Philosophy"
        description="We believe performance reporting must be transparent, contextual, and accompanied by the assumptions that underpin the numbers."
        centered={false}
      />
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {PRINCIPLES.map((principle) => (
          <div key={principle.title} className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-sm font-medium text-foreground">{principle.title}</h3>
            <p className={`${typography.body} mt-2 text-secondary`}>{principle.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}