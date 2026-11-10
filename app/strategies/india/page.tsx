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

              {/* Options Strategies (Dynamic) */}
              {optionsStrategies?.map((opt) => (
                <li key={opt.id} className="h-full">
                  <Link href={`/strategies/india/options/${opt.slug}`} className="group rounded-lg border border-border bg-surface p-6 transition-colors hover:border-foreground flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold tracking-tight text-foreground">{opt.name}</h2>
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">Live</span>
                      </div>
                      <p className="mt-2 text-sm text-secondary">{opt.description}</p>
                    </div>
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
