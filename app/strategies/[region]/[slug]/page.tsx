import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import Container from "@/components/layout/Container";
import DataTable from "@/components/ui/data-table";
import EquityCurveChart, {
  type ChartSeries,
} from "@/components/strategies/EquityCurveChart";
import LockedPicksMock from "@/components/strategies/LockedPicksMock";
import { typography } from "@/lib/typography";
import {
  getStrategyBySlug,
  getCurrentRecommendations,
  getRemovedRecommendations,
  getStrategyPerformance,
  getBenchmark,
  type Recommendation,
} from "@/lib/strategies/fetch";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/admin/recommendations";

import {
  nextRebalanceDate,
  formatRebalanceDate,
} from "@/lib/strategies/rebalance";
import SubscribePayForm from "@/components/strategies/SubscribePayForm";

type Region = "india" | "us";

function isRegion(value: string): value is Region {
  return value === "india" || value === "us";
}

const WINDOW_START = "2026-08-03";

function formatDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function fmt(v: number): string {
  return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
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
    title: `${strategy.name} — Simplicial Capital`,
    description:
      strategy.short_description ??
      `${strategy.name} — quantitative strategy from Simplicial Capital.`,
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

  const [perf, benchRaw] = await Promise.all([
    getStrategyPerformance(strategy.id),
    strategy.benchmark
      ? getBenchmark(strategy.benchmark, WINDOW_START)
      : Promise.resolve([]),
  ]);

  const strategySeries = (() => {
    const filtered = perf.filter((p) => p.date >= WINDOW_START);
    if (filtered.length < 2 || filtered[0].total_value <= 0) return [];
    const base = filtered[0].total_value;
    return filtered.map((p) => ({
      date: p.date,
      value: (100 * p.total_value) / base,
    }));
  })();

  const benchmarkSeries = (() => {
    const filtered = benchRaw.filter((p) => p.date >= WINDOW_START);
    if (filtered.length < 2 || filtered[0].close <= 0) return [];
    const base = filtered[0].close;
    return filtered.map((p) => ({
      date: p.date,
      value: (100 * p.close) / base,
    }));
  })();

  const chartSeries: ChartSeries[] = [];
  if (strategySeries.length >= 2) {
    chartSeries.push({
      name: strategy.name,
      color: "var(--color-foreground)",
      data: strategySeries,
      emphasis: "primary",
    });
  }
  if (benchmarkSeries.length >= 2 && strategy.benchmark) {
    chartSeries.push({
      name: strategy.benchmark,
      color: "#b08900",
      data: benchmarkSeries,
      emphasis: "secondary",
    });
  }

  const strategyReturn =
    strategySeries.length >= 2
      ? strategySeries[strategySeries.length - 1].value - 100
      : null;
  const benchmarkReturn =
    benchmarkSeries.length >= 2
      ? benchmarkSeries[benchmarkSeries.length - 1].value - 100
      : null;
  const alpha =
    strategyReturn !== null && benchmarkReturn !== null
      ? strategyReturn - benchmarkReturn
      : null;

  const showChart = chartSeries.length > 0;

  // --- Monthly Returns Computation ---
  const monthlyReturns: { month: string; returnPct: number }[] = [];
  if (perf.length >= 2) {
    const monthlyMap = new Map<string, { first: number; last: number }>();
    for (const p of perf) {
      const monthKey = p.date.slice(0, 7);
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { first: p.total_value, last: p.total_value });
      } else {
        const existing = monthlyMap.get(monthKey)!;
        existing.last = p.total_value;
      }
    }
    const sortedMonths = Array.from(monthlyMap.keys()).sort().reverse();
    
    for (const monthKey of sortedMonths) {
      const data = monthlyMap.get(monthKey)!;
      if (data.first > 0) {
        const pct = ((data.last / data.first) - 1) * 100;
        const date = new Date(monthKey + "-01T00:00:00Z");
        const label = date.toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        });
        monthlyReturns.push({ month: label, returnPct: pct });
      }
    }
  }

  const picks: Recommendation[] = user
    ? await getCurrentRecommendations(strategy.id)
    : [];



  type ExistingSub = {
    id: string;
    capital_allocated: number | null;
    status: string;
    started_at: string | null;
  };
  let existingSub: ExistingSub | null = null;
  if (user) {
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("id, capital_allocated, status, started_at")
      .eq("user_id", user.id)
      .eq("strategy_id", strategy.id)
      .in("status", ["PENDING", "ACTIVE"])
      .order("created_at", { ascending: false })
      .limit(1);
    existingSub = subs && subs.length > 0 ? (subs[0] as ExistingSub) : null;
  }
  const capital = existingSub?.capital_allocated ?? null;

  const hasAccess = existingSub?.status === "ACTIVE";

  let teaserPicks: { id: string; returnPct: number | null }[] = [];
  if (!hasAccess) {
    try {
      const admin = createServiceClient();
      const { data } = await admin
        .from("recommendations")
        .select("id, price, current_price")
        .eq("strategy_id", strategy.id)
        .not("approved_at", "is", null)
        .is("removed_at", null)
        .or("expires_at.is.null,expires_at.gt.now()");

      if (data) {
        teaserPicks = data.map((p) => ({
          id: p.id,
          returnPct: p.current_price && p.price ? ((p.current_price / p.price) - 1) * 100 : null,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch teaser picks", err);
    }
  }

  const nextDate = nextRebalanceDate(strategy.slug);
  const nextDateStr = formatRebalanceDate(nextDate);
  const fee = strategy.fee_per_rebalance ?? null;
  const isUS = region === "us" || strategy.slug === "us-equity-leadership";
  const feeStr = fee !== null ? `${isUS ? "$" : "₹"}${fee.toLocaleString(isUS ? "en-US" : "en-IN")}` : "—";


  const columns = [
    {
      key: "symbol",
      header: "Symbol",
      render: (r: Recommendation) => (
        <div>
          <span className="font-medium text-foreground">{r.symbol}</span>
          {r.admin_remark && (
            <div className="mt-1 border-l-2 border-accent pl-2 text-xs leading-relaxed text-secondary">
              {r.admin_remark}
            </div>
          )}
        </div>
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
      header: "Strategy Entry",
      render: (r: Recommendation) => {
        const isNew = existingSub?.started_at && r.as_of && new Date(existingSub.started_at) >= new Date(r.as_of);
        const displayPrice = isNew ? (r.rebalance_price || r.price) : r.price;
        return <span className="text-foreground">{displayPrice !== null ? Number(displayPrice).toFixed(2) : "—"}</span>;
      },
    },
    {
      key: "current_price",
      header: "Current Price",
      render: (r: Recommendation) => (
        <span className="text-foreground">{r.current_price !== null ? Number(r.current_price).toFixed(2) : "—"}</span>
      ),
    },
    {
      key: "return",
      header: "Returns",
      render: (r: Recommendation) => {
        const isNew = existingSub?.started_at && r.as_of && new Date(existingSub.started_at) >= new Date(r.as_of);
        const displayEntry = isNew ? (r.rebalance_price || r.price) : r.price;
        const ret = r.current_price && displayEntry ? ((r.current_price / displayEntry) - 1) * 100 : null;
        if (ret === null) return <span className="text-foreground">—</span>;
        const isPos = ret >= 0;
        return (
          <span className={`font-medium ${isPos ? "text-accent" : "text-tertiary"}`}>
            {isPos ? "+" : ""}{ret.toFixed(2)}%
          </span>
        );
      },
    },
    {
      key: "weight",
      header: "Weight",
      render: (r: Recommendation) => (
        <span className="text-foreground">
          {r.weight_pct !== null ? `${(r.weight_pct * 100).toFixed(2)}%` : "—"}
        </span>
      ),
    },
    {
      key: "target_shares",
      header: "Target Shares",
      render: (r: Recommendation) => {
        const currentPrice = r.current_price || r.price;
        const target = capital !== null && r.weight_pct !== null && currentPrice !== null && currentPrice > 0
          ? Math.floor((capital * r.weight_pct) / currentPrice)
          : null;
        return (
          <span className="text-foreground">{target !== null ? target : "—"}</span>
        );
      },
    },
    {
      key: "rebalance_date",
      header: "Rebalance date",
      render: (r: Recommendation) => (
        <span className="text-foreground">{formatDate(r.as_of)}</span>
      ),
    },
    {
      key: "valid_until",
      header: "Valid until",
      render: () => <span className="text-foreground">{nextDateStr}</span>,
    },
  ];

  const pickEmptyState = (() => {
    if (!strategy.is_subscribable) return null;
    if (!existingSub) {
      return (
        <div className="rounded-md border border-border bg-surface px-4 py-6">
          <p className={`${typography.body} text-foreground`}>
            Subscribe to see current picks for {strategy.name}.
          </p>
        </div>
      );
    }
    if (existingSub.status === "PENDING") {
      return (
        <div className="rounded-md border border-border bg-surface px-4 py-6">
          <p className={`${typography.body} text-foreground`}>
            Your subscription activates at the next rebalance on{" "}
            {nextDateStr}. Picks will appear here once it does.
          </p>
        </div>
      );
    }
    return (
      <div className="rounded-md border border-border bg-surface px-4 py-6">
        <p className={`${typography.body} text-foreground`}>
          No active picks right now. The next rebalance is on {nextDateStr}.
        </p>
      </div>
    );
  })();

  return (
    <main>
      <Container className="py-20">
        <PageHeader
          title={strategy.name}
          description={strategy.short_description ?? undefined}
        />

        <div className="mt-16">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-md border border-border bg-surface p-5">
              <dt className="text-xs font-medium uppercase tracking-wide text-foreground">
                Benchmark
              </dt>
              <dd className={`${typography.body} mt-1 text-foreground`}>
                {strategy.benchmark ?? "—"}
              </dd>
            </div>
            <div className="rounded-md border border-border bg-surface p-5">
              <dt className="text-xs font-medium uppercase tracking-wide text-foreground">
                Risk level
              </dt>
              <dd className={`${typography.body} mt-1 capitalize text-foreground`}>
                {strategy.risk_level ?? "—"}
              </dd>
            </div>
            <div className="rounded-md border border-border bg-surface p-5">
              <dt className="text-xs font-medium uppercase tracking-wide text-foreground">
                Rebalance Cycle
              </dt>
              <dd className={`${typography.body} mt-1 capitalize text-foreground`}>
                {strategy.cadence === "quarterly" ? "Quarterly" : "Monthly"}
              </dd>
            </div>
            <div className="rounded-md border border-border bg-surface p-5">
              <dt className="text-xs font-medium uppercase tracking-wide text-foreground">
                Next rebalance
              </dt>
              <dd className={`${typography.body} mt-1 text-foreground`}>
                {nextDateStr}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-16">
          <h2 className={`${typography.h3} text-foreground`}>
            About this strategy
          </h2>
          <div className="mt-4 space-y-4">
            {strategy.long_description
              ? strategy.long_description.split("\n\n").map((para, i) => (
                  <p key={i} className={`${typography.body} text-foreground`}>
                    {para}
                  </p>
                ))
              : (
                  <p className={`${typography.body} text-foreground`}>
                    {strategy.short_description ?? "Description coming soon."}
                  </p>
                )}
          </div>
        </div>

        {showChart && (
          <div className="mt-16">
            <h2 className={`${typography.h3} text-foreground`}>Performance since inception</h2>
            <p className={`${typography.body} mt-3 text-foreground`}>
              {`Since inception, net of costs${strategy.benchmark ? `, vs ${strategy.benchmark}` : ""}.`}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-md border border-border bg-surface px-6 py-6 flex flex-col justify-between">
                <EquityCurveChart series={chartSeries} height={280} />

                {(strategyReturn !== null || benchmarkReturn !== null) && (
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 text-sm">
                    {strategyReturn !== null && (
                      <span className="flex items-center gap-2 text-foreground">
                        <span aria-hidden className="inline-block h-[3px] w-6 bg-foreground" />
                        <span>{strategy.name} <strong className="text-foreground">{fmt(strategyReturn!)}</strong></span>
                      </span>
                    )}
                    {benchmarkReturn !== null && strategy.benchmark && (
                      <span className="flex items-center gap-2 text-foreground">
                        <span aria-hidden className="inline-block h-[3px] w-6 border-t-2 border-dashed border-[#b08900]" />
                        <span>{strategy.benchmark} <strong className="text-foreground">{fmt(benchmarkReturn!)}</strong></span>
                      </span>
                    )}
                    {alpha !== null && (
                      <span className="text-foreground"><strong>{fmt(alpha)} alpha</strong></span>
                    )}
                  </div>
                )}
              </div>

              {monthlyReturns.length > 0 && (
                <div className="lg:col-span-1 rounded-md border border-border bg-surface px-6 py-6">
                  <h3 className="text-xs font-medium uppercase tracking-wide text-foreground">Monthly Returns</h3>
                  <div className="mt-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="pb-2 text-left text-xs font-medium text-tertiary">Month</th>
                          <th className="pb-2 text-right text-xs font-medium text-tertiary">Return</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyReturns.map((m) => (
                          <tr key={m.month} className="border-b border-border last:border-0">
                            <td className="py-2.5 text-foreground">{m.month}</td>
                            <td className={`py-2.5 text-right font-medium ${m.returnPct >= 0 ? "text-accent" : "text-tertiary"}`}>
                              {m.returnPct >= 0 ? "+" : ""}{m.returnPct.toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                        {strategyReturn !== null && (
                          <tr className="bg-surface-hover/50">
                            <td className="py-2.5 font-medium text-foreground">Total</td>
                            <td className={`py-2.5 text-right font-bold ${strategyReturn >= 0 ? "text-accent" : "text-tertiary"}`}>
                              {strategyReturn >= 0 ? "+" : ""}{strategyReturn.toFixed(2)}%
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <p className={`${typography.body} mt-4 text-foreground`}>
              Past performance does not indicate future results. Track record
              is short and not statistically significant.
            </p>
          </div>
        )}

        <div className="mt-16">
          <h2 className={`${typography.h3} text-foreground`}>Current picks</h2>

          {!user ? (
            <div className="mt-4 rounded-md border border-border bg-surface px-4 py-6">
              <p className={`${typography.body} text-foreground`}>
                Log in to see current picks.
              </p>
              <Link
                href="/login"
                className={`${typography.body} mt-3 inline-block text-foreground underline hover:no-underline`}
              >
                Log in
              </Link>
            </div>
          ) : existingSub?.status !== "ACTIVE" && strategy.is_subscribable ? (
            <div className="mt-4">
              <LockedPicksMock
                strategyName={strategy.name}
                teaserPicks={teaserPicks}
              />
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
                      <dt className="text-foreground">Allocated capital</dt>
                      <dd className="text-foreground">
                        {capital !== null
                          ? strategy?.slug === "us-equity-leadership" ||
                            strategy?.id === "95ccee51-d817-4a61-9a5b-b4d1a9143e74"
                            ? `$ ${capital.toLocaleString("en-US")}`
                            : `₹${capital.toLocaleString("en-IN")}`
                          : "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-foreground">Next rebalance</dt>
                      <dd className="text-foreground">{nextDateStr}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-foreground">Fee</dt>
                      <dd className="text-foreground">{feeStr}</dd>
                    </div>
                  </dl>
                  {existingSub.status === "PENDING" && (
                    <p className={`${typography.body} mt-4 text-foreground`}>
                      Your subscription will activate at the next
                      rebalance on {nextDateStr}.
                    </p>
                  )}
                </div>
              ) : strategy.is_subscribable ? (
                <div className="rounded-md border border-border bg-surface px-4 py-4">
                  <p className="text-sm font-medium text-foreground">
                    Subscribe to {strategy.name}
                  </p>
                  <p className={`${typography.body} mt-2 text-foreground`}>
                    Next rebalance: <span className="text-foreground">{nextDateStr}</span>
                    <br />
                    Fee: <span className="text-foreground">{feeStr}</span>
                  </p>
                  <SubscribePayForm
                    strategyId={strategy.id}
                    strategy={strategy}
                    fee={fee}
                    currency={region === "us" ? "$" : "₹"}
                  />
                </div>
              ) : (
                <div className="rounded-md border border-border bg-surface px-4 py-4">
                  <p className="text-sm font-medium text-foreground">
                    Not open to new subscriptions
                  </p>
                  <p className="mt-2 text-sm text-foreground">
                    {strategy.name} is currently not accepting new subscribers.
                  </p>
                  <Link
                    href={`/strategies/${region}`}
                    className="mt-3 inline-block text-sm text-foreground underline"
                  >
                    View other strategies →
                  </Link>
                </div>
              )}

              <DataTable
                columns={columns}
                rows={picks}
                rowKey={(r) => r.id}
                emptyState={pickEmptyState}
              />

            {/* Recently Removed */}
            {(() => {
              if (!existingSub?.started_at) return null;
              const removedPicks = picks.filter((r) => r.removed_at);
              const visible = removedPicks.filter((r) => {
                if (!r.removed_at) return false;
                return new Date(existingSub.started_at!) <= new Date(r.removed_at);
              });
              if (visible.length === 0) return null;
              return (
                <div className="mt-12">
                  <h3 className="text-lg font-medium text-foreground">Recently Removed</h3>
                  <p className="mt-1 text-sm text-secondary">These picks were removed from the strategy after you subscribed.</p>
                  <div className="mt-4 overflow-hidden rounded-md border border-border bg-surface">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-tertiary">Symbol</th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-tertiary">Reason</th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-tertiary">Admin Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visible.map((r) => (
                          <tr key={r.id} className="border-b border-border last:border-0">
                            <td className="px-4 py-3 font-medium text-foreground">{r.symbol}</td>
                            <td className="px-4 py-3 text-secondary">{r.removed_reason || "—"}</td>
                            <td className="px-4 py-3 text-secondary">{r.admin_remark || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}