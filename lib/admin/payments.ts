// SERVER-ONLY. Reads SUPABASE_SERVICE_ROLE_KEY. Never import from a
// client component — the key must never reach the browser bundle.
import { createClient } from "@supabase/supabase-js";

function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing service role env vars");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type PendingPayment = {
  id: string;
  amount: number;
  status: string;
  rebalance_date: string;
  paid_at: string | null;
  created_at: string;
  subscription_id: string;
  strategy_name: string;
  client_email: string;
};

type RawPayment = {
  id: string;
  amount: number | string;
  status: string;
  rebalance_date: string;
  paid_at: string | null;
  created_at: string;
  subscription_id: string;
};

async function buildPayments(
  status: "PENDING" | "PAID",
  opts: { orderBy: "created_at" | "paid_at"; limit?: number },
): Promise<PendingPayment[]> {
  const supabase = createServiceClient();

  let query = supabase
    .from("subscription_payments")
    .select("id, amount, status, rebalance_date, paid_at, created_at, subscription_id")
    .eq("status", status)
    .order(opts.orderBy, { ascending: false });
  if (opts.limit) query = query.limit(opts.limit);

  const { data: payments, error } = await query;
  if (error || !payments || payments.length === 0) return [];
  const rows = payments as RawPayment[];

  const subIds = [...new Set(rows.map((p) => p.subscription_id))];
  const { data: subs } = await supabase
    .from("subscriptions")
    .select("id, user_id, strategy_id")
    .in("id", subIds);
  const subById = new Map<string, { user_id: string; strategy_id: string }>(
    (subs ?? []).map((s) => [s.id as string, s as { user_id: string; strategy_id: string }]),
  );

  const stratIds = [...new Set((subs ?? []).map((s) => s.strategy_id as string))];
  const { data: strategies } = await supabase
    .from("strategies")
    .select("id, name")
    .in("id", stratIds);
  const strategyById = new Map<string, string>(
    (strategies ?? []).map((s) => [s.id as string, s.name as string]),
  );

  // profiles has no email column — resolve emails via the auth admin API.
  const userIds = [...new Set((subs ?? []).map((s) => s.user_id as string))];
  const emailById = new Map<string, string>();
  await Promise.all(
    userIds.map(async (uid) => {
      const { data } = await supabase.auth.admin.getUserById(uid);
      if (data?.user?.email) emailById.set(uid, data.user.email);
    }),
  );

  return rows.map((p) => {
    const sub = subById.get(p.subscription_id);
    const userId = sub?.user_id;
    return {
      id: p.id,
      amount: Number(p.amount),
      status: p.status,
      rebalance_date: p.rebalance_date,
      paid_at: p.paid_at,
      created_at: p.created_at,
      subscription_id: p.subscription_id,
      strategy_name: (sub && strategyById.get(sub.strategy_id)) ?? "Strategy",
      client_email: (userId && emailById.get(userId)) ?? "—",
    };
  });
}

export async function getPendingPayments(): Promise<PendingPayment[]> {
  try {
    return await buildPayments("PENDING", { orderBy: "created_at" });
  } catch {
    return [];
  }
}

export async function getRecentPaidPayments(): Promise<PendingPayment[]> {
  try {
    return await buildPayments("PAID", { orderBy: "paid_at", limit: 30 });
  } catch {
    return [];
  }
}
