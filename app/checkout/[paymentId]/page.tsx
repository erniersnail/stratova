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
            <div className="rounded-md border border-border bg-surface px-6 py-6">
              <p className="text-sm font-medium text-foreground">
                Complete your payment
              </p>

              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-secondary">Amount</dt>
                  <dd className="font-medium text-foreground">
                    ₹{Number(payment.amount).toLocaleString("en-IN")}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary">Strategy</dt>
                  <dd className="text-foreground">
                    {strategy?.name ?? "Strategy"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-secondary">Reference ID</dt>
                  <dd className="font-mono text-xs text-foreground">
                    {payment.id.slice(0, 8).toUpperCase()}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 border-t border-border pt-6">
                <p className="text-sm font-medium text-foreground">
                  Step 1 — Pay via UPI
                </p>
                <p className="mt-2 text-sm text-secondary">
                  Send ₹{Number(payment.amount).toLocaleString("en-IN")} to:
                </p>
                <p className="mt-3 font-mono text-base text-foreground">
                  {process.env.NEXT_PUBLIC_UPI_ID ?? "UPI ID not configured"}
                </p>

                <p className="mt-6 text-sm font-medium text-foreground">
                  Step 2 — Send us the receipt
                </p>
                <p className="mt-2 text-sm text-secondary">
                  WhatsApp the payment screenshot to{" "}
                  <span className="text-foreground">
                    {process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP ??
                      "support number not configured"}
                  </span>{" "}
                  with the reference ID{" "}
                  <span className="font-mono text-foreground">
                    {payment.id.slice(0, 8).toUpperCase()}
                  </span>
                  .
                </p>

                <p className="mt-6 text-sm font-medium text-foreground">
                  Step 3 — We activate your subscription
                </p>
                <p className="mt-2 text-sm text-secondary">
                  Once we verify your payment, your subscription will be
                  active for the next rebalance on {payment.rebalance_date}.
                </p>
              </div>
            </div>
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
