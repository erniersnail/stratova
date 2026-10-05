import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/common/PageHeader";
import { typography } from "@/lib/typography";
import { RA_REGISTRATION_NUMBER } from "@/lib/site";

export const metadata = {
  title: "Terms of Use — Stratova Quant",
  description: "Terms of use for Stratova Quant, a SEBI-registered Research Analyst. Research subscriptions, scope of recommendations, and limitations of liability.",
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
              <h2 className="text-2xl font-semibold tracking-tight">Pre-Launch Notice</h2>
              <p className={`${typography.body} mt-4 text-secondary`}>This page describes the terms that will apply once Stratova Quant&apos;s SEBI Research Analyst registration is granted. Until then, the service is pre-launch and no paid subscriptions are offered.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">Nature of Our Research</h2>
              <p className={`${typography.body} mt-4 text-secondary`}>All research published by Stratova Quant, including any stock recommendations, is provided for information and research purposes. It is not a solicitation to buy or sell any security and does not take account of the objectives, financial situation, or needs of any particular recipient. Past performance is not indicative of, and is no guarantee of, future results. The value of, and income from, investments may fall as well as rise, and investors may not get back the amount originally invested.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">Research Analyst Status and Scope of Service</h2>
              <p className={`${typography.body} mt-4 text-secondary`}>Stratova Quant is a SEBI-registered Research Analyst. In that capacity we publish research and stock recommendations to subscribers of our research service. A subscription is a subscription to research only. Stratova Quant does not execute trades on behalf of subscribers, does not hold, manage, or come into possession of client funds or securities, and does not operate any client securities account. The recommendations we publish are general in nature and are not personalised investment advice. Nothing on this website or in any paid research constitutes advice tailored to your individual circumstances, financial situation, or investment objectives. You should assess any recommendation against your own circumstances and consult a qualified financial adviser before making investment decisions.</p>
              <p className={`${typography.body} mt-4 text-secondary`}>SEBI Research Analyst Registration No.: <span className="font-medium text-foreground">{RA_REGISTRATION_NUMBER}</span></p>
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