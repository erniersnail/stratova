import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/common/PageHeader";
import { typography } from "@/lib/typography";

export const metadata = {
  title: "Privacy Policy — Stratova Quant",
  description: "Privacy policy for Stratova Quant. How we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <main>
      <Container className="py-20">
        <PageHeader title="Privacy Policy" description="How we collect, use, and protect your personal information." />
      </Container>

      <Section spacing="lg">
        <Container size="reading">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold tracking-tight">Information We Collect</h2>
              <p className={`${typography.body} mt-4 text-secondary`}>We collect information you provide directly to us, such as your name, email address, company name, and any messages you send through our contact form. We also collect usage data including pages visited, time spent on pages, and referring sources.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">How We Use Your Information</h2>
              <p className={`${typography.body} mt-4 text-secondary`}>We use the information we collect to respond to your inquiries, improve our website and services, and communicate with you about research publications and company updates. We do not sell or rent your personal information to third parties.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">Data Security</h2>
              <p className={`${typography.body} mt-4 text-secondary`}>We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">Your Rights</h2>
              <p className={`${typography.body} mt-4 text-secondary`}>You have the right to access, correct, or delete your personal information. You may also opt out of receiving communications from us at any time by following the unsubscribe instructions in our emails or contacting us directly.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">Contact Us</h2>
              <p className={`${typography.body} mt-4 text-secondary`}>If you have questions about this privacy policy, please contact us at privacy@stratovaquant.com.</p>
            </section>
          </div>
        </Container>
      </Section>
    </main>
  );
}