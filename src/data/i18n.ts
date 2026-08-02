/**
 * Bilingual (English / Japanese) support.
 * `L` is a localized string pair — every user-facing string in the data
 * module and components resolves through it via `useLang().t`.
 */

export type Lang = "en" | "ja";

export interface L {
  en: string;
  ja: string;
}

export const LANGS: readonly Lang[] = ["en", "ja"];

/**
 * Each language has its own URL — English at `/`, Japanese at `/ja` — rather
 * than a client-side toggle over one page. A toggle leaves search engines with
 * a single English document, which costs the site every Japanese query
 * ("京都 インド料理" and friends) that its own neighbourhood searches with.
 * Two crawlable URLs, cross-linked with hreflang, are what get both indexed.
 */
export function langPath(lang: Lang): string {
  return lang === "ja" ? "/ja" : "/";
}

/** The language a pathname belongs to. Anything under `/ja` is Japanese. */
export function langFromPath(pathname: string): Lang {
  return pathname === "/ja" || pathname.startsWith("/ja/") ? "ja" : "en";
}

/** Shared UI strings used across multiple components. */
export const UI = {
  nav: {
    story: { en: "Our Story", ja: "私たちについて" },
    menu: { en: "Menu", ja: "メニュー" },
    gallery: { en: "Gallery", ja: "ギャラリー" },
    reviews: { en: "Reviews", ja: "口コミ" },
    visit: { en: "Visit Us", ja: "アクセス" },
    reserve: { en: "Reserve a Table", ja: "オンライン予約" },
    callNow: { en: "Call Now", ja: "電話する" },
    brandSub: { en: "Restaurant & Bar · Kyoto", ja: "レストラン＆バー・京都" },
  },
  hero: {
    // Sits inside the <h1>. The big brand name alone says nothing about what
    // we serve or where — this line is what makes the page's single most
    // important heading match how people search for us.
    h1Kicker: {
      en: "Indian Restaurant & Bar · Kyoto",
      ja: "インド料理レストラン · 京都 中京区",
    },
    openDaily: { en: "Open Daily", ja: "年中無休" },
    explore: { en: "Explore Our Menu", ja: "メニューを見る" },
    location: {
      en: "4F Hijikata Bldg. · Nakagyo Ward",
      ja: "ヒジカタビル4F・中京区",
    },
    payments: { en: "Cards & cash", ja: "カード・現金OK" },
    scrollLabel: { en: "Scroll to our story", ja: "ストーリーへスクロール" },
    daysLine: { en: "Monday - Sunday", ja: "月曜〜日曜" },
  },
  menu: {
    eyebrow: { en: "From Our Kitchen", ja: "キッチンから" },
    title: { en: "The Full Menu", ja: "フルメニュー" },
    description: {
      en: "Spices ground in-house, breads baked to order, and five spice levels — from mild to very hot.",
      ja: "自家製スパイス、焼きたてのパン、甘口から激辛まで5段階の辛さ。",
    },
    signatureLabel: { en: "Signature dishes", ja: "看板メニュー" },
    footerLine: {
      en: "Spice adjusted to taste · Jain & Halal on request",
      ja: "辛さ調整可・ジャイン／ハラール対応",
    },
    tabelogLink: { en: "Full menu on Tabelog", ja: "食べログでフルメニューを見る" },
    recommendedLabel: { en: "House recommendation", ja: "おすすめ" },
  },
  gallery: {
    eyebrow: { en: "From the Table", ja: "テーブルから" },
    title: { en: "A Feast for the Eyes First", ja: "まずは目でご馳走を" },
    scrollDescription: {
      en: "Keep scrolling — the table rolls past, dish by dish.",
      ja: "スクロールすると、料理が一皿ずつ流れていきます。",
    },
    swipeDescription: {
      en: "Real plates, shot at our own tables — swipe through.",
      ja: "店内で撮影した本物のお料理 — スワイプしてご覧ください。",
    },
    keepScrolling: { en: "Keep scrolling", ja: "スクロールを続ける" },
    allPhotos: { en: "See all photos on Tabelog", ja: "食べログで全ての写真を見る" },
    readReviews: { en: "Read reviews on Tabelog", ja: "食べログの口コミを読む" },
  },
  amenities: {
    eyebrow: { en: "Good to Know", ja: "ご利用について" },
    title: {
      en: "Come As You Are",
      ja: "どうぞ気軽にお越しください",
    },
    description: {
      en: "50 seats, free Wi-Fi, and Jain or Halal cooking whenever you ask.",
      ja: "50席、無料Wi-Fi、ジャイン・ハラール調理もご相談ください。",
    },
  },
  reviews: {
    eyebrow: { en: "Guest Stories", ja: "お客様の声" },
    title: {
      en: "What Our Guests Say",
      ja: "お客様の声",
    },
    description: {
      en: "From diners who made it up to the fourth floor.",
      ja: "4階まで足を運んでくださったお客様より。",
    },
  },
  faq: {
    eyebrow: { en: "Before You Come", ja: "ご来店の前に" },
    title: {
      en: "Questions We're Asked Most",
      ja: "よくいただくご質問",
    },
    description: {
      en: "Hours, dietary requests, payment, and how to find the fourth floor.",
      ja: "営業時間、食事制限のご相談、お支払い、4階への行き方について。",
    },
  },
  story: {
    eyebrow: { en: "Ambience & Heritage", ja: "雰囲気と伝統" },
    titleLead: { en: "A Hidden Gem Above the", ja: "京都の路地に佇む" },
    titleAccent: { en: "Lanes of Kyoto", ja: "隠れた名店" },
    body: {
      en: "Step inside and the city noise gives way to toasted cumin, simmering tomato gravy and fresh roti — an Indian family kitchen in the middle of Nakagyo Ward.",
      ja: "一歩入れば、街の喧騒はクミンの香ばしさ、煮込みトマトの香り、焼きたてロティに変わります。中京区にある、インドの家庭の台所です。",
    },
    chip4f: { en: "Hijikata Building", ja: "ヒジカタビル" },
  },
  visit: {
    eyebrow: { en: "Visit Us", ja: "アクセス" },
    title: { en: "Find Us in Nakagyo Ward", ja: "中京区でお待ちしています" },
    address: { en: "Address", ja: "住所" },
    hours: { en: "Opening Hours", ja: "営業時間" },
    reservations: { en: "Reservations", ja: "ご予約" },
    copyAddress: { en: "Copy Japanese address", ja: "日本語住所をコピー" },
    copied: { en: "Copied!", ja: "コピーしました！" },
    openMaps: { en: "Open in Google Maps", ja: "Googleマップで開く" },
    taxiTip: {
      en: "Copy the Japanese address to show your taxi driver.",
      ja: "日本語住所をコピーしてタクシーの運転手にご提示ください。",
    },
    bookOnline: { en: "Book online", ja: "オンライン予約" },
    tabelog: { en: "Tabelog", ja: "食べログ" },
    tabelogMenu: { en: "Menu on Tabelog", ja: "食べログのメニュー" },
    googleMaps: { en: "Google Maps", ja: "Googleマップ" },
    crafted: { en: "Crafted with warmth in Kyoto", ja: "京都より心を込めて" },
    builtBy: { en: "Website by", ja: "制作" },
  },
} as const;
