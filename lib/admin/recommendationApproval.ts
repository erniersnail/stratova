"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/admin/recommendations";
import { sendNewRecommendationEmails } from "@/lib/email/sendRecommendations";

async function requireAdmin(): Promise<void> {
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

function revalidateAll(): void {
  revalidatePath("/admin/recommendations");
  revalidatePath("/dashboard");
  revalidatePath("/account/history");
  revalidatePath("/strategies", "layout");
}

/** Approve a single pending recommendation. Does NOT send email. */
export async function approveRecommendation(id: string): Promise<void> {
  await requireAdmin();
  const admin = createServiceClient();
  const { error } = await admin
    .from("recommendations")
    .update({ approved_at: new Date().toISOString() })
    .eq("id", id)
    .is("approved_at", null);
  if (error) {
    console.error("[admin] approveRecommendation failed:", error.message);
    throw new Error("Could not approve recommendation");
  }
  revalidateAll();
}

/** Reject a single pending recommendation with a reason. */
export async function rejectRecommendation(
  id: string,
  reason: string,
): Promise<void> {
  await requireAdmin();
  const admin = createServiceClient();
  const now = new Date().toISOString();
  const { error } = await admin
    .from("recommendations")
    .update({
      approved_at: now,
      removed_at: now,
      removed_reason: reason.trim() || "Rejected by admin",
    })
    .eq("id", id)
    .is("approved_at", null);
  if (error) {
    console.error("[admin] rejectRecommendation failed:", error.message);
    throw new Error("Could not reject recommendation");
  }
  revalidateAll();
}

/**
 * Approve all remaining pending picks for a strategy, then fire the email
 * send. Individual picks can be rejected first; this approves the rest.
 */
export async function approveAllPendingForStrategy(
  strategyId: string,
): Promise<void> {
  await requireAdmin();
  const admin = createServiceClient();
  const now = new Date().toISOString();
  const { error } = await admin
    .from("recommendations")
    .update({ approved_at: now })
    .eq("strategy_id", strategyId)
    .is("approved_at", null)
    .is("removed_at", null);
  if (error) {
    console.error(
      "[admin] approveAllPendingForStrategy failed:",
      error.message,
    );
    throw new Error("Could not approve pending recommendations");
  }

  // Fire email send for the newly-approved batch. Idempotent — the send
  // function checks notification_log so a second call within the same
  // window is a no-op.
  try {
    await sendNewRecommendationEmails();
  } catch (err) {
    console.error("[admin] approveAllPendingForStrategy email failed:", err);
    // Don't rethrow — approval succeeded even if email failed. The daily
    // cron will catch up.
  }

  revalidateAll();
}

/**
 * Remove a live (already-approved) pick with a reason. Disappears from
 * client dashboard immediately. Does not send email.
 */
export async function removeApprovedRecommendation(
  id: string,
  reason: string,
): Promise<void> {
  await requireAdmin();
  const admin = createServiceClient();
  const { error } = await admin
    .from("recommendations")
    .update({
      removed_at: new Date().toISOString(),
      removed_reason: reason.trim() || "Removed by admin",
    })
    .eq("id", id)
    .not("approved_at", "is", null);
  if (error) {
    console.error(
      "[admin] removeApprovedRecommendation failed:",
      error.message,
    );
    throw new Error("Could not remove recommendation");
  }
  revalidateAll();
}

/** Update the admin remark on any recommendation. */
export async function updateAdminRemark(
  id: string,
  remark: string,
): Promise<void> {
  await requireAdmin();
  const admin = createServiceClient();
  const trimmed = remark.trim();
  const { error } = await admin
    .from("recommendations")
    .update({ admin_remark: trimmed.length > 0 ? trimmed : null })
    .eq("id", id);
  if (error) {
    console.error("[admin] updateAdminRemark failed:", error.message);
    throw new Error("Could not update remark");
  }
  revalidateAll();
}
