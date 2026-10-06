"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
  revalidatePath("/strategies", "layout");
}
