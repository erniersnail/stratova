"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";
import { createServiceClient } from "./recommendations";
import { sendNewRecommendationEmails } from "../email/sendRecommendations";

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

/**
 * Approve a single pending recommendation. Optional remark is saved in the
 * same call so the admin does not need two round trips.
 */
export async function approveRecommendation(
  id: string,
  remark?: string,
): Promise<void> {
  await requireAdmin();
  const admin = createServiceClient();
  const now = new Date().toISOString();
  const trimmed = (remark ?? "").trim();
  const patch: Record<string, unknown> = { approved_at: now };
  if (trimmed.length > 0) patch.admin_remark = trimmed;

  const { error } = await admin
    .from("recommendations")
    .update(patch)
    .eq("id", id)
    .is("approved_at", null);
  if (error) {
    console.error("[admin] approveRecommendation failed:", error.message);
    throw new Error("Could not approve recommendation");
  }
  revalidateAll();
}

/**
 * Reject a single pending recommendation with a reason. Stores the pick as
 * approved+removed so it disappears from clients and admin "pending" queue
 * but stays in the audit trail.
 */
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
 * Returns the number of recommendations that were approved.
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

  try {
    await sendNewRecommendationEmails();
  } catch (err) {
    console.error("[admin] approveAllPendingForStrategy email failed:", err);
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
