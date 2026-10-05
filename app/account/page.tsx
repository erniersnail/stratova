import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth/ensure-profile";
import { signOutAction } from "@/lib/auth/actions";
import { typography } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Your account — Stratova Quant",
  description: "Your Stratova Quant account, profile, and consent history.",
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AccountPage() {
  const supabase = await createClient();

  // getUser() validates the token against Supabase — never trust getSession()
  // alone on the server.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Backfills profile + consent rows when email confirmation delayed signup.
  await ensureProfile(supabase, user);

  const [{ data: profile }, { data: consents }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase
      .from("consents")
      .select("doc_type, doc_version, accepted_at")
      .eq("user_id", user.id)
      .order("accepted_at", { ascending: false }),
  ]);

  return (
    <main>
      <Container size="narrow" className="py-20">
        <PageHeader
          title="Your account"
          description="Your profile, verification status, and consent history."
        />

        {/* Identity */}
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
                {profile?.full_name ?? (
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
              <dt className="text-sm text-secondary">KYC status</dt>
              <dd className="text-sm font-medium text-foreground">
                {profile?.kyc_status ?? "pending"}
              </dd>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <dt className="text-sm text-secondary">Waitlist status</dt>
              <dd className="text-sm font-medium text-foreground">pending</dd>
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

        {/* Consents */}
        <section className="mt-16">
          <h2 className="text-xl font-semibold tracking-tight">
            Consent history
          </h2>
          <p className={`${typography.body} mt-3 text-sm text-secondary`}>
            A record of every document you have agreed to, and when.
          </p>

          {!consents || consents.length === 0 ? (
            <p className="mt-6 rounded-md border border-border bg-surface px-4 py-3 text-sm text-secondary">
              No consents recorded yet.
            </p>
          ) : (
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {consents.map((consent, index) => (
                <li
                  key={`${consent.doc_type}-${consent.accepted_at}-${index}`}
                  className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between"
                >
                  <span className="text-sm font-medium text-foreground">
                    {consent.doc_type}
                  </span>
                  <span className="text-sm text-secondary">
                    {consent.doc_version} · accepted{" "}
                    {formatDate(consent.accepted_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Actions */}
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
        </section>
      </Container>
    </main>
  );
}
