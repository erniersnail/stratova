import SectionHeader from "@/components/common/SectionHeader";
import EquityCurve from "@/components/strategies/EquityCurve";

type EquityCurveData = {
  labels: string[];
  strategy: number[];
  benchmark: number[];
};

type EquityCurveSectionProps = {
  data: EquityCurveData;
  benchmarkLabel: string;
};

export default function EquityCurveSection({ data, benchmarkLabel }: EquityCurveSectionProps) {
  return (
    <div>
      <SectionHeader title="Equity Curve" centered={false} />
      <div className="mt-6 rounded-lg border border-border bg-surface p-4">
        <EquityCurve
          labels={data.labels}
          strategy={data.strategy}
          benchmark={data.benchmark}
          benchmarkLabel={benchmarkLabel}
        />
      </div>
    </div>
  );
}