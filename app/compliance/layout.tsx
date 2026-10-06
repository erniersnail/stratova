import Link from "next/link";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";

export const COMPLIANCE_PAGES = [
  { slug: "disclaimer", title: "Disclaimer" },
  { slug: "mitc", title: "Most Important Terms and Conditions" },
  { slug: "investor-charter", title: "Investor Charter" },
  { slug: "grievance", title: "Grievance Redressal" },
  { slug: "risk-disclosure", title: "Risk Disclosure" },
  { slug: "refund", title: "Refund Policy" },
  { slug: "conflict-of-interest", title: "Conflict of Interest Policy" },
  { slug: "research-methodology", title: "Research Methodology" },
] as const;

export default function ComplianceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Section spacing="sm">
        <Container size="narrow">
          <nav aria-label="Compliance pages" className="mt-8">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {COMPLIANCE_PAGES.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/compliance/${page.slug}`}
                    className="text-sm text-secondary underline hover:text-foreground hover:no-underline"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-8">{children}</div>
        </Container>
      </Section>
    </main>
  );
}
