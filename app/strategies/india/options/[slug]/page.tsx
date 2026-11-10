import Container from "@/components/layout/Container";
import PageHeader from "@/components/common/PageHeader";
import { typography } from "@/lib/typography";
import EquityCurveChart, { type ChartSeries } from "@/components/strategies/EquityCurveChart";
import { createServiceClient } from "@/lib/admin/recommendations";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OptionsShowcasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const admin = createServiceClient();
  
  // 1. Fetch the specific options strategy
  const { data: strategy } = await admin
    .from("options_strategies")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!strategy) notFound();

  // 2. Fetch the cumulative PnL data
  const { data: perf } = await admin
    .from("options_performance")
    .select("date, cumulative_pnl")
    .eq("strategy_id", strategy.id)
    .order("date", { ascending: true });

  let chartSeries: ChartSeries[] = [];
  
  if (perf && perf.length >= 1) {
    chartSeries = [{
      name: "Options PnL",
      color: "var(--color-foreground)",
      data: perf.map(p => ({ date: p.date, value: Number(p.cumulative_pnl) })),
      emphasis: "primary"
    }];
  }

  const latestPnl = perf && perf.length > 0 ? Number(perf[perf.length - 1].cumulative_pnl) : 0;

  return (
    <main>
      <Container className="py-20">
        <PageHeader 
          title={strategy.name} 
          description={strategy.description ?? "High-conviction options setups."}
        />

        <div className="mt-12 rounded-md border border-border bg-surface px-6 py-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className={`${typography.h3} text-foreground`}>Cumulative P&L</h2>
              <p className="mt-1 text-sm text-tertiary">Live tracking of our options strategy</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-tertiary">Total P&L</p>
              <p className={`text-3xl font-serif ${latestPnl >= 0 ? "text-accent" : "text-tertiary"}`}>
                {latestPnl >= 0 ? "+" : ""}₹{latestPnl.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
          
          {chartSeries.length >= 1 ? (
            <EquityCurveChart series={chartSeries} height={320} />
          ) : (
            <div className="h-[320px] flex items-center justify-center text-tertiary">
              Waiting for first data sync from VM...
            </div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-md border border-border bg-surface p-8 flex flex-col items-start">
            <h3 className={`${typography.h3} text-foreground`}>Subscribe to Options</h3>
            <p className={`${typography.body} mt-2 text-secondary flex-1`}>
              Get real-time access to our high-probability options setups. 
              Reach out to us to discuss allocations and subscription details.
            </p>
            <Link 
              href={strategy.contact_url || "/contact"} 
              className="mt-6 inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:opacity-90"
            >
              Contact Us
            </Link>
          </div>

          {strategy.streamlit_url && (
            <div className="rounded-md border border-border bg-surface p-8 flex flex-col items-start">
              <h3 className={`${typography.h3} text-foreground`}>Live Dashboard</h3>
              <p className={`${typography.body} mt-2 text-secondary flex-1`}>
                View our live Streamlit dashboard for deep analytics, 
                open positions, and live Greeks.
              </p>
              <a 
                href={strategy.streamlit_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
              >
                Open Streamlit App ↗
              </a>
            </div>
          )}
        </div>

        <p className={`${typography.body} mt-8 text-tertiary text-sm`}>
          Past performance does not indicate future results. Options trading involves significant risk.
        </p>
      </Container>
    </main>
  );
}
