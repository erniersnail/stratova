import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/common/PageHeader";
import { typography } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Careers — Simplical Capital",
  description:
    "Join Simplical Capital. Open roles in quantitative research, trading, and engineering.",
};

const ROLES = [
  {
    title: "Quantitative Researcher",
    location: "Bangalore, India",
    type: "Full-time",
    description:
      "Design, backtest, and deploy systematic equity strategies across Indian and U.S. markets. Work spans signal construction, factor modeling, portfolio construction, and out-of-sample validation.",
    requirements: [
      "Strong Python (pandas, numpy) and statistical analysis",
      "Experience with backtesting frameworks and time-series data",
      "Familiarity with equity factor models and momentum strategies",
      "Degree in a quantitative discipline — Mathematics, Physics, Computer Science, Engineering, or Economics",
    ],
  },
  {
    title: "Quantitative Trader",
    location: "Bangalore, India",
    type: "Full-time",
    description:
      "Own the daily signal-to-order workflow. Execute and monitor systematic rebalances across client portfolios, and refine the execution layer over time.",
    requirements: [
      "Hands-on experience with Indian or U.S. equity execution",
      "Familiarity with broker APIs (Zerodha, Upstox, IBKR, or similar)",
      "Understanding of transaction costs, slippage, and market impact",
      "Comfort with Python and live production systems",
    ],
  },
  {
    title: "Quantitative Developer",
    location: "Bangalore, India",
    type: "Full-time",
    description:
      "Build and maintain the research infrastructure that powers strategy development, backtesting, and daily production pipelines.",
    requirements: [
      "Strong Python; some TypeScript / Next.js a plus",
      "Experience with data pipelines, Parquet, and cloud deployment",
      "Postgres or Supabase familiarity preferred",
      "Comfort owning production systems end to end",
    ],
  },
  {
    title: "Research Analyst",
    location: "Bangalore, India",
    type: "Full-time",
    description:
      "Support the research process with data gathering, validation, and writing. Help translate strategy outputs into clear, SEBI-compliant research notes.",
    requirements: [
      "Strong writing and analytical skills",
      "Familiarity with Indian equity markets and the SEBI RA framework",
      "NISM Series XV (Research Analyst) certification preferred, or willingness to obtain",
      "Attention to detail and process discipline",
    ],
  },
];

export default function CareersPage() {
  return (
    <main>
      <Container className="pt-16 pb-0">
        <PageHeader
          title="Careers"
          description="We are a small team building systematic equity research. We hire slowly and expect a lot."
        />
      </Container>

      <Section spacing="sm">
        <Container size="default">
          <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
            {ROLES.map((role) => (
              <div
                key={role.title}
                className="rounded-md border border-border bg-surface px-6 py-6"
              >
                <h2 className="font-serif text-xl font-semibold tracking-tight text-foreground">
                  {role.title}
                </h2>
                <p className="mt-1 text-xs uppercase tracking-wider text-tertiary">
                  {role.location} · {role.type}
                </p>
                <p className={`${typography.body} mt-4 text-secondary`}>
                  {role.description}
                </p>
                <h3 className="mt-6 text-sm font-medium text-foreground">
                  What we look for
                </h3>
                <ul className="mt-3 space-y-2">
                  {role.requirements.map((r) => (
                    <li
                      key={r}
                      className="flex gap-3 text-sm leading-relaxed text-secondary"
                    >
                      <span
                        aria-hidden
                        className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-tertiary"
                      />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="sm">
        <Container size="default">
          <div className="rounded-md border border-border bg-surface px-6 py-10 text-center">
            <h2 className={`${typography.h3} text-foreground`}>
              How to apply
            </h2>
            <p
              className={`${typography.body} mx-auto mt-4 max-w-[600px] text-secondary`}
            >
              Send your CV and a short note about what you want to work on to{" "}
              <a
                href="mailto:careers@simplicalcapital.com"
                className="text-foreground underline hover:no-underline"
              >
                careers@simplicalcapital.com
              </a>
              . We read every application.
            </p>
          </div>
        </Container>
      </Section>
    </main>
  );
}
