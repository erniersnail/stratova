import { typography } from "@/lib/typography";
import type { Recommendation } from "@/lib/strategies/fetch";

export default function LockedPicksMock({
  strategyName,
  picks,
}: {
  strategyName: string;
  picks: Recommendation[];
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-surface">
      <div className="pointer-events-none select-none">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-foreground">Symbol</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-foreground">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-foreground">Price</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-foreground">Since Rec.</th>
            </tr>
          </thead>
          <tbody>
            {picks.map((r) => {
              const ret = r.current_price && r.price ? ((r.current_price / r.price) - 1) * 100 : null;
              const isPos = ret !== null && ret >= 0;
              return (
                <tr key={r.id} className="border-b border-border last:border-0">
                  {/* Blur the symbol name */}
                  <td className="px-4 py-3 font-medium text-foreground blur-[4px] opacity-60">
                    {r.symbol}
                  </td>
                  <td className="px-4 py-3 text-foreground blur-[4px] opacity-60">
                    {r.action}
                  </td>
                  {/* Blur the price */}
                  <td className="px-4 py-3 text-foreground blur-[4px] opacity-60">
                    {r.price ?? "—"}
                  </td>
                  {/* Show the real return clearly */}
                  <td className={`px-4 py-3 text-right font-medium ${isPos ? "text-accent" : "text-tertiary"}`}>
                    {ret !== null ? `${isPos ? "+" : ""}${ret.toFixed(2)}%` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 p-6 text-center backdrop-blur-[1px]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3 text-foreground">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <p className={`${typography.h3} text-foreground`}>Subscribe to unlock picks</p>
        <p className={`${typography.body} mt-2 max-w-[400px] text-foreground`}>Get real-time access to {strategyName} recommendations, target allocations, and entry prices.</p>
        <a href="#subscribe" className="mt-6 inline-flex items-center rounded-md bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90">View plans & subscribe</a>
      </div>
    </div>
  );
}
