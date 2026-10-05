import SectionHeader from "@/components/common/SectionHeader";
import DrawdownChart from "@/components/strategies/DrawdownChart";

type DrawdownData = {
  labels: string[];
  strategy: number[];
  benchmark: number[];
};

type DrawdownSectionProps = {
  data: DrawdownData;
  benchmarkLabel: string;
};

export default function DrawdownSection({ data, benchmarkLabel }: DrawdownSectionProps) {
  return (
    <div>
      <SectionHeader title="Drawdown Analysis" centered={false} />
      <div className="mt-6 rounded-lg border border-border bg-surface p-4">
        <DrawdownChart
          labels={data.labels}
          strategy={data.strategy}
          benchmark={data.benchmark}
          benchmarkLabel={benchmarkLabel}
        />
      </div>
    </div>
  );
}