"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";

import type { PricedItem } from "@/data/restaurantData";
import { UI } from "@/data/i18n";
import { useLang } from "@/components/LanguageProvider";
import { cn } from "@/lib/utils";

/**
 * One priced dish: name, dotted leader, price, and an optional description and
 * thumbnail. Shared by the home page's category tabs and the standalone
 * `/menu` page so a change to how a dish reads only has to be made once.
 *
 * A priced row in a list is not a section of the document, so the name is a
 * `<p>` rather than a heading — as an `<h4>` it both skipped a level under the
 * section's `<h2>` and buried the page's real headings under a dish name per row.
 *
 * `animated` opts the row into its parent's stagger. It works by *variant
 * label* ("hidden"/"show"), which Framer Motion propagates down the React
 * tree, so the parent owns the timing and neither side imports the other's.
 * Off by default: the home page swaps categories inside an `AnimatePresence`
 * that already animates the whole panel, and a second animation there fights it.
 */
export default function MenuRow({
  item,
  animated = false,
}: {
  item: PricedItem;
  animated?: boolean;
}) {
  const { t } = useLang();
  const reduce = useReducedMotion();

  const Row = animated ? motion.li : "li";
  const motionProps = animated
    ? {
        variants: {
          hidden: { opacity: 0, y: reduce ? 0 : 10 },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
          },
        },
      }
    : {};

  return (
    <Row
      {...motionProps}
      className="flex items-start gap-4 border-b border-white/5 py-3.5"
    >
      {item.photo && (
        <Image
          src={item.photo}
          alt={t(item.name)}
          width={64}
          height={64}
          className="size-16 shrink-0 rounded-xl border border-white/10 object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <p
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium sm:text-base",
              item.recommended ? "text-saffron-glow" : "text-cream"
            )}
          >
            {t(item.name)}
            {item.recommended && (
              <Star
                className="size-3.5 shrink-0 fill-saffron-bright text-saffron-bright"
                aria-label={t(UI.menu.recommendedLabel)}
              />
            )}
          </p>
          <span
            aria-hidden="true"
            className="mb-1 flex-1 border-b border-dotted border-white/15"
          />
          {item.price && (
            <span className="shrink-0 text-sm tabular-nums text-stone-300 sm:text-base">
              {item.price}
            </span>
          )}
        </div>
        {item.description && (
          <p className="mt-1 pr-2 text-xs leading-relaxed text-stone-500">
            {t(item.description)}
          </p>
        )}
      </div>
    </Row>
  );
}
