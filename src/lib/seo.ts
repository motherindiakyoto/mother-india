import { RESTAURANT_DATA } from "@/data/restaurantData";
import { localePath, type Lang } from "@/data/i18n";
import { PRODUCTION_URL } from "@/lib/site";

export { PRODUCTION_URL };

/**
 * Canonical origin for the site. Every absolute URL in metadata, the sitemap,
 * robots.txt and the structured data derives from this one value.
 *
 * Order matters. Resolution order:
 *
 *  1. `NEXT_PUBLIC_SITE_URL` — an explicit override, e.g. a staging domain.
 *  2. The generated Vercel URL, but *only* on preview deployments, so a
 *     preview never advertises itself as the production site.
 *  3. localhost for `next dev`.
 *  4. The production domain everywhere else.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/+$/, "")}`;
  }

  if (process.env.NODE_ENV === "development") return "http://localhost:3000";

  return PRODUCTION_URL;
}

export const SITE_URL = resolveSiteUrl();

/** Latitude / longitude of the restaurant, read off its Google Maps listing. */
export const GEO = { latitude: 35.0092423, longitude: 135.7691765 } as const;

/**
 * Absolute URL for one locale's copy of a route — what canonical and hreflang
 * both need. `absoluteUrl("ja", "menu")` → `https://…/ja/menu`.
 */
export function absoluteUrl(lang: Lang, segment = ""): string {
  const path = localePath(lang, segment);
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

/**
 * The hreflang cluster for one route, across both locales.
 *
 * Every page must list *both* of its language URLs and the two must agree with
 * each other, or Google discards the annotations and picks a winner itself.
 * Critically, the cluster is per-route: `/menu` has to point at `/ja/menu`,
 * not at `/ja`. Pointing every page's alternates at the home page is the
 * classic way to get a whole translated section dropped from the index.
 *
 * `sitemap.ts` repeats these same entries — page-level and sitemap-level
 * hreflang have to match exactly or they're read as conflicting.
 */
export function hreflangFor(segment = "") {
  return {
    en: localePath("en", segment),
    ja: localePath("ja", segment),
    "x-default": localePath("en", segment),
  };
}

/** Back-compat alias for the home-page cluster. */
export const HREFLANG = hreflangFor();

/** `alternates` for a page: self-referencing canonical plus its hreflang set. */
export function alternatesFor(lang: Lang, segment = "") {
  return {
    canonical: localePath(lang, segment),
    languages: hreflangFor(segment),
  };
}

/**
 * schema.org `Offer.price` must be a bare number — "¥1,450" is rejected, and a
 * malformed offer can invalidate the whole menu block. Ranged prices
 * ("¥2,250 / ¥2,350") resolve to the lower bound.
 */
function numericPrice(price: string): string | null {
  const match = price.replace(/,/g, "").match(/\d+/);
  return match ? match[0] : null;
}

/**
 * schema.org/Restaurant — the payload that earns the rich result in Google
 * Search and feeds the local pack, Maps and AI answers.
 *
 * Everything here comes from `RESTAURANT_DATA`, so the markup can never drift
 * from what the page actually says. Google penalises structured data that
 * contradicts visible content, which is also why there is no `aggregateRating`:
 * the site shows guest quotes, not a verified review count we could stand behind.
 */
export function buildRestaurantJsonLd(lang: Lang = "en") {
  const { metadata, contact, paymentMethods, amenities } = RESTAURANT_DATA;
  const url = absoluteUrl(lang);
  const menuUrl = absoluteUrl(lang, "menu");

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}/#restaurant`,
    name: metadata.legalName,
    alternateName: [
      `${metadata.brandName} Kyoto`,
      "マザーインディア 京都",
      "Mother India Restaurant & Bar",
    ],
    url,
    description: metadata.description[lang],
    slogan: metadata.tagline[lang],
    image: [
      `${SITE_URL}/opengraph-image.jpg`,
      `${SITE_URL}/images/menu/cheese-naan-set.jpg`,
      `${SITE_URL}/images/menu/naan-thali.jpg`,
      `${SITE_URL}/images/menu/biryani-platter.jpg`,
    ],
    telephone: contact.phone.display,
    address: {
      "@type": "PostalAddress",
      streetAddress: "435-2 Ebisuchō, Hijikata Bldg. 4F",
      addressLocality: "Nakagyo Ward",
      addressRegion: "Kyoto",
      postalCode: "604-8005",
      addressCountry: "JP",
    },
    // Coordinates plus `hasMap` are what tie the page to the Maps listing.
    geo: {
      "@type": "GeoCoordinates",
      latitude: GEO.latitude,
      longitude: GEO.longitude,
    },
    hasMap: metadata.gMapsLink,
    areaServed: [
      { "@type": "City", name: "Kyoto" },
      { "@type": "AdministrativeArea", name: "Nakagyo Ward" },
    ],
    // Every day, 11:00–23:00.
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "11:00",
        closes: "23:00",
      },
    ],
    servesCuisine: ["Indian", "Asian"],
    // Now that the whole menu has its own crawlable URL, point at that rather
    // than at the home page's anchor — it's the page that actually lists
    // every dish and price.
    menu: menuUrl,
    hasMenu: { "@id": `${menuUrl}#menu` },
    // Most mains land between ¥390 and ¥2,500 — "¥¥" in Google's banding.
    priceRange: "¥¥",
    currenciesAccepted: "JPY",
    paymentAccepted: paymentMethods.modes.map((mode) => mode.en).join(", "),
    acceptsReservations: true,
    smokingAllowed: false,
    publicAccess: true,
    isAccessibleForFree: false,
    inLanguage: ["en", "ja"],
    // Dine-in / takeout / vegetarian / Jain & Halal / Wi-Fi, straight from the
    // amenities the page renders — these drive "…near me with X" matching.
    amenityFeature: amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity.label.en,
      value: amenity.available,
    })),
    potentialAction: [
      {
        "@type": "ReserveAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: metadata.tabelogUrl,
          inLanguage: lang,
          actionPlatform: [
            "https://schema.org/DesktopWebPlatform",
            "https://schema.org/MobileWebPlatform",
          ],
        },
        result: { "@type": "FoodEstablishmentReservation", name: "Table reservation" },
      },
      {
        "@type": "ViewAction",
        target: menuUrl,
        name: "View the menu",
      },
    ],
    sameAs: [metadata.gMapsLink, metadata.tabelogUrl],
    subjectOf: { "@id": `${url}#faq` },
  };
}

