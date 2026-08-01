import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

/**
 * The site is a single page; its sections are anchors rather than routes, so
 * the sitemap lists the one URL. Add entries here if sections ever become
 * their own routes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
