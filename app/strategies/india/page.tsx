import type { Metadata } from "next";
import PageHeader from "@/components/common/PageHeader";
import Container from "@/components/layout/Container";
import StrategyCard from "@/components/strategies/StrategyCard";
import {
  getPublicStrategiesByRegion,
  getStrategyPerformance,
  type PerformancePoint,
} from "@/lib/strategies/fetch";

export const metadata: Metadata = {
  title: "India Strategies — Simplicial Capital",
  description: "Systematic quantitative strategies for NSE-listed equities.",
};

export const dynamic = "force-dynamic";

export default async function IndiaStrategiesPage() {
  const strategies = await getPublicStrategiesByRegion("india");

  const perfEntries = await Promise.all(
    strategies.map(async (s) => {
      const perf = await getStrategyPerformance(s.id);
      return [s.id, perf] as const;
    }),
  );
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
              {strategies.map((strategy) => (
                <li key={strategy.id} className="h-full">
                  <StrategyCard
                    strategy={strategy}
                    region="india"
                    performance={perfMap.get(strategy.id) ?? []}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </main>
  );
}
