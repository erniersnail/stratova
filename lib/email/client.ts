// SERVER-ONLY. Reads RESEND_API_KEY. Never import from a client component.
import { Resend } from "resend";

let cached: Resend | null = null;

export function getResend(): Resend {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Missing RESEND_API_KEY");
  cached = new Resend(key);
  return cached;
}

export const NOTIFICATION_FROM =
  process.env.NOTIFICATION_FROM_EMAIL ??
  "Simplicial Capital <updates@simplicialcapital.com>";
