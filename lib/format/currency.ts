export function formatFee(amount: number | null, region: string | null): string {
  if (amount === null || amount === undefined) return "—";
  
  if (region === "us") {
    return `$${amount.toLocaleString("en-US")}`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}