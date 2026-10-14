import { NextResponse } from "next/server";
import { sendNewRecommendationEmails } from "@/lib/email/sendRecommendations";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization") ?? "";
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await sendNewRecommendationEmails();
    return NextResponse.json(summary);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[cron] recommendations send failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
