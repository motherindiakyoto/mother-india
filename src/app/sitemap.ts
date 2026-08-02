import type { MetadataRoute } from "next";

import { RESTAURANT_DATA } from "@/data/restaurantData";
import { SITE_URL } from "@/lib/seo";

/**
 * Two URLs — the English page and its Japanese translation — each declaring
 * the other as an alternate. Sitemap-level hreflang is the pairing Google
 * trusts most, and it also gets `/ja` discovered on the first crawl instead of
 * waiting for a link to be followed.
 *
 * Sections are anchors rather than routes, so there is nothing else to list.
 * Add entries here if any section ever becomes its own page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const languages = {
    en: SITE_URL,
    ja: `${SITE_URL}/ja`,
    "x-default": SITE_URL,
  };

  // The dishes worth surfacing in Google Images — a real traffic source for
  // restaurants, where people search the food before the name.
  const images = [
    `${SITE_URL}/opengraph-image.jpg`,
    ...RESTAURANT_DATA.gallery.map((image) => `${SITE_URL}${image.src}`),
  ];

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages },
      images,
    },
    {
      url: `${SITE_URL}/ja`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages },
      images,
    },
  ];
}
