import type { Metadata } from "next";
import { typography } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Disclaimer — Simplical Capital",
  description:
    "This disclaimer outlines the limitations of liability and the nature of research services provided by Simplical Capital as a SEBI-registered Research Analyst.",
};

export default function DisclaimerPage() {
  return (
    <article className="max-w-[680px]">
      <h1 className={typography.h1}>Disclaimer</h1>
      <p className={`${typography.body} mt-5 text-secondary`}>
        This disclaimer outlines the limitations of liability and the nature
        of research services provided by Simplical Capital as a SEBI-registered
        Research Analyst.
      </p>

      <h2 className={`${typography.h2} mt-10`}>General Disclaimer</h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        The research reports, recommendations, and any other information
        provided by Simplical Capital (&quot;the RA&quot;) are for informational
        purposes only and do not constitute an offer or solicitation for the
        purchase or sale of any security. The RA is a SEBI-registered
        Research Analyst (Registration No: [RA Registration Number]).
        Registration granted by SEBI, enlistment with RAASB, and
        certification from NISM in no way guarantee the performance of the RA
        or provide any assurance of returns to investors. The RA cannot
        execute or carry out any trade (purchase or sell transaction) on
        behalf of the client.
      </p>

      <h2 className={`${typography.h2} mt-10`}>
        No Guarantee of Returns and Limitation of Liability
      </h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        Any investment made based on the recommendations in the research
        reports is subject to market risks, and the recommendations do not
        provide any assurance of returns. There is no recourse to claim any
        losses incurred on investments made based on the recommendations. The
        RA shall not be liable for any direct, indirect, incidental, or
        consequential loss or damage arising from the use of the information
        provided.
      </p>

      <h2 className={`${typography.h2} mt-10`}>Accuracy of Information</h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        The information provided is based on publicly available data and
        sources believed to be reliable. However, the RA does not warrant the
        accuracy, completeness, or adequacy of such information. All opinions,
        projections, and estimates are based on analysis under certain
        assumptions as of the date of preparation or publication and are
        subject to change without notice.
      </p>

      <p className={`${typography.body} mt-10 text-secondary`}>
        Investment in securities market are subject to market risks. Read all
        the related documents carefully before investing.
      </p>
    </article>
  );
}
