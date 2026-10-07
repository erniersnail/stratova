import Image from "next/image";
import Link from "next/link";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Paper from "@/components/ui/Paper";
import { typography } from "@/lib/typography";

type FeatureIcon = "chart" | "trend" | "calendar" | "pie" | "target";

type StrategyFeature = {
  icon: FeatureIcon;
  label: string;
};

type StrategyCard = {
  href: string;
  code: string;
  title: string;
  description: string;
  image: string;
  features: StrategyFeature[];
};

const FEATURE_ICON_PATHS: Record<FeatureIcon, React.ReactNode> = {
  chart: (
    <>
      <line x1="5" y1="20" x2="5" y2="14" />
      <line x1="12" y1="20" x2="12" y2="9" />
      <line x1="19" y1="20" x2="19" y2="4" />
    </>
  ),
  trend: (
    <>
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="15 7 21 7 21 13" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  pie: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v9h9" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
};

function FeatureIconGlyph({ icon }: { icon: FeatureIcon }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-tertiary"
    >
      {FEATURE_ICON_PATHS[icon]}
    </svg>
  );
}

const STRATEGY_CARDS: StrategyCard[] = [
  {
    href: "/strategies/us",
    code: "US",
    title: "U.S. Strategies",
    description:
      "Systematic equity strategies focused on liquid U.S. companies using quantitative screening, portfolio construction, and ongoing evaluation.",
    image: "/images/statue_liberty.png",
    features: [
      { icon: "chart", label: "Systematic" },
      { icon: "trend", label: "Momentum-Driven" },
      { icon: "calendar", label: "Monthly Rebalanced" },
      { icon: "target", label: "Benchmark Outperformer" },
    ],
  },
  {
    href: "/strategies/india",
    code: "IN",
    title: "India Strategies",
    description:
      "Evidence-based strategies covering Indian listed companies with an emphasis on systematic processes and long-term portfolio construction.",
    image: "/images/india_gate.png",
    features: [
      { icon: "chart", label: "Systematic" },
      { icon: "trend", label: "Momentum-Driven" },
      { icon: "pie", label: "Multi-Cap" },
      { icon: "target", label: "Benchmark Outperformer" },
    ],
  },
];

export default function StrategiesSection() {
  return (
    <Section spacing="sm">
      <Container size="default">
        <div className="text-center">
          <p className="text-center text-xs font-medium tracking-[0.2em] text-tertiary uppercase">
            OUR STRATEGIES
          </p>
          <SectionHeader
            title="Two Strategies. Global Markets."
            description="Rules based. Evidence driven. Built to outperform our benchmarks over the long term."
            centered
            className="mt-4"
          />
        </div>
        <div className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          {STRATEGY_CARDS.map((card) => (
            <article
              key={card.title}
              className="h-full transition-all duration-200 hover:border-foreground hover:shadow-sm"
            >
              <Link href={card.href} className="block h-full">
                <Paper padding="none" hover className="h-full">
                  <div className="flex h-full flex-col justify-between p-6 lg:p-8">
                    <div>
                      {/* Header row: region box + title left, image right */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-border text-xs font-medium tracking-widest text-secondary">
                            {card.code}
                          </span>
                          <div>
                            <h3 className="text-2xl font-medium">
                              {card.title}
                            </h3>
                          </div>
                        </div>
                        <Image
                          src={card.image}
                          alt=""
                          width={120}
                          height={120}
                          className="shrink-0 object-contain"
                        />
                      </div>

                      {/* Description */}
                      <p
                        className={`${typography.body} mt-4 text-secondary`}
                      >
                        {card.description}
                      </p>

                      <hr className="my-6 border-t border-border" />

                      {/* Feature icon row */}
                      <ul className="flex flex-wrap gap-x-6 gap-y-2">
                        {card.features.map((feature) => (
                          <li
                            key={feature.label}
                            className="flex items-center gap-2 text-xs tracking-wide text-secondary"
                          >
                            <FeatureIconGlyph icon={feature.icon} />
                            {feature.label}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6">
                      <span className="block text-xs font-semibold tracking-wide text-foreground uppercase">
                        LEARN MORE &rarr;
                      </span>
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

