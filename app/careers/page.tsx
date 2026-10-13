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
    department: "Research",
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
    department: "Trading",
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
    department: "Engineering",
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
    department: "Research",
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

const PROCESS = [
  {
    step: "01",
    title: "Application",
    body: "Send your CV and a short note about what you want to work on. We read every application personally.",
  },
  {
    step: "02",
    title: "Intro conversation",
    body: "A 30-minute call to understand your background, what you have built, and what you are looking for next.",
  },
  {
    step: "03",
    title: "Technical assessment",
    body: "A take-home or live exercise relevant to the role — quantitative, coding, or written, depending on the position.",
  },
  {
    step: "04",
    title: "Team conversations",
    body: "Two or three conversations with the people you would work with day to day. No panel rounds, no trick questions.",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold tracking-[0.15em] text-tertiary uppercase">
      {children}
    </span>
  );
}

export default function CareersPage() {
  return (
    <main>
      <Container className="pt-16 pb-0">
        <PageHeader
          title="Careers"
          description="We are a small, systematic team building quantitative equity research. We hire slowly and expect a lot."
        />
      </Container>

      <Section spacing="sm">
        <Container size="default">
          <div className="space-y-20">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr] md:gap-12">
              <div className="pt-1">
                <SectionLabel>Who we are</SectionLabel>
              </div>
              <div className="max-w-[680px] space-y-5">
                <p className={`${typography.body} text-secondary`}>
                  Simplical Capital runs systematic equity strategies for
                  individual investors, in India and the U.S.
                </p>
                <p className={`${typography.body} text-secondary`}>
                  We are small on purpose. Everyone writes code, reads
                  research, and owns a piece of the pipeline.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr] md:gap-12">
              <div className="pt-1">
                <SectionLabel>What we look for</SectionLabel>
              </div>
              <div className="max-w-[680px] space-y-5">
                <p className={`${typography.body} text-secondary`}>
                  We look for people who are genuinely interested in how
                  markets work and disciplined about process.
                </p>
                <ul className="space-y-3">
                  {[
                    "Evidence over narrative",
                    "Ownership without supervision",
                    "Precision in details",
                    "Range across research and code",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-secondary">
                      <span aria-hidden className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-tertiary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr] md:gap-12">
              <div className="pt-1">
                <SectionLabel>Open roles</SectionLabel>
              </div>
              <div className="max-w-[680px] space-y-10">
                {ROLES.map((role, index) => (
                  <div key={role.title} className={index === 0 ? "" : "border-t border-border pt-10"}>
                    <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                      {role.title}
                    </h2>
                    <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.15em] text-tertiary">
                      {role.department} · {role.location} · {role.type}
                    </p>
                    <p className={`${typography.body} mt-5 text-secondary`}>
                      {role.description}
                    </p>
                    <ul className="mt-3 space-y-3">
                      {role.requirements.map((r) => (
                        <li key={r} className="flex gap-3 text-sm leading-relaxed text-secondary">
                          <span aria-hidden className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-tertiary" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr] md:gap-12">
              <div className="pt-1">
                <SectionLabel>How we hire</SectionLabel>
              </div>
              <div className="max-w-[680px] grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
                {PROCESS.map((p) => (
                  <div key={p.step}>
                    <span className="text-3xl font-light leading-none text-tertiary">{p.step}</span>
                    <h3 className="mt-3 text-base font-medium text-foreground">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-secondary">{p.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr] md:gap-12">
              <div className="pt-1">
                <SectionLabel>How to apply</SectionLabel>
              </div>
              <div className="max-w-[680px]">
                <p className={`${typography.body} text-secondary`}>
                  Send your CV and a short note to{" "}
                  <a href="mailto:careers@simplicalcapital.com" className="text-foreground underline hover:no-underline">
                    careers@simplicalcapital.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
