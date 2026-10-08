/**
 * Formats an ISO timestamp in IST (Asia/Kolkata). Returns "—" for
 * null, undefined, or invalid inputs.
 */
export function formatIST(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(d);
}

/**
 * Formats a value as a date-only string in IST ("15 Aug 2026").
 * Accepts ISO timestamps and bare "YYYY-MM-DD" dates. Returns "—" for
 * null, undefined, or invalid inputs.
 */
export function formatDateIST(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(d);
}
