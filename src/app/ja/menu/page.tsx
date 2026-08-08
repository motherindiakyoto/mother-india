import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import FullMenu from "@/components/sections/FullMenu";
import { RESTAURANT_DATA } from "@/data/restaurantData";
import { alternatesFor } from "@/lib/seo";

const { metadata: brand } = RESTAURANT_DATA;

const TITLE = "メニュー・価格一覧｜京都のインド料理 マザーインディア";
// Held to ~85 full-width characters, the same rendered-width budget the
// English description works to.
const DESCRIPTION =
  "京都・中京区のインド料理レストラン マザーインディアの全メニューと価格。カレー、タンドール料理、ナン、ビリヤニ、ベジタリアン・パニール料理、バーまで。辛さ5段階、ジャイン・ハラール対応。";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "マザーインディア 京都 メニュー",
    "京都 インド料理 メニュー",
    "京都 カレー 値段",
    "京都 ベジタリアン カレー",
    "京都 パニール",
    "京都 ナン",
    "京都 ビリヤニ",
  ],
  alternates: alternatesFor("ja", "menu"),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/ja/menu",
    locale: "ja_JP",
    alternateLocale: "en_US",
    siteName: brand.legalName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function JapaneseMenuPage() {
  return (
    <>
      <JsonLd
        lang="ja"
        page="menu"
        meta={{ name: TITLE, description: DESCRIPTION }}
      />
      <FullMenu />
    </>
  );
}
