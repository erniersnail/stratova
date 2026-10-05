import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/common/PageHeader";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in — Stratova Quant",
  description: "Log in to your Stratova Quant account.",
};

export default function LoginPage() {
  return (
    <main>
      <Container size="narrow" className="py-20">
        <PageHeader
          title="Log in"
          description="Access your account, consent history, and subscription status."
        />

        <div className="mt-12 max-w-[440px]">
          <LoginForm />
        </div>
      </Container>
    </main>
  );
}
