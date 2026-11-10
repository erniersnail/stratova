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
  
  const { data: strategy } = await admin
    .from("options_strategies")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!strategy) notFound();

  let chartSeries: ChartSeries[] = [];
  let latestPnl = 0;
  let monthlyData: { month: string, pnl: number, returnPct: number }[] = [];

  try {
    const res = await fetch("http://80.225.214.33:8000/api/options/pnl", {
      next: { revalidate: 0 },
    });
    
    if (res.ok) {
      const data = await res.json();
      latestPnl = data.realized_pnl || 0;
      
      if (data.history && data.history.length > 0) {
        const INITIAL_CAPITAL = 500000;
        
        // 1. Build Chart Data (Normalized to 100)
        let mappedChart = data.history.map((p: any) => ({
          date: p.date,
          value: 100 + ((p.value / INITIAL_CAPITAL) * 100)
        }));

        const firstDate = new Date(data.history[0].date);
        firstDate.setDate(firstDate.getDate() - 1);
        const startDate = firstDate.toISOString().split("T")[0];
        mappedChart.unshift({ date: startDate, value: 100 });

        chartSeries = [{
          name: "Simplicial NSE Options",
          color: "var(--color-foreground)",
          data: mappedChart,
          emphasis: "primary"
        }];

        // 2. Build Monthly Returns (Mathematically Accurate)
        const sortedHistory = [...data.history].sort((a: any, b: any) => a.date.localeCompare(b.date));
        const months = Array.from(new Set(sortedHistory.map((p: any) => p.date.slice(0, 7)))).sort();
        
        let previousMonthCumulativePnl = 0;
        
        months.forEach((month: any) => {
          const monthData = sortedHistory.filter((p: any) => p.date.startsWith(month));
          if (monthData.length === 0) return;
          
          const endOfMonthCumulativePnl = monthData[monthData.length - 1].value;
          const pnlThisMonth = endOfMonthCumulativePnl - previousMonthCumulativePnl;
          
          monthlyData.push({
            month,
            pnl: pnlThisMonth,
            returnPct: (pnlThisMonth / INITIAL_CAPITAL) * 100
          });
          
          previousMonthCumulativePnl = endOfMonthCumulativePnl;
        });
        
        // Reverse to show most recent month first
        monthlyData.reverse();
      }
    }
  } catch (error) {
    console.error("Failed to connect to VM API", error);
  }

  // Format "2026-09" to "Sep 2026"
  const formatMonth = (monthStr: string) => {
    const d = new Date(monthStr + "-01T00:00:00Z");
    return d.toLocaleDateString("en-IN", { month: "short", year: "numeric", timeZone: "UTC" });
  };

  return (
    <main>
      <Container className="py-20">
        <PageHeader 
          title={strategy.name} 
          description={strategy.description}
        />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Chart Area */}
          <div className="lg:col-span-2 rounded-md border border-border bg-surface px-6 py-6 flex flex-col justify-between">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className={`${typography.h3} text-foreground`}>Cumulative P&L</h2>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-tertiary">Total Realized P&L</p>
                <p className={`text-3xl font-serif ${latestPnl >= 0 ? "text-accent" : "text-tertiary"}`}>
                  {latestPnl >= 0 ? "+" : ""}₹{latestPnl.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            
            {chartSeries.length >= 1 ? (
              <EquityCurveChart series={chartSeries} height={280} />
            ) : (
              <div className="h-[280px] flex items-center justify-center text-tertiary">
                Waiting for data from VM...
              </div>
            )}
          </div>

          {/* Monthly Returns Area */}
          {monthlyData.length > 0 && (
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
                    {monthlyData.map((m) => (
                      <tr key={m.month} className="border-b border-border last:border-0">
                        <td className="py-2.5 text-foreground">{formatMonth(m.month)}</td>
                        <td className={`py-2.5 text-right font-medium ${m.returnPct >= 0 ? "text-accent" : "text-tertiary"}`}>
                          {m.returnPct >= 0 ? "+" : ""}{m.returnPct.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                    {latestPnl !== null && (
                      <tr className="bg-surface-hover/50">
                        <td className="py-2.5 font-medium text-foreground">Total</td>
                        <td className={`py-2.5 text-right font-bold ${latestPnl >= 0 ? "text-accent" : "text-tertiary"}`}>
                          {latestPnl >= 0 ? "+" : ""}{((latestPnl / 500000) * 100).toFixed(2)}%
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Subscribe Section */}
        <div className="mt-12 max-w-xl">
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
        </div>

        <p className={`${typography.body} mt-8 text-tertiary text-sm`}>
          Past performance does not indicate future results. Options trading involves significant risk.
        </p>
      </Container>
    </main>
  );
}
