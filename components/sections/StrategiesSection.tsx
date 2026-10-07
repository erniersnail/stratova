import Link from "next/link";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Paper from "@/components/ui/Paper";
import { typography } from "@/lib/typography";

type StrategyCard = {
  href: string;
  label: string;
  title: string;
  description: string;
  stat?: string;
  linkLabel: string;
};

const STRATEGY_CARDS: StrategyCard[] = [
  {
    href: "/strategies/us",
    label: "United States",
    title: "U.S. Strategies",
    description:
      "Systematic equity strategies focused on liquid U.S. companies using quantitative screening, portfolio construction, and ongoing evaluation.",
    stat: "1 strategy · Coming soon",
    linkLabel: "View Strategies",
  },
  {
    href: "/strategies/india",
    label: "India",
    title: "India Strategies",
    description:
      "Evidence-based strategies covering Indian listed companies with an emphasis on systematic processes and long-term portfolio construction.",
    stat: "4 strategies · Live since Aug 2026",
    linkLabel: "View Strategies",
  },
];

export default function StrategiesSection() {
  return (
    <Section spacing="sm">
      <Container size="default">
        <SectionHeader
          title="Strategies"
          description="Systematic investment strategies developed through rigorous research, disciplined portfolio construction, and institutional-grade backtesting."
          centered={false}
        />
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {STRATEGY_CARDS.map((card) => (
            <article
              key={card.title}
              className="transition-all duration-200 hover:border-foreground hover:shadow-sm"
            >
              <Link href={card.href} className="block">
                <Paper padding="none" hover>
                  <div
                    className="relative overflow-hidden"
                    style={{ height: "280px" }}
                  >
                    {/* Text content */}
                    <div
                      className="relative z-10 flex h-full flex-col justify-between p-6 lg:p-8"
                    >
                      <div>
                        <span className="text-xs font-medium tracking-widest text-tertiary uppercase">
                          {card.label}
                        </span>
                        <h3 className="mt-2 text-2xl font-medium">
                          {card.title}
                        </h3>
                        <p
                          className={`${typography.body} mt-3 text-secondary`}
                        >
                          {card.description}
                        </p>
                        {card.stat && (
                          <p className="mt-4 text-xs font-medium tracking-widest text-tertiary uppercase">
                            {card.stat}
                          </p>
                        )}
                      </div>

                      <div>
                        <hr className="border-t border-border" />
                        <span className="mt-4 block text-sm font-medium text-foreground">
                          {card.linkLabel} &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                </Paper>
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
