import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/common/PageHeader";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Choose a new password — Stratova Quant",
  description: "Set a new password for your Stratova Quant account.",
};

/**
 * Reached from the password-reset email via /auth/callback, which exchanges
 * the link's ?code= for a session first. Showing this form without a session
 * would surface "Auth session missing" on submit, so readers without one go
 * back to /forgot-password instead.
 */
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const params = new URLSearchParams({
      error: (await searchParams).expired ?? "reset_link_expired",
    });
    redirect(`/forgot-password?${params.toString()}`);
  }

  return (
    <main>
      <Container size="narrow" className="py-20">
        <PageHeader
          title="Choose a new password"
          description="Enter your new password below."
        />

        <div className="mt-12 max-w-[440px]">
          <ResetPasswordForm />
        </div>
      </Container>
    </main>
  );
}
