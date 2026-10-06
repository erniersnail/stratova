import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import DataTable from "@/components/ui/data-table";
import { typography } from "@/lib/typography";
import {
  getStrategyBySlug,
  getCurrentRecommendations,
  type Recommendation,
} from "@/lib/strategies/fetch";
import { createClient } from "@/lib/supabase/server";
import { formatIST } from "@/lib/format/date";
import {
  nextRebalanceDate,
  formatRebalanceDate,
} from "@/lib/strategies/rebalance";
import { subscribeAction } from "@/lib/auth/actions";
import SubscribePayForm from "@/components/strategies/SubscribePayForm";

type Region = "india" | "us";

function isRegion(value: string): value is Region {
  return value === "india" || value === "us";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string; slug: string }>;
}): Promise<Metadata> {
  const { region, slug } = await params;
  if (!isRegion(region)) return { title: "Strategy not found" };
  const strategy = await getStrategyBySlug(slug);
  if (!strategy || strategy.region !== region)
    return { title: "Strategy not found" };
  return {
    title: `${strategy.name} — Stratova`,
    description:
      strategy.short_description ??
      `${strategy.name} — quantitative strategy from Stratova.`,
  };
}

export default async function StrategyDetailPage({
  params,
}: {
  params: Promise<{ region: string; slug: string }>;
}) {
  const { region, slug } = await params;
  if (!isRegion(region)) notFound();
  const strategy = await getStrategyBySlug(slug);
  if (!strategy || strategy.region !== region) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const picks: Recommendation[] = user
    ? await getCurrentRecommendations(strategy.id)
    : [];

  // Current user's PENDING or ACTIVE subscription for this strategy.
  type ExistingSub = {
    id: string;
    capital_allocated: number | null;
    status: string;
  };
  let existingSub: ExistingSub | null = null;
  if (user) {
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("id, capital_allocated, status")
      .eq("user_id", user.id)
      .eq("strategy_id", strategy.id)
      .in("status", ["PENDING", "ACTIVE"])
      .order("created_at", { ascending: false })
      .limit(1);
    existingSub = subs && subs.length > 0 ? (subs[0] as ExistingSub) : null;
  }
  const capital = existingSub?.capital_allocated ?? null;
  const perPositionWeight = picks[0]?.weight_pct ?? null;

  const nextDate = nextRebalanceDate(strategy.slug);
  const nextDateStr = formatRebalanceDate(nextDate);
  const fee = strategy.fee_per_rebalance ?? null;
  const feeStr = fee !== null ? `₹${fee.toLocaleString("en-IN")}` : "—";

  const targetShares = (r: Recommendation): number | null =>
    capital !== null &&
    r.weight_pct !== null &&
    r.price !== null &&
    r.price > 0
      ? Math.floor((capital * r.weight_pct) / r.price)
      : null;

  const columns = [
    {
      key: "symbol",
      header: "Symbol",
      render: (r: Recommendation) => (
        <span className="font-medium text-foreground">{r.symbol}</span>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (r: Recommendation) => (
        <span className="inline-flex items-center rounded border border-border px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-foreground">
          {r.action}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (r: Recommendation) => (
        <span className="text-secondary">{r.price ?? "—"}</span>
      ),
    },
    {
      key: "weight",
      header: "Weight",
      render: (r: Recommendation) => (
        <span className="text-secondary">
          {r.weight_pct !== null
            ? `${(r.weight_pct * 100).toFixed(2)}%`
            : "—"}
        </span>
      ),
    },
    {
      key: "target_shares",
      header: "Target Shares",
      render: (r: Recommendation) => {
        const target = targetShares(r);
        return (
          <span className="text-foreground">
            {target !== null ? target : "—"}
          </span>
        );
      },
    },
    {
      key: "as_of",
      header: "As of (IST)",
      render: (r: Recommendation) => (
        <span className="text-secondary">{formatIST(r.as_of)}</span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={strategy.name}
        description={strategy.short_description ?? undefined}
      />

      <Section>
        <Container>
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-md border border-border bg-surface p-5">
              <dt className="text-xs font-medium uppercase tracking-wide text-tertiary">
                Benchmark
              </dt>
              <dd className={`${typography.body} mt-1 text-foreground`}>
                {strategy.benchmark ?? "—"}
              </dd>
            </div>
            <div className="rounded-md border border-border bg-surface p-5">
              <dt className="text-xs font-medium uppercase tracking-wide text-tertiary">
                Risk level
              </dt>
              <dd className={`${typography.body} mt-1 capitalize text-foreground`}>
                {strategy.risk_level ?? "—"}
              </dd>
            </div>
            <div className="rounded-md border border-border bg-surface p-5">
              <dt className="text-xs font-medium uppercase tracking-wide text-tertiary">
                Next rebalance
              </dt>
              <dd className={`${typography.body} mt-1 text-foreground`}>
                {nextDateStr}
              </dd>
            </div>
          </dl>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className={`${typography.h3} text-foreground`}>
            Current picks
          </h2>

          {!user ? (
            <div className="mt-4 rounded-md border border-border bg-surface px-4 py-6">
              <p className={`${typography.body} text-secondary`}>
                Log in to see current picks.
              </p>
              <Link
                href="/login"
                className={`${typography.body} mt-3 inline-block text-foreground underline hover:no-underline`}
              >
                Log in
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-6">
              {existingSub ? (
                <div className="rounded-md border border-border bg-surface px-4 py-4">
                  <p className="text-sm font-medium text-foreground">
                    {existingSub.status === "PENDING"
                      ? "Awaiting first rebalance"
                      : "Subscribed"}
                  </p>
                  <dl className="mt-3 space-y-1 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-secondary">Allocated capital</dt>
                      <dd className="text-foreground">
                        {capital !== null
                          ? `₹${capital.toLocaleString("en-IN")}`
                          : "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-secondary">Next rebalance</dt>
                      <dd className="text-foreground">{nextDateStr}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-secondary">Fee</dt>
                      <dd className="text-foreground">{feeStr}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-secondary">Per-position weight</dt>
                      <dd className="text-foreground">
                        {perPositionWeight !== null
                          ? `${(perPositionWeight * 100).toFixed(2)}%`
                          : "—"}
                      </dd>
                    </div>
                  </dl>
                  {existingSub.status === "PENDING" && (
                    <p className={`${typography.body} mt-4 text-secondary`}>
                      Your subscription will activate at the next
                      rebalance on {nextDateStr}. You'll receive a
                      payment confirmation email if pending.
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-md border border-border bg-surface px-4 py-4">
                  <p className="text-sm font-medium text-foreground">
                    Subscribe to {strategy.name}
                  </p>
                  <p className={`${typography.body} mt-2 text-secondary`}>
                    Next rebalance: <span className="text-foreground">{nextDateStr}</span>
                    <br />
                    Fee: <span className="text-foreground">{feeStr}</span>
                  </p>
                  <p className={`${typography.body} mt-3 text-secondary`}>
                    This subscription covers the rebalance on {nextDateStr}.
                  </p>
                  <SubscribePayForm
                    strategyId={strategy.id}
                    fee={fee}
                    feeStr={feeStr}
                  />
                </div>
              )}

              <DataTable
                columns={columns}
                rows={picks}
                rowKey={(r) => r.id}
                emptyState={
                  <div className="rounded-md border border-border bg-surface px-4 py-6">
                    <p className={`${typography.body} text-secondary`}>
                      No active picks. Next rebalance publishes shortly.
                    </p>
                  </div>
                }
              />
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}