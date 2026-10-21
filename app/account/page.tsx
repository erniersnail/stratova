import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { getAuthedUser, type AuthedUser } from "@/lib/auth/session";
import { ensureProfile } from "@/lib/auth/ensure-profile";
import { signOutAction } from "@/lib/auth/actions";
import { typography } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Your account — Simplicial Capital",
  description: "Your Simplicial Capital account, profile, and consent history.",
};

function AccountSkeleton() {
  return (
    <div className="mt-12 space-y-12">
      <div>
        <div className="h-6 w-24 animate-pulse rounded bg-surface-hover" />
        <div className="mt-6 space-y-3">
          <div className="h-5 w-full animate-pulse rounded bg-surface-hover" />
          <div className="h-5 w-full animate-pulse rounded bg-surface-hover" />
          <div className="h-5 w-2/3 animate-pulse rounded bg-surface-hover" />
        </div>
      </div>
      <div>
        <div className="h-6 w-32 animate-pulse rounded bg-surface-hover" />
        <div className="mt-6 h-11 w-full max-w-[440px] animate-pulse rounded bg-surface-hover" />
      </div>
    </div>
  );
}

export default async function AccountPage() {
  const user = await getAuthedUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <main>
      <Container size="narrow" className="py-20">
        <PageHeader
          title="Your account"
          description="Your profile, verification status, and consent history."
        />

        <Suspense fallback={<AccountSkeleton />}>
          <AccountContent user={user} />
        </Suspense>
      </Container>
    </main>
  );
}
async function AccountContent({ user }: { user: AuthedUser }) {
  const supabase = await createClient();

  await ensureProfile(supabase, user);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <>
      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">Identity</h2>
        <dl className="mt-6 space-y-4">
          <div className="flex flex-col gap-1 border-b border-border pb-4 sm:flex-row sm:justify-between">
            <dt className="text-sm text-secondary">Email</dt>
            <dd className="text-sm font-medium text-foreground">{user.email}</dd>
          </div>
          <div className="flex flex-col gap-1 border-b border-border pb-4 sm:flex-row sm:justify-between">
            <dt className="text-sm text-secondary">Full name</dt>
            <dd className="text-sm font-medium text-foreground">
              {profile?.full_name ??
                user.fullName ?? (
                  <span className="font-normal text-secondary">
                    Not set —{" "}
                    <span className="underline">
                      complete your profile during KYC verification
                    </span>
                  </span>
                )}
            </dd>
          </div>
          <div className="flex flex-col gap-1 border-b border-border pb-4 sm:flex-row sm:justify-between">
            <dt className="text-sm text-secondary">Phone number</dt>
            <dd className="text-sm font-medium text-foreground">
              {(profile as { phone?: string | null })?.phone || "Not set"}
            </dd>
          </div>
        </dl>

        {!profile && (
          <div className="mt-6 rounded-md border border-border bg-surface p-4">
            <p className={`${typography.body} text-sm text-secondary`}>
              Your profile is not complete yet. You will be asked to complete
              your profile — including the details required for SEBI-mandated
              verification — before any subscription can begin.
            </p>
          </div>
        )}
      </section>

      <section className="mt-16 flex flex-wrap items-center gap-4 border-t border-border pt-8">
        <Button href="/dashboard" variant="primary" size="md">
          Go to dashboard
        </Button>

        <form action={signOutAction}>
          <Button type="submit" variant="secondary" size="md">
            Log out
          </Button>
        </form>

        <Link
          href="/contact"
          className="text-sm text-secondary underline hover:text-foreground"
        >
          Contact us
        </Link>

        <Link
          href="/account/history"
          className="text-sm text-secondary underline hover:text-foreground"
        >
          View recommendation history →
        </Link>

        {profile?.role === "admin" && (
          <Link
            href="/admin"
            className="text-sm text-secondary underline hover:text-foreground"
          >
            Admin Panel →
          </Link>
        )}
      </section>
    </>
  );
}