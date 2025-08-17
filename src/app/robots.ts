import type { MetadataRoute } from "next";
import { base } from "../lib/base";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/private/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
