import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import SiteSections from "@/components/SiteSections";
import { RESTAURANT_DATA } from "@/data/restaurantData";
import { alternatesFor } from "@/lib/seo";

const { metadata: brand } = RESTAURANT_DATA;

// Leads with the phrase people actually search — cuisine and city — rather
// than the brand name, which only the people who already know us type.
const TITLE = "Indian Restaurant & Bar in Kyoto | Mother India";
// Kept under ~950px rendered so Google shows the whole line instead of
// truncating it mid-sentence — the 1000px ceiling is the practical limit.
const DESCRIPTION =
  "Curries cooked to order and naan from the tandoor, four floors above Nakagyo Ward, Kyoto. Vegetarian, Jain and Halal on request. Open daily 11:00–23:00.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: alternatesFor("en"),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
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

export default function Home() {
  return (
    <>
      <JsonLd lang="en" />
      <SiteSections />
    </>
  );
}
