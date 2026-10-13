import type { Metadata } from "next";
import { typography } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Research Methodology — Simplical Capital",
  description:
    "A transparent overview of the principles and processes used to generate research recommendations.",
};

export default function ResearchMethodologyPage() {
  return (
    <article className="max-w-[680px]">
      <h1 className={typography.h1}>Research Methodology</h1>
      <p className={`${typography.body} mt-5 text-secondary`}>
        A transparent overview of the principles and processes used to
        generate research recommendations.
      </p>

      <h2 className={`${typography.h2} mt-10`}>
        Principles of Systematic Research
      </h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        Simplical Capital&apos;s research is systematic, rules-based, and transparent.
        The methodology is designed to be repeatable and free from
        discretionary bias. The RA maintains a documented research methodology
        that can be audited for consistency and objectivity. The scope of
        research per recommendation, internal data-validation mechanisms, and
        interaction protocols with issuers are defined and maintained.
      </p>

      <h2 className={`${typography.h2} mt-10`}>Data Sources and Validation</h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        The research is based on publicly available data and sources believed
        to be reliable, including but not limited to historical price data,
        financial statements, and market data. The RA employs internal
        data-validation mechanisms to ensure the integrity of the data used.
        The use of any AI tools in the research process is disclosed to
        clients.
      </p>

      <h2 className={`${typography.h2} mt-10`}>Limitations and Updates</h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        The methodology is not restricted, but any buy, sell, or hold
        recommendation for a specific security falls under RA Regulations.
        The research reflects the analyst&apos;s independent views and is not
        influenced by any business relationship. The methodology and
        assumptions are subject to change and are updated as necessary to
        maintain efficacy. The RA distributes research fairly without
        selective disclosure.
      </p>

      <p className={`${typography.body} mt-10 text-secondary`}>
        Investment in securities market are subject to market risks. Read all
        the related documents carefully before investing.
      </p>
    </article>
  );
}
