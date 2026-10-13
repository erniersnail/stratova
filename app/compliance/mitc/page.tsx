import type { Metadata } from "next";
import { typography } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Most Important Terms and Conditions — Simplical Capital",
  description:
    "The standardized key terms and conditions governing the research services provided by Simplical Capital, as mandated by SEBI.",
};

export default function MitcPage() {
  return (
    <article className="max-w-[680px]">
      <h1 className={typography.h1}>Most Important Terms and Conditions</h1>
      <p className={`${typography.body} mt-5 text-secondary`}>
        The standardized key terms and conditions governing the research
        services provided by Simplical Capital, as mandated by SEBI.
      </p>

      <h2 className={`${typography.h2} mt-10`}>
        Scope of Services and Fee
      </h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        These terms and conditions, and consent thereon, are for the research
        services provided by the Research Analyst (RA). The RA cannot execute
        or carry out any trade (purchase or sell transaction) on behalf of
        the client. The fee charged by the RA is subject to the maximum
        amount prescribed by SEBI and RAASB from time to time (currently
        ₹1,51,000 per annum per family of client for all research services,
        applicable only to Individual and HUF clients). Fee limits do not
        apply to non-individual clients or accredited investors. The RA may
        charge fees in advance, not exceeding one quarter. Fees may be paid
        through cheque, online bank transfer, UPI, or other permitted
        electronic modes. Cash payment is not allowed. Optionally, payments
        can be made through the Centralized Fee Collection Mechanism (CeFCoM)
        managed by BSE Limited.
      </p>

      <h2 className={`${typography.h2} mt-10`}>
        Refunds, Conflict of Interest, and Prohibited Practices
      </h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        In case of premature termination of services by either party, the
        client is entitled to a refund of proportionate fees only for the
        unexpired period. Except as expressly provided in the Refund Policy,
        all fees paid are non-refundable. The client acknowledges that no
        refund will be granted for partial use of the subscription period or
        for market losses. The RA will abide by applicable regulations
        regarding disclosure and mitigation of any actual or potential
        conflict of interest and will endeavor to promptly inform the client
        of any such conflict. Any assured, guaranteed, or fixed returns
        schemes or any other schemes of similar nature are prohibited by law
        and shall not be offered. The RA cannot guarantee returns, profits,
        accuracy, or risk-free investments.
      </p>

      <h2 className={`${typography.h2} mt-10`}>Grievance Redressal</h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        For any grievances, Step 1: the client should first contact the RA
        using the details provided on the website. Step 2: if the resolution
        is unsatisfactory, the client may escalate the matter to SEBI through
        the SCORES portal (
        <a href="https://scores.gov.in/">https://scores.gov.in/</a>). Step 3:
        if still not satisfied, the client can initiate Online Dispute
        Resolution (ODR) through the SMART ODR portal (
        <a href="https://smartodr.in/">https://smartodr.in/</a>). The client
        is required to keep contact details, including email ID and mobile
        number, updated with the RA at all times.
      </p>

      <p className={`${typography.body} mt-10 text-secondary`}>
        Investment in securities market are subject to market risks. Read all
        the related documents carefully before investing.
      </p>
    </article>
  );
}
