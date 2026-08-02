/**
 * Central data module for MOTHER INDIA RESTAURANT & BAR, Kyoto.
 * All page copy, menu content, contact details, and testimonials live here
 * so components stay purely presentational.
 *
 * Menu items, prices and Japanese names are transcribed from photographs of
 * the restaurant's own printed menu (see `Mother India menu/` in the repo
 * root) — not from third-party listings.
 *
 * Two printed pages were not photographed: the vegetarian/paneer curries
 * (menu nos. 97–112) and the snacks & momo page (nos. 51–70). They are
 * deliberately absent here rather than carried over at unverified prices.
 *
 * Every user-facing string is a localized `L` pair ({ en, ja }) resolved
 * through `useLang().t` at render time.
 */

import type { L } from "@/data/i18n";

export type AmenityIcon =
  | "Utensils"
  | "ShoppingBag"
  | "CalendarCheck"
  | "Leaf"
  | "Heart"
  | "Wifi"
  | "Smile"
  | "Car";

export interface PricedItem {
  name: L;
  /** Display-ready price, e.g. "¥1,050". Omitted when included with sets / variable. */
  price?: string;
  description?: L;
  /** Marked as an official house recommendation on the printed menu. */
  recommended?: boolean;
  /** Local photo path under /public when real photography exists for this item. */
  photo?: string;
}

export interface FullMenuSection {
  id: string;
  name: L;
  /** Optional feature image shown beside the section's list. */
  image?: { src: string; alt: string; caption: L };
  items: PricedItem[];
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption: L;
  /** Card sizing hint: "lg" = widest, "wide" = medium, "sm" = compact. */
  size: "lg" | "wide" | "sm";
}

export interface Testimonial {
  quote: L;
  author: L;
  rating: number;
  context: L;
}

export interface Amenity {
  label: L;
  available: boolean;
  icon: AmenityIcon;
}

export interface ScheduleEntry {
  days: L;
  time: string;
}

/**
 * A question guests actually ask, with an answer taken only from the facts
 * already on this page — hours, floor, payment, spice, dietary handling.
 * Rendered as visible copy *and* as `FAQPage` structured data, which is what
 * search engines and assistants quote back for "is there Jain food in Kyoto"
 * style questions. Never add an entry here that the page can't back up.
 */
export interface FaqItem {
  question: L;
  answer: L;
}

