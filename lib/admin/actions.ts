"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/admin/recommendations";

export type RecommendationFormState = {
  error?: string;
  success?: string;
};

const VALID_ACTIONS = ["BUY", "SELL", "HOLD"];

async function requireAdminSession(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") throw new Error("Not authorized");
}

/**
 * Insert a manual recommendation (source = 'manual').
 * Auth is verified against the session client; the write itself uses the
 * service client because recommendations has no admin write RLS policy.
 */
export async function insertManualRecommendation(
  _prev: RecommendationFormState,
  formData: FormData,
): Promise<RecommendationFormState> {
  try {
    try {
      await requireAdminSession();
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Not authorized" };
    }

    const strategyId = String(formData.get("strategy_id") ?? "").trim();
    const symbol = String(formData.get("symbol") ?? "").trim().toUpperCase();
    const action = String(formData.get("action") ?? "").trim().toUpperCase();
    const asOf = String(formData.get("as_of") ?? "").trim();
    const rationale = String(formData.get("rationale") ?? "").trim();
    const weightRaw = String(formData.get("weight_pct") ?? "").trim();
    const priceRaw = String(formData.get("price") ?? "").trim();

    if (!strategyId) return { error: "Select a strategy." };
    if (!symbol) return { error: "Symbol is required." };
    if (!VALID_ACTIONS.includes(action)) {
      return { error: "Action must be BUY, SELL, or HOLD." };
    }
    if (!asOf) return { error: "As-of date and time are required." };

    const asOfDate = new Date(asOf);
    if (Number.isNaN(asOfDate.getTime())) {
      return { error: "Invalid as-of date." };
    }

    let weightPct: number | null = null;
    if (weightRaw !== "") {
      const n = Number(weightRaw);
      if (!Number.isFinite(n) || n < 0 || n > 100) {
        return { error: "Weight must be between 0 and 100." };
      }
      weightPct = n;
    }

    let price: number | null = null;
    if (priceRaw !== "") {
      const n = Number(priceRaw);
      if (!Number.isFinite(n) || n <= 0) {
        return { error: "Price must be greater than 0." };
      }
      price = n;
    }

    const supabase = createServiceClient();
    const { error: dbError } = await supabase
      .from("recommendations")
      .insert({
        strategy_id: strategyId,
        symbol,
        action,
        as_of: asOfDate.toISOString(),
        rationale: rationale || null,
        weight_pct: weightPct,
        price,
        source: "manual",
      });

    if (dbError) {
      console.error("[admin] insertManualRecommendation failed:", dbError.message);
      return { error: "Could not insert the recommendation. Please try again." };
    }

    revalidatePath("/admin/recommendations");
    revalidatePath("/dashboard");
    return { success: `Added ${action} ${symbol} for ${asOfDate.toLocaleDateString("en-IN")}.` };
  } catch (err) {
    console.error("[admin] insertManualRecommendation threw:", err);
    return { error: "Could not insert the recommendation. Please try again." };
  }
}

/** Expire a single recommendation immediately (VM or manual). */
export async function expireRecommendation(id: string): Promise<void> {
  try {
    await requireAdminSession();

    const supabase = createServiceClient();
    const { error } = await supabase
      .from("recommendations")
      .update({ expires_at: new Date().toISOString() })
      .eq("id", id)
      .is("expires_at", null);

    if (error) {
      console.error("[admin] expireRecommendation failed:", error.message);
      throw new Error("Could not expire the recommendation.");
    }

    revalidatePath("/admin/recommendations");
    revalidatePath("/dashboard");
  } catch (err) {
    console.error("[admin] expireRecommendation threw:", err);
    throw err;
  }
}

/** Expire every still-active recommendation for one strategy. */
export async function expireAllForStrategy(strategyId: string): Promise<void> {
  try {
    await requireAdminSession();

    const supabase = createServiceClient();
    const { error } = await supabase
      .from("recommendations")
      .update({ expires_at: new Date().toISOString() })
      .eq("strategy_id", strategyId)
      .is("expires_at", null);

    if (error) {
      console.error("[admin] expireAllForStrategy failed:", error.message);
      throw new Error("Could not expire recommendations for this strategy.");
    }

    revalidatePath("/admin/recommendations");
    revalidatePath("/dashboard");
  } catch (err) {
    console.error("[admin] expireAllForStrategy threw:", err);
    throw err;
  }
}