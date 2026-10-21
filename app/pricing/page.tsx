import type { Metadata } from "next";
import PageHeader from "@/components/common/PageHeader";
import Container from "@/components/layout/Container";
import PricingPlans from "@/components/strategies/PricingPlans";
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

        <div className="mt-12">
          <PricingPlans strategies={strategies} />
        </div>
      </Container>
    </main>
  );
}