import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import FullMenu from "@/components/sections/FullMenu";
import { RESTAURANT_DATA } from "@/data/restaurantData";
import { alternatesFor } from "@/lib/seo";

const { metadata: brand } = RESTAURANT_DATA;

// "Menu" plus the cuisine and the city: the query is almost always
// "<restaurant> menu" or "indian restaurant kyoto menu", never the brand alone.
const TITLE = "Menu & Prices | Indian Restaurant in Kyoto | Mother India";
const DESCRIPTION =
  "Our full menu with prices — curries, tandoori, naan, biryani, vegetarian and paneer dishes, and the bar. Five spice levels, Jain and Halal on request. Kyoto, Nakagyo Ward.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "Mother India Kyoto menu",
    "Indian restaurant Kyoto menu",
    "Kyoto curry prices",
    "vegetarian Indian food Kyoto",
    "paneer Kyoto",
    "naan Kyoto",
    "biryani Kyoto",
  ],
  alternates: alternatesFor("en", "menu"),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/menu",
    locale: "en_US",
    alternateLocale: "ja_JP",
    siteName: brand.legalName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function MenuPage() {
  return (
    <>
      <JsonLd
        lang="en"
        page="menu"
        meta={{ name: TITLE, description: DESCRIPTION }}
      />
      <FullMenu />
    </>
  );
}
