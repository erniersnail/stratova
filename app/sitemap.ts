import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://stratovaquant.com";

const STATIC_PATHS = [
  "/",
  "/about",
  "/contact",
  "/methodology",
  "/performance",
  "/privacy",
  "/terms",
  "/research",
  "/strategies",
  "/strategies/india",
  "/strategies/us",
  "/signup",
  "/login",
  "/compliance/disclaimer",
  "/compliance/investor-charter",
  "/compliance/mitc",
  "/compliance/grievance",
  "/compliance/risk-disclosure",
  "/compliance/refund",
  "/compliance/conflict-of-interest",
  "/compliance/research-methodology",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
  }));
}
