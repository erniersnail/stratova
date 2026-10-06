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

export function nextRebalanceDate(slug: string, from: Date = new Date()): Date {
  const cadence = cadenceForSlug(slug);
  const d = new Date(from);
  let candidate: Date;
  if (cadence === "monthly") {
    candidate = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  } else {
    const months = [1, 4, 7, 10]; // Feb, May, Aug, Nov (0-indexed)
    const next = months.find((m) => m > d.getMonth() ||
      (m === d.getMonth() && d.getDate() < 1));
    candidate = next !== undefined
      ? new Date(d.getFullYear(), next, 1)
      : new Date(d.getFullYear() + 1, 1, 1);
  }
  // Roll forward to Monday if Saturday or Sunday
  while (candidate.getDay() === 0 || candidate.getDay() === 6) {
    candidate.setDate(candidate.getDate() + 1);
  }
  return candidate;
}

export function formatRebalanceDate(d: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  }).format(d);
}
