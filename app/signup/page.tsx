import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/common/PageHeader";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create account — Stratova Quant",
  description:
    "Create your Stratova Quant account to access your research dashboard.",
};

export default function SignupPage() {
  return (
    <main>
      <Container size="narrow" className="py-20">
        <PageHeader
          title="Create an account"
          description="Create a Stratova account to access your dashboard and research."
        />

        <div className="mt-12 max-w-[440px]">
          <SignupForm />
        </div>

        <div className="mt-14 max-w-[620px] border-t border-border pt-8">
          <h2 className="text-lg font-semibold tracking-tight">About your account</h2>
          <p className="mt-3 text-sm leading-[1.75] text-secondary">
            Stratova Quant is an applicant for SEBI Research Analyst
            registration under the SEBI (Research Analysts) Regulations, 2014.
            Creating an
            account records your agreement to our Terms of Use and Privacy
            Policy. We never handle client funds or securities, and we do not
            execute trades.
          </p>
        </div>
      </Container>
    </main>
  );
}
