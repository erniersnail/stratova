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

  // Fetch live return for the options strategy to display on the card
  let optionsReturn = 0;
  try {
    const res = await fetch("http://80.225.214.33:8000/api/options/pnl", { next: { revalidate: 0 } });
    if (res.ok) {
      const data = await res.json();
      // Approximate return % based on 500k initial capital
      optionsReturn = (data.realized_pnl / 500000) * 100;
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

              {/* Options Strategies (Styled exactly like StrategyCard) */}
              {optionsStrategies?.map((opt) => (
                <li key={opt.id} className="h-full">
                  <Link href={`/strategies/india/options/${opt.slug}`} className="group flex flex-col justify-between h-full rounded-lg border border-border bg-surface p-6 transition-colors hover:border-foreground">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-semibold tracking-tight text-foreground">{opt.name}</h2>
                          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">Live</span>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${optionsReturn >= 0 ? "text-accent" : "text-tertiary"}`}>
                            {optionsReturn >= 0 ? "+" : ""}{optionsReturn.toFixed(2)}%
                          </p>
                          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-tertiary">Since inception</p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-secondary">{opt.description}</p>
                    </div>
                    
                    <dl className="mt-6 space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="text-tertiary">Benchmark</dt>
                        <dd className="text-foreground">NIFTY 50</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-tertiary">Risk</dt>
                        <dd className="text-foreground capitalize">High risk</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-tertiary">Investors</dt>
                        <dd className="text-foreground">0</dd>
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
