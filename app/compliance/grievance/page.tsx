import type { Metadata } from "next";
import { typography } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Grievance Redressal — Simplicial Capital",
  description:
    "The procedure and escalation matrix for resolving investor complaints against Simplicial Capital.",
};

export default function GrievancePage() {
  return (
    <article className="max-w-[680px]">
      <h1 className={typography.h1}>Grievance Redressal</h1>
      <p className={`${typography.body} mt-5 text-secondary`}>
        The procedure and escalation matrix for resolving investor complaints
        against Simplicial Capital.
      </p>

      <h2 className={`${typography.h2} mt-10`}>
        Level 1 — Direct Resolution with Simplicial Capital
      </h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        An investor shall first take up their grievance by lodging a
        complaint directly with the RA. The complaint must be submitted in
        writing to [Compliance Officer Name] at [Compliance Officer Email],
        or to [Support Email]. The RA will acknowledge the complaint within 3
        working days and endeavor to resolve it within 21 calendar days from
        the date of receipt. The investor will be kept informed of the
        progress.
      </p>

      <h2 className={`${typography.h2} mt-10`}>Level 2 — SEBI SCORES</h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        If the grievance is not redressed satisfactorily within 21 days, or
        if the investor is dissatisfied with the resolution, they may
        escalate the matter through the SEBI SCORES Portal (
        <a href="https://scores.gov.in/">https://scores.gov.in/</a>).
        Complaints received through SCORES must be resolved by the RA within
        21 calendar days of receipt, and an Action Taken Report (ATR) will be
        submitted.
      </p>

      <h2 className={`${typography.h2} mt-10`}>Level 3 — SMART ODR Portal</h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        If the investor is still not satisfied with the outcome at Level 2,
        they can initiate Online Dispute Resolution through the SMART ODR
        portal (
        <a href="https://smartodr.in/">https://smartodr.in/</a>). The dispute
        resolution through the ODR portal can be initiated only when the
        complaint is not under consideration or pending before any arbitral
        process, court, tribunal, or consumer forum, or is non-arbitrable in
        terms of Indian law.
      </p>

      <p className={`${typography.body} mt-10 text-secondary`}>
        Investment in securities market are subject to market risks. Read all
        the related documents carefully before investing.
      </p>
    </article>
  );
}
