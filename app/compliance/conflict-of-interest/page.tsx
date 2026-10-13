import type { Metadata } from "next";
import { typography } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Conflict of Interest Policy — Simplicial Capital",
  description:
    "Policies and disclosures regarding potential or actual conflicts of interest that could affect the objectivity of research.",
};

export default function ConflictOfInterestPage() {
  return (
    <article className="max-w-[680px]">
      <h1 className={typography.h1}>Conflict of Interest</h1>
      <p className={`${typography.body} mt-5 text-secondary`}>
        Policies and disclosures regarding potential or actual conflicts of
        interest that could affect the objectivity of research.
      </p>

      <h2 className={`${typography.h2} mt-10`}>Policy on Conflict of Interest</h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        The RA maintains written policies to identify and manage conflicts of
        interest, ensuring that research is independent, objective, and not
        used to manipulate the market. The RA and its employees and directors
        must disclose their status of registration and any material conflict
        of interest in research reports and public appearances.
      </p>

      <h2 className={`${typography.h2} mt-10`}>Specific Disclosures</h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        The Research Analyst, their relatives, and their associates do not
        have a financial interest in the subject companies at the time of
        publication of the research report. The Research Analyst, their
        relatives, and their associates do not have any other material
        conflict of interest at the time of publication. In the event of a
        material conflict of interest, the RA will promptly inform the client
        of the same. The RA does not provide any distribution or other
        compensation tied to specific recommendations.
      </p>

      <h2 className={`${typography.h2} mt-10`}>
        Third-Party Research and AI Disclosure
      </h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        If the RA distributes third-party research reports, it will disclose
        any material conflict of interest of such third-party research
        provider or provide a web address directing the recipient to the
        relevant disclosures. The RA discloses any use of Artificial
        Intelligence (AI) tools in conducting research, to ensure clients
        understand the automated versus human input in the research process.
      </p>

      <p className={`${typography.body} mt-10 text-secondary`}>
        Investment in securities market are subject to market risks. Read all
        the related documents carefully before investing.
      </p>
    </article>
  );
}
