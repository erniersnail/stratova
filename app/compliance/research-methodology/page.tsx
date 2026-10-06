import type { Metadata } from "next";
import { typography } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Research Methodology — Stratova",
  description: "TODO: one-line description of the research methodology.",
};

export default function ResearchMethodologyPage() {
  return (
    <article className="max-w-[680px]">
      <h1 className={typography.h1}>Research Methodology</h1>
      <p className={`${typography.body} mt-5 text-secondary`}>
        TODO: one-line description of what the research methodology page must
        contain.
      </p>

      <h2 className={`${typography.h2} mt-10`}>TODO: Section 1 heading</h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        TODO: content — to be drafted with SEBI counsel before launch.
      </p>

      <h2 className={`${typography.h2} mt-10`}>TODO: Section 2 heading</h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        TODO: content — to be drafted with SEBI counsel before launch.
      </p>

      <h2 className={`${typography.h2} mt-10`}>TODO: Section 3 heading</h2>
      <p className={`${typography.body} mt-4 text-secondary`}>
        TODO: content — to be drafted with SEBI counsel before launch.
      </p>
    </article>
  );
}
