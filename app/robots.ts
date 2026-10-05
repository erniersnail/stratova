import type { MetadataRoute } from "next";
import { IS_PUBLIC_MODE } from "@/lib/site";

/**
 * robots.txt — driven by the public-mode gate.
 *
 * Pre-launch (default): disallow every crawler. At launch: allow all.
 * Driven by the same NEXT_PUBLIC_PUBLIC_MODE flag as the noindex metadata and
 * the footer banner, so the three can never disagree.
 */
export default function robots(): MetadataRoute.Robots {
  if (!IS_PUBLIC_MODE) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
  };
}