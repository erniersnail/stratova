import type { Metadata } from "next";
import { typography } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Refund Policy — Simplicial Capital",
  description:
    "The terms under which subscription fees may be refunded, in accordance with the SEBI (Research Analysts) Regulations, 2014.",
};

export default function RefundPage() {
  return (
    <article className="max-w-[680px]">
      <h1 className={typography.h1}>Refund Policy</h1>
      <p className={`${typography.body} mt-5 text-secondary`}>
        The terms under which subscription fees may be refunded, in
        accordance with the SEBI (Research Analysts) Regulations, 2014.
      </p>

      <h2 className={`${typography.h2} mt-10`}>
        General Policy — Fees Non-Refundable Once Delivered
      </h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        All fees paid to Simplicial Capital for research services are
        non-refundable for any subscription cycle during which
        recommendations have been delivered to the client&apos;s dashboard.
        By subscribing, the client acknowledges that they have reviewed the
        scope of services, the research methodology, and any sample research
        reports made available prior to purchase, and that they are satisfied
        with the same. No refund will be provided for partial use of the
        subscription period, dissatisfaction with individual recommendations,
        or market losses.
      </p>

      <h2 className={`${typography.h2} mt-10`}>
        Refund on Premature Termination
      </h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        In the event of premature termination of services by the client,
        the client is entitled to a refund of proportionate fees for the
        portion of the subscription period for which recommendations have
        not yet been delivered. Since recommendations for the current cycle
        are delivered to the subscriber&apos;s dashboard on the rebalance
        date and remain accessible for the full cycle, that cycle is treated
        as fully served and no refund is payable for it. Where the client has
        prepaid for a future cycle that has not yet commenced, a proportionate
        refund will be issued for that cycle, net of any applicable taxes and
        payment-gateway charges. A client seeking termination must notify
        Simplicial Capital in writing at support@simplicialcapital.com with
        their registered email ID, transaction reference, and reason for
        termination.
      </p>

      <h2 className={`${typography.h2} mt-10`}>
        Mandatory Refund — Suspension or Cancellation of RA Registration
      </h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        If Simplicial Capital&apos;s SEBI Research Analyst registration is
        suspended or cancelled by SEBI, Simplicial Capital shall refund fees
        on a pro-rata basis for the period from the effective date of such
        suspension or cancellation to the end of the client&apos;s paid
        subscription period. This refund shall be processed without requiring
        the client to request it.
      </p>

      <h2 className={`${typography.h2} mt-10`}>Processing of Refunds</h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        All approved refunds will be processed within 7 to 10 working days
        from the date of approval, via the original mode of payment. Refunds
        will be made only to the account from which the original payment was
        received. Cash payments are not accepted and will not be refunded.
      </p>

      <h2 className={`${typography.h2} mt-10`}>How to Request a Refund</h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        Refund requests must be submitted to support@simplicialcapital.com
        with: (a) full name; (b) registered email; (c) transaction or payment
        ID; (d) date of payment; and (e) reason for the request. Requests
        that do not meet SEBI&apos;s mandatory refund criteria will be
        declined with a written explanation.
      </p>

      <p className={`${typography.body} mt-10 text-secondary`}>
        Investment in securities market are subject to market risks. Read all
        the related documents carefully before investing.
      </p>
    </article>
  );
}
