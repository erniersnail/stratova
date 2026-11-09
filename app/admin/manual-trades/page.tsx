import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/admin/recommendations";
import { revalidatePath } from "next/cache";

export const metadata: Metadata = { title: "Manual Trades — Admin" };

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") notFound();
}

async function addTrade(formData: FormData) {
  "use server";
  await requireAdmin();
  const admin = createServiceClient();
  
  const symbol = String(formData.get("symbol")).toUpperCase();
  const entry_date = String(formData.get("entry_date"));
  const entry_price = Number(formData.get("entry_price"));
  const target_price = Number(formData.get("target_price"));
  const stop_loss_price = Number(formData.get("stop_loss_price"));

  if (!symbol || !entry_date || !entry_price || !target_price || !stop_loss_price) {
    return;
  }

  await admin.from("manual_trades").insert({
    symbol, entry_date, entry_price, target_price, stop_loss_price, status: "OPEN"
  });

  revalidatePath("/admin/manual-trades");
  revalidatePath("/strategies/free-manual");
}

export default async function AdminManualTradesPage() {
  await requireAdmin();
  const admin = createServiceClient();
  const { data: trades } = await admin.from("manual_trades").select("*").order("entry_date", { ascending: false });

  return (
    <Container className="py-20">
      <h1 className="font-serif text-3xl text-foreground">Manual Trades</h1>
      <p className="mt-2 text-sm text-secondary">Add high-conviction picks with absolute targets and stop losses.</p>

      <div className="mt-8 rounded-md border border-border bg-surface p-6">
        <h2 className="text-lg font-medium text-foreground">Add New Trade</h2>
        <form action={addTrade} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-5 items-end">
          <div>
            <label className="text-xs text-secondary">Symbol</label>
            <input name="symbol" required placeholder="MARICO" className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-secondary">Entry Date</label>
            <input type="date" name="entry_date" required className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-secondary">Entry Price</label>
            <input type="number" step="0.01" name="entry_price" required placeholder="100.00" className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-secondary">Target Price</label>
            <input type="number" step="0.01" name="target_price" required placeholder="110.00" className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-secondary">Stop Loss</label>
            <input type="number" step="0.01" name="stop_loss_price" required placeholder="95.00" className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm" />
          </div>
          <div className="sm:col-span-5 mt-2">
            <button type="submit" className="rounded-md bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-90">
              Add Trade
            </button>
          </div>
        </form>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-medium text-foreground">Recent Trades</h2>
        <div className="mt-4 overflow-x-auto border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-tertiary">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Symbol</th>
                <th className="px-4 py-3">Entry</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Stop Loss</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {trades?.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{t.entry_date}</td>
                  <td className="px-4 py-3 font-medium">{t.symbol}</td>
                  <td className="px-4 py-3">₹{Number(t.entry_price).toFixed(2)}</td>
                  <td className="px-4 py-3">₹{Number(t.target_price).toFixed(2)}</td>
                  <td className="px-4 py-3">₹{Number(t.stop_loss_price).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.status === "OPEN" ? "bg-accent/10 text-accent" : "bg-surface-hover text-tertiary"}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
}