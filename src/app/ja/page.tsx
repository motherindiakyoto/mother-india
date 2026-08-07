import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import SiteSections from "@/components/SiteSections";
import { RESTAURANT_DATA } from "@/data/restaurantData";
import { alternatesFor } from "@/lib/seo";

const { metadata: brand } = RESTAURANT_DATA;

/**
 * The Japanese page. Its own URL, its own server-rendered copy, its own title
 * and description — the queries this restaurant's own neighbourhood types
 * ("京都 インド料理", "中京区 カレー") can only be won by a document that is
 * actually written in Japanese.
 */
const TITLE = "京都のインド料理レストラン｜マザーインディア 中京区";
// Full-width characters cost roughly twice a Latin one, so the Japanese line is
// held to ~85 characters to stay inside the same rendered-width budget as the
// English description.
const DESCRIPTION =
  "京都・中京区、ヒジカタビル4Fのインド料理レストラン＆バー。注文後に仕込むカレーとタンドール窯のナン。ベジタリアン・ジャイン・ハラール対応。年中無休11:00〜23:00。";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "京都 インド料理",
    "京都 カレー",
    "中京区 インド料理",
    "京都 ナン",
    "京都 ハラール",
    "京都 ベジタリアン レストラン",
    "京都 ビリヤニ",
    "河原町 インド料理",
    "マザーインディア 京都",
  ],
  alternates: alternatesFor("ja"),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/ja",
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

export default function JapanesePage() {
  return (
    <>
      <JsonLd lang="ja" />
      <SiteSections />
    </>
  );
}
