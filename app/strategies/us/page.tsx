import type { Metadata } from "next";
import PageHeader from "@/components/common/PageHeader";
import Container from "@/components/layout/Container";
import StrategyCard from "@/components/strategies/StrategyCard";
import {
  getPublicStrategiesByRegion,
  getStrategyPerformance,
  getSubscriberCounts,
  type PerformancePoint,
} from "@/lib/strategies/fetch";

export const metadata: Metadata = {
  title: "U.S. Strategies — Simplicial Capital",
  description: "Systematic NASDAQ large-cap research.",
};

export const dynamic = "force-dynamic";

export default async function USStrategiesPage() {
  const strategies = await getPublicStrategiesByRegion("us");

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
          title="U.S. Strategies"
          description="Systematic NASDAQ large-cap research."
        />

        <div className="mt-12">
          {strategies.length === 0 ? (
            <div className="rounded-md border border-border bg-surface px-6 py-8">
              <p className="text-sm text-secondary">
                U.S. strategy coverage is being finalised.
              </p>
            </div>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2">
              {strategies.map((strategy) => (
                <li key={strategy.id} className="h-full">
                  <StrategyCard
                    strategy={strategy}
                    region="us"
                    performance={perfMap.get(strategy.id) ?? []}
                    subscribers={subscriberCounts[strategy.id] ?? 0}
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