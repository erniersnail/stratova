import Image from "next/image";
import Link from "next/link";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import SectionHeader from "@/components/common/SectionHeader";
import Paper from "@/components/ui/Paper";
import { typography } from "@/lib/typography";

type FeatureIcon = "chart" | "clock" | "shield" | "trend";

type StrategyFeature = {
  icon: FeatureIcon;
  label: string;
};

type StrategyCard = {
  href: string;
  label: string;
  code: string;
  title: string;
  description: string;
  image: string;
  stat?: string;
  features: StrategyFeature[];
  linkLabel: string;
};

const FEATURE_ICON_PATHS: Record<FeatureIcon, React.ReactNode> = {
  chart: (
    <>
      <line x1="4" y1="20" x2="4" y2="12" />
      <line x1="10" y1="20" x2="10" y2="6" />
      <line x1="16" y1="20" x2="16" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </>
  ),
  shield: <path d="M12 3l7 3v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />,
  trend: (
    <>
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="15 7 21 7 21 13" />
    </>
  ),
};

function FeatureIconGlyph({ icon }: { icon: FeatureIcon }) {
  return (
    <svg
      width="14"
      height="14"
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

const CARD_FEATURES: StrategyFeature[] = [
  { icon: "chart", label: "Systematic" },
  { icon: "clock", label: "Low Turnover" },
  { icon: "shield", label: "Risk Aware" },
  { icon: "trend", label: "Benchmark Focused" },
];

const STRATEGY_CARDS: StrategyCard[] = [
  {
    href: "/strategies/us",
    label: "United States",
    code: "US",
    title: "U.S. Strategies",
    description:
      "Systematic equity strategies focused on liquid U.S. companies using quantitative screening, portfolio construction, and ongoing evaluation.",
    image: "/images/statue_liberty.png",
    stat: "1 strategy · Coming soon",
    features: CARD_FEATURES,
    linkLabel: "View Strategies",
  },
  {
    href: "/strategies/india",
    label: "India",
    code: "IN",
    title: "India Strategies",
    description:
      "Evidence-based strategies covering Indian listed companies with an emphasis on systematic processes and long-term portfolio construction.",
    image: "/images/india_gate.png",
    stat: "4 strategies · Live since Aug 2026",
    features: CARD_FEATURES,
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
        <div className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          {STRATEGY_CARDS.map((card) => (
            <article
              key={card.title}
              className="h-full transition-all duration-200 hover:border-foreground hover:shadow-sm"
            >
              <Link href={card.href} className="block h-full">
                <Paper padding="none" hover className="relative h-full overflow-hidden">
                  <div
                    className="relative overflow-hidden"
                    style={{ minHeight: "280px" }}
                  >
                    {/* Text content */}
                    <div className="relative z-10 flex h-full min-h-[inherit] flex-col justify-between p-6 lg:p-8">
                      <div>
                        <div className="flex items-center gap-3 pr-[180px]">
                          <span className="flex h-9 w-9 items-center justify-center border border-border bg-surface text-xs font-semibold tracking-wider text-foreground">
                            {card.code}
                          </span>
                          <div>
                            <span className="text-xs font-medium tracking-widest text-tertiary uppercase">
                              {card.label}
                            </span>
                            <h3 className="mt-1 text-2xl font-medium">
                              {card.title}
                            </h3>
                          </div>
                        </div>
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
                        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                          {card.features.map((feature) => (
                            <li
                              key={feature.label}
                              className="flex items-center gap-2 text-xs font-medium text-secondary"
                            >
                              <FeatureIconGlyph icon={feature.icon} />
                              {feature.label}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Card image, bleeding off the top-right edge with left fade */}
                      <div
                        className="pointer-events-none absolute z-0 select-none"
                        style={{ top: "20px", right: "-40px" }}
                      >
                        <Image
                          src={card.image}
                          alt=""
                          width={220}
                          height={220}
                          className="object-contain opacity-90"
                          style={{
                            maskImage:
                              "linear-gradient(to right, transparent 0%, black 40%, black 100%)",
                            WebkitMaskImage:
                              "linear-gradient(to right, transparent 0%, black 40%, black 100%)",
                          }}
                        />
                      </div>

                      <div className="mt-6">
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
