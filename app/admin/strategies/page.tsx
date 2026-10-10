import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/server";
import StrategyRowEditor from "@/components/admin/StrategyRowEditor";

export const metadata: Metadata = {
  title: "Strategies — Admin",
};

async function requireAdminInPage(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") notFound();
}

type AdminStrategyRow = {
  id: string;
  name: string;
  slug: string;
  fee_per_rebalance: number | null;
  is_subscribable: boolean;
};

async function getAllStrategies(): Promise<AdminStrategyRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("strategies")
    .select("id, name, slug, fee_per_rebalance, is_subscribable")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[admin] getAllStrategies failed:", error.message);
    return [];
  }
  return (data as AdminStrategyRow[]) ?? [];
}

export default async function AdminStrategiesPage() {
  await requireAdminInPage();
  const strategies = await getAllStrategies();

  return (
    <Container className="py-20">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-foreground">Strategies</h1>
      </div>

      <p className="mt-3 text-sm text-secondary">
        Edit the rebalance fee and availability for each strategy.
      </p>

      <div className="mt-8 overflow-x-auto border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-secondary">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Slug</th>
              <th className="py-2 pr-4">Fee (₹)</th>
              <th className="py-2 pr-4">Subscribable</th>
              <th className="py-2">Save</th>
            </tr>
          </thead>
          <tbody>
            {strategies.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-secondary">
                  No strategies found.
                </td>
              </tr>
            ) : (
              strategies.map((strategy) => (
                <tr key={strategy.id} className="border-b border-border">
                  <td className="py-3 pr-4 font-medium">{strategy.name}</td>
                  <td className="py-3 pr-4 text-secondary">{strategy.slug}</td>
                  <StrategyRowEditor strategy={strategy} />
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
