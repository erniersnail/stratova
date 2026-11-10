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
        let mappedChart = data.history.map((p: any) => ({
          date: p.date,
          value: 100 + ((p.value / INITIAL_CAPITAL) * 100)
        }));

        // Prepend a starting point to start exactly at 100%
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

        // Calculate Monthly PnL
        const monthlyMap = new Map<string, { first: number, last: number }>();
        data.history.forEach((p: any) => {
          const month = p.date.slice(0, 7); // YYYY-MM
          if (!monthlyMap.has(month)) {
            monthlyMap.set(month, { first: p.value, last: p.value });
          } else {
            monthlyMap.get(month)!.last = p.value;
          }
        });

        monthlyData = Array.from(monthlyMap.entries()).map(([month, vals]) => {
          const pnl = vals.last - vals.first;
          return {
            month,
            pnl,
            returnPct: (pnl / INITIAL_CAPITAL) * 100
          };
        }).reverse();
      }
    }
  } catch (error) {
    console.error("Failed to connect to VM API", error);
  }

  return (
    <main>
      <Container className="py-20">
        <PageHeader 
          title={strategy.name} 
          description={strategy.description}
        />

        <div className="mt-12 rounded-md border border-border bg-surface px-6 py-6">
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
            <div className="lg:col-span-2 rounded-md border border-border bg-surface px-6 py-6 flex flex-col justify-between">
              <EquityCurveChart series={chartSeries} height={280} />
            </div>
          ) : (
            <div className="h-[320px] flex items-center justify-center text-tertiary">
              Waiting for data from VM...
            </div>
          )}

          {/* Month-wise PnL Dropdown */}
          {monthlyData.length > 0 && (
            <div className="mt-6">
              <details className="group">
                <summary className="cursor-pointer list-none flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors">
                  <span className="transition-transform group-open:rotate-90">▶</span>
                  View Monthly Returns
                </summary>
                <div className="mt-4 overflow-hidden rounded-md border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-surface-hover/50 text-xs uppercase tracking-wider text-tertiary">
                        <th className="px-4 py-3 text-left">Month</th>
                        <th className="px-4 py-3 text-right">Return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyData.map((m, i) => (
                        <tr key={i} className="border-b border-border last:border-0">
                          <td className="px-4 py-3 text-foreground">{m.month}</td>
                          <td className={`px-4 py-3 text-right font-medium ${m.returnPct >= 0 ? "text-accent" : "text-tertiary"}`}>
                            {m.returnPct >= 0 ? "+" : ""}{m.returnPct.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </div>
          )}
        </div>

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
