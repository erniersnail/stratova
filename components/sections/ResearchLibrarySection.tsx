import Link from "next/link";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import { typography } from "@/lib/typography";

type ResearchPaper = {
  href: string;
  category: string;
  date: string;
  title: string;
  summary: string;
};

const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    href: "/research/momentum-after-earnings",
    category: "Factor Research",
    date: "July 2026",
    title: "Momentum After Earnings:\nEvidence from U.S. Equities",
    summary:
      "Examining whether post-earnings momentum persists after controlling for size and sector effects.",
  },
  {
    href: "/research/position-sizing",
    category: "Portfolio Construction",
    date: "June 2026",
    title: "Position Sizing in Concentrated Portfolios",
    summary:
      "Evaluating different weighting approaches under varying volatility regimes.",
  },
  {
    href: "/research/liquidity-indian-mid-cap",
    category: "Market Structure",
    date: "May 2026",
    title: "Liquidity and Execution in Indian Mid-Cap Stocks",
    summary:
      "Studying the relationship between liquidity constraints and systematic portfolio implementation.",
  },
];

export default function ResearchLibrarySection() {
  return (
    <Section spacing="lg">
      <Container size="default">
        <div className="text-center">
          <span className="text-sm font-medium tracking-widest text-secondary">
            RESEARCH
          </span>
          <h2 className={`${typography.h2} mt-4`}>Latest Research</h2>
          <p
            className={`${typography.body} mx-auto mt-4 max-w-[620px] text-secondary`}
          >
            Selected publications exploring systematic investing, quantitative
            methods, portfolio construction, and market behavior.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {RESEARCH_PAPERS.map((paper) => (
            <article
              key={paper.title}
              className="rounded-sm border border-border bg-surface p-7 transition-all duration-200 hover:border-foreground hover:shadow-sm"
            >
              <Link href={paper.href} className="block">
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <span>{paper.category}</span>
                  <span aria-hidden="true" className="text-border">
                    /
                  </span>
                  <span>{paper.date}</span>
                </div>
                <h3 className="mt-4 text-xl font-medium leading-snug whitespace-pre-line">
                  {paper.title}
                </h3>
                <p
                  className={`${typography.body} mt-3 text-secondary`}
                >
                  {paper.summary}
                </p>
                <span className="mt-5 block text-sm font-medium text-foreground">
                  Read Research &rarr;
                </span>
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}