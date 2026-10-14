import Link from "next/link";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import { typography } from "@/lib/typography";

type StepItem = {
  number: string;
  headline: string;
  body: string;
};

const STEPS: StepItem[] = [
  {
    number: "01",
    headline: "Choose",
    body: "Read the universe, benchmark, and cadence. Pick the strategy that fits your risk profile.",
  },
  {
    number: "02",
    headline: "Subscribe",
    body: "One payment per cycle. Your dashboard unlocks the moment payment is confirmed.",
  },
  {
    number: "03",
    headline: "Get picks",
    body: "Recommendations land on your dashboard after each rebalance — monthly or quarterly.",
  },
  {
    number: "04",
    headline: "Trade",
    body: "You place the orders through your own broker. We never touch your account.",
  },
];

export default function HowItWorksSection() {
  return (
    <Section spacing="none" className="py-12">
      <Container size="default">
        <p className="mb-10 text-center text-sm tracking-[0.15em] text-foreground uppercase">
          HOW IT WORKS
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              className={`px-6 py-6 text-center ${
                index > 0 ? "lg:border-l lg:border-border" : ""
              }`}
            >
              <span className="text-2xl font-light leading-none text-tertiary">
                {step.number}
              </span>
              <h3
                className={`${typography.h3} mt-3 font-serif text-foreground`}
              >
                {step.headline}
              </h3>
              <p className={`${typography.body} mt-3 text-foreground/75`}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/how-it-works"
            className="text-sm text-secondary underline hover:text-foreground hover:no-underline"
          >
            See the full guide →
          </Link>
        </div>
      </Container>
    </Section>
  );
}
