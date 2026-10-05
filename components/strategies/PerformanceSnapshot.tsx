import SectionHeader from "@/components/common/SectionHeader";

type Metric = {
  label: string;
  value: string;
  note?: string;
};

type PerformanceSnapshotProps = {
  metrics: Metric[];
};

export default function PerformanceSnapshot({ metrics }: PerformanceSnapshotProps) {
  if (!metrics.length) {
    return null;
  }

  return (
    <div>
      <SectionHeader title="Performance Snapshot" centered={false} />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-lg border border-border bg-surface p-6"
          >
            <h3 className="text-xs font-medium tracking-wide text-secondary uppercase">
              {metric.label}
            </h3>
            <p className="mt-3 text-2xl font-medium tracking-tight tabular-nums">
              {metric.value}
            </p>
            {metric.note && (
              <p className="mt-1 text-xs leading-relaxed text-tertiary">
                {metric.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}