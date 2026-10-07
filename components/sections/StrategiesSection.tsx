import Image from "next/image";
import Link from "next/link";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Paper from "@/components/ui/Paper";
import { typography } from "@/lib/typography";

type FeatureIcon = "chart" | "trend" | "pie" | "target";

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
    description: "Systematic strategies across America's full market-cap spectrum.",
    image: "/images/statue_liberty.png",
    features: [
      { icon: "chart", label: "Systematic" },
      { icon: "trend", label: "Nasdaq 100" },
      { icon: "target", label: "Benchmark Outperformer" },
    ],
  },
  {
    href: "/strategies/india",
    code: "IN",
    title: "India Strategies",
    description: "Systematic strategies across India's full market-cap spectrum.",
    image: "/images/india_gate.png",
    features: [
      { icon: "chart", label: "Systematic" },
      { icon: "pie", label: "Multi-Cap" },
      { icon: "target", label: "Benchmark Outperformer" },
    ],
  },
];

export default function StrategiesSection() {
  return (
    <Section spacing="none" className="py-12">
      <Container size="default">
        <div className="text-center">
          <h2 className={`${typography.h2} text-foreground sm:text-4xl`}>
            Our Strategies
          </h2>
          <p className={`${typography.body} mt-4 text-secondary`}>
            Rules based. Evidence driven. Built to outperform.
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          {STRATEGY_CARDS.map((card) => (
            <article
              key={card.title}
              className="h-full transition-all duration-200 hover:border-foreground hover:shadow-sm"
            >
              <Link href={card.href} className="block h-full">
                <Paper padding="none" hover className="h-full overflow-hidden">
                  <div className="flex">
                    <div className="relative z-10 flex-1 py-8 pr-4 pl-7">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-border text-xs font-medium tracking-widest text-secondary">
                          {card.code}
                        </span>
                        <h3 className="text-2xl font-medium">{card.title}</h3>
                      </div>
                      <p className="mt-5 text-sm text-secondary">
                        {card.description}
                      </p>
                      <hr className="my-5 border-t border-border" />
                      {/* Feature icon row — spread across full width */}
                      <ul className="flex w-full flex-wrap items-center justify-between gap-y-2">
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
                      <div className="mt-5">
                        <span className="block text-xs font-semibold tracking-wide text-foreground uppercase">
                          LEARN MORE &rarr;
                        </span>
                      </div>
                    </div>
                    <div className="relative w-[40%] overflow-hidden">
                      <Image
                        src={card.image}
                        alt=""
                        fill
                        className="object-cover object-center opacity-90"
                        sizes="(max-width: 1024px) 40vw, 300px"
                        style={{
                          maskImage:
                            "linear-gradient(to right, transparent 0%, black 30%, black 100%)",
                          WebkitMaskImage:
                            "linear-gradient(to right, transparent 0%, black 30%, black 100%)",
                        }}
                      />
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