/**
 * schema.org/Menu — the full dish-and-price listing as its own entity, which
 * `Restaurant.hasMenu` points at.
 *
 * Unlike the old inline version this carries *every* item rather than the
 * first twelve per section: it's a standalone node referenced by `@id`, so
 * there's no reason to truncate, and dish-level offers are exactly what gets
 * matched against "paneer butter masala kyoto" style queries.
 */
export function buildMenuJsonLd(lang: Lang) {
  const menuUrl = absoluteUrl(lang, "menu");
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${menuUrl}#menu`,
    url: menuUrl,
    name: lang === "ja" ? "フルメニュー" : "The Full Menu",
    inLanguage: lang === "ja" ? "ja-JP" : "en",
    provider: { "@id": `${SITE_URL}/#restaurant` },
    hasMenuSection: RESTAURANT_DATA.fullMenu.sections.map((section) => ({
      "@type": "MenuSection",
      name: section.name[lang],
      hasMenuItem: section.items.map((item) => {
        const price = item.price ? numericPrice(item.price) : null;
        return {
          "@type": "MenuItem",
          name: item.name[lang],
          ...(item.description ? { description: item.description[lang] } : {}),
          ...(price
            ? {
                offers: {
                  "@type": "Offer",
                  price,
                  priceCurrency: "JPY",
                },
              }
            : {}),
        };
      }),
    })),
  };
}

/** schema.org/WebSite — name disambiguation for the brand query. */
export function buildWebSiteJsonLd() {
  const { metadata } = RESTAURANT_DATA;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: `${metadata.brandName} — ${metadata.subTitle}`,
    inLanguage: ["en", "ja"],
    publisher: { "@id": `${SITE_URL}/#restaurant` },
  };
}

/**
 * schema.org/WebPage — ties this specific URL to its language, so the two
 * locales read as translations of one page rather than duplicate content.
 */
export function buildWebPageJsonLd(
  lang: Lang,
  segment = "",
  overrides?: { name?: string; description?: string }
) {
  const { metadata } = RESTAURANT_DATA;
  const url = absoluteUrl(lang, segment);
  // The translation pair is per-route: `/ja/menu` is the translation of
  // `/menu`, not of the home page.
  const counterpart = absoluteUrl(lang === "ja" ? "en" : "ja", segment);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: overrides?.name ?? metadata.legalName,
    description: overrides?.description ?? metadata.description[lang],
    inLanguage: lang === "ja" ? "ja-JP" : "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#restaurant` },
    primaryImageOfPage: `${SITE_URL}/opengraph-image.jpg`,
    ...(lang === "ja"
      ? { translationOfWork: { "@id": `${counterpart}#webpage` } }
      : { workTranslation: { "@id": `${counterpart}#webpage` } }),
  };
}

/**
 * schema.org/FAQPage — the block that gets quoted directly in search results
 * and by assistants answering "does anywhere in Kyoto do Jain food".
 * Mirrors the visible FAQ section exactly, which Google requires.
 */
export function buildFaqJsonLd(lang: Lang) {
  const url = absoluteUrl(lang);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    inLanguage: lang === "ja" ? "ja-JP" : "en",
    mainEntity: RESTAURANT_DATA.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question[lang],
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer[lang],
      },
    })),
  };
}

/**
 * Serialises the whole graph for one locale.
 *
 * `<` is escaped: a stray `</script>` inside any data string would otherwise
 * close the tag early and turn the rest of the payload into live markup.
 */
function serialize(graph: unknown[]): string {
  return JSON.stringify(graph).replace(/</g, "\\u003c");
}

export function jsonLdFor(lang: Lang): string {
  return serialize([
    buildRestaurantJsonLd(lang),
    buildWebSiteJsonLd(),
    buildWebPageJsonLd(lang),
    buildFaqJsonLd(lang),
    // The home page renders the whole menu too (one category at a time), so
    // the Menu entity is accurate here as well as on `/menu`.
    buildMenuJsonLd(lang),
  ]);
}

/**
 * The graph for `/menu`. Same restaurant and website nodes — they're global —
 * with a page node describing this URL and the Menu it exists to publish.
 */
export function jsonLdForMenu(
  lang: Lang,
  page: { name: string; description: string }
): string {
  return serialize([
    buildRestaurantJsonLd(lang),
    buildWebSiteJsonLd(),
    buildWebPageJsonLd(lang, "menu", page),
    buildMenuJsonLd(lang),
  ]);
}
