import Link from "next/link";
import Sparkline from "@/components/strategies/Sparkline";
import type { PerformancePoint, Strategy } from "@/lib/strategies/fetch";

const RISK_LABEL: Record<string, string> = {
  moderate: "Moderate risk",
  high: "High risk",
};

type StrategyCardProps = {
  strategy: Strategy;
  region: "india" | "us";
  performance: PerformancePoint[];
  subscribers: number;
  badge?: string;
};

function normalize(values: number[]): number[] {
  if (values.length < 2 || values[0] <= 0) return [];
  const base = values[0];
  return values.map((v) => (v / base) * 100);
}

export default function StrategyCard({
  strategy,
  region,
  performance,
  subscribers,
}: StrategyCardProps) {
  const values = performance.map((p) => p.total_value);
  const normalized = normalize(values);
  const returnPct = normalized.length >= 2 ? normalized[normalized.length - 1] - 100 : null;
  const positive = returnPct !== null && returnPct >= 0;

  return (
    <Link
      href={`/strategies/${region}/${strategy.slug}`}
      className="flex h-full flex-col rounded-md border border-border bg-surface p-6 transition-colors duration-200 hover:border-foreground"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {strategy.name}
          </h2>
          {strategy.slug === "free-manual" && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">
              Free
            </span>
          )}
        </div>

        {returnPct !== null && (
          <div className="flex shrink-0 flex-col items-end">
            <span className={`font-mono text-sm font-medium tracking-tight ${positive ? "text-accent" : "text-tertiary"}`}>
              {positive ? "+" : ""}{returnPct.toFixed(2)}%
            </span>
            <Sparkline values={normalized} className={`mt-1 ${positive ? "text-accent" : "text-tertiary"}`} />
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.15em] text-foreground">
              Since inception
            </span>
          </div>
        )}
      </div>

      {strategy.short_description && (
        <p className="mt-2 text-sm text-secondary">{strategy.short_description}</p>
      )}

      <dl className="mt-4 space-y-1 text-sm">
        {strategy.benchmark && (
          <div className="flex justify-between gap-4">
            <dt className="text-white font-medium">Benchmark</dt>
            <dd className="text-white font-medium">{strategy.benchmark}</dd>
          </div>
        )}
        {strategy.risk_level && (
          <div className="flex justify-between gap-4">
            <dt className="text-white font-medium">Risk</dt>
            <dd className="text-white font-medium">{RISK_LABEL[strategy.risk_level] ?? strategy.risk_level}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt className="text-white font-medium">Investors</dt>
          <dd className="text-white font-medium">{subscribers}</dd>
        </div>
      </dl>

      {strategy.is_subscribable === false && (
        <span className="mt-2 inline-block text-xs tracking-wide text-tertiary">
          Not open to new subscriptions
        </span>
      )}
    </Link>
  );
}

