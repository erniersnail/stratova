"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type StrategyAdminState = {
  error?: string;
  success?: string;
};

/**
 * Admin-only update of a strategy's subscription fee and availability.
 * Bound to a strategyId by the caller, so the form action signature is the
 * standard (prevState, formData) shape for useActionState.
 */
export async function updateStrategyAdmin(
  strategyId: string,
  _prev: StrategyAdminState,
  formData: FormData,
): Promise<StrategyAdminState> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.role !== "admin") return { error: "Not authorized" };

    const fee = Number(formData.get("fee_per_rebalance"));
    if (!Number.isInteger(fee) || fee < 100 || fee > 1000000) {
      return { error: "Fee must be a whole number between 100 and 1,000,000." };
    }

    const isSubscribable = formData.get("is_subscribable") === "on";

    const { error: dbError } = await supabase
      .from("strategies")
      .update({ fee_per_rebalance: fee, is_subscribable: isSubscribable })
      .eq("id", strategyId);

    if (dbError) {
      console.error("[admin] updateStrategyAdmin failed:", dbError.message);
      return { error: "Could not save changes. Please try again." };
    }

    revalidatePath("/admin/strategies");
    revalidatePath("/strategies", "layout");
    return { success: "Saved." };
  } catch (err) {
    console.error("[admin] updateStrategyAdmin threw:", err);
    return { error: "Could not save changes. Please try again." };
  }
}

export async function markPaymentPaid(paymentId: string): Promise<void> {
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

  const nowIso = new Date().toISOString();

  const { data: payment } = await supabase
    .from("subscription_payments")
    .select("id, subscription_id, rebalance_date, status")
    .eq("id", paymentId)
    .maybeSingle();
  if (!payment) throw new Error("Payment not found");

  await supabase
    .from("subscription_payments")
    .update({ status: "PAID", paid_at: nowIso })
    .eq("id", paymentId);

  const rebalanceDate = new Date(payment.rebalance_date + "T00:00:00+05:30");
  if (rebalanceDate <= new Date()) {
    await supabase
      .from("subscriptions")
      .update({ status: "ACTIVE", started_at: payment.rebalance_date })
      .eq("id", payment.subscription_id)
      .eq("status", "PENDING");
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin/payments");
  revalidatePath("/strategies", "layout");
}
