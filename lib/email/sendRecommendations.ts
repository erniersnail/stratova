// SERVER-ONLY. Uses the Supabase service-role key and Resend API key.
import { createClient } from "@supabase/supabase-js";
import { getResend, NOTIFICATION_FROM } from "@/lib/email/client";
import {
  renderRecommendationEmail,
  recommendationEmailSubject,
  type RecommendationForEmail,
} from "@/lib/email/template";

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing service role env vars");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.simplicialcapital.com"
  ).replace(/\/$/, "");
}

export type SendSummary = {
  strategiesProcessed: number;
  emailsSent: number;
  emailsFailed: number;
  skipped: number;
  errors: string[];
};

export async function sendNewRecommendationEmails(): Promise<SendSummary> {
  const admin = serviceClient();
  const resend = getResend();
  const dashboardUrl = `${siteUrl()}/dashboard`;

  const summary: SendSummary = {
    strategiesProcessed: 0,
    emailsSent: 0,
    emailsFailed: 0,
    skipped: 0,
    errors: [],
  };

  const { data: activeSubs, error: subsErr } = await admin
    .from("subscriptions")
    .select("strategy_id, user_id, capital_allocated")
    .eq("status", "ACTIVE")
    .not("strategy_id", "is", null);

  if (subsErr) {
    summary.errors.push(`subscriptions fetch failed: ${subsErr.message}`);
    return summary;
  }
  if (!activeSubs || activeSubs.length === 0) return summary;

  const byStrategy = new Map<
    string,
    { user_id: string; capital_allocated: number | null }[]
  >();
  for (const row of activeSubs) {
    if (!row.strategy_id) continue;
    const arr = byStrategy.get(row.strategy_id) ?? [];
    arr.push({
      user_id: row.user_id,
      capital_allocated: row.capital_allocated,
    });
    byStrategy.set(row.strategy_id, arr);
  }

  const strategyIds = [...byStrategy.keys()];

  const [{ data: strategies }, { data: logs }] = await Promise.all([
    admin.from("strategies").select("id, name").in("id", strategyIds),
    admin
      .from("notification_log")
      .select("strategy_id, last_notified_at")
      .in("strategy_id", strategyIds),
  ]);

  const nameById = new Map<string, string>(
    (strategies ?? []).map((s) => [s.id as string, s.name as string]),
  );
  const lastNotifiedById = new Map<string, string>(
    (logs ?? []).map((l) => [
      l.strategy_id as string,
      l.last_notified_at as string,
    ]),
  );

  for (const strategyId of strategyIds) {
    summary.strategiesProcessed += 1;
    const strategyName = nameById.get(strategyId) ?? "Strategy";
    const cutoff =
      lastNotifiedById.get(strategyId) ??
      new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();

    const { data: recs, error: recErr } = await admin
      .from("recommendations")
      .select(
        "symbol, action, weight_pct, price, as_of, expires_at, published_at, admin_remark",
      )
      .eq("strategy_id", strategyId)
      .not("approved_at", "is", null)
      .is("removed_at", null)
      .gt("published_at", cutoff)
      .order("published_at", { ascending: false });

    if (recErr) {
      summary.errors.push(
        `recommendations fetch failed for ${strategyName}: ${recErr.message}`,
      );
      continue;
    }
    if (!recs || recs.length === 0) continue;

    const newestPublishedAt = recs[0].published_at as string;
    const newest = recs.filter(
      (r) => r.published_at === newestPublishedAt,
    ) as RecommendationForEmail[];

    const subscribers = byStrategy.get(strategyId) ?? [];
    for (const sub of subscribers) {
      const { data: userData, error: userErr } =
        await admin.auth.admin.getUserById(sub.user_id);
      if (userErr || !userData?.user?.email) {
        summary.skipped += 1;
        continue;
      }

      const html = renderRecommendationEmail({
        strategyName,
        dashboardUrl,
        recommendations: newest,
      });
      const subject = recommendationEmailSubject(strategyName);

      const { error: sendErr } = await resend.emails.send({
        from: NOTIFICATION_FROM,
        to: userData.user.email,
        subject,
        html,
      });

      if (sendErr) {
        summary.emailsFailed += 1;
        summary.errors.push(
          `send failed for ${userData.user.email}: ${sendErr.message}`,
        );
      } else {
        summary.emailsSent += 1;
      }
    }

    await admin
      .from("notification_log")
      .upsert(
        { strategy_id: strategyId, last_notified_at: new Date().toISOString() },
        { onConflict: "strategy_id" },
      );
  }

  return summary;
}
