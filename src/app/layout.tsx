import type { Metadata, Viewport } from "next";
import {
  Inter,
  Noto_Sans_JP,
  Noto_Serif_JP,
  Playfair_Display,
} from "next/font/google";

import { RESTAURANT_DATA } from "@/data/restaurantData";
import { GEO, SITE_URL } from "@/lib/seo";
import { LanguageProvider } from "@/components/LanguageProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollManager from "@/components/ScrollManager";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  display: "swap",
});

const notoSerifJp = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  display: "swap",
});

const { metadata: brand } = RESTAURANT_DATA;

// og:image / twitter:image come from `opengraph-image.jpg` and
// `twitter-image.jpg` in this folder — Next resolves their URL, dimensions
// and alt text (from the sibling `.alt.txt` files) automatically.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Leads with the search intent people actually type: cuisine + city.
    default: `${brand.brandName} — Indian Restaurant & Bar in Kyoto`,
    template: `%s | ${brand.brandName} Kyoto`,
  },
  description: brand.description.en,
  keywords: brand.seoKeywords,
  applicationName: brand.legalName,
  authors: [{ name: brand.legalName }],
  creator: brand.legalName,
  publisher: brand.legalName,
  // Canonical and hreflang are per-locale — each page sets its own. Declaring
  // them here would point every route at `/`.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: `${brand.brandName} — Indian Restaurant & Bar in Kyoto`,
    description: brand.description.en,
    url: SITE_URL,
    type: "website",
    locale: "en_US",
    alternateLocale: "ja_JP",
    siteName: brand.legalName,
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.brandName} — Indian Restaurant & Bar in Kyoto`,
    description: brand.description.en,
  },
  category: "restaurant",
  formatDetection: { telephone: true, address: true },
  // Coordinates as plain meta tags: still read by a number of local-search
  // and map crawlers that never parse JSON-LD.
  other: {
    "geo.region": "JP-26",
    "geo.placename": "Kyoto",
    "geo.position": `${GEO.latitude};${GEO.longitude}`,
    ICBM: `${GEO.latitude}, ${GEO.longitude}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#0F0F11",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  // Zoom stays available — never pinned to 1 — up to 5x.
  maximumScale: 5,
  userScalable: true,
  // Lets the layout paint edge to edge so `env(safe-area-inset-*)` reports
  // real values around the notch and home indicator.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${notoSansJp.variable} ${notoSerifJp.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-obsidian text-cream">
        {/* Rich-result markup is per-locale and lives in each page. */}
        <LanguageProvider>
          <ScrollManager />
          <Navbar />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
