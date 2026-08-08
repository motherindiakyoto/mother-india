import type { MetadataRoute } from "next";

import { RESTAURANT_DATA } from "@/data/restaurantData";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

/**
 * Four URLs: the home page and the full menu, each in English and Japanese,
 * each declaring the other language as an alternate.
 *
 * The hreflang cluster is per-route — `/menu` pairs with `/ja/menu`, never
 * with `/ja`. Sitemap-level hreflang is the pairing Google trusts most, and it
 * also gets the translated routes discovered on the first crawl instead of
 * waiting for a link to be followed. These entries must stay identical to the
 * page-level `alternates` produced by `alternatesFor`, or the two are read as
 * conflicting and both get discarded.
 */
function languagesFor(segment: string) {
  return {
    en: absoluteUrl("en", segment),
    ja: absoluteUrl("ja", segment),
    "x-default": absoluteUrl("en", segment),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // The dishes worth surfacing in Google Images — a real traffic source for
  // restaurants, where people search the food before the name.
  const images = [
    `${SITE_URL}/opengraph-image.jpg`,
    ...RESTAURANT_DATA.gallery.map((image) => `${SITE_URL}${image.src}`),
  ];

  const home = languagesFor("");
  const menu = languagesFor("menu");

  return [
    {
      url: absoluteUrl("en"),
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: home },
      images,
    },
    {
      url: absoluteUrl("ja"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages: home },
      images,
    },
    // The menu changes more often than anything else on the site, and it's
    // what most searches are actually looking for — hence the high priority.
    {
      url: absoluteUrl("en", "menu"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages: menu },
      images,
    },
    {
      url: absoluteUrl("ja", "menu"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: menu },
      images,
    },
  ];
}
