import type { Metadata } from "next";
import { typography } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Investor Charter — Stratova",
  description: "TODO: one-line description of the investor charter.",
};

export default function InvestorCharterPage() {
  return (
    <article className="max-w-[680px]">
      <h1 className={typography.h1}>Investor Charter</h1>
      <p className={`${typography.body} mt-5 text-secondary`}>
        TODO: one-line description of what the investor charter must contain.
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
