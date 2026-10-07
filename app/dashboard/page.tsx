import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/ui/data-table";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth/ensure-profile";
import {
  getCurrentRecommendationsForUser,
  getStrategyPerformance,
  type PerformancePoint,
  type Recommendation,
} from "@/lib/strategies/fetch";
import { formatIST } from "@/lib/format/date";

export const metadata: Metadata = {
  title: "Dashboard — Stratova Quant",
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

type StrategyRow = {
  id: string;
  name: string;
  slug: string;
  region: string | null;
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

  await ensureProfile(supabase, user);

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const authName =
    ((user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      "")?.trim() || null;
  const profileName = profile?.full_name?.trim()
    ? profile.full_name.trim()
    : null;
  const fullName = profileName ?? authName;

  let subscriptions: SubscriptionRow[] = [];
  const { data: subsData, error: subsError } = await supabase
    .from("subscriptions")
    .select("id,strategy_id,status,plan,started_at,expires_at,capital_allocated")
    .eq("user_id", user.id);

  if (subsError) {
    console.error("Dashboard subscriptions fetch failed:", subsError.message);
  } else if (subsData) {
    subscriptions = subsData as SubscriptionRow[];
  }

  const previewSubscription =
    subscriptions.find((s) => s.plan === "preview") ?? null;
  const paidSubscriptions = subscriptions.filter(
    (s) => s.strategy_id !== null && s.strategy_id.length > 0,
  );

  const strategyNames = new Map<string, string>();
  const strategySlugs = new Map<string, string>();
  const strategyRegions = new Map<string, string>();
  // Always fetch the full public catalog — the user may see recommendations
  // for strategies they are not subscribed to (e.g. admin RLS bypass), and
  // those must resolve to names, never raw UUIDs.
  const { data: stratData, error: stratError } = await supabase
    .from("strategies")
    .select("id,name,slug,region")
    .eq("is_public", true);

  if (stratError) {
    console.error("Dashboard strategies fetch failed:", stratError.message);
  } else if (stratData) {
    for (const s of stratData as StrategyRow[]) {
      strategyNames.set(s.id, s.name);
      strategySlugs.set(s.id, s.slug);
      if (s.region) strategyRegions.set(s.id, s.region);
    }
  }

  const recommendations: Recommendation[] =
    await getCurrentRecommendationsForUser(user.id);

  // Capital allocated per strategy — feeds the Target Shares column.
  const capitalByStrategy = new Map<string, number>();
  for (const s of subscriptions) {
    if (s.strategy_id && s.capital_allocated !== null) {
      capitalByStrategy.set(s.strategy_id, s.capital_allocated);
    }
  }

  // Client-window returns: value of the allocated capital from the
  // subscription start date to the latest snapshot. One line per
  // subscription; skipped when started_at is null or the window has
  // fewer than 2 snapshots.
  type ClientWindow = {
    subscriptionId: string;
    name: string;
    startedOn: string;
    capital: number;
    current: number;
    returnPct: string;
  };
  const clientWindows: ClientWindow[] = [];
  const perfCache = new Map<string, PerformancePoint[]>();
  for (const s of paidSubscriptions) {
    if (!s.strategy_id || !s.started_at || s.capital_allocated === null) {
      continue;
    }
    if (!perfCache.has(s.strategy_id)) {
      perfCache.set(s.strategy_id, await getStrategyPerformance(s.strategy_id));
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
              {previewSubscription && (
                <div className="rounded-md border border-border bg-surface px-4 py-3">
                  <p className="text-sm font-medium text-foreground">
                    Preview access — all strategies
                  </p>
                  <p className="mt-1 text-sm text-secondary">
                    You have preview access to every current strategy.
                  </p>
                </div>
              )}
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
                ]}
                rows={paidSubscriptions}
                rowKey={(row) => row.id}
                emptyState={
                  previewSubscription ? null : (
                    <div className="rounded-lg border border-border bg-surface p-6">
                      <p className="text-sm leading-[1.75] text-secondary">
                        You don&apos;t have any active subscriptions yet.
                      </p>
                      <p className="mt-4 text-sm">
                        <Link
                          href="/pricing"
                          className="underline hover:text-foreground"
                        >
                          View pricing
                        </Link>
                      </p>
                    </div>
                  )
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
