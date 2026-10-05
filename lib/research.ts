export type ResearchItem = {
  id: string;
  category: string;
  date: string;
  title: string;
  abstract: string;
  readingTime: string;
  href: string;
};

/**
 * Research publications list.
 *
 * This array is empty because no research has been published yet.
 * When a paper is ready for publication, add it here following the
 * ResearchItem type structure. The editorial list component and
 * research page will automatically render new entries.
 */
export const RESEARCH_ITEMS: ResearchItem[] = [];

export const RESEARCH_CATEGORIES = [
  "All",
  "Factor Research",
  "Portfolio Construction",
  "Market Structure",
  "Methodology",
] as const;
