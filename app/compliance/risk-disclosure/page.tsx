import type { Metadata } from "next";
import { typography } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Risk Disclosure — Simplical Capital",
  description:
    "A statement of the various risks associated with investing in securities markets based on research recommendations.",
};

export default function RiskDisclosurePage() {
  return (
    <article className="max-w-[680px]">
      <h1 className={typography.h1}>Risk Disclosure</h1>
      <p className={`${typography.body} mt-5 text-secondary`}>
        A statement of the various risks associated with investing in
        securities markets based on research recommendations.
      </p>

      <h2 className={`${typography.h2} mt-10`}>Market Risks</h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        Investments in securities markets are subject to market risks. The
        value of investments can go up or down, and past performance is not
        indicative of future results. Recommendations are based on analysis
        of available data and certain assumptions; actual outcomes may differ
        materially.
      </p>

      <h2 className={`${typography.h2} mt-10`}>No Guarantee and No Recourse</h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        The RA does not guarantee returns, profits, accuracy, or risk-free
        investments from the use of its research services. Any reliance
        placed on the research reports shall be as per the client&apos;s own
        judgement and assessment of the conclusions contained therein. There
        is no recourse to claim any losses incurred on investments made based
        on the recommendations.
      </p>

      <h2 className={`${typography.h2} mt-10`}>Specific Risks</h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        Investments are subject to various risks including, but not limited
        to, market risk, liquidity risk, concentration risk, credit risk,
        interest rate risk, and regulatory risk. The recommendations may not
        be suitable for all investors. Investors should carefully consider
        their investment objectives, financial situation, and risk tolerance
        before acting on any recommendation.
      </p>

      <p className={`${typography.body} mt-10 text-secondary`}>
        Investment in securities market are subject to market risks. Read all
        the related documents carefully before investing.
      </p>
    </article>
  );
}
