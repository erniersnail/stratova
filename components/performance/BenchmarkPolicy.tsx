import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

const POLICIES = [
  {
    title: "Benchmark Selection",
    description: "Benchmarks are selected to match the investment universe and strategy objectives. Common benchmarks include market-cap-weighted indices, sector indices, and custom peer groups.",
  },
  {
    title: "Benchmark-relative Returns",
    description: "Active return (excess return over benchmark) is reported alongside absolute return. Tracking error and information ratio are calculated to evaluate consistency of outperformance.",
  },
  {
    title: "Benchmark Changes",
    description: "Any change to the benchmark is documented with the rationale and effective date. Performance relative to both the old and new benchmarks is disclosed for a transition period.",
  },
  {
    title: "Risk Metrics",
    description: "Portfolio risk is decomposed into systematic and idiosyncratic components. Factor exposure analysis identifies the sources of risk relative to the benchmark.",
  },
];

export default function BenchmarkPolicy() {
  return (
    <div>
      <SectionHeader label="BENCHMARKS" title="Benchmark Policy" description="Benchmarks provide context for evaluating strategy performance. Our benchmark policy ensures consistency and transparency." centered={false} />
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {POLICIES.map((p) => (
          <div key={p.title} className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-sm font-medium text-foreground">{p.title}</h3>
            <p className={`${typography.body} mt-2 text-secondary`}>{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}