import type { Metadata } from "next";
import PageHeader from "@/components/common/PageHeader";
import Container from "@/components/layout/Container";
import SubscribePayForm from "@/components/strategies/SubscribePayForm";
import { getPublicStrategies } from "@/lib/strategies/fetch";
import { nextRebalanceDate, formatRebalanceDate } from "@/lib/strategies/rebalance";
import { typography } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Pricing & Subscriptions — Simplicial Capital",
  description: "Subscribe to our systematic quantitative strategies.",
};

export default async function PricingPage() {
  const allStrategies = await getPublicStrategies();
  const strategies = allStrategies.filter((s) => s.is_subscribable);

  return (
    <main>
      <Container size="default" className="py-20">
        <PageHeader
          title="Pricing & Subscriptions"
          description="Choose a strategy to subscribe. You pay per cycle, and you can cancel anytime."
        />

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {strategies.map((strategy) => {
            const nextDate = nextRebalanceDate(strategy.slug);
            const nextDateStr = formatRebalanceDate(nextDate);
            const fee = strategy.fee_per_rebalance ?? null;
            const feeStr = fee !== null ? `₹${fee.toLocaleString("en-IN")}` : "—";

            return (
              <div key={strategy.id} className="rounded-lg border border-border bg-surface p-8 shadow-sm flex flex-col">
                <div className="flex-1">
                  <h2 className="text-2xl font-serif text-foreground">{strategy.name}</h2>
                  <p className={`${typography.body} mt-2 text-foreground`}>
                    {strategy.short_description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-y border-border py-4">
                    <div>
                      <p className="text-sm text-tertiary uppercase tracking-wide">Next rebalance</p>
                      <p className="font-medium text-foreground">{nextDateStr}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-tertiary uppercase tracking-wide">Fee</p>
                      <p className="font-medium text-foreground">{feeStr}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <SubscribePayForm
                    strategyId={strategy.id}
                    fee={fee}
                    feeStr={feeStr}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </main>
  );
}