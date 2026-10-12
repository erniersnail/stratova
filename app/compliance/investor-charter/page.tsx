import type { Metadata } from "next";
import { typography } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Investor Charter — Stratova",
  description:
    "The charter detailing the vision, mission, and services provided by Stratova to investors, in accordance with SEBI guidelines.",
};

export default function InvestorCharterPage() {
  return (
    <article className="max-w-[680px]">
      <h1 className={typography.h1}>Investor Charter</h1>
      <p className={`${typography.body} mt-5 text-secondary`}>
        The charter detailing the vision, mission, and services provided by
        Stratova to investors, in accordance with SEBI guidelines.
      </p>

      <h2 className={`${typography.h2} mt-10`}>
        Vision and Mission Statements
      </h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        Vision: Invest with knowledge and safety. Mission: Every investor
        should be able to invest in the right investment products based on
        their needs, manage and monitor them to meet their goals, access
        reports, and enjoy financial wellness.
      </p>

      <h2 className={`${typography.h2} mt-10`}>
        Details of Business Transacted and Services Provided
      </h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        The RA provides research services, including preparation and
        publication of research reports, making buy, sell, or hold
        recommendations, and giving price targets. The RA does not provide
        any execution services or act as a portfolio manager. The RA
        maintains high standards of integrity, avoids conflicts of interest,
        and ensures research recommendations are unbiased and based solely on
        public information and factual observations.
      </p>

      <h2 className={`${typography.h2} mt-10`}>
        Grievance Redressal and Expectations from Investors
      </h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        The RA has a structured grievance redressal mechanism. Complaints can
        be lodged with the RA, escalated to SEBI SCORES, and subsequently to
        the SMART ODR portal. Investors are expected to: (a) read all
        documents carefully before investing; (b) not permit the RA to
        execute any trade on their behalf; (c) keep their contact details
        updated; and (d) understand that the RA&apos;s registration and NISM
        certification do not guarantee performance or assure returns.
      </p>

      <p className={`${typography.body} mt-10 text-secondary`}>
        Investment in securities market are subject to market risks. Read all
        the related documents carefully before investing.
      </p>
    </article>
  );
}
