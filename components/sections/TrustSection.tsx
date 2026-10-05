import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import SectionHeader from "@/components/common/SectionHeader";
import { typography } from "@/lib/typography";

type TrustCard = {
  headline: string;
  body: string;
};

const TRUST_CARDS: TrustCard[] = [
  {
    headline: "Independent",
    body: "Our research is developed independently using systematic methods rather than market narratives or short-term forecasts.",
  },
  {
    headline: "Evidence Based",
    body: "Every idea begins with a hypothesis and is evaluated through historical data, testing, and continuous review.",
  },
  {
    headline: "Transparent",
    body: "We explain the reasoning behind our research, including assumptions, methodology, and known limitations.",
  },
];

export default function TrustSection() {
  return (
    <Section spacing="sm">
      <Container size="default">
        <SectionHeader
          title="Research Built on Trust"
          description="Our research process is guided by principles that ensure integrity, rigor, and clarity in everything we publish."
        />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TRUST_CARDS.map((card) => (
            <article
              key={card.headline}
              className="group relative rounded-sm border border-border bg-surface p-6 transition-all duration-200 hover:border-foreground hover:shadow-sm"
            >
              {/* Subtle top accent line */}
              <div className="absolute left-0 right-0 top-0 h-px bg-border transition-all duration-200 group-hover:bg-foreground" />
              <h3 className={`${typography.h3} text-foreground`}>{card.headline}</h3>
              <p className={`${typography.body} mt-3 text-secondary`}>
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}