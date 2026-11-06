export function formatFee(amount: number | string | null, region: string | null): string {
  if (amount === null || amount === undefined) return "—";
  
  // Safely convert string to number, just in case Supabase returns numeric as a string
  const num = Number(amount);
  if (isNaN(num)) return "—";

  if (region === "us") {
    return `$${num.toLocaleString("en-US")}`;
  }
  return `₹${num.toLocaleString("en-IN")}`;
}