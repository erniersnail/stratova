import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import { typography } from "@/lib/typography";

type TrustItem = {
  headline: string;
  body: string;
};

const TRUST_ITEMS: TrustItem[] = [
  {
    headline: "Transparent",
    body: "Every recommendation published with rationale.",
  },
  {
    headline: "Accountable",
    body: "Benchmark-relative. Measured against the market.",
  },
  {
    headline: "Independent",
    body: "No commissions. Subscription-funded only.",
  },
  {
    headline: "Systematic",
    body: "Rules-based, not reactive.",
  },
];

export default function TrustSection() {
  return (
    <Section spacing="none" className="py-12">
      <Container size="default">
        <p className="mb-10 text-center text-sm tracking-[0.15em] text-foreground uppercase">
          HOW WE OPERATE
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item, index) => (
            <div
              key={item.headline}
              className={`px-6 py-6 text-center ${
                index > 0 ? "lg:border-l lg:border-border" : ""
              }`}
            >
              <h3 className={`${typography.h3} font-serif text-foreground`}>
                {item.headline}
              </h3>
              <p className={`${typography.body} mt-3 text-foreground/75`}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}