import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/server";
import RecommendationForm from "@/components/admin/RecommendationForm";
import ConfirmActionForm from "@/components/admin/ConfirmActionForm";
import {
  getAdminRecommendations,
  getAdminStrategies,
  type AdminRecommendation,
  type AdminStrategyOption,
} from "@/lib/admin/recommendations";
import {
  expireRecommendation,
  expireAllForStrategy,
} from "@/lib/admin/actions";

export const metadata: Metadata = {
  title: "Recommendations — Admin",
};

async function requireAdminInPage(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") notFound();
}

/** India strategies in display_order — the grouping order for the page. */
type AdminStrategyGroup = AdminStrategyOption & { display_order: number };

async function getIndiaStrategies(): Promise<AdminStrategyGroup[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("strategies")
    .select("id, name, display_order")
    .eq("region", "india")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[admin] getIndiaStrategies failed:", error.message);
    return [];
  }
  return (data as AdminStrategyGroup[]) ?? [];
}

/** A recommendation counts as a current pick while it has no expiry or a future one. */
function isCurrentPick(rec: AdminRecommendation): boolean {
  if (!rec.expires_at) return true;
  const expiry = new Date(rec.expires_at).getTime();
  return Number.isNaN(expiry) || expiry > Date.now();
}

function formatIST(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
}

const thClass =
  "py-2 pr-4 text-left text-xs uppercase tracking-wide text-secondary";
const tdClass = "py-3 pr-4";
const smallButtonClass =
  "rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-foreground";


export default async function AdminRecommendationsPage() {
  await requireAdminInPage();

  const [strategies, recommendations, formStrategies] = await Promise.all([
    getIndiaStrategies(),
    getAdminRecommendations(),
    getAdminStrategies(),
  ]);

  const currentPicksByStrategy = new Map<string, AdminRecommendation[]>();
  for (const rec of recommendations) {
    if (!rec.strategy_id || !isCurrentPick(rec)) continue;
    const list = currentPicksByStrategy.get(rec.strategy_id) ?? [];
    list.push(rec);
    currentPicksByStrategy.set(rec.strategy_id, list);
  }

  return (
    <Container className="py-20">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-foreground">Recommendations</h1>
      </div>

      <p className="mt-3 text-sm text-secondary">
        Current picks per strategy. Insert manual recommendations or expire
        stale picks.
      </p>

      <div className="mt-10 space-y-12">
        {strategies.length === 0 ? (
          <p className="text-sm text-secondary">No strategies found.</p>
        ) : (
          strategies.map((strategy) => {
            const picks = currentPicksByStrategy.get(strategy.id) ?? [];

            return (
              <section key={strategy.id}>
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-semibold text-foreground">
                    {strategy.name}
                  </h2>
                  <ConfirmActionForm
                    action={expireAllForStrategy}
                    id={strategy.id}
                    confirmMessage={`Expire all current picks for ${strategy.name}?`}
                    className={smallButtonClass}
                  >
                    Expire all picks
                  </ConfirmActionForm>
                </div>

                <div className="mt-4 overflow-x-auto border border-border bg-surface">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className={thClass}>Symbol</th>
                        <th className={thClass}>Action</th>
                        <th className={thClass}>Weight</th>
                        <th className={thClass}>Price</th>
                        <th className={thClass}>Source</th>
                        <th className={thClass}>As of</th>
                        <th className={thClass}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {picks.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-8 text-center text-sm text-secondary"
                          >
                            No current picks.
                          </td>
                        </tr>
                      ) : (
                        picks.map((rec) => (
                          <tr key={rec.id} className="border-b border-border">
                            <td className={`${tdClass} font-medium`}>
                              {rec.symbol}
                            </td>
                            <td className={tdClass}>{rec.action}</td>
                            <td className={tdClass}>
                              {rec.weight_pct !== null
                                ? `${rec.weight_pct}%`
                                : "—"}
                            </td>
                            <td className={tdClass}>
                              {rec.price !== null ? rec.price : "—"}
                            </td>
                            <td className={tdClass}>
                              <span className="inline-block rounded-full border border-border px-2 py-0.5 text-xs uppercase tracking-wide text-secondary">
                                {rec.source === "manual" ? "Manual" : "VM"}
                              </span>
                            </td>
                            <td className={`${tdClass} text-secondary`}>
                              {formatIST(rec.as_of)}
                            </td>
                            <td className={tdClass}>
                              <ConfirmActionForm
                                action={expireRecommendation}
                                id={rec.id}
                                confirmMessage={`Expire ${rec.action} ${rec.symbol}?`}
                                className={smallButtonClass}
                              >
                                Expire
                              </ConfirmActionForm>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 max-w-[720px] rounded-md border border-border bg-surface px-6 py-6">
                  <h3 className="text-xs uppercase tracking-wider text-tertiary">
                    Add pick — {strategy.name}
                  </h3>
                  <div className="mt-4">
                    <RecommendationForm
                      strategies={formStrategies}
                      defaultStrategyId={strategy.id}
                    />
                  </div>
                </div>
              </section>
            );
          })
        )}
      </div>
    </Container>
  );
}

