import type { Metadata } from "next";
import PageHeader from "@/components/common/PageHeader";
import Container from "@/components/layout/Container";
import SubscribePayForm from "@/components/strategies/SubscribePayForm";
import { getPublicStrategies } from "@/lib/strategies/fetch";
import { nextRebalanceDate, formatRebalanceDate } from "@/lib/strategies/rebalance";
import { createClient } from "@/lib/supabase/server";
import { typography } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Pricing & Subscriptions — Simplicial Capital",
  description: "Subscribe to our systematic quantitative strategies.",
};

export default async function PricingPage() {
  const allStrategies = await getPublicStrategies();
  const strategies = allStrategies.filter((s) => s.is_subscribable);

  // Fetch current user's subscriptions to hide forms if already subscribed
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userSubs: Record<string, string> = {}; // strategy_id -> status
  if (user) {
    const { data } = await supabase
      .from("subscriptions")
      .select("strategy_id, status")
      .eq("user_id", user.id)
      .in("status", ["ACTIVE", "PENDING"]);

    if (data) {
      data.forEach((s) => {
        if (s.strategy_id) userSubs[s.strategy_id] = s.status;
      });
    }
  }

  return (
    <main>
      <Container size="default" className="py-20">
        <PageHeader
          title="Pricing & Subscriptions"
          description="Choose a strategy to subscribe. You pay per cycle, and you can cancel anytime."
        />

        <div className="mt-12 space-y-6">
          {strategies.map((strategy) => {
            const nextDate = nextRebalanceDate(strategy.slug);
            const nextDateStr = formatRebalanceDate(nextDate);
            const fee = strategy.fee_per_rebalance ?? null;
            const feeStr = fee !== null ? `₹${fee.toLocaleString("en-IN")}` : "—";

            const subStatus = userSubs[strategy.id];

            return (
              <div 
                key={strategy.id} 
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 rounded-lg border border-border bg-surface p-6 sm:p-8 shadow-sm transition-colors hover:border-foreground/20"
              >
                {/* Left Side: Details */}
                <div className="flex-1 max-w-2xl">
                  <h2 className="text-2xl font-serif text-foreground">{strategy.name}</h2>
                  <p className={`${typography.body} mt-2 text-secondary`}>
                    {strategy.short_description}
                  </p>
                  
                  <div className="mt-6 flex flex-wrap gap-x-12 gap-y-4 border-t border-border pt-4">
                    <div>
                      <p className="text-xs text-tertiary uppercase tracking-wide">Next rebalance</p>
                      <p className="font-medium text-foreground">{nextDateStr}</p>
                    </div>
                    <div>
                      <p className="text-xs text-tertiary uppercase tracking-wide">Fee</p>
                      <p className="font-medium text-foreground">{feeStr}</p>
                    </div>
                    <div>
                      <p className="text-xs text-tertiary uppercase tracking-wide">Benchmark</p>
                      <p className="font-medium text-foreground">{strategy.benchmark ?? "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Action (Form or Status) */}
                <div className="w-full lg:w-[380px] shrink-0 lg:border-l lg:border-border lg:pl-8">
                  {subStatus ? (
                    <div className="rounded-md border border-border bg-surface-hover px-6 py-6 text-center h-full flex flex-col items-center justify-center">
                      <span className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-foreground">
                        <span className={`h-2 w-2 rounded-full ${subStatus === "ACTIVE" ? "bg-accent" : "bg-tertiary"}`} />
                        {subStatus === "PENDING" ? "Awaiting Rebalance" : "Subscribed"}
                      </span>
                      <p className={`${typography.body} mt-3 text-sm text-secondary`}>
                        {subStatus === "PENDING" 
                          ? "Your subscription will activate on the next rebalance date." 
                          : "You have active access to this strategy's picks."}
                      </p>
                    </div>
                  ) : (
                    <div className="w-full">
                      <p className="text-sm font-medium text-foreground mb-4 lg:hidden">Subscribe</p>
                      <SubscribePayForm
                        strategyId={strategy.id}
                        fee={fee}
                        feeStr={feeStr}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </main>
  );
}