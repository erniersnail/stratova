// SERVER-ONLY. Uses the service-role key (same pattern as lib/admin/payments.ts)
// because recommendations has no write RLS policy — admin inserts/expiries would
// fail under the session client. Never import from a client component.
import { createClient } from "@supabase/supabase-js";

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing service role env vars");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type AdminRecommendation = {
  id: string;
  strategy_id: string;
  strategy_name: string | null;
  symbol: string;
  action: string;
  as_of: string;
  rationale: string | null;
  expires_at: string | null;
  published_at: string;
  weight_pct: number | null;
  price: number | null;
  source: string;
  approved_at: string | null;
  removed_at: string | null;
  removed_reason: string | null;
  admin_remark: string | null;
};

export type AdminStrategyOption = {
  id: string;
  name: string;
};

type RawRecommendation = {
  id: string;
  strategy_id: string | null;
  symbol: string;
  action: string | null;
  as_of: string;
  rationale: string | null;
  expires_at: string | null;
  published_at: string;
  weight_pct: number | null;
  price: number | null;
  source: string | null;
  approved_at: string | null;
  removed_at: string | null;
  removed_reason: string | null;
  admin_remark: string | null;
  strategies: { name: string }[] | null;
};

const SELECT_COLS =
  "id, strategy_id, symbol, action, as_of, rationale, expires_at, published_at, weight_pct, price, source, approved_at, removed_at, removed_reason, admin_remark, strategies(name)";

function mapRow(r: RawRecommendation): AdminRecommendation {
  return {
    id: r.id,
    strategy_id: r.strategy_id ?? "",
    strategy_name: r.strategies?.[0]?.name ?? null,
    symbol: r.symbol,
    action: r.action ?? "",
    as_of: r.as_of,
    rationale: r.rationale,
    expires_at: r.expires_at,
    published_at: r.published_at,
    weight_pct: r.weight_pct,
    price: r.price,
    source: r.source ?? "vm",
    approved_at: r.approved_at,
    removed_at: r.removed_at,
    removed_reason: r.removed_reason,
    admin_remark: r.admin_remark,
  };
}

async function buildRecommendations(): Promise<AdminRecommendation[]> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("recommendations")
      .select(SELECT_COLS)
      .order("published_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("[admin] getAdminRecommendations failed:", error.message);
      return [];
    }
    return ((data ?? []) as RawRecommendation[]).map(mapRow);
  } catch (err) {
    console.error("[admin] getAdminRecommendations threw:", err);
    return [];
  }
}

/** All recommendations, newest first. */
export async function getAdminRecommendations(): Promise<AdminRecommendation[]> {
  return buildRecommendations();
}

/** Recommendations awaiting admin review (approved_at IS NULL, not removed). */
export async function getPendingRecommendations(): Promise<AdminRecommendation[]> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("recommendations")
      .select(SELECT_COLS)
      .is("approved_at", null)
      .is("removed_at", null)
      .order("published_at", { ascending: false })
      .limit(200);
    if (error) {
      console.error("[admin] getPendingRecommendations failed:", error.message);
      return [];
    }
    return ((data ?? []) as RawRecommendation[]).map(mapRow);
  } catch (err) {
    console.error("[admin] getPendingRecommendations threw:", err);
    return [];
  }
}

/** Strategies for the insert dropdown — id + name only. */
export async function getAdminStrategies(): Promise<AdminStrategyOption[]> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("strategies")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) {
      console.error("[admin] getAdminStrategies failed:", error.message);
      return [];
    }
    return (data as AdminStrategyOption[]) ?? [];
  } catch (err) {
    console.error("[admin] getAdminStrategies threw:", err);
    return [];
  }
}
