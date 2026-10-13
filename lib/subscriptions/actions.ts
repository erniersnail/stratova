"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CancelResult = {
  error?: string;
};

/**
 * User-initiated cancellation of their own subscription.
 *
 * Policy: no refund once the subscription is ACTIVE — the client has access
 * to current-month picks from the moment of activation. Cancellation ends
 * access immediately. Pro-rata refunds are only issued if Simplical Capital's
 * SEBI RA registration is suspended or cancelled (mandatory clause).
 *
 * RLS `subscriptions_update_own` permits this UPDATE because auth.uid()
 * matches user_id.
 */
export async function cancelSubscription(
  subscriptionId: string,
): Promise<CancelResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: sub, error: fetchErr } = await supabase
    .from("subscriptions")
    .select("id, user_id, status")
    .eq("id", subscriptionId)
    .maybeSingle();

  if (fetchErr) {
    console.error("[subscriptions] cancel fetch failed:", fetchErr.message);
    return { error: "Could not load subscription." };
  }
  if (!sub) return { error: "Subscription not found." };
  if (sub.user_id !== user.id) return { error: "Not authorized." };
  if (sub.status !== "ACTIVE" && sub.status !== "PENDING") {
    return { error: "This subscription cannot be cancelled." };
  }

  const { error: updateErr } = await supabase
    .from("subscriptions")
    .update({
      status: "CANCELLED",
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", subscriptionId)
    .eq("user_id", user.id);

  if (updateErr) {
    console.error("[subscriptions] cancel update failed:", updateErr.message);
    return { error: "Could not cancel. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/strategies", "layout");
  return {};
}
