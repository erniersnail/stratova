import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import Container from "@/components/layout/Container";
import SubscribePayForm from "@/components/strategies/SubscribePayForm";
import { getStrategyBySlug } from "@/lib/strategies/fetch";
import { nextRebalanceDate, formatRebalanceDate } from "@/lib/strategies/rebalance";
import { typography } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Subscribe — Simplicial Capital",
};

export default async function SubscribePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const strategy = await getStrategyBySlug(slug);
  if (!strategy || !strategy.is_subscribable) notFound();

  const nextDate = nextRebalanceDate(strategy.slug);
  const nextDateStr = formatRebalanceDate(nextDate);
  const fee = strategy.fee_per_rebalance ?? null;
  const feeStr = fee !== null ? `₹${fee.toLocaleString("en-IN")}` : "—";

  return (
    <main>
      <Container size="narrow" className="py-20">
        <PageHeader
          title={`Subscribe to ${strategy.name}`}
          description={strategy.short_description ?? undefined}
        />

        <div className="mt-12 rounded-lg border border-border bg-surface p-8 shadow-sm">
          <div className="text-center">
            <p className="text-2xl font-serif text-foreground">{strategy.name}</p>
            <p className={`${typography.body} mt-2 text-foreground`}>
              Next rebalance: <strong>{nextDateStr}</strong><br/>
              Fee: <strong>{feeStr}</strong>
            </p>
          </div>

          <div className="mt-8 max-w-md mx-auto text-left">
            <SubscribePayForm
              strategyId={strategy.id}
              fee={fee}
              feeStr={feeStr}
            />
          </div>
        </div>
      </Container>
    </main>
  );
}
