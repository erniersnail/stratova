import Image from "next/image";
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
  image: string;
  tags: string[];
  linkLabel: string;
};

const STRATEGY_CARDS: StrategyCard[] = [
  {
    href: "/strategies/us",
    label: "United States",
    title: "U.S. Strategies",
    description:
      "Systematic equity strategies focused on liquid U.S. companies using quantitative screening, portfolio construction, and ongoing evaluation.",
    image: "/images/statue_liberty.png",
    tags: ["Systematic", "Momentum", "Benchmark Outperformer"],
    linkLabel: "View Strategies",
  },
  {
    href: "/strategies/india",
    label: "India",
    title: "India Strategies",
    description:
      "Evidence-based strategies covering Indian listed companies with an emphasis on systematic processes and long-term portfolio construction.",
    image: "/images/india_gate.png",
    tags: ["Systematic", "Multi-Cap", "Benchmark Outperformer"],
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
                      <div className="min-h-[200px]">
                        <div className="pr-[200px]">
                          <span className="text-xs font-medium tracking-widest text-tertiary uppercase">
                            {card.label}
                          </span>
                          <h3 className="mt-1 text-2xl font-medium">
                            {card.title}
                          </h3>
                        </div>
                        <div className="pr-[140px] sm:pr-[180px]">
                          <p
                            className={`${typography.body} mt-3 text-secondary`}
                          >
                            {card.description}
                          </p>
                        </div>
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {card.tags.map((tag) => (
                            <li
                              key={tag}
                              className="rounded-full border border-border px-2.5 py-1 text-xs tracking-wide text-secondary"
                            >
                              {tag}
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
                        <span className="block text-sm font-medium text-foreground">
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

