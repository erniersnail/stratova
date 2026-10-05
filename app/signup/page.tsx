import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/common/PageHeader";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Join the waitlist — Stratova Quant",
  description:
    "Create an account to be notified when Stratova subscriptions open.",
};

export default function SignupPage() {
  return (
    <main>
      <Container size="narrow" className="py-20">
        <PageHeader
          title="Join the waitlist"
          description="Create an account to be notified when Stratova subscriptions open."
        />

        <div className="mt-12 max-w-[440px]">
          <SignupForm />
        </div>

        <div className="mt-14 max-w-[620px] border-t border-border pt-8">
          <h2 className="text-lg font-semibold tracking-tight">About this waitlist</h2>
          <p className="mt-3 text-sm leading-[1.75] text-secondary">
            Stratova Quant is a SEBI-registered Research Analyst. Until our
            registration is granted, no paid subscriptions are offered. Creating
            an account records your agreement to our Terms of Use and Privacy
            Policy and notifies you when subscriptions open. We never handle
            client funds or securities, and we do not execute trades.
          </p>
        </div>
      </Container>
    </main>
  );
}
