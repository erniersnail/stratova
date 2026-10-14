import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/ui/data-table";
import CancelSubscriptionButton from "@/components/dashboard/CancelSubscriptionButton";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth/ensure-profile";
import {
  getCurrentRecommendationsForUser,
  getPublicStrategies,
  getStrategyPerformance,
  type PerformancePoint,
  type Recommendation,
  type Strategy,
} from "@/lib/strategies/fetch";
import { formatIST } from "@/lib/format/date";

export const metadata: Metadata = {
  title: "Dashboard — Simplicial Capital",
  description: "Your subscriptions and latest recommendations.",
};

type SubscriptionRow = {
  id: string;
  strategy_id: string | null;
  status: string | null;
  plan: string | null;
  started_at: string | null;
  expires_at: string | null;
  capital_allocated: number | null;
};

function formatDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Wave 1 — fire everything independent in parallel. The old version ran
  // each of these sequentially, which stacked ~4 round trips to Supabase
  // on every page load.
  const [fullName, subsResult, strategies, recommendations] = await Promise.all([
    ensureProfile(supabase, user),
    supabase
      .from("subscriptions")
      .select(
        "id,strategy_id,status,plan,started_at,expires_at,capital_allocated",
      )
      .eq("user_id", user.id),
    // Cached — same catalog for every user.
    getPublicStrategies(),
    getCurrentRecommendationsForUser(user.id),
  ]);

  let subscriptions: SubscriptionRow[] = [];
  if (subsResult.error) {
    console.error(
      "Dashboard subscriptions fetch failed:",
      subsResult.error.message,
    );
  } else if (subsResult.data) {
    subscriptions = subsResult.data as SubscriptionRow[];
  }

  const paidSubscriptions = subscriptions.filter(
    (s) => s.strategy_id !== null && s.strategy_id.length > 0,
  );

  const strategyNames = new Map<string, string>();
  const strategySlugs = new Map<string, string>();
  const strategyRegions = new Map<string, string>();
  for (const s of strategies as Strategy[]) {
    strategyNames.set(s.id, s.name);
    strategySlugs.set(s.id, s.slug);
    if (s.region) strategyRegions.set(s.id, s.region);
  }

  const capitalByStrategy = new Map<string, number>();
  for (const s of subscriptions) {
    if (s.strategy_id && s.capital_allocated !== null) {
      capitalByStrategy.set(s.strategy_id, s.capital_allocated);
    }
  }

  // Wave 2 — one parallel batch for every unique strategy that needs a
  // performance curve. Dedupe first so we don't fetch the same strategy
  // twice when a user has multiple subs on it.
  const strategiesNeedingPerf = [
    ...new Set(
      paidSubscriptions
        .filter(
          (s) =>
            s.strategy_id !== null &&
            s.started_at !== null &&
            s.capital_allocated !== null,
        )
        .map((s) => s.strategy_id as string),
    ),
  ];

  const perfResults = await Promise.all(
    strategiesNeedingPerf.map((id) => getStrategyPerformance(id)),
  );
  const perfCache = new Map<string, PerformancePoint[]>(
    strategiesNeedingPerf.map((id, i) => [id, perfResults[i]]),
  );

  type ClientWindow = {
    subscriptionId: string;
    name: string;
    startedOn: string;
    capital: number;
    current: number;
    returnPct: string;
  };
  const clientWindows: ClientWindow[] = [];
  for (const s of paidSubscriptions) {
    if (!s.strategy_id || !s.started_at || s.capital_allocated === null) {
      continue;
    }
    const startDay = s.started_at.slice(0, 10);
    const window = (perfCache.get(s.strategy_id) ?? []).filter(
      (p) => p.date >= startDay,
    );
    if (window.length < 2 || window[0].total_value <= 0) continue;
    const first = window[0].total_value;
    const last = window[window.length - 1].total_value;
    clientWindows.push({
      subscriptionId: s.id,
      name: strategyNames.get(s.strategy_id) ?? "Strategy",
      startedOn: startDay,
      capital: s.capital_allocated,
      current: s.capital_allocated * (last / first),
      returnPct: (((last / first) - 1) * 100).toFixed(2),
    });
  }
  return (
    <main>
      <Container className="py-20">
        <PageHeader
          title={`Welcome, ${fullName ?? "there"}`}
          description="Your subscriptions and the latest research published to you."
        />

        <div className="mt-12 grid grid-cols-1 gap-8">
          <section aria-labelledby="dashboard-subscriptions">
            <h2
              id="dashboard-subscriptions"
              className="text-lg font-medium tracking-tight"
            >
              Your subscriptions
            </h2>
            <div className="mt-4 space-y-4">
              <DataTable<SubscriptionRow>
                columns={[
                  {
                    key: "strategy",
                    header: "Strategy",
                    render: (row) => (
                      <span className="text-foreground">
                        {row.strategy_id
                          ? (strategyNames.get(row.strategy_id) ?? "Strategy")
                          : "—"}
                      </span>
                    ),
                  },
                  {
                    key: "plan",
                    header: "Plan",
                    render: (row) => row.plan ?? "—",
                  },
                  {
                    key: "capital",
                    header: "Capital allocated",
                    render: (row) =>
                      row.capital_allocated !== null
                        ? `₹${row.capital_allocated.toLocaleString("en-IN")}`
                        : "—",
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (row) => row.status ?? "—",
                  },
                  {
                    key: "started",
                    header: "Started",
                    render: (row) => formatDate(row.started_at),
                  },
                  {
                    key: "expires",
                    header: "Expires",
                    render: (row) => formatDate(row.expires_at),
                  },
                  {
                    key: "view",
                    header: "",
                    render: (row) => {
                      if (!row.strategy_id) return "—";
                      const region = strategyRegions.get(row.strategy_id);
                      const slug = strategySlugs.get(row.strategy_id);
                      if (!region || !slug) return "—";
                      return (
                        <Link
                          href={`/strategies/${region}/${slug}`}
                          className="underline hover:text-foreground"
                        >
                          View strategy
                        </Link>
                      );
                    },
                  },
                  {
                    key: "actions",
                    header: "",
                    render: (row) => {
                      if (row.status !== "ACTIVE") return null;
                      return <CancelSubscriptionButton subscriptionId={row.id} />;
                    },
                  },
                ]}
                rows={paidSubscriptions}
                rowKey={(row) => row.id}
                emptyState={
                  <div className="rounded-lg border border-border bg-surface p-6">
                    <p className="text-sm leading-[1.75] text-secondary">
                      You don&apos;t have any active subscriptions yet.
                    </p>
                    <p className="mt-4 text-sm">
                      <Link
                        href="/strategies"
                        className="underline hover:text-foreground"
                      >
                        Browse strategies
                      </Link>
                    </p>
                  </div>
                }
              />
              {clientWindows.length > 0 && (
                <ul className="mt-4 space-y-1">
                  {clientWindows.map((w) => (
                    <li
                      key={w.subscriptionId}
                      className="text-sm text-secondary"
                    >
                      {w.name} — Since {w.startedOn}: ₹
                      {w.capital.toLocaleString("en-IN")} → ₹
                      {Math.round(w.current).toLocaleString("en-IN")} (
                      {w.returnPct}%)
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section aria-labelledby="dashboard-recommendations">
            <h2
              id="dashboard-recommendations"
              className="text-lg font-medium tracking-tight"
            >
              Latest recommendations
            </h2>
            <div className="mt-4">
              <DataTable<Recommendation>
                columns={[
                  {
                    key: "strategy",
                    header: "Strategy",
                    render: (row) => (
                      <span className="text-foreground">
                        {strategyNames.get(row.strategy_id) ??
                          strategySlugs.get(row.strategy_id) ??
                          "—"}
                      </span>
                    ),
                  },
                  {
                    key: "symbol",
                    header: "Symbol",
                    render: (row) => (
                      <span className="font-medium text-foreground">
                        {row.symbol}
                      </span>
                    ),
                  },
                  {
                    key: "action",
                    header: "Action",
                    render: (row) => row.action ?? "—",
                  },
                  {
                    key: "target",
                    header: "Target Shares",
                    render: (row) => {
                      const cap = capitalByStrategy.get(row.strategy_id);
                      const target =
                        cap && row.weight_pct && row.price
                          ? Math.floor((cap * row.weight_pct) / row.price)
                          : null;
                      return target !== null
                        ? target.toLocaleString("en-IN")
                        : "—";
                    },
                  },
                  {
                    key: "asof",
                    header: "As of (IST)",
                    render: (row) => formatIST(row.as_of),
                  },
                  {
                    key: "expires",
                    header: "Expires (IST)",
                    render: (row) => formatIST(row.expires_at),
                  },
                ]}
                rows={recommendations}
                rowKey={(row) => row.id}
                emptyState={
                  <div className="rounded-lg border border-border bg-surface p-6">
                    <p className="text-sm leading-[1.75] text-secondary">
                      No recommendations yet.
                    </p>
                  </div>
                }
              />
            </div>
            <p className="mt-4 text-sm">
              <Link
                href="/account/history"
                className="underline hover:text-foreground"
              >
                View full history →
              </Link>
            </p>
          </section>
        </div>

        <p className="mt-12 text-sm text-secondary">
          Need to update your details?{" "}
          <Link href="/account" className="underline hover:text-foreground">
            Go to your account
          </Link>
        </p>
      </Container>
    </main>
  );
}