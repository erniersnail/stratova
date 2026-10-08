import Image from "next/image";
import Link from "next/link";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Paper from "@/components/ui/Paper";
import { typography } from "@/lib/typography";

type StrategyCard = {
  href: string;
  code: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
};

const STRATEGY_CARDS: StrategyCard[] = [
  {
    href: "/strategies/us",
    code: "US",
    title: "U.S. Strategies",
    description: "Systematic strategies across the NASDAQ 100.",
    image: "/images/statue_liberty.png",
    tags: ["Systematic", "NASDAQ 100", "Benchmark Outperformer"],
  },
  {
    href: "/strategies/india",
    code: "IN",
    title: "India Strategies",
    description: "Systematic strategies across India's full market-cap spectrum.",
    image: "/images/india_gate.png",
    tags: ["Systematic", "Multi-Cap", "Benchmark Outperformer"],
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
                      <p className="mt-5 text-sm text-foreground">
                        {card.description}
                      </p>
                      <hr className="my-5 border-t border-border" />
                      <p className="mt-4 text-xs tracking-wide text-foreground/85 whitespace-nowrap overflow-hidden text-ellipsis">
                        {card.tags.join(" · ")}
                      </p>
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

