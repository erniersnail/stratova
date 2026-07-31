import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const METRICS = [
  { title: "Cumulative Return", desc: "Total percentage return over the full reporting period." },
  { title: "Annualized Return", desc: "Geometric average return expressed on an annual basis." },
  { title: "Volatility", desc: "Annualized standard deviation of daily or monthly returns." },
  { title: "Maximum Drawdown", desc: "Largest peak-to-trough decline over the reporting period." },
  { title: "Sharpe Ratio", desc: "Excess return per unit of risk, using the risk-free rate as the baseline." },
  { title: "Turnover", desc: "One-way portfolio turnover expressed as a percentage of portfolio value." },
  { title: "Capacity", desc: "Estimated maximum strategy size before trading costs materially impact returns." },
  { title: "Hit Rate", desc: "Percentage of periods with positive returns." },
];

export default function ReportingFramework() {
  return (
    <div>
      <SectionHeader label="FRAMEWORK" title="Reporting Framework" description="Every performance report includes a standardized set of metrics designed to provide a complete picture of strategy behavior." centered={false} />
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => (
          <div key={m.title} className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-sm font-medium text-foreground">{m.title}</h3>
            <p className={`${typography.body} mt-2 text-secondary`}>{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}