import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/common/PageHeader";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset your password — Stratova Quant",
  description: "We'll email you a link to reset your password.",
};

/**
 * Accepts an optional `error` query param. The session guard on
 * /reset-password redirects here with `error=reset_link_expired` when a
 * user arrives with no session, so the message below explains why they
 * were sent back rather than silently redisplaying the form.
 */
export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const linkMessage =
    error === "reset_link_expired" || error === "reset_link_invalid"
      ? "That reset link didn't work — it may have expired or already been used. Request a new one below."
      : null;

  return (
    <main>
      <Container size="narrow" className="py-20">
        <PageHeader
          title="Reset your password"
          description="We'll email you a link to reset it."
        />

        <div className="mt-12 max-w-[440px]">
          {linkMessage && (
            <div
              role="alert"
              className="mb-4 rounded-md border border-border bg-surface px-4 py-3"
            >
              <p className="text-sm text-secondary">{linkMessage}</p>
            </div>
          )}
          <ForgotPasswordForm />
        </div>
      </Container>
    </main>
  );
}
