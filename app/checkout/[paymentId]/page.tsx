import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/common/PageHeader";
import { typography } from "@/lib/typography";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Checkout — Stratova Quant",
};

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) {
  const { paymentId } = await params;
  const supabase = await createClient();

  const { data: payment } = await supabase
    .from("subscription_payments")
    .select("id, amount, status, rebalance_date, subscription_id")
    .eq("id", paymentId)
    .maybeSingle();

  if (!payment) notFound();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id, strategy_id")
    .eq("id", payment.subscription_id)
    .maybeSingle();

  const { data: strategy } = subscription
    ? await supabase
        .from("strategies")
        .select("name, slug, region")
        .eq("id", subscription.strategy_id)
        .maybeSingle()
    : { data: null };

  const isPaid = payment.status === "PAID";
  const amountStr = `₹${Number(payment.amount).toLocaleString("en-IN")}`;

  return (
    <main>
      <Container className="py-20">
        <PageHeader
          title={isPaid ? "Payment received" : "Complete payment"}
          description={
            strategy
              ? `For ${strategy.name}`
              : "Stratova Quant subscription"
          }
        />

        <div className="mt-10 max-w-[640px] rounded-md border border-border bg-surface px-6 py-6">
          {isPaid ? (
            <>
              <p className={`${typography.body} text-foreground`}>
                Payment received. Your subscription activates at the
                next rebalance on {payment.rebalance_date}.
              </p>
            </>
          ) : (
            <>
              <p className={`${typography.body} text-foreground font-medium`}>
                Payment integration coming soon
              </p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-secondary">Amount</dt>
                  <dd className="text-foreground">{amountStr}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary">Next rebalance</dt>
                  <dd className="text-foreground">{payment.rebalance_date}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary">Payment ID</dt>
                  <dd className="text-foreground font-mono text-xs">{payment.id}</dd>
                </div>
              </dl>
              <p className={`${typography.body} mt-6 text-secondary`}>
                To complete payment, email info@stratovaquant.com.
                An admin will confirm and your subscription activates
                at the next rebalance.
              </p>
            </>
          )}
        </div>

        <div className="mt-8 flex gap-6">
          {strategy && (
            <Link
              href={`/strategies/${strategy.region ?? "india"}/${strategy.slug}`}
              className={`${typography.body} text-foreground underline hover:no-underline`}
            >
              Back to strategy
            </Link>
          )}
          <Link
            href="/dashboard"
            className={`${typography.body} text-foreground underline hover:no-underline`}
          >
            Go to dashboard
          </Link>
        </div>
      </Container>
    </main>
  );
}