export interface RestaurantData {
  metadata: {
    brandName: string;
    subTitle: string;
    legalName: string;
    tagline: L;
    description: L;
    seoKeywords: string[];
    gMapsLink: string;
    gMapsEmbedUrl: string;
    tabelogUrl: string;
    tabelogMenuUrl: string;
    tabelogPhotosUrl: string;
    heroImage: { src: string; alt: string };
  };
  contact: {
    phone: { display: string; dial: string };
    address: { english: string; japanese: string; accessHint: L };
    hours: { schedule: ScheduleEntry[]; note: L };
  };
  amenities: Amenity[];
  paymentMethods: {
    modes: L[];
    note: L;
    /** Compact brand list for the hero strip — no trailing sentence. */
    cardBrands: L;
  };
  fullMenu: {
    sections: FullMenuSection[];
  };
  gallery: GalleryImage[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
}

export const RESTAURANT_DATA: RestaurantData = {
  metadata: {
    brandName: "Mother India",
    subTitle: "Restaurant & Bar Kyoto",
    legalName: "MOTHER INDIA RESTAURANT & BAR",
    tagline: {
      en: "Indian cooking, four floors above Kyoto",
      ja: "京都のビル4階、インドの味",
    },
    description: {
      en: "Curries cooked to order, breads straight from the tandoor, and a full bar — with Jain and vegetarian dishes prepared with real care.",
      ja: "注文を受けてから仕込むカレー、タンドール窯の焼きたてパン、そしてフルバー。ジャイン・ベジタリアン料理も丁寧にお作りします。",
    },
    seoKeywords: [
      "Indian restaurant Kyoto",
      "Jain food Kyoto",
      "Vegetarian restaurant Kyoto",
      "Halal food Kyoto",
      "Best curry Kyoto",
      "Nakagyo Ward dining",
      "Cheese naan Kyoto",
      "Biryani Kyoto",
      "京都 インド料理",
      "京都 カレー",
    ],
    gMapsLink: "https://maps.app.goo.gl/hy4edM9sEvyLiDe9A",
    gMapsEmbedUrl:
      "https://www.google.com/maps?q=MOTHER+INDIA+RESTAURANT+%26+BAR,+435-2+Ebisucho,+Nakagyo+Ward,+Kyoto,+604-8005&output=embed",
    tabelogUrl: "https://tabelog.com/en/kyoto/A2601/A260202/26043494/",
    tabelogMenuUrl:
      "https://tabelog.com/en/kyoto/A2601/A260202/26043494/dtlmenu/",
    tabelogPhotosUrl:
      "https://tabelog.com/en/kyoto/A2601/A260202/26043494/dtlphotolst/",
    heroImage: {
      src: "/chair-landing.jpg",
      alt: "Mother India's bright dining room with chandelier, booth seating and large windows over Nakagyo Ward",
    },
  },

  contact: {
    phone: {
      display: "+81 75-211-5131",
      dial: "tel:+81752115131",
    },
    address: {
      english:
        "Hijikata Bldg. 4th Floor, 435-2 Ebisuchō, Nakagyo Ward, Kyoto, 604-8005, Japan",
      japanese: "〒604-8005 京都府京都市中京区恵比須町435-2 ヒジカタビル 4F",
      accessHint: {
        en: "We're on the 4th floor — take the lift. Look for our signboard at street level.",
        ja: "ビルの4階です（エレベーターあり）。通り沿いの看板が目印です。",
      },
    },
    hours: {
      schedule: [
        {
          days: { en: "Monday - Sunday", ja: "月曜〜日曜" },
          time: "11:00 AM – 11:00 PM",
        },
      ],
      note: {
        en: "Open every day, lunch through late dinner.",
        ja: "年中無休。ランチから夜遅くまで営業。",
      },
    },
  },

  amenities: [
    {
      label: { en: "Dine In", ja: "店内でのお食事" },
      available: true,
      icon: "Utensils",
    },
    {
      label: { en: "Takeout", ja: "テイクアウト" },
      available: true,
      icon: "ShoppingBag",
    },
    {
      label: { en: "Reservations", ja: "ご予約" },
      available: true,
      icon: "CalendarCheck",
    },
    {
      label: { en: "Vegetarian Dishes", ja: "ベジタリアン対応" },
      available: true,
      icon: "Leaf",
    },
    {
      label: { en: "Jain & Halal", ja: "ジャイン・ハラール対応" },
      available: true,
      icon: "Heart",
    },
    {
      label: { en: "Free Wi-Fi", ja: "無料Wi-Fi" },
      available: true,
      icon: "Wifi",
    },
    {
      label: { en: "Kids Welcome", ja: "お子様連れ歓迎" },
      available: true,
      icon: "Smile",
    },
    {
      label: { en: "Parking Nearby", ja: "近隣に駐車場" },
      available: true,
      icon: "Car",
    },
  ],

  paymentMethods: {
    modes: [
      { en: "Credit Cards", ja: "クレジットカード" },
      { en: "Debit Cards", ja: "デビットカード" },
      { en: "Cash", ja: "現金" },
    ],
    note: {
      en: "Visa, Mastercard, JCB, Amex, Diners and Discover accepted.",
      ja: "VISA・Mastercard・JCB・AMEX・Diners・Discover がご利用いただけます。",
    },
    cardBrands: {
      en: "Visa · Mastercard · JCB · Amex · Diners · Discover",
      ja: "VISA・Mastercard・JCB・AMEX・Diners・Discover",
    },
  },

  fullMenu: {
    sections: [
      {
        id: "sets",
        name: { en: "Dinner Sets", ja: "ディナーセット" },
        image: {
          src: "/images/menu/cheese-naan-set.jpg",
          alt: "Cheese nan set with curry, rice, salad, chicken tikka and a drink on a steel thali",
          caption: {
            en: "Cheese Nan Set",
            ja: "チーズナンセット",
          },
        },
        items: [
          {
            name: { en: "A Set", ja: "Aセット" },
            price: "¥1,450",
            photo: "/images/menu/dinner-set-thali.jpg",
            description: {
              en: "Curry (1 choice) · chicken tikka (1p) · plain nan · rice · salad · drink",
              ja: "カレー1チョイス・チキンティッカ(1p)・プレーンナン・ライス・サラダ・ドリンク",
            },
          },
          {
            name: { en: "Cheese Nan Set", ja: "チーズナンセット" },
            price: "¥1,750",
            photo: "/images/menu/cheese-naan-set.jpg",
            description: {
              en: "Curry (1 choice) · chicken tikka (1p) · cheese nan · rice · salad · drink",
              ja: "カレー1チョイス・チキンティッカ(1p)・チーズナン・ライス・サラダ・ドリンク",
            },
          },
          {
            name: { en: "MOTHER INDIA Set", ja: "マザーインディアセット" },
            price: "¥2,350",
            photo: "/images/menu/two-curry-thali.jpg",
            recommended: true,
            description: {
              en: "Curry (2 choices) · tandoori chicken (1p) · seekh kebab (1p) · plain nan · rice · salad · dessert · drink (draft beer OK)",
              ja: "カレー2チョイス・タンドリーチキン(1p)・シークカバブ(1p)・プレーンナン・ライス・サラダ・デザート・ドリンク（生ビールOK）",
            },
          },
          {
            name: { en: "Child Set", ja: "お子様セット" },
            price: "¥900",
            description: {
              en: "Mild butter chicken curry · plain nan · potato fries · salad · dessert · drink",
              ja: "マイルドバターチキンカレー・プレーンナン・ポテトフライ・サラダ・デザート・ドリンク",
            },
          },
          {
            name: { en: "Biryani Set", ja: "ビリヤニセット" },
            price: "¥2,250 / ¥2,350",
            photo: "/images/menu/biryani-raita.jpg",
            description: {
              en: "Chicken ¥2,250 · mutton ¥2,350 — biryani, mini curry (1 choice), raita, salad, chutney, onion slices. Add a drink +¥100",
              ja: "チキン¥2,250／マトン¥2,350 — ビリヤニ、ミニカレー1チョイス、ライタ、サラダ、チャツネ、オニオンスライス。ドリンク＋¥100",
            },
          },
          {
            name: { en: "Lady's Set", ja: "レディースセット" },
            price: "¥1,900",
            description: {
              en: "Curry (2 choices) · seekh kebab or malai tikka (1p) · plain nan · rice · salad · dessert · drink",
              ja: "カレー2チョイス・シークカバブ または マライティッカ(1p)・プレーンナン・ライス・サラダ・デザート・ドリンク",
            },
          },
          {
            name: { en: "Jen's Set", ja: "ジェンズセット" },
            price: "¥2,100",
            description: {
              en: "Curry (2 choices) · chicken tikka (1p) · plain nan · rice · salad · dessert · drink (draft beer OK)",
              ja: "カレー2チョイス・チキンティッカ(1p)・プレーンナン・ライス・サラダ・デザート・ドリンク（生ビールOK）",
            },
          },
          {
            name: { en: "Beer Set", ja: "ビールセット" },
            price: "¥2,050",
            description: {
              en: "Mini curry (1 choice) · mini plain nan · tandoori chicken (full) · salad · draft beer",
              ja: "ミニカレー1チョイス・ミニプレーンナン・タンドリーチキン（フル）・サラダ・生ビール",
            },
          },
          {
            name: { en: "Curry Beer Set", ja: "カレービールセット" },
            price: "¥1,850",
            description: {
              en: "Curry (1 choice) · plain nan · chicken tikka (1p) · salad · draft beer",
              ja: "カレー1チョイス・プレーンナン・チキンティッカ(1p)・サラダ・生ビール",
            },
          },
          {
            name: { en: "Student Set", ja: "学生セット" },
            price: "¥1,550",
            photo: "/images/menu/set-salad-drink.jpg",
            description: {
              en: "Curry (1 choice) · nan (honey / cheese / sesame / garlic) · chicken tikka (1p) · salad · drink. Student ID required",
              ja: "カレー1チョイス・ナン1チョイス（ハニー／チーズ／ゴマ／ガーリック）・チキンティッカ(1p)・サラダ・ドリンク。学生証をご提示ください",
            },
          },
        ],
      },
      {
        id: "curry",
        name: { en: "Curry", ja: "カレー" },
        image: {
          src: "/images/menu/naan-thali.jpg",
          alt: "Fresh nan with curry, chicken tikka and rice on a steel thali",
          caption: {
            en: "Curry with nan, rice and papad",
            ja: "カレー、ナン、ライス、パパド",
          },
        },
        items: [
          {
            name: { en: "Chicken Curry", ja: "チキンカレー" },
            price: "¥1,050",
          },
          {
            name: { en: "Chicken Masala", ja: "チキンマサラ" },
            price: "¥1,100",
          },
          {
            name: { en: "Butter Chicken", ja: "バターチキン" },
            price: "¥1,200",
            recommended: true,
          },
          {
            name: { en: "Sag Chicken Curry", ja: "ほうれん草チキン" },
            price: "¥1,100",
            description: {
              en: "With spinach",
              ja: "ほうれん草仕立て",
            },
          },
          {
            name: {
              en: "Chicken Tikka Butter Masala",
              ja: "チキンティッカ バターマサラ",
            },
            price: "¥1,200",
          },
          {
            name: { en: "Keema Curry", ja: "キーマカレー" },
            price: "¥1,050",
            description: {
              en: "Minced meat",
              ja: "挽肉のカレー",
            },
          },
          {
            name: { en: "Keema Egg Curry", ja: "キーマエッグカレー" },
            price: "¥1,090",
            description: {
              en: "Keema with boiled egg",
              ja: "ゆで卵入り",
            },
          },
          {
            name: { en: "Kadai Chicken Curry", ja: "カダイチキンカレー" },
            price: "¥1,450",
            description: {
              en: "With onion & bell pepper",
              ja: "玉ねぎ・ピーマン入り",
            },
          },
          {
            name: { en: "Chicken Cheese Curry", ja: "チキンチーズカレー" },
            price: "¥1,200",
          },
          {
            name: { en: "Green Curry (Thai)", ja: "グリーンカレー" },
            price: "¥1,350",
            recommended: true,
            description: {
              en: "Coconut milk and Thai chili — rice included",
              ja: "ココナッツミルクとタイの唐辛子。ライス付き",
            },
          },
          {
            name: { en: "Mutton Curry", ja: "マトンカレー" },
            price: "¥1,150",
          },
          {
            name: { en: "Mutton Masala", ja: "マトンマサラ" },
            price: "¥1,250",
          },
          {
            name: { en: "Sag Mutton Curry", ja: "ほうれん草マトン" },
            price: "¥1,250",
          },
          {
            name: { en: "Kadai Mutton Curry", ja: "カダイマトンカレー" },
            price: "¥1,350",
            description: {
              en: "With onion & bell pepper",
              ja: "玉ねぎ・ピーマン入り",
            },
          },
        ],
      },
      {
        id: "tandoori",
        name: { en: "Tandoori", ja: "タンドーリ" },
        image: {
          src: "/images/menu/naan-curry-set.jpg",
          alt: "Tandoori chicken pieces beside nan, curry, rice and papad on a thali",
          caption: {
            en: "Tandoori chicken, off the skewer",
            ja: "タンドリーチキン",
          },
        },
        items: [
          {
            name: { en: "Tandoori Chicken", ja: "タンドリーチキン" },
            price: "Half ¥700 · Full ¥1,300",
            recommended: true,
          },
          {
            name: { en: "Seekh Kebab", ja: "シシカバブ" },
            price: "2p ¥600 · 4p ¥1,150",
          },
          {
            name: { en: "Malai Tikka", ja: "マライティッカ" },
            price: "2p ¥550 · 4p ¥1,050",
          },
          {
            name: { en: "Chicken Tikka", ja: "チキンティッカ" },
            price: "2p ¥550 · 4p ¥1,050",
          },
          {
            name: { en: "Garlic Tikka", ja: "ガーリックティッカ" },
            price: "2p ¥600 · 4p ¥1,100",
          },
          {
            name: { en: "Tandoori Tebamoto", ja: "タンドリー手羽元" },
            price: "5p ¥800",
          },
          {
            name: { en: "Tandoori Prawn", ja: "タンドリー海老" },
            price: "4p ¥1,400",
          },
          {
            name: { en: "Fish Tikka", ja: "フィッシュティッカ" },
            price: "2p ¥700 · 4p ¥1,350",
          },
          {
            name: { en: "Paneer Tikka", ja: "パニールティッカ" },
            price: "4p ¥1,290",
          },
          {
            name: { en: "Mutton Chop", ja: "マトンチョップ" },
            price: "4p ¥1,790",
          },
          {
            name: { en: "Mushroom Tikka", ja: "マッシュルームティッカ" },
            price: "¥900",
          },
          {
            name: { en: "Mix Tandoori Grill", ja: "ミックス タンドリー グリル" },
            price: "¥2,500",
            description: {
              en: "Malai and paneer tikka, tandoori chicken, seekh kebab, tandoori prawn and fish tikka on one platter",
              ja: "マライ・パニールティッカ、タンドリーチキン、シークカバブ、タンドリー海老、フィッシュティッカの盛り合わせ",
            },
          },
        ],
      },
      {
        id: "nan",
        name: { en: "Nan", ja: "ナン" },
        image: {
          src: "/images/menu/cheese-naan.jpg",
          alt: "Cheese nan slices pulling apart with molten cheese",
          caption: {
            en: "Cheese nan",
            ja: "チーズナン",
          },
        },
        items: [
          {
            name: { en: "Plain Nan", ja: "プレーンナン" },
            price: "¥390",
          },
          {
            name: { en: "Butter Nan", ja: "バターナン" },
            price: "¥490",
          },
          {
            name: { en: "Cheese Nan", ja: "チーズナン" },
            price: "¥650",
            recommended: true,
            photo: "/images/menu/cheese-naan.jpg",
          },
          {
            name: { en: "Masala Kulcha", ja: "マサラクルチャ" },
            price: "¥650",
          },
          {
            name: { en: "Garlic Nan", ja: "ガーリックナン" },
            price: "¥470",
          },
          {
            name: { en: "Sesame Nan", ja: "ゴマナン" },
            price: "¥470",
          },
          {
            name: { en: "Honey Nan", ja: "ハニーナン" },
            price: "¥490",
          },
          {
            name: { en: "Basil Nan", ja: "バジルナン" },
            price: "¥490",
          },
          {
            name: { en: "Honey Cheese Nan", ja: "ハニーチーズナン" },
            price: "¥700",
          },
          {
            name: { en: "Coconut Nan", ja: "ココナッツナン" },
            price: "¥700",
          },
          {
            name: { en: "Chocolate Nan", ja: "チョコナン" },
            price: "¥750",
          },
          {
            name: { en: "Sweet Red Bean Nan", ja: "あんこナン" },
            price: "¥750",
          },
          {
            name: { en: "Roti", ja: "ロティ" },
            price: "¥200",
            description: {
              en: "Whole wheat flatbread",
              ja: "インドの全粒粉フラットブレッド",
            },
          },
          {
            name: { en: "Paratha", ja: "プランタ" },
            price: "¥350",
            description: {
              en: "Layered and flaky",
              ja: "サクサクの層仕立て",
            },
          },
        ],
      },
      {
        id: "rice",
        name: { en: "Rice & Biryani", ja: "ライス＆ビリヤニ" },
        image: {
          src: "/images/menu/biryani-raita.jpg",
          alt: "Biryani topped with egg, almonds and red onion beside a bowl of raita",
          caption: {
            en: "Biryani with raita",
            ja: "ビリヤニ、ライタ添え",
          },
        },
        items: [
          {
            name: { en: "Rice", ja: "ライス" },
            price: "¥400",
          },
          {
            name: { en: "Basmati Rice", ja: "バスマティライス" },
            price: "¥600",
          },
          {
            name: { en: "Saffron Rice", ja: "サフランライス" },
            price: "¥825",
          },
          {
            name: { en: "Garlic Rice", ja: "ガーリックライス" },
            price: "¥780",
          },
          {
            name: { en: "Egg Fried Rice", ja: "エッグフライドライス" },
            price: "¥850",
          },
          {
            name: { en: "Gapao Rice", ja: "ガパオライス" },
            price: "¥1,200",
            description: {
              en: "Thai-style rice with minced chicken and basil",
              ja: "鶏挽肉とバジルのタイ風ライス",
            },
          },
          {
            name: { en: "Chicken Biryani", ja: "チキンビリヤニ" },
            price: "¥1,350",
            recommended: true,
            photo: "/images/menu/biryani-platter.jpg",
            description: {
              en: "Served with raita",
              ja: "ライタ添え",
            },
          },
          {
            name: { en: "Mutton Biryani", ja: "マトンビリヤニ" },
            price: "¥1,450",
            description: {
              en: "Served with raita",
              ja: "ライタ添え",
            },
          },
          {
            name: { en: "Prawn Biryani", ja: "海老ビリヤニ" },
            price: "¥1,550",
            description: {
              en: "Served with raita",
              ja: "ライタ添え",
            },
          },
          {
            name: { en: "Prawn Fried Rice", ja: "海老チャーハン" },
            price: "¥1,250",
          },
          {
            name: { en: "Vegetable Fried Rice", ja: "ベジタブル フライドライス" },
            price: "¥1,100",
            description: {
              en: "With assorted vegetables · basmati +¥100",
              ja: "彩り野菜たっぷり・バスマティ変更＋¥100",
            },
          },
          {
            name: { en: "Chicken Fried Rice", ja: "チキン フライドライス" },
            price: "¥1,200",
            description: {
              en: "With chicken · basmati +¥100",
              ja: "チキン入り・バスマティ変更＋¥100",
            },
          },
          {
            name: { en: "Seafood Fried Rice", ja: "シーフード フライドライス" },
            price: "¥1,100",
            description: {
              en: "With assorted seafood · basmati +¥100",
              ja: "海の幸たっぷり・バスマティ変更＋¥100",
            },
          },
        ],
      },
      {
        id: "street-food",
        name: { en: "Street Food", ja: "屋台料理" },
        items: [
          {
            name: { en: "Pani Puri (8 pcs)", ja: "パニプリ（8個）" },
            price: "¥950",
            recommended: true,
            description: {
              en: "Crispy puri filled with spicy potato and chickpeas, served with tangy pani",
              ja: "スパイシーなポテトとひよこ豆を詰めたパリパリのプリを、酸味のあるパニと一緒に",
            },
          },
          {
            name: { en: "Chatpate", ja: "チャトパテ" },
            price: "¥950",
            description: {
              en: "Puffed rice with fresh vegetables, peanuts, spices and our special sauce",
              ja: "パフライスに野菜、ピーナッツ、スパイス、特製ソースを和えて",
            },
          },
          {
            name: { en: "Bhatmas Sadheko (Soyabin)", ja: "バトマス・サデコ" },
            price: "¥950",
            description: {
              en: "Soybeans tossed with onion, tomato, herbs, spices and lemon",
              ja: "大豆を玉ねぎ、トマト、ハーブ、スパイス、レモンで和えて",
            },
          },
        ],
      },
      {
        id: "soup-snacks",
        name: { en: "Soup & Snacks", ja: "スープ＆おつまみ" },
        items: [
          {
            name: { en: "Tomato Soup", ja: "トマトスープ" },
            price: "¥600",
          },
          {
            name: { en: "Chicken Soup", ja: "チキンスープ" },
            price: "¥600",
            recommended: true,
          },
          {
            name: { en: "Vegetable Soup", ja: "ベジタブルスープ" },
            price: "¥550",
          },
          {
            name: { en: "Corn Soup", ja: "コーンスープ" },
            price: "¥600",
          },
          {
            name: { en: "Mushroom Soup", ja: "マッシュルームスープ" },
            price: "¥600",
          },
          {
            name: { en: "Tom Yum Kung Soup", ja: "トムヤムクンスープ" },
            price: "¥750",
            description: {
              en: "Thai hot-and-sour soup with shrimp and herbs",
              ja: "海老とハーブのタイ風酸辛スープ",
            },
          },
          {
            name: { en: "Edamame", ja: "枝豆" },
            price: "¥500",
          },
          {
            name: { en: "Garlic Stir-fried Edamame", ja: "枝豆ガーリック炒め" },
            price: "¥450",
          },
          {
            name: { en: "Chicken Chili", ja: "チキンチリ" },
            price: "¥1,050",
          },
          {
            name: { en: "Prawn Chili", ja: "海老チリ" },
            price: "¥1,150",
          },
        ],
      },
      {
        id: "salad",
        name: { en: "Salad", ja: "サラダ" },
        image: {
          src: "/images/menu/fresh-salad.jpg",
          alt: "Garden salad with dressing, corn and cucumber",
          caption: {
            en: "Fresh green salad",
            ja: "グリーンサラダ",
          },
        },
        items: [
          {
            name: { en: "Green Salad", ja: "グリーンサラダ" },
            price: "¥500",
            photo: "/images/menu/fresh-salad.jpg",
          },
          {
            name: { en: "Chicken Salad", ja: "チキンサラダ" },
            price: "¥650",
            recommended: true,
            description: {
              en: "With tandoori chicken",
              ja: "タンドリーチキンのせ",
            },
          },
          {
            name: { en: "Kuchumbar Salad", ja: "クチュンバーサラダ" },
            price: "¥650",
            description: {
              en: "Spicy diced cucumber, tomato, carrot and onion",
              ja: "きゅうり、トマト、人参、玉ねぎのスパイシーサラダ",
            },
          },
          {
            name: { en: "Chana Salad", ja: "チャナサラダ" },
            price: "¥700",
            description: {
              en: "With chickpeas",
              ja: "ひよこ豆入り",
            },
          },
          {
            name: { en: "Asian Salad", ja: "アジアンサラダ" },
            price: "¥750",
            description: {
              en: "With tuna",
              ja: "ツナ入り",
            },
          },
          {
            name: { en: "Seafood Salad", ja: "シーフードサラダ" },
            price: "¥750",
          },
          {
            name: { en: "Avocado Salad", ja: "アボカドサラダ" },
            price: "¥850",
          },
          {
            name: { en: "Indian Green Salad", ja: "インディアン グリーンサラダ" },
            price: "¥850",
          },
          {
            name: { en: "Peanut Salad", ja: "ピーナッツサラダ" },
            price: "¥500",
          },
          {
            name: { en: "Tomato Salad", ja: "トマトサラダ" },
            price: "¥500",
          },
          {
            name: { en: "Sliced Red Onion Salad", ja: "スライスレッド オニオンサラダ" },
            price: "¥450",
          },
        ],
      },
      {
        id: "sweets",
        name: { en: "Dessert & Smoothies", ja: "デザート＆スムージー" },
        image: {
          src: "/images/menu/banana-lassi.jpg",
          alt: "Thick banana smoothie in a tall glass",
          caption: {
            en: "Banana smoothie, blended fresh",
            ja: "バナナスムージー",
          },
        },
        items: [
          {
            name: { en: "Ice Cream", ja: "アイスクリーム" },
            price: "¥300",
          },
          {
            name: { en: "Cassis Ice Cream", ja: "カシスアイスクリーム" },
            price: "¥300",
          },
          {
            name: { en: "Gulab Jamun", ja: "グラブジャムン" },
            price: "¥500",
            description: {
              en: "Warm milk dumplings in sweet syrup",
              ja: "シロップに浸した温かいミルク団子",
            },
          },
          {
            name: { en: "Rasgulla", ja: "ラスグッラ" },
            price: "¥500",
            description: {
              en: "Soft cheese dumplings in light syrup",
              ja: "軽いシロップのふんわりチーズ団子",
            },
          },
          {
            name: { en: "Banana Smoothie", ja: "バナナ スムージー" },
            price: "¥700",
            recommended: true,
            photo: "/images/menu/banana-lassi.jpg",
          },
          {
            name: { en: "Apple Smoothie", ja: "アップル スムージー" },
            price: "¥750",
          },
          {
            name: { en: "Mix Berry Smoothie", ja: "ミックスベリースムージー" },
            price: "¥750",
          },
          {
            name: {
              en: "Green Vegetable Smoothie",
              ja: "グリーンベジタブルスムージー",
            },
            price: "¥750",
          },
          {
            name: { en: "Pineapple Smoothie", ja: "パイナップルスムージー" },
            price: "¥850",
          },
          {
            name: { en: "Banana & Berry Smoothie", ja: "バナナベリースムージー" },
            price: "¥850",
          },
        ],
      },
      {
        id: "drinks",
        name: { en: "Drinks & Bar", ja: "ドリンク＆バー" },
        image: {
          src: "/images/menu/sweet-lassi.jpg",
          alt: "Frothy white lassi in a tall glass",
          caption: {
            en: "House lassi — churned to order",
            ja: "自家製ラッシー — 注文ごとに仕込みます",
          },
        },
        items: [
          {
            name: { en: "Kirin Draft Beer (Medium Mug)", ja: "キリン生ビール（中ジョッキ）" },
            price: "¥600",
            recommended: true,
          },
          {
            name: {
              en: "Bottle Beer — Kirin Lager / Asahi Super Dry",
              ja: "瓶ビール — キリンラガー／アサヒスーパードライ",
            },
            price: "¥650",
          },
          {
            name: { en: "Kirin Harekaze", ja: "キリン晴れ風" },
            price: "¥650",
          },
          {
            name: { en: "Cobra Beer", ja: "コブラビール" },
            price: "¥750",
          },
          {
            name: { en: "Kyoto Craft Beer", ja: "京都クラフトビール" },
            price: "¥720",
            description: {
              en: "Kölsch · Alt · Kuranokaori (sake yeast) · Yamadanishiki (sake rice)",
              ja: "ケルシュ・アルト・蔵のかほり（清酒酵母）・山田錦（酒米使用）",
            },
          },
          {
            name: { en: "Beer Lassi", ja: "ビールラッシー" },
            price: "¥550",
          },
          {
            name: {
              en: "Non-Alcoholic Beer — Kirin Green's Free / Asahi",
              ja: "ノンアルコールビール — キリングリーンズフリー／アサヒ",
            },
            price: "¥550",
          },
          {
            name: { en: "Glass Wine (Red / White)", ja: "グラスワイン（赤・白）" },
            price: "¥550",
          },
          {
            name: { en: "Wine Decanter (Red / White)", ja: "デキャンタ（赤・白）" },
            price: "¥1,250",
          },
          {
            name: { en: "Bottle Wine (Red / White)", ja: "ボトルワイン（赤・白）" },
            price: "¥2,100",
          },
          {
            name: {
              en: "Fratelli Indian Wine (Red / White)",
              ja: "フラテッリ インドワイン（赤・白）",
            },
            price: "¥2,500",
            description: {
              en: "Full 750ml bottle from India",
              ja: "インド産フルボトル 750ml",
            },
          },
          {
            name: { en: "Kyoto Sake (180ml)", ja: "京都の地酒（5寸瓶 180ml）" },
            price: "¥650",
            description: {
              en: "Kouden (Miyazu) or Tsukinokatsura Sparkling (Fushimi) — served in a wine glass, chilled or warmed",
              ja: "香田（宮津市）／月の桂 SPARKLING（伏見区）— ワイングラスで、冷や・燗どちらも可",
            },
          },
          {
            name: {
              en: "Sour — Lemon / Lime / Lychee / Plum",
              ja: "サワー — レモン／ライム／ライチ／梅酒",
            },
            price: "¥550",
          },
          {
            name: {
              en: "Chu-Hi — Plum / Lemon / Lime",
              ja: "チューハイ — 梅酒ハイ／レモンハイ／ライムハイ",
            },
            price: "¥550",
          },
          {
            name: {
              en: "Kirin Hyoketsu Non-Sugar Lemon Sour",
              ja: "キリン 氷結無糖 レモンサワー",
            },
            price: "¥550",
          },
          {
            name: {
              en: "Shochu — Jinro / Imo / Mugi / Kome (Glass)",
              ja: "焼酎 — ジンロ／芋／麦／米（グラス）",
            },
            price: "¥550",
          },
          {
            name: {
              en: "High Ball — Suntory / Ginger / Kirin Riku",
              ja: "ハイボール — サントリー／ジンジャー／キリン陸",
            },
            price: "¥550",
          },
          {
            name: {
              en: "High Ball — Mr Dowell's / Johnnie Walker / Chivas Regal",
              ja: "ハイボール — マクダウェルズ／ジョニーウォーカー／シーバスリーガル",
            },
            price: "¥650 – ¥700",
            description: {
              en: "Mr Dowell's ¥650 · Johnnie Walker ¥700 · Chivas Regal ¥700",
              ja: "マクダウェルズ ¥650／ジョニーウォーカー ¥700／シーバスリーガル ¥700",
            },
          },
          {
            name: { en: "Suntory Whisky", ja: "サントリーウイスキー" },
            price: "¥550 / ¥800",
            description: { en: "Single / double", ja: "シングル／ダブル" },
          },
          {
            name: { en: "Grand Duke Whisky", ja: "グランデューク" },
            price: "¥650",
            description: {
              en: "On the rocks, with water, or with hot water",
              ja: "ロック・水割り・お湯割り",
            },
          },
          {
            name: {
              en: "Whisky — Johnnie Walker / Mr Dowell's / Chivas Regal",
              ja: "ウイスキー — ジョニーウォーカー／マクダウェルズ／シーバスリーガル",
            },
            price: "¥700 / ¥1,100",
            description: { en: "Single / double", ja: "シングル／ダブル" },
          },
          {
            // "Khukri Rum" is the product's actual brand name — kept as-is.
            // Only the country descriptor in front of it was dropped.
            name: { en: "Khukri Rum", ja: "ククリラム" },
            price: "¥700 / ¥1,100",
            description: { en: "Single / double", ja: "シングル／ダブル" },
          },
          {
            name: { en: "Cocktails — All Bases", ja: "カクテル — 全ベース" },
            price: "¥550",
            description: {
              en: "Gin · Campari · Rum · Cassis · Malibu · Vodka — with tonic, soda, cola, ginger ale, mango, orange, oolong, milk or lassi",
              ja: "ジン・カンパリ・ラム・カシス・マリブ・ウォッカ — トニック、ソーダ、コーラ、ジンジャーエール、マンゴー、オレンジ、ウーロン、ミルク、ラッシー割り",
            },
          },
          {
            name: {
              en: "Bacardi Mojito / Mojito Lassi",
              ja: "バカルディ モヒート／モヒートラッシー",
            },
            price: "¥600",
          },
          {
            name: {
              en: "Lassi — Plain / Mango / Strawberry / Blueberry",
              ja: "ラッシー — プレーン／マンゴー／ストロベリー／ブルーベリー",
            },
            price: "¥450",
            photo: "/images/menu/sweet-lassi.jpg",
          },
          {
            name: {
              en: "Juice — Mango / Orange / Apple · Green Tea",
              ja: "ジュース — マンゴー／オレンジ／アップル・緑茶",
            },
            price: "¥450",
          },
          {
            name: {
              en: "Oolong Tea · Tea · Coffee (Hot / Ice) · Coca-Cola · Ginger Ale · Calpis",
              ja: "ウーロン茶・ティー・コーヒー（ホット／アイス）・コカコーラ・ジンジャーエール・カルピス",
            },
            price: "¥400",
          },
        ],
      },
    ],
  },

  gallery: [
    {
      src: "/images/menu/cheese-naan-set.jpg",
      alt: "Cheese nan set with curry, rice, salad, chicken tikka and a drink on a steel thali",
      caption: { en: "Cheese Nan Set", ja: "チーズナンセット" },
      size: "lg",
    },
    {
      src: "/images/menu/naan-thali.jpg",
      alt: "Giant fresh nan with curry, chicken tikka and rice on a steel thali",
      caption: { en: "Nan & Curry Thali", ja: "ナン＆カレーターリー" },
      size: "lg",
    },
    {
      src: "/images/menu/biryani-raita.jpg",
      alt: "Biryani topped with egg, almonds and red onion beside a bowl of raita",
      caption: { en: "Biryani & Raita", ja: "ビリヤニ＆ライタ" },
      size: "wide",
    },
    {
      src: "/images/menu/samosa.jpg",
      alt: "Two golden samosas with shredded cabbage salad and ketchup",
      caption: { en: "Crisp Samosas", ja: "サクサクサモサ" },
      size: "sm",
    },
    {
      src: "/images/menu/cheese-naan.jpg",
      alt: "Cheese nan slices with molten cheese pulling apart on a white plate",
      caption: { en: "Molten Cheese Nan", ja: "とろけるチーズナン" },
      size: "sm",
    },
    {
      src: "/images/menu/dinner-set-thali.jpg",
      alt: "Dinner set thali with curry, nan, papad, rice, salad and iced coffee",
      caption: { en: "A Set Thali", ja: "Aセットターリー" },
      size: "sm",
    },
    {
      src: "/images/menu/two-curry-thali.jpg",
      alt: "Thali with two curries, chicken tikka, nan and rice",
      caption: { en: "MOTHER INDIA Set", ja: "マザーインディアセット" },
      size: "sm",
    },
    {
      src: "/images/menu/biryani-platter.jpg",
      alt: "Biryani platter ringed with red onion and topped with almonds and cilantro",
      caption: { en: "Biryani Platter", ja: "ビリヤニプラター" },
      size: "wide",
    },
    {
      src: "/images/menu/masala-papad.jpg",
      alt: "Masala papad topped with chopped onion, carrot, cucumber and cilantro",
      caption: { en: "Masala Papad", ja: "マサラパパド" },
      size: "sm",
    },
    {
      src: "/images/menu/sweet-lassi.jpg",
      alt: "Frothy white lassi in a tall glass with red flowers behind",
      caption: { en: "Fresh Lassi", ja: "フレッシュラッシー" },
      size: "sm",
    },
    {
      src: "/images/gallery/bar-bottle-shelf.jpg",
      alt: "Wooden shelves lined with Himalayan and Indian beer bottles",
      caption: { en: "The Bar Shelf", ja: "バーの棚" },
      size: "wide",
    },
    {
      src: "/images/menu/naan-curry-set.jpg",
      alt: "Large nan with curry, tandoori chicken, papad and rice on a thali",
      caption: { en: "Nan & Curry Dinner", ja: "ナン＆カレーディナー" },
      size: "sm",
    },
    {
      src: "/images/menu/fresh-salad.jpg",
      alt: "Garden salad with dressing, corn and cucumber",
      caption: { en: "Green Salad", ja: "グリーンサラダ" },
      size: "sm",
    },
  ],

  testimonials: [
    {
      quote: {
        en: "We came back twice on one trip. Deepakji, Kishanji and Govindji cooked us proper Jain dishes with real care. A hidden gem in Kyoto.",
        ja: "旅行中に2回も伺いました。ディーパクさん、キシャンさん、ゴビンドさんが本格的なジャイン料理を心を込めて作ってくださいます。京都の隠れた名店です。",
      },
      author: {
        en: "Travelling family",
        ja: "海外からのご家族",
      },
      rating: 5,
      context: { en: "Dined in Nakagyo Ward", ja: "中京区でお食事" },
    },
    {
      quote: {
        en: "Spotted the signboard from the street and went up with no expectations. Food, service, atmosphere — all 5/5. They matched the spice to us perfectly.",
        ja: "通りの看板を見つけて、何も期待せずに4階へ。料理もサービスも雰囲気も5点満点。辛さも完璧に合わせてくれました。",
      },
      author: { en: "Walk-in guest", ja: "ふらっと立ち寄ったお客様" },
      rating: 5,
      context: { en: "Late dinner", ja: "遅めのディナー" },
    },
    {
      quote: {
        en: "Really fresh Indian food. The chicken curry and the momos were excellent, and the staff were lovely. Don't miss it if you're in Kyoto.",
        ja: "とても新鮮なインド料理。チキンカレーもモモも絶品で、スタッフの方も親切でした。京都に来たらぜひ。",
      },
      author: { en: "Google Local Guide", ja: "Googleローカルガイド" },
      rating: 5,
      context: {
        en: "Verified review",
        ja: "認証済みレビュー",
      },
    },
  ],

  faqs: [
    {
      question: {
        en: "Where is Mother India in Kyoto, and how do I find it?",
        ja: "マザーインディアは京都のどこにありますか？",
      },
      answer: {
        en: "We're on the 4th floor of the Hijikata Building at 435-2 Ebisuchō, Nakagyo Ward, Kyoto 604-8005 — a few minutes' walk from the Kawaramachi and Sanjō area. Look for our signboard at street level and take the lift to 4F.",
        ja: "京都市中京区恵比須町435-2 ヒジカタビル4F（〒604-8005）、河原町・三条エリアから徒歩数分です。通り沿いの看板を目印に、エレベーターで4階へお上がりください。",
      },
    },
    {
      question: {
        en: "What are your opening hours?",
        ja: "営業時間を教えてください。",
      },
      answer: {
        en: "We're open every day of the week, 11:00 AM to 11:00 PM — lunch straight through to late dinner, with no closing day.",
        ja: "年中無休で、毎日11:00〜23:00まで営業しています。ランチから夜遅いディナーまで通し営業で、定休日はありません。",
      },
    },
    {
      question: {
        en: "Do you serve vegetarian, vegan, Jain or Halal food?",
        ja: "ベジタリアン・ヴィーガン・ジャイン・ハラール料理はありますか？",
      },
      answer: {
        en: "Yes. Vegetarian dishes are a permanent part of the menu, and our kitchen prepares Jain and Halal meals on request — just tell us when you order or when you book. Everything is cooked to order, so if you're vegan let us know and we'll leave the dairy out wherever the dish allows.",
        ja: "はい。ベジタリアン料理は常時ご用意しており、ジャイン・ハラール対応もご注文時またはご予約時にお申し付けいただければお作りします。すべて注文後にお作りしますので、ヴィーガンの方は乳製品を除いた調理もご相談ください。",
      },
    },
    {
      question: {
        en: "Can I book a table, and do you take walk-ins?",
        ja: "予約はできますか？予約なしでも入れますか？",
      },
      answer: {
        en: "Both. Call us on +81 75-211-5131 or reserve online through Tabelog. Walk-in guests are welcome too — we seat around 50.",
        ja: "どちらも可能です。お電話（+81 75-211-5131）または食べログからオンラインでご予約いただけます。約50席ございますので、ご予約なしでもお気軽にどうぞ。",
      },
    },
    {
      question: {
        en: "How spicy is the food? Can you make it mild?",
        ja: "辛さは調整できますか？",
      },
      answer: {
        en: "Every curry is cooked to order across five spice levels, from mild to very hot, so we can make it as gentle or as fiery as you like. Children's portions are kept mild by default.",
        ja: "カレーはすべてご注文を受けてからお作りし、甘口から激辛まで5段階で辛さを調整できます。お子様向けは基本的に甘口でご用意します。",
      },
    },
    {
      question: {
        en: "Do you accept credit cards?",
        ja: "クレジットカードは使えますか？",
      },
      answer: {
        en: "Yes — Visa, Mastercard, JCB, American Express, Diners Club and Discover, plus debit cards and cash in Japanese yen.",
        ja: "はい。VISA・Mastercard・JCB・AMEX・Diners・Discover のほか、デビットカードと現金（日本円）がご利用いただけます。",
      },
    },
    {
      question: {
        en: "How much does a meal cost?",
        ja: "予算はどのくらいですか？",
      },
      answer: {
        en: "Dinner sets — curry, tandoori, naan, rice, salad and a drink — run from ¥1,450 to ¥2,350, with a student set at ¥1,550 and a child set at ¥900. Individual curries and breads are priced à la carte.",
        ja: "カレー・タンドリー・ナン・ライス・サラダ・ドリンクが付くディナーセットは ¥1,450〜¥2,350、学生セット ¥1,550、お子様セット ¥900 です。単品のカレーやナンはアラカルト価格でご用意しています。",
      },
    },
    {
      question: {
        en: "Do you offer takeout?",
        ja: "テイクアウトはできますか？",
      },
      answer: {
        en: "Yes, the menu is available to take away — curries, tandoori dishes and breads from the tandoor all travel well. Order at the restaurant or call ahead.",
        ja: "はい、メニューはテイクアウトでもご利用いただけます。カレー、タンドール料理、焼きたてのナンもお持ち帰りいただけます。店頭またはお電話でご注文ください。",
      },
    },
    {
      question: {
        en: "Is the restaurant good for families and groups?",
        ja: "子ども連れやグループでも利用できますか？",
      },
      answer: {
        en: "Children are very welcome — there's a dedicated child set and mild spicing — and with roughly 50 seats we can take larger groups. Free Wi-Fi throughout, and there is parking nearby.",
        ja: "お子様連れも大歓迎で、お子様セットや甘口の辛さ調整もございます。約50席ございますので、グループでのご利用も可能です。無料Wi-Fi完備、近隣に駐車場がございます。",
      },
    },
  ],
};
