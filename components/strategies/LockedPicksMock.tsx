import { typography } from "@/lib/typography";
import SubscribePayForm from "@/components/strategies/SubscribePayForm";

export type TeaserPick = {
  id: string;
  returnPct: number | null;
};

export default function LockedPicksMock({
  strategyId,
  strategyName,
  fee,
  feeStr,
  nextDateStr,
  teaserPicks,
}: {
  strategyId: string;
  strategyName: string;
  fee: number | null;
  feeStr: string;
  nextDateStr: string;
  teaserPicks: TeaserPick[];
}) {
  // If no live picks exist, show dummy returns so the layout holds shape
  const displayPicks = teaserPicks.length > 0 ? teaserPicks : [
    { id: "1", returnPct: 12.4 },
    { id: "2", returnPct: -3.52 },
    { id: "3", returnPct: 6.3 },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      {/* Blurred Table Area */}
      <div className="relative min-h-[280px]">
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
              {displayPicks.map((r) => {
                const isPos = r.returnPct !== null && r.returnPct >= 0;
                return (
                  <tr key={r.id} className="border-b border-border last:border-0">
                    {/* Blur the symbol name, action, and price */}
                    <td className="px-4 py-3 font-medium text-foreground blur-[4px] opacity-60">HIDDEN</td>
                    <td className="px-4 py-3 text-foreground blur-[4px] opacity-60">BUY</td>
                    <td className="px-4 py-3 text-foreground blur-[4px] opacity-60">₹***.**</td>
                    {/* Show the real return clearly */}
                    <td className={`px-4 py-3 text-right font-medium ${isPos ? "text-accent" : "text-tertiary"}`}>
                      {r.returnPct !== null ? `${isPos ? "+" : ""}${r.returnPct.toFixed(2)}%` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/40 p-6 text-center backdrop-blur-[1px]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3 text-foreground">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <p className={`${typography.h3} text-foreground`}>Subscribe to unlock picks</p>
          <p className={`${typography.body} mt-2 max-w-[400px] text-foreground`}>Get real-time access to {strategyName} recommendations.</p>
          <a href="#subscribe" className="mt-6 inline-flex items-center rounded-md bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90">View plans & subscribe</a>
        </div>
      </div>

      {/* Subscribe Form Area (Inside the same card) */}
      <div className="border-t border-border bg-surface-hover/30 px-6 py-8 text-center" id="subscribe">
        <p className="text-lg font-medium text-foreground">Subscribe to {strategyName}</p>
        <p className={`${typography.body} mt-2 text-foreground`}>
          Next rebalance: <strong>{nextDateStr}</strong><br />Fee: <strong>{feeStr}</strong>
        </p>
        <div className="mt-6 max-w-md mx-auto text-left">
          <SubscribePayForm strategyId={strategyId} fee={fee} feeStr={feeStr} />
        </div>
      </div>
    </div>
  );
}
