import type { Metadata } from "next";
import PageHeader from "@/components/common/PageHeader";
import Container from "@/components/layout/Container";
import StrategyCard from "@/components/strategies/StrategyCard";
import Link from "next/link";
import { createServiceClient } from "@/lib/admin/recommendations";
import {
  getPublicStrategiesByRegion,
  getStrategyPerformance,
  getSubscriberCounts,
  type PerformancePoint,
} from "@/lib/strategies/fetch";

export const metadata: Metadata = {
  title: "India Strategies — Simplicial Capital",
  description: "Systematic quantitative strategies for NSE-listed equities.",
};

export const dynamic = "force-dynamic";

// Lightweight SVG Sparkline component
function Sparkline({ data }: { data: { date: string, value: number }[] }) {
  if (!data || data.length < 2) return null;
  
  const min = Math.min(...data.map(d => d.value));
  const max = Math.max(...data.map(d => d.value));
  const range = max - min || 1;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - min) / range) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 100 100" className="h-8 w-20" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        className="text-accent"
      />
    </svg>
  );
}

export default async function IndiaStrategiesPage() {
  const admin = createServiceClient();
  const { data: optionsStrategies } = await admin.from("options_strategies").select("*");

  const strategies = await getPublicStrategiesByRegion("india");

  const [perfEntries, subscriberCounts] = await Promise.all([
    Promise.all(
      strategies.map(async (s) => {
        const perf = await getStrategyPerformance(s.id);
        return [s.id, perf] as const;
      })
    ),
    getSubscriberCounts(),
  ]);
  
  const perfMap = new Map<string, PerformancePoint[]>(perfEntries);

  // Fetch live return and sparkline data for the options strategy
  let optionsReturn = 0;
  let optionsSparkline: { date: string, value: number }[] = [];
  
  try {
    const res = await fetch("http://80.225.214.33:8000/api/options/pnl", { next: { revalidate: 0 } });
    if (res.ok) {
      const data = await res.json();
      optionsReturn = (data.realized_pnl / 500000) * 100;
      
      if (data.history && data.history.length > 0) {
        const INITIAL_CAPITAL = 500000;
        optionsSparkline = data.history.map((p: any) => ({
          date: p.date,
          value: 100 + ((p.value / INITIAL_CAPITAL) * 100)
        }));
      }
    }
  } catch (e) {
    // Ignore fetch errors for the card
  }

  return (
    <main>
      <Container className="py-20">
        <PageHeader
          title="India Strategies"
          description="Systematic quantitative strategies for NSE-listed equities."
        />

        <div className="mt-12">
          {strategies.length === 0 ? (
            <div className="rounded-md border border-border bg-surface px-6 py-8">
              <p className="text-sm text-secondary">
                Strategy catalog is being finalised.
              </p>
            </div>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2">
              {/* Regular Equity Strategies */}
              {strategies.map((strategy) => (
                <li key={strategy.id} className="h-full">
                  <StrategyCard
                    strategy={strategy}
                    region="india"
                    performance={perfMap.get(strategy.id) ?? []}
                    subscribers={subscriberCounts[strategy.id] ?? 0}
                    badge={strategy.slug === "free-manual" ? "Free" : undefined}
                  />
                </li>
              ))}

              {/* Options Strategies */}
              {optionsStrategies?.map((opt) => (
                <li key={opt.id} className="h-full">
                  <Link href={`/strategies/india/options/${opt.slug}`} className="group flex flex-col justify-between h-full rounded-lg border border-border bg-surface p-6 transition-colors hover:border-foreground">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-xl font-semibold tracking-tight text-foreground mt-1">{opt.name}</h2>
                        
                        <div className="text-right flex flex-col items-end">
                          <p className={`text-sm font-medium ${optionsReturn >= 0 ? "text-accent" : "text-tertiary"}`}>
                            {optionsReturn >= 0 ? "+" : ""}{optionsReturn.toFixed(2)}%
                          </p>
                          <div className="my-1">
                            <Sparkline data={optionsSparkline} />
                          </div>
                          <p className="text-[10px] font-medium uppercase tracking-wider text-tertiary">Since inception</p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-secondary">{opt.description}</p>
                    </div>
                    
                    <dl className="mt-6 space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="text-white font-medium">Benchmark</dt>
                        <dd className="text-white font-medium">NIFTY 50</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-white font-medium">Risk</dt>
                        <dd className="text-white font-medium">High risk</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-white font-medium">Investors</dt>
                        <dd className="text-white font-medium">0</dd>
                      </div>
                    </dl>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </main>
  );
}


