import type { MetadataRoute } from "next";
import { IS_PUBLIC_MODE } from "@/lib/site";

/**
 * robots.txt — driven by the public-mode gate.
 *
 * Locked mode (NEXT_PUBLIC_PUBLIC_MODE="false"): disallow every crawler.
 * Default (public): allow all.
 * Driven by the same NEXT_PUBLIC_PUBLIC_MODE flag as the noindex metadata and
 * the footer banner, so the three can never disagree.
 */
export default function robots(): MetadataRoute.Robots {
  if (!IS_PUBLIC_MODE) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://stratovaquant.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/account",
          "/auth/",
          "/forgot-password",
          "/reset-password",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}