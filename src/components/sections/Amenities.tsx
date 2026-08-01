"use client";

import { motion } from "framer-motion";
import {
  CalendarCheck,
  Car,
  Heart,
  Leaf,
  ShoppingBag,
  Smile,
  Utensils,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import { RESTAURANT_DATA, type AmenityIcon } from "@/data/restaurantData";
import { UI } from "@/data/i18n";
import { useLang } from "@/components/LanguageProvider";
import SectionHeading from "@/components/SectionHeading";
import { useRevealFallback } from "@/lib/reveal";

const AMENITY_ICONS: Record<AmenityIcon, LucideIcon> = {
  Utensils,
  ShoppingBag,
  CalendarCheck,
  Leaf,
  Heart,
  Wifi,
  Smile,
  Car,
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Amenities() {
  const { amenities } = RESTAURANT_DATA;
  const { t } = useLang();
  const revealed = useRevealFallback();

  return (
    <section id="amenities" className="bg-obsidian-soft py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t(UI.amenities.eyebrow)}
          title={t(UI.amenities.title)}
          description={t(UI.amenities.description)}
        />

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="visible"
          animate={revealed ? "visible" : undefined}
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4"
        >
          {amenities.map((amenity) => {
            const Icon = AMENITY_ICONS[amenity.icon];
            return (
              <motion.li key={amenity.label.en} variants={item}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  className="group flex h-full flex-col items-center gap-4 rounded-2xl border border-white/8 bg-obsidian-card p-6 text-center transition-colors duration-200 hover:border-saffron/40 sm:p-7"
                >
                  <span className="flex size-13 items-center justify-center rounded-2xl border border-saffron/25 bg-saffron/10 transition-colors duration-200 group-hover:bg-saffron/20">
                    <Icon className="size-6 text-saffron-bright" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium leading-snug text-stone-200">
                    {t(amenity.label)}
                  </span>
                </motion.div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
