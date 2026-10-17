import { unstable_cache } from "next/cache";
import { createClient } from "../supabase/server";
import { createPublicClient } from "../supabase/public";

export type Strategy = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  long_description: string | null;
  risk_level: string | null;
  benchmark: string | null;
  fee: number | null;
  fee_per_rebalance: number | null;
  returns_json: unknown | null;
  is_public: boolean;
  is_subscribable: boolean;
  display_order: number;
  region: string | null;
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
  weight_pct: number | null;
  price: number | null;
  current_price: number | null;
  approved_at: string | null;
  removed_at: string | null;
  removed_reason: string | null;
  admin_remark: string | null;
};

export type PerformancePoint = { date: string; total_value: number };
export type BenchmarkPoint = { date: string; close: number };

const STRATEGY_TTL = 300;
const PERFORMANCE_TTL = 300;
const BENCHMARK_TTL = 3600;

const _getPublicStrategies = unstable_cache(
  async (): Promise<Strategy[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("strategies").select("*").eq("is_public", true).order("display_order", { ascending: true });
    if (error) throw new Error(`getPublicStrategies: ${error.message}`);
    return (data as Strategy[]) ?? [];
  },
  ["public-strategies"],
  { revalidate: STRATEGY_TTL, tags: ["strategies"] },
);

export async function getPublicStrategies(): Promise<Strategy[]> {
  try { return await _getPublicStrategies(); } catch (err) { console.error("[strategies] getPublicStrategies failed:", err); return []; }
}

const _getPublicStrategiesByRegion = unstable_cache(
  async (region: "india" | "us"): Promise<Strategy[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("strategies").select("*").eq("is_public", true).eq("region", region).order("name", { ascending: true });
    if (error) throw new Error(`getPublicStrategiesByRegion: ${error.message}`);
    return (data as Strategy[]) ?? [];
  },
  ["public-strategies-region"],
  { revalidate: STRATEGY_TTL, tags: ["strategies"] },
);

export async function getPublicStrategiesByRegion(region: "india" | "us"): Promise<Strategy[]> {
  try { return await _getPublicStrategiesByRegion(region); } catch (err) { console.error("[strategies] getPublicStrategiesByRegion failed:", err); return []; }
}

const _getStrategyBySlug = unstable_cache(
  async (slug: string): Promise<Strategy | null> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("strategies").select("*").eq("slug", slug).eq("is_public", true).maybeSingle();
    if (error) throw new Error(`getStrategyBySlug: ${error.message}`);
    return (data as Strategy) ?? null;
  },
  ["strategy-by-slug"],
  { revalidate: STRATEGY_TTL, tags: ["strategies"] },
);

export async function getStrategyBySlug(slug: string): Promise<Strategy | null> {
  try { return await _getStrategyBySlug(slug); } catch (err) { console.error("[strategies] getStrategyBySlug failed:", err); return null; }
}

const _getStrategyPerformance = unstable_cache(
  async (strategyId: string): Promise<PerformancePoint[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("strategy_performance").select("date, total_value").eq("strategy_id", strategyId).order("date", { ascending: true });
    if (error) throw new Error(`getStrategyPerformance: ${error.message}`);
    return ((data as PerformancePoint[]) ?? []).filter((r) => typeof r?.date === "string" && r.date.length >= 10 && Number.isFinite(Number(r?.total_value))).map((r) => ({ date: r.date.slice(0, 10), total_value: Number(r.total_value) }));
  },
  ["strategy-performance"],
  { revalidate: PERFORMANCE_TTL, tags: ["performance"] },
);

export async function getStrategyPerformance(strategyId: string): Promise<PerformancePoint[]> {
  if (!strategyId) return [];
  try { return await _getStrategyPerformance(strategyId); } catch (err) { console.error("[strategies] getStrategyPerformance failed:", err); return []; }
}

const _getBenchmark = unstable_cache(
  async (symbol: string, fromDate: string): Promise<BenchmarkPoint[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("benchmarks").select("date, close").eq("symbol", symbol).gte("date", fromDate).order("date", { ascending: true });
    if (error) throw new Error(`getBenchmark: ${error.message}`);
    return ((data as BenchmarkPoint[]) ?? []).filter((r) => typeof r?.date === "string" && r.date.length >= 10 && Number.isFinite(Number(r?.close))).map((r) => ({ date: r.date.slice(0, 10), close: Number(r.close) }));
  },
  ["benchmark"],
  { revalidate: BENCHMARK_TTL, tags: ["benchmarks"] },
);

export async function getBenchmark(symbol: string, fromDate: string): Promise<BenchmarkPoint[]> {
  if (!symbol || !fromDate) return [];
  try { return await _getBenchmark(symbol, fromDate); } catch (err) { console.error("[strategies] getBenchmark failed:", err); return []; }
}

export async function getCurrentRecommendations(strategyId: string): Promise<Recommendation[]> {
  if (!strategyId) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("recommendations").select("*").eq("strategy_id", strategyId).not("approved_at", "is", null).is("removed_at", null).or("expires_at.is.null,expires_at.gt.now()").order("published_at", { ascending: false });
    if (error) { console.error("[strategies] getCurrentRecommendations failed:", error.message); return []; }
    return (data as Recommendation[]) ?? [];
  } catch (err) { console.error("[strategies] getCurrentRecommendations threw:", err); return []; }
}

export async function getCurrentRecommendationsForUser(userId: string): Promise<Recommendation[]> {
  if (!userId) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("recommendations").select("*").not("approved_at", "is", null).is("removed_at", null).or("expires_at.is.null,expires_at.gt.now()").order("strategy_id", { ascending: true }).order("published_at", { ascending: false }).limit(50);
    if (error) { console.error("[strategies] getCurrentRecommendationsForUser failed:", error.message); return []; }
    return (data as Recommendation[]) ?? [];
  } catch (err) { console.error("[strategies] getCurrentRecommendationsForUser threw:", err); return []; }
}

export async function getRecommendationHistoryForUser(userId: string): Promise<Recommendation[]> {
  if (!userId) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("recommendations").select("*").not("approved_at", "is", null).order("as_of", { ascending: false }).order("published_at", { ascending: false }).limit(200);
    if (error) { console.error("[strategies] getRecommendationHistoryForUser failed:", error.message); return []; }
    return (data as Recommendation[]) ?? [];
  } catch (err) { console.error("[strategies] getRecommendationHistoryForUser threw:", err); return []; }
}
