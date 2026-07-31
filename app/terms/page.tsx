import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/common/PageHeader";
import { typography } from "@/lib/typography";

export const metadata = {
  title: "Terms of Use — Stratova Quant",
  description: "Terms of use for Stratova Quant. Research is for educational purposes only and does not constitute investment advice.",
};

export default function TermsPage() {
  return (
    <main>
      <Container className="py-20">
        <PageHeader title="Terms of Use" description="By accessing this website, you agree to the following terms and conditions." />
      </Container>

      <Section spacing="lg">
        <Container size="reading">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold tracking-tight">Research for Educational Purposes</h2>
              <p className={`${typography.body} mt-4 text-secondary`}>All research published by Stratova Quant is intended for educational and informational purposes only. It does not constitute investment advice, a solicitation, or a recommendation to buy or sell any security. Past performance does not guarantee future results.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">No Investment Advice</h2>
              <p className={`${typography.body} mt-4 text-secondary`}>Nothing on this website should be construed as investment advice. You should consult with a qualified financial advisor before making any investment decisions. Stratova Quant is not a registered investment advisor and does not provide personalized investment recommendations.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">Limitation of Liability</h2>
              <p className={`${typography.body} mt-4 text-secondary`}>Stratova Quant shall not be liable for any loss or damage arising from the use of this website or reliance on any information contained herein. We make no warranties, express or implied, regarding the accuracy, completeness, or timeliness of the information provided.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">Intellectual Property</h2>
              <p className={`${typography.body} mt-4 text-secondary`}>All content on this website, including text, graphics, logos, and code, is the property of Stratova Quant and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">Changes to Terms</h2>
              <p className={`${typography.body} mt-4 text-secondary`}>We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated effective date. Your continued use of the website following any changes constitutes acceptance of those changes.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
              <p className={`${typography.body} mt-4 text-secondary`}>If you have questions about these terms, please contact us at legal@stratovaquant.com.</p>
            </section>
          </div>
        </Container>
      </Section>
    </main>
  );
}