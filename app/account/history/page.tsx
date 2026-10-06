import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/ui/data-table";
import { createClient } from "@/lib/supabase/server";
import {
  getRecommendationHistoryForUser,
  type Recommendation,
} from "@/lib/strategies/fetch";
import { formatIST } from "@/lib/format/date";

export const metadata: Metadata = {
  title: "Recommendation History — Stratova Quant",
  description: "Your full recommendation history, including expired picks.",
};

type StrategyRow = {
  id: string;
  name: string;
};

function isExpired(value: string | null): boolean {
  if (!value) return false;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  return d.getTime() < Date.now();
}

export default async function HistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const history: Recommendation[] = await getRecommendationHistoryForUser(
    user.id,
  );

  const strategyIds = [
    ...new Set(
      history
        .map((r) => r.strategy_id)
        .filter((id): id is string => typeof id === "string" && id.length > 0),
    ),
  ];

  const strategyNames = new Map<string, string>();
  if (strategyIds.length > 0) {
    const { data: stratData } = await supabase
      .from("strategies")
      .select("id,name")
      .in("id", strategyIds);

    if (stratData) {
      for (const s of stratData as StrategyRow[]) {
        strategyNames.set(s.id, s.name);
      }
    }
  }

  return (
    <main>
      <Container size="narrow" className="py-20">
        <PageHeader
          title="Recommendation history"
          description="Every pick from your active subscriptions — current and expired."
        />

        <div className="mt-12">
          <DataTable<Recommendation>
            columns={[
              {
                key: "strategy",
                header: "Strategy",
                render: (row) => (
                  <span className="text-foreground">
                    {strategyNames.get(row.strategy_id) ?? row.strategy_id}
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
                render: (row) => (
                  <span className="inline-flex items-center gap-2">
                    {row.action ?? "—"}
                    {isExpired(row.expires_at) && (
                      <span className="rounded border border-border px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-secondary">
                        expired
                      </span>
                    )}
                  </span>
                ),
              },
              {
                key: "asof",
                header: "As of (IST)",
                render: (row) => formatIST(row.as_of),
              },
              {
                key: "expires",
                header: "Expired (IST)",
                render: (row) => formatIST(row.expires_at),
              },
            ]}
            rows={history}
            rowKey={(row) => row.id}
            emptyState={
              <div className="rounded-lg border border-border bg-surface p-6">
                <p className="text-sm leading-[1.75] text-secondary">
                  No recommendations yet. Your history will appear here.
                </p>
              </div>
            }
          />
        </div>

        <p className="mt-12 text-sm text-secondary">
          <Link href="/account" className="underline hover:text-foreground">
            Back to your account
          </Link>
        </p>
      </Container>
    </main>
  );
}
