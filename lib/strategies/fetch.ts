import { createClient } from "@/lib/supabase/server";

export type Strategy = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  long_description: string | null;
  risk_level: string | null;
  benchmark: string | null;
  fee: number | null;
  returns_json: unknown | null;
  is_public: boolean;
  display_order: number;
};

export type Recommendation = {
  id: string;
  strategy_id: string;
  symbol: string;
  action: string;
  as_of: string;
  rationale: string | null;
  expires_at: string | null;
  published_at: string;
};

/**
 * Public strategy catalog. Reads only — the VM never writes here and this
 * module never writes at all. Every function swallows errors and degrades to
 * an empty result so a Supabase hiccup never takes a page down.
 */
export async function getPublicStrategies(): Promise<Strategy[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("strategies")
      .select("*")
      .eq("is_public", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[strategies] getPublicStrategies failed:", error.message);
      return [];
    }
    return (data as Strategy[]) ?? [];
  } catch (err) {
    console.error("[strategies] getPublicStrategies threw:", err);
    return [];
  }
}

export async function getStrategyBySlug(slug: string): Promise<Strategy | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("strategies")
      .select("*")
      .eq("slug", slug)
      .eq("is_public", true)
      .maybeSingle();

    if (error) {
      console.error("[strategies] getStrategyBySlug failed:", error.message);
      return null;
    }
    return (data as Strategy) ?? null;
  } catch (err) {
    console.error("[strategies] getStrategyBySlug threw:", err);
    return null;
  }
}

/**
 * Current picks for one strategy. Event-based: a new pick is a new row, and
 * "current" means expires_at is still in the future (or null = open-ended).
 */
export async function getCurrentRecommendations(
  strategyId: string,
): Promise<Recommendation[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("recommendations")
      .select("*")
      .eq("strategy_id", strategyId)
      .or("expires_at.is.null,expires_at.gt.now()")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("[strategies] getCurrentRecommendations failed:", error.message);
      return [];
    }
    return (data as Recommendation[]) ?? [];
  } catch (err) {
    console.error("[strategies] getCurrentRecommendations threw:", err);
    return [];
  }
}

/**
 * Current picks across every ACTIVE subscription the user holds.
 * RLS enforces the subscription check; the explicit filter is for readability.
 */
export async function getCurrentRecommendationsForUser(
  userId: string,
): Promise<Recommendation[]> {
  if (!userId) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("recommendations")
      .select("*")
      .or("expires_at.is.null,expires_at.gt.now()")
      .order("strategy_id", { ascending: true })
      .order("published_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error(
        "[strategies] getCurrentRecommendationsForUser failed:",
        error.message,
      );
      return [];
    }
    return (data as Recommendation[]) ?? [];
  } catch (err) {
    console.error("[strategies] getCurrentRecommendationsForUser threw:", err);
    return [];
  }
}
