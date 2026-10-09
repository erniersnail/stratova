import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/server";

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

export default async function AdminPage() {
  await requireAdminInPage();

  return (
    <Container className="py-20">
      <h1 className="font-serif text-3xl text-foreground">Admin</h1>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Link
          href="/admin/research"
          className="rounded-md border border-border bg-surface px-6 py-6 transition-colors hover:border-foreground"
        >
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Research
          </h2>
          <p className="mt-2 text-sm text-secondary">
            Create, edit, and publish research articles.
          </p>
        </Link>

        <Link
          href="/admin/payments"
          className="rounded-md border border-border bg-surface px-6 py-6 transition-colors hover:border-foreground"
        >
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Payments
          </h2>
          <p className="mt-2 text-sm text-secondary">
            Review pending subscriptions and mark payments received.
          </p>
        </Link>

        <Link
          href="/admin/strategies"
          className="rounded-md border border-border bg-surface px-6 py-6 transition-colors hover:border-foreground"
        >
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Strategies
          </h2>
          <p className="mt-2 text-sm text-secondary">
            Edit rebalance fees and subscription availability.
          </p>
        </Link>
      </div>
    </Container>
  );
}

