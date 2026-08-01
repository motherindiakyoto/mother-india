import { RESTAURANT_DATA } from "@/data/restaurantData";

/**
 * Canonical origin for the site. Every absolute URL in metadata, the sitemap,
 * robots.txt and the structured data derives from this one value — change it
 * here and nowhere else.
 */
export const SITE_URL = "https://motherindiakyoto.com";

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
