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
  linkLabel: string;
  illustration: string;
  imageWidth: number;
  imageBottom: number;
  imageRight: number;
};

const STRATEGY_CARDS: StrategyCard[] = [
  {
    href: "/research/us-equities",
    label: "United States",
    title: "U.S. Equities",
    description:
      "Systematic equity research focused on liquid U.S. companies using quantitative screening, portfolio construction, and ongoing evaluation.",
    linkLabel: "Explore U.S. Research",
    illustration: "/images/statue-of-liberty.svg",
    imageWidth: 730,
    imageBottom: -400,
    imageRight: -180,
  },
  {
    href: "/research/india-equities",
    label: "India",
    title: "Indian Equities",
    description:
      "Evidence-based research covering Indian listed companies with an emphasis on systematic processes and long-term portfolio construction.",
    linkLabel: "Explore India Research",
    illustration: "/images/india-gate.svg",
    imageWidth: 640,
    imageBottom: -50,
    imageRight: -95,
  },
];

export default function StrategiesSection() {
  return (
    <Section spacing="lg">
      <Container size="default">
        <SectionHeader
          label="STRATEGIES"
          title="Research Across Two Markets"
          description="We develop systematic investment research across U.S. and Indian equity markets using disciplined quantitative methodologies."
        />
        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {STRATEGY_CARDS.map((card) => (
            <article
              key={card.title}
              className="transition-all duration-200 hover:border-foreground hover:shadow-sm"
            >
              <Link href={card.href} className="block">
                <Paper padding="none" hover>
                  <div
                    className="relative overflow-hidden"
                    style={{ height: "340px" }}
                  >
                    {/* Illustration - absolutely positioned, oversized, extending beyond bounds */}
                    {/* eslint-disable-next-line @next/next/no-img-element -- local SVGs don't need next/image optimization */}
                    <img
                      src={card.illustration}
                      alt=""
                      className="absolute z-0 pointer-events-none h-auto max-w-none object-contain object-right-bottom opacity-[0.22]"
                      style={{
                        width: `${card.imageWidth}px`,
                        bottom: `${card.imageBottom}px`,
                        right: `${card.imageRight}px`,
                        filter: "grayscale(100%) brightness(1.05)",
                      }}
                    />

                    {/* Text content - positioned above illustration */}
                    <div
                      className="relative z-10 flex h-full flex-col justify-between p-8 lg:p-10"
                      style={{ width: "58%" }}
                    >
                      <div>
                        <span className="text-xs font-medium tracking-widest text-tertiary uppercase">
                          {card.label}
                        </span>
                        <h3 className="mt-3 text-2xl font-medium">
                          {card.title}
                        </h3>
                        <p
                          className={`${typography.body} mt-4 text-secondary`}
                        >
                          {card.description}
                        </p>
                      </div>

                      <div>
                        <hr className="border-t border-border" />
                        <div className="mt-6 flex items-center gap-6">
                          <span className="text-xs text-tertiary">
                            Quantitative
                          </span>
                          <span className="text-xs text-tertiary">
                            Systematic
                          </span>
                          <span className="text-xs text-tertiary">
                            Evidence-Based
                          </span>
                          <span className="text-xs text-tertiary">
                            Long-Term
                          </span>
                        </div>
                        <span className="mt-6 block text-sm font-medium text-foreground">
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