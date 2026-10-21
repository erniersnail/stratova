// Shared billing-cycle definitions used by the pricing UI, the subscribe
// server action, and the admin payment-activation flow. Keep this module free
// of any server/client-only imports so it can be used everywhere.

export type BillingCycleMonths = 1 | 3 | 6;

export const BILLING_CYCLES: {
  months: BillingCycleMonths;
  label: string;
  discountMultiplier: number;
}[] = [
  { months: 1, label: "1 month", discountMultiplier: 1 },
  { months: 3, label: "3 months", discountMultiplier: 0.95 },
  { months: 6, label: "6 months", discountMultiplier: 0.9 },
];

export const DEFAULT_BASE_FEE = 6000;

export function isBillingCycleMonths(v: unknown): v is BillingCycleMonths {
  return v === 1 || v === 3 || v === 6;
}

export function discountMultiplierFor(months: BillingCycleMonths): number {
  return BILLING_CYCLES.find((c) => c.months === months)?.discountMultiplier ?? 1;
}

export function calculateTotalFee(
  baseFee: number,
  months: BillingCycleMonths,
): number {
  return Math.round(baseFee * months * discountMultiplierFor(months));
}

export function planForCycle(months: BillingCycleMonths): string {
  return `${months}m`;
}

export function cycleMonthsForPlan(plan: string | null): BillingCycleMonths {
  if (plan === "3m") return 3;
  if (plan === "6m") return 6;
  return 1;
}

export function expiryForCycle(firstRebalanceDate: string, months: BillingCycleMonths): string {
  const [yStr, mStr] = firstRebalanceDate.split("-");
  const year = Number(yStr);
  const month = Number(mStr);
  const total = year * 12 + (month - 1) + (months - 1);
  const tYear = Math.floor(total / 12);
  const tMonth0 = total % 12;
  const expiresAtMs = Date.UTC(tYear, tMonth0 + 1, 0, 18, 29, 59, 999);
  return new Date(expiresAtMs).toISOString();
}

export function discountPercentFor(months: BillingCycleMonths): number {
  return Math.round((1 - discountMultiplierFor(months)) * 100);
}
