import Link from "next/link";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import { typography } from "@/lib/typography";
import { RESEARCH_ITEMS } from "@/lib/research";

export default function ResearchLibrarySection() {
  return (
    <Section spacing="sm">
      <Container size="default">
        <div className="text-center">
          <span className="text-sm font-semibold tracking-[0.15em] text-secondary">
            RESEARCH
          </span>
          <h2 className={`${typography.h2} mt-4`}>Latest Research</h2>
          <p
            className={`${typography.body} mx-auto mt-4 max-w-[620px] text-secondary`}
          >
            Selected publications exploring systematic investing, quantitative
            methods, portfolio construction, and market behavior.
          </p>
          <div className="mx-auto mt-6 w-24 border-b border-border" />
        </div>

        {RESEARCH_ITEMS.length > 0 ? (
          <div className="mt-10">
            {RESEARCH_ITEMS.slice(0, 3).map((paper) => (
              <article
                key={paper.id}
                className="border-t border-border py-6 last:border-b"
              >
                <Link href={paper.href} className="group block">
                  <div className="grid grid-cols-1 gap-2 lg:grid-cols-[200px_1fr_140px] lg:gap-8">
                    {/* Left: Research type and date */}
                    <div className="text-sm text-secondary">
                      <span className="font-medium text-foreground">
                        {paper.category}
                      </span>
                      <span className="mt-1 block text-tertiary">
                        {paper.date}
                      </span>
                    </div>

                    {/* Center: Title and abstract */}
                    <div>
                      <h3 className="text-xl font-medium leading-snug text-foreground transition-colors duration-200 group-hover:text-secondary">
                        {paper.title}
                      </h3>
                      <p
                        className={`${typography.body} mt-2 text-secondary`}
                      >
                        {paper.abstract}
                      </p>
                    </div>

                    {/* Right: Reading time and link */}
                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <span className="text-xs text-tertiary">
                        {paper.readingTime}
                      </span>
                      <span className="text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-secondary">
                        Read Research &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 border-t border-b border-border py-12 text-center">
            <p className={`${typography.body} text-secondary`}>
              Research publications will appear here as they are released.
            </p>
            <div className="mt-4">
              <Link
                href="/methodology"
                className="text-sm font-medium text-foreground transition-colors duration-200 hover:text-secondary"
              >
                View Our Methodology &rarr;
              </Link>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}