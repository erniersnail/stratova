export type Cadence = "monthly" | "quarterly";

const SLUG_CADENCE: Record<string, Cadence> = {
  "momentum-eq": "monthly",
  "momentum-broad": "monthly",
  "smallcap-ensemble": "quarterly",
  "midcap": "quarterly",
};

export function cadenceForSlug(slug: string): Cadence {
  return SLUG_CADENCE[slug] ?? "monthly";
}

export function nextRebalanceDate(slug: string): Date {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed (Nov is 10)
  
  const isQuarterly = slug === "midcap-select" || slug === "smallcap-select";
  
  if (isQuarterly) {
    // Quarterly months: Feb (1), May (4), Aug (7), Nov (10)
    const qMonths = [1, 4, 7, 10];
    let nextMonth = qMonths.find((m) => m > month);
    let nextYear = year;
    if (nextMonth === undefined) {
      nextMonth = qMonths[0]; // Feb of next year
      nextYear += 1;
    }
    return new Date(nextYear, nextMonth, 1);
  } else {
    // Monthly: first day of next month
    return new Date(year, month + 1, 1);
  }
}

export function formatRebalanceDate(d: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  }).format(d);
}
