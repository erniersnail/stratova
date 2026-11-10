import Container from "@/components/layout/Container";
import PageHeader from "@/components/common/PageHeader";
import { createServiceClient } from "@/lib/admin/recommendations";
import { typography } from "@/lib/typography";
import EquityCurveChart, { type ChartSeries } from "@/components/strategies/EquityCurveChart";
import { getStrategyBySlug, getStrategyPerformance } from "@/lib/strategies/fetch";

export const metadata = { title: "Free Research Picks — Simplicial Capital" };

export default async function FreeManualStrategyPage() {
  const admin = createServiceClient();
  const { data: trades } = await admin.from("manual_trades").select("*").order("entry_date", { ascending: false });

  const strategy = await getStrategyBySlug("free-manual");
  let chartSeries: ChartSeries[] = [];

  if (strategy) {
    const perf = await getStrategyPerformance(strategy.id);
    // Allow 1 data point so the chart shows up on day 1
    if (perf.length >= 1 && perf[0].total_value > 0) {
      const base = perf[0].total_value;
      chartSeries = [{
        name: "₹1L Portfolio",
        color: "var(--color-foreground)",
        data: perf.map(p => ({ date: p.date, value: (100 * p.total_value) / base })),
        emphasis: "primary"
      }];
    }
  }

  const openTrades = trades?.filter(t => t.status === "OPEN") || [];
  const closedTrades = trades?.filter(t => t.status !== "OPEN") || [];

  const totalClosed = closedTrades.length;
  const wins = closedTrades.filter(t => t.status === "CLOSED_TARGET").length;
  const winRate = totalClosed > 0 ? ((wins / totalClosed) * 100).toFixed(1) : "0.0";

  return (
    <main>
      <Container className="py-20">
        <PageHeader title="Free Research Picks" description="High-conviction ideas with absolute targets and strict stop losses." />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-md border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-wide text-tertiary">Win Rate</p>
            <p className="mt-1 text-3xl font-serif text-foreground">{winRate}%</p>
          </div>
          <div className="rounded-md border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-wide text-tertiary">Total Closed</p>
            <p className="mt-1 text-3xl font-serif text-foreground">{totalClosed}</p>
          </div>
          <div className="rounded-md border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-wide text-tertiary">Open Trades</p>
            <p className="mt-1 text-3xl font-serif text-foreground">{openTrades.length}</p>
        </div>
        </div>

        <div className="mt-16">
          <h2 className={`${typography.h3} text-foreground`}>Open Positions</h2>
          <div className="mt-4 overflow-hidden rounded-md border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-tertiary">
                  <th className="px-4 py-3 text-left">Symbol</th>
                  <th className="px-4 py-3 text-left">Entry Date</th>
                  <th className="px-4 py-3 text-left">Entry Price</th>
                  <th className="px-4 py-3 text-left">Target</th>
                  <th className="px-4 py-3 text-left">Stop Loss</th>
                </tr>
              </thead>
              <tbody>
                {openTrades.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{t.symbol}</td>
                    <td className="px-4 py-3 text-secondary">{t.entry_date}</td>
                    <td className="px-4 py-3 text-secondary">₹{Number(t.entry_price).toFixed(2)}</td>
                    <td className="px-4 py-3 text-accent font-medium">₹{Number(t.target_price).toFixed(2)}</td>
                    <td className="px-4 py-3 text-tertiary font-medium">₹{Number(t.stop_loss_price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-16">
          <h2 className={`${typography.h3} text-foreground`}>Closed Positions</h2>
          <div className="mt-4 overflow-hidden rounded-md border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-tertiary">
                  <th className="px-4 py-3 text-left">Symbol</th>
                  <th className="px-4 py-3 text-left">Entry</th>
                  <th className="px-4 py-3 text-left">Exit</th>
                  <th className="px-4 py-3 text-left">Result</th>
                  <th className="px-4 py-3 text-right">P&L %</th>
                </tr>
              </thead>
              <tbody>
                {closedTrades.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{t.symbol}</td>
                    <td className="px-4 py-3 text-secondary">₹{Number(t.entry_price).toFixed(2)}</td>
                    <td className="px-4 py-3 text-secondary">₹{Number(t.exit_price).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${t.status === "CLOSED_TARGET" ? "text-accent" : "text-tertiary"}`}>
                        {t.status === "CLOSED_TARGET" ? "Target Hit" : "Stop Loss"}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-medium ${Number(t.pnl_percent) >= 0 ? "text-accent" : "text-tertiary"}`}>
                      {Number(t.pnl_percent) >= 0 ? "+" : ""}{Number(t.pnl_percent).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </main>
  );
}
          