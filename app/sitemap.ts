import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/research/fetch";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const articleUrls = await Promise.all(
    (await getPublishedArticles()).map(async (article) => ({
      url: `${SITE_URL}/research/${article.slug}`,
      lastModified: new Date(article.updated_at),
    })),
  );
  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
    })),
    ...articleUrls,
  ];
}

