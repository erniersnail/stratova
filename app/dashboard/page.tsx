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
};

type StrategyRow = {
  id: string;
  name: string;
  slug: string;
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
    .select("id,strategy_id,status,plan,started_at,expires_at")
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

  const allStrategyIds = [
    ...new Set(
      subscriptions
        .map((s) => s.strategy_id)
        .filter((id): id is string => typeof id === "string" && id.length > 0),
    ),
  ];

  const strategyNames = new Map<string, string>();
  const strategySlugs = new Map<string, string>();
  if (allStrategyIds.length > 0) {
    const { data: stratData, error: stratError } = await supabase
      .from("strategies")
      .select("id,name,slug")
      .in("id", allStrategyIds);

    if (stratError) {
      console.error("Dashboard strategies fetch failed:", stratError.message);
    } else if (stratData) {
      for (const s of stratData as StrategyRow[]) {
        strategyNames.set(s.id, s.name);
        strategySlugs.set(s.id, s.slug);
      }
    }
  } else {
    // Preview-only users hold no strategy_id rows, so the map above stays
    // empty — fall back to the full public catalog so recommendation
    // strategy_ids still resolve to names.
    const { data: stratData, error: stratError } = await supabase
      .from("strategies")
      .select("id,name,slug")
      .eq("is_public", true);

    if (stratError) {
      console.error("Dashboard strategies fetch failed:", stratError.message);
    } else if (stratData) {
      for (const s of stratData as StrategyRow[]) {
        strategyNames.set(s.id, s.name);
        strategySlugs.set(s.id, s.slug);
      }
    }
  }

  const recommendations: Recommendation[] =
    await getCurrentRecommendationsForUser(user.id);

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
                    You have preview access to every current strategy. Paid
                    subscriptions open when Stratova&apos;s SEBI RA
                    registration is granted.
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
                ]}
                rows={paidSubscriptions}
                rowKey={(row) => row.id}
                emptyState={
                  previewSubscription ? null : (
                    <div className="rounded-lg border border-border bg-surface p-6">
                      <p className="text-sm leading-[1.75] text-secondary">
                        You don&apos;t have any subscriptions yet. Once you
                        subscribe, you&apos;ll see your plans and start dates
                        here.
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
            </div>
          </section>

          <section aria-labelledby="dashboard-recommendations">
            <h2
              id="dashboard-recommendations"
              className="text-lg font-medium tracking-tight"
            >
              Latest recommendations
            </h2>
            <div
              className="mt-4 rounded-md border border-border bg-surface px-4 py-3"
              role="note"
            >
              <p className="text-sm text-secondary">
                Pre-launch — not for public distribution. Stratova&apos;s SEBI
                Research Analyst registration is pending.
              </p>
            </div>
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
                          row.strategy_id}
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
                      No recommendations yet. You&apos;ll see signals here once
                      you&apos;re subscribed and the service is live.
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
