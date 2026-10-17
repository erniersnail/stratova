import { typography } from "@/lib/typography";
import Link from "next/link";

export type TeaserPick = {
  id: string;
  returnPct: number | null;
};

export default function LockedPicksMock({
  strategyName,
  teaserPicks,
}: {
  strategyName: string;
  teaserPicks: TeaserPick[];
}) {
  const displayPicks = teaserPicks.length > 0 ? teaserPicks : [
    { id: "1", returnPct: 12.4 },
    { id: "2", returnPct: -3.52 },
    { id: "3", returnPct: 6.3 },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="relative min-h-[280px] flex flex-col">
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
                  <td className="px-4 py-3 font-medium text-foreground blur-[4px] opacity-40 select-none">HIDDEN</td>
                  <td className="px-4 py-3 text-foreground blur-[4px] opacity-40 select-none">BUY</td>
                  <td className="px-4 py-3 text-foreground blur-[4px] opacity-40 select-none">₹***.**</td>
                  <td className={`px-4 py-3 text-right font-medium ${isPos ? "text-accent" : "text-tertiary"}`}>
                    {r.returnPct !== null ? `${isPos ? "+" : ""}${r.returnPct.toFixed(2)}%` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto flex flex-col items-center p-6 text-center bg-background/80 backdrop-blur-sm rounded-xl border border-border shadow-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3 text-foreground">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <p className={`${typography.h3} text-foreground`}>Unlock full picks</p>
            <p className={`${typography.body} mt-2 max-w-[280px] text-sm text-foreground`}>Get real-time access to {strategyName} recommendations.</p>
            <Link href="/pricing" className="mt-5 inline-flex items-center rounded-md bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90">
              View pricing &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}