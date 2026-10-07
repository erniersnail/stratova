import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import { typography } from "@/lib/typography";

type TrustItem = {
  headline: string;
  body: string;
};

const TRUST_ITEMS: TrustItem[] = [
  {
    headline: "Evidence Based",
    body: "Every decision is backed by data and rigorous research.",
  },
  {
    headline: "Risk Managed",
    body: "Focus on downside protection while compounding steadily.",
  },
  {
    headline: "Risk Adjusted",
    body: "Our goal is consistent, risk-adjusted outperformance.",
  },
  {
    headline: "Aligned With Investors",
    body: "We think like owners and invest alongside our members.",
  },
];

export default function TrustSection() {
  return (
    <Section spacing="sm">
      <Container size="default">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item, index) => (
            <div
              key={item.headline}
              className={`px-6 py-8 text-center ${
                index > 0 ? "lg:border-l lg:border-border" : ""
              }`}
            >
              <h3 className={`${typography.h3} font-serif text-foreground`}>
                {item.headline}
              </h3>
              <p className={`${typography.body} mt-3 text-secondary`}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}