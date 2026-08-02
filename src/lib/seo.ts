import { RESTAURANT_DATA } from "@/data/restaurantData";
import { langPath, type Lang } from "@/data/i18n";
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

/** Absolute URL for a locale's page — what canonical and hreflang both need. */
export function absoluteUrl(lang: Lang): string {
  return lang === "ja" ? `${SITE_URL}/ja` : SITE_URL;
}

/**
 * `alternates` for a page's metadata: a self-referencing canonical plus the
 * hreflang cluster. Both locales must list *both* URLs and agree with each
 * other, or Google discards the annotations and picks a winner itself. The
 * same three entries are repeated in `sitemap.ts` — page-level and
 * sitemap-level hreflang have to match exactly or they're read as conflicting.
 */
export const HREFLANG = {
  en: "/",
  ja: "/ja",
  "x-default": "/",
} as const;

export function alternatesFor(lang: Lang) {
  return {
    canonical: langPath(lang),
    languages: HREFLANG,
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
    menu: `${url}#menu`,
    hasMenu: `${url}#menu`,
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
        target: `${url}#menu`,
        name: "View the menu",
      },
    ],
    sameAs: [metadata.gMapsLink, metadata.tabelogUrl],
    hasMenuSection: RESTAURANT_DATA.fullMenu.sections.map((section) => ({
      "@type": "MenuSection",
      name: section.name[lang],
      hasMenuItem: section.items.slice(0, 12).map((item) => {
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
    subjectOf: { "@id": `${url}#faq` },
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
export function buildWebPageJsonLd(lang: Lang) {
  const { metadata } = RESTAURANT_DATA;
  const url = absoluteUrl(lang);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: metadata.legalName,
    description: metadata.description[lang],
    inLanguage: lang === "ja" ? "ja-JP" : "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#restaurant` },
    primaryImageOfPage: `${SITE_URL}/opengraph-image.jpg`,
    ...(lang === "ja"
      ? { translationOfWork: { "@id": `${SITE_URL}#webpage` } }
      : { workTranslation: { "@id": `${SITE_URL}/ja#webpage` } }),
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
export function jsonLdFor(lang: Lang): string {
  return JSON.stringify([
    buildRestaurantJsonLd(lang),
    buildWebSiteJsonLd(),
    buildWebPageJsonLd(lang),
    buildFaqJsonLd(lang),
  ]).replace(/</g, "\\u003c");
}
