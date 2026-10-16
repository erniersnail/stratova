import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "../../../components/layout/Container";
import { createClient } from "../../../lib/supabase/server";
import RecommendationForm from "../../../components/admin/RecommendationForm";
import PendingPickRow from "../../../components/admin/PendingPickRow";
import LivePickRow from "../../../components/admin/LivePickRow";
import {
  getAdminRecommendations,
  getPendingRecommendations,
  getAdminStrategies,
  type AdminRecommendation,
  type AdminStrategyOption,
} from "../../../lib/admin/recommendations";
import { approveAllPendingForStrategy } from "../../../lib/admin/recommendationApproval";

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

type AdminStrategyGroup = AdminStrategyOption & { display_order: number };

async function getStrategiesGrouped(): Promise<AdminStrategyGroup[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("strategies")
    .select("id, name, display_order")
    .order("display_order", { ascending: true });
  if (error) {
    console.error("[admin] getStrategiesGrouped failed:", error.message);
    return [];
  }
  return (data as AdminStrategyGroup[]) ?? [];
}

function isLivePick(rec: AdminRecommendation): boolean {
  if (!rec.approved_at) return false;
  if (rec.removed_at) return false;
  if (!rec.expires_at) return true;
  const expiry = new Date(rec.expires_at).getTime();
  return Number.isNaN(expiry) || expiry > Date.now();
}

const thClass =
  "py-2 pr-4 text-left text-xs uppercase tracking-wide text-secondary";
const smallButtonClass =
  "rounded-md border border-foreground bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90";

export default async function AdminRecommendationsPage() {
  await requireAdminInPage();
  const [strategies, allRecs, pendingRecs, formStrategies] = await Promise.all([
    getStrategiesGrouped(),
    getAdminRecommendations(),
    getPendingRecommendations(),
    getAdminStrategies(),
  ]);
  const pendingByStrategy = new Map<string, AdminRecommendation[]>();
  for (const rec of pendingRecs) {
    if (!rec.strategy_id) continue;
    const list = pendingByStrategy.get(rec.strategy_id) ?? [];
    list.push(rec);
    pendingByStrategy.set(rec.strategy_id, list);
  }
  const liveByStrategy = new Map<string, AdminRecommendation[]>();
  for (const rec of allRecs) {
    if (!rec.strategy_id || !isLivePick(rec)) continue;
    const list = liveByStrategy.get(rec.strategy_id) ?? [];
    list.push(rec);
    liveByStrategy.set(rec.strategy_id, list);
  }
  const totalPending = pendingRecs.length;
  return (
    <Container className="py-20">
      <h1 className="font-serif text-3xl text-foreground">Recommendations</h1>
      <p className="mt-3 text-sm text-secondary">
        Review new picks from the VM before they go live. Approve or reject
        individually, then send the batch to subscribers.
      </p>
      <section className="mt-10">
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          Pending review{" "}
          <span className="text-base font-normal text-secondary">
            ({totalPending})
          </span>
        </h2>
        {totalPending === 0 ? (
          <p className="mt-4 rounded-md border border-border bg-surface px-6 py-6 text-sm text-secondary">
            No recommendations awaiting review.
          </p>
        ) : (
          <div className="mt-4 space-y-8">
            {strategies.map((strategy) => {
              const pending = pendingByStrategy.get(strategy.id) ?? [];
              if (pending.length === 0) return null;
              const approveAllAction = approveAllPendingForStrategy.bind(
                null,
                strategy.id,
              );
              return (
                <div key={strategy.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {strategy.name}{" "}
                      <span className="text-sm font-normal text-secondary">
                        — {pending.length} pending
                      </span>
                    </h3>
                    <form action={approveAllAction}>
                      <button type="submit" className={smallButtonClass}>
                        Approve {pending.length} & notify
                      </button>
                    </form>
                  </div>
                  <div className="mt-3 overflow-x-auto border border-border bg-surface">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className={thClass}>Symbol</th>
                          <th className={thClass}>Action</th>
                          <th className={thClass}>Weight</th>
                          <th className={thClass}>Price</th>
                          <th className={thClass}>As of</th>
                          <th className={thClass}>Remark</th>
                          <th className={thClass}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pending.map((rec) => (
                          <PendingPickRow key={rec.id} rec={rec} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      <section className="mt-16">
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          Live picks
        </h2>
        <p className="mt-2 text-sm text-secondary">
          Approved and visible to subscribers. Remove a pick to withdraw it
          from all dashboards immediately.
        </p>
        <div className="mt-6 space-y-10">
          {strategies.map((strategy) => {
            const live = liveByStrategy.get(strategy.id) ?? [];
            return (
              <div key={strategy.id}>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  {strategy.name}{" "}
                  <span className="text-sm font-normal text-secondary">
                    — {live.length} live
                  </span>
                </h3>
                <div className="mt-3 overflow-x-auto border border-border bg-surface">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className={thClass}>Symbol</th>
                        <th className={thClass}>Action</th>
                        <th className={thClass}>Weight</th>
                        <th className={thClass}>Price</th>
                        <th className={thClass}>Approved</th>
                        <th className={thClass}>Remark</th>
                        <th className={thClass}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {live.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-8 text-center text-sm text-secondary"
                          >
                            No live picks.
                          </td>
                        </tr>
                      ) : (
                        live.map((rec) => (
                          <LivePickRow key={rec.id} rec={rec} />
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 max-w-[720px] rounded-md border border-border bg-surface px-6 py-6">
                  <h4 className="text-xs uppercase tracking-wider text-tertiary">
                    Add pick — {strategy.name}
                  </h4>
                  <div className="mt-4">
                    <RecommendationForm
                      strategies={formStrategies}
                      defaultStrategyId={strategy.id}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </Container>
  );
}

