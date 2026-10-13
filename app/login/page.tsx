import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/common/PageHeader";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in — Simplical Capital",
  description: "Log in to your Simplical Capital account.",
};

/**
 * Accepts an optional `error` query param. The /auth/callback route redirects
 * here with `error=reset_link_invalid` when the code exchange fails, so the
 * message below explains why rather than silently showing the login form.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const linkMessage =
    error === "reset_link_invalid"
      ? "That reset link didn't work — it may have expired or already been used. Request a new one from the forgot-password page."
      : null;

  return (
    <main>
      <Container size="narrow" className="py-20">
        <PageHeader
          title="Log in"
          description="Access your account, consent history, and subscription status."
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
          <LoginForm />
        </div>
      </Container>
    </main>
  );
}
