"use server";

import { revalidatePath } from "next/cache";
import { cycleMonthsForPlan, expiryForCycle } from "@/lib/billing/cycles";
import { createClient } from "../supabase/server";
import { createServiceClient } from "./recommendations";

export type StrategyAdminState = {
  error?: string;
  success?: string;
};

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

function endOfMonthIst(rebalanceDate: string): string {
  const [yStr, mStr] = rebalanceDate.split("-");
  const year = Number(yStr);
  const month = Number(mStr);
  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
    const nowIst = new Date(Date.now() + IST_OFFSET_MS);
    const expiresAtMs = Date.UTC(
      nowIst.getUTCFullYear(),
      nowIst.getUTCMonth() + 1,
      0,
      18,
      29,
      59,
      999,
    );
    return new Date(expiresAtMs).toISOString();
  }
  const expiresAtMs = Date.UTC(year, month, 0, 18, 29, 59, 999);
  return new Date(expiresAtMs).toISOString();
}

export async function markPaymentPaid(paymentId: string): Promise<void> {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await authClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") throw new Error("Not authorized");

  const admin = createServiceClient();
  const nowIso = new Date().toISOString();

  const { data: payment, error: fetchErr } = await admin
    .from("subscription_payments")
    .select("id, subscription_id, rebalance_date, status")
    .eq("id", paymentId)
    .maybeSingle();

  if (fetchErr) {
    console.error("[admin] markPaymentPaid fetch failed:", fetchErr.message);
    throw new Error("Payment lookup failed");
  }
  if (!payment) throw new Error("Payment not found");

  // Resolve the subscription's plan so multi-month purchases grant the
  // correct access duration (not just the single rebalance month).
  const { data: subRow } = await admin
    .from("subscriptions")
    .select("plan")
    .eq("id", payment.subscription_id)
    .maybeSingle();
  const months = cycleMonthsForPlan(
    (subRow?.plan as string | null) ?? null,
  );
  const expiresAt = expiryForCycle(payment.rebalance_date, months);

  const { error: payErr } = await admin
    .from("subscription_payments")
    .update({ status: "PAID", paid_at: nowIso })
    .eq("id", paymentId);

  if (payErr) {
    console.error("[admin] markPaymentPaid payment update failed:", payErr.message);
    throw new Error("Could not mark payment paid");
  }

  const { error: subErr } = await admin
    .from("subscriptions")
    .update({
      status: "ACTIVE",
      started_at: payment.rebalance_date,
      expires_at: expiresAt,
    })
    .eq("id", payment.subscription_id)
    .eq("status", "PENDING");

  if (subErr) {
    console.error(
      "[admin] markPaymentPaid subscription activate failed:",
      subErr.message,
    );
    throw new Error("Payment recorded but subscription activation failed");
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin/payments");
  revalidatePath("/strategies", "layout");
}
