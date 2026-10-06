import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import DataTable from "@/components/ui/data-table";
import SubscribeForm from "@/components/strategies/SubscribeForm";
import { typography } from "@/lib/typography";
import {
  getStrategyBySlug,
  getCurrentRecommendations,
  type Recommendation,
} from "@/lib/strategies/fetch";
import { createClient } from "@/lib/supabase/server";
import { formatIST } from "@/lib/format/date";

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

  // Auth check — recommendations are gated to signed-in users only.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const picks: Recommendation[] = user
    ? await getCurrentRecommendations(strategy.id)
    : [];

  // Current user's ACTIVE subscription for this strategy (most recent).
  type ActiveSubscription = { id: string; capital_allocated: number | null };
  let activeSub: ActiveSubscription | null = null;
  if (user) {
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("id, capital_allocated")
      .eq("user_id", user.id)
      .eq("strategy_id", strategy.id)
      .eq("status", "ACTIVE")
      .order("started_at", { ascending: false })
      .limit(1);
    activeSub = subs && subs.length > 0 ? (subs[0] as ActiveSubscription) : null;
  }
  const capital = activeSub?.capital_allocated ?? null;
  // Per-position weight — read straight from the VM-published row; never
  // computed here. All current picks share the same weight.
  const perPositionWeight = picks[0]?.weight_pct ?? null;

  // target_shares = floor(capital * weight_pct / price). null → render "—".
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
                Availability
              </dt>
              <dd className={`${typography.body} mt-1 text-foreground`}>
                Live
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
              {activeSub && (
                <div className="rounded-md border border-border bg-surface px-4 py-3">
                  <p className="text-sm font-medium text-foreground">
                    Allocated capital:{" "}
                    {capital !== null
                      ? `₹${capital.toLocaleString("en-IN")}`
                      : "—"}
                  </p>
                  <p className="mt-1 text-sm text-secondary">
                    Per-position weight:{" "}
                    {perPositionWeight !== null
                      ? `${(perPositionWeight * 100).toFixed(2)}%`
                      : "—"}
                  </p>
                </div>
              )}

              <SubscribeForm
                strategyId={strategy.id}
                strategyPath={`/strategies/${region}/${slug}`}
                strategyName={strategy.name}
                currentAmount={capital}
              />

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
