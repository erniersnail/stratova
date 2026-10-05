import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Confirm your email — Stratova Quant",
  description: "Check your inbox to confirm your email address.",
};

/**
 * Shown when Supabase Auth requires email confirmation: signUp returns no
 * session, so the user must confirm before they can sign in.
 */
export default function SignupConfirmPage() {
  return (
    <main>
      <Container size="narrow" className="py-20">
        <PageHeader
          title="Check your email"
          description="We sent a confirmation link to your email address. Confirm it to activate your account."
        />

        <div className="mt-12 max-w-[620px] space-y-6 text-sm leading-[1.75] text-secondary">
          <p>
            Open the email we sent and follow the link to confirm your address.
            You can close this page once you have confirmed — then log in to
            finish setting up your account.
          </p>
          <p>
            Didn&apos;t receive it? Check your spam folder, or wait a few minutes
            before requesting another. Your account is created either way; it
            simply stays inactive until the address is confirmed.
          </p>
        </div>

        <div className="mt-10 max-w-[440px]">
          <Button href="/login" variant="primary" size="md">
            Go to log in
          </Button>
        </div>

        <p className="mt-8 text-sm text-secondary">
          Wrong address?{" "}
          <Link href="/signup" className="underline hover:text-foreground">
            Sign up again
          </Link>
        </p>
      </Container>
    </main>
  );
}
