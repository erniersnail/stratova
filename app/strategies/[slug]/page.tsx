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

const IST = "en-IN" as const;

function formatIST(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(IST, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(d);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const strategy = await getStrategyBySlug(slug);
  if (!strategy) return { title: "Strategy not found" };
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const strategy = await getStrategyBySlug(slug);
  if (!strategy) notFound();

  // Auth check — recommendations are gated to signed-in users only.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const picks: Recommendation[] = user
    ? await getCurrentRecommendations(strategy.id)
    : [];

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
      key: "as_of",
      header: "As of (IST)",
      render: (r: Recommendation) => (
        <span className="text-secondary">{formatIST(r.as_of)}</span>
      ),
    },
    {
      key: "expires",
      header: "Expires (IST)",
      render: (r: Recommendation) => (
        <span className="text-secondary">
          {r.expires_at ? formatIST(r.expires_at) : "—"}
        </span>
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
                Pre-launch
              </dd>
            </div>
          </dl>
        </Container>
      </Section>

      <Section>
        <Container>
          <div
            className="rounded-md border border-border bg-surface px-4 py-3"
            role="note"
          >
            <p className="text-sm text-secondary">
              Pre-launch — for informational purposes. Not investment advice.
              Stratova&apos;s SEBI Research Analyst registration is pending.
            </p>
          </div>

          <h2 className={`${typography.h3} mt-8 text-foreground`}>
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
            <div className="mt-4">
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