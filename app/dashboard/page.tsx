import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/common/PageHeader";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth/ensure-profile";

export const metadata: Metadata = {
  title: "Dashboard — Stratova Quant",
  description: "Your subscriptions and latest recommendations.",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await ensureProfile(supabase, user);

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const firstName = profile?.full_name?.split(" ")[0];

  return (
    <main>
      <Container className="py-20">
        <PageHeader
          title={firstName ? `Welcome, ${firstName}` : "Welcome"}
          description="Your subscriptions and the latest research published to you."
        />

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-lg font-medium tracking-tight">
              Your subscriptions
            </h2>
            <p className="mt-3 text-sm leading-[1.75] text-secondary">
              None yet. Subscriptions open when Stratova&apos;s SEBI RA
              registration is granted.
            </p>
          </section>

          <section className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-lg font-medium tracking-tight">
              Latest recommendations
            </h2>
            <p className="mt-3 text-sm leading-[1.75] text-secondary">
              Nothing to show yet. Recommendations appear here once you hold an
              active subscription.
            </p>
          </section>
        </div>

        <p className="mt-12 text-sm text-secondary">
          Need to update your details?{" "}
          <Link href="/account" className="underline hover:text-foreground">
            Go to your account
          </Link>
        </p>
      </Container>
    </main>
  );
}
