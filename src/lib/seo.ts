import { RESTAURANT_DATA } from "@/data/restaurantData";

/**
 * Canonical origin for the site. Every absolute URL in metadata, the sitemap,
 * robots.txt and the structured data derives from this one value.
 *
 * Order matters. A hardcoded origin that doesn't resolve breaks link previews
 * everywhere — WhatsApp, iMessage, X and Facebook fetch `og:image` as an
 * absolute URL, so a dead host renders an empty card. Resolution order:
 *
 *  1. `NEXT_PUBLIC_SITE_URL` — set this once the real domain is live.
 *  2. The Vercel production domain, so deployments are always self-consistent.
 *  3. localhost for `next dev`.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

/**
 * schema.org/Restaurant payload for the JSON-LD block in the root layout.
 *
 * This is what earns the rich result in Google Search and Maps — opening
 * hours, address, phone, cuisine, price range and reservation support all
 * come from `RESTAURANT_DATA` so the markup can never drift from the page.
 */
export function buildRestaurantJsonLd() {
  const { metadata, contact, paymentMethods } = RESTAURANT_DATA;

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}/#restaurant`,
    name: metadata.legalName,
    alternateName: `${metadata.brandName} Kyoto`,
    url: SITE_URL,
    description: metadata.description.en,
    image: [
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
    servesCuisine: ["Indian", "Nepalese", "Asian"],
    menu: `${SITE_URL}/#menu`,
    hasMenu: `${SITE_URL}/#menu`,
    // Most mains land between ¥390 and ¥2,500 — "¥¥" in Google's banding.
    priceRange: "¥¥",
    currenciesAccepted: "JPY",
    paymentAccepted: paymentMethods.modes.map((mode) => mode.en).join(", "),
    acceptsReservations: true,
    smokingAllowed: false,
    publicAccess: true,
    isAccessibleForFree: false,
    sameAs: [metadata.gMapsLink, metadata.tabelogUrl],
    // Vegetarian, vegan-adaptable and Jain preparations are a core draw.
    hasMenuSection: RESTAURANT_DATA.fullMenu.sections.map((section) => ({
      "@type": "MenuSection",
      name: section.name.en,
      hasMenuItem: section.items.slice(0, 12).map((item) => ({
        "@type": "MenuItem",
        name: item.name.en,
        ...(item.description ? { description: item.description.en } : {}),
        ...(item.price ? { offers: { "@type": "Offer", price: item.price, priceCurrency: "JPY" } } : {}),
      })),
    })),
  };
}

/** schema.org/WebSite — enables the sitelinks search box and name disambiguation. */
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
