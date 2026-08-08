"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowUp, ExternalLink, Flame, Leaf } from "lucide-react";

import { RESTAURANT_DATA } from "@/data/restaurantData";
import { UI } from "@/data/i18n";
import { useLang } from "@/components/LanguageProvider";
import MenuRow from "@/components/MenuRow";
import { cn } from "@/lib/utils";
import { useRevealFallback } from "@/lib/reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

/** DOM id for a menu section. Namespaced so it can't collide with `#menu`. */
const sectionDomId = (id: string) => `menu-${id}`;

/**
 * The whole menu on one page.
 *
 * The home page shows one category at a time, which is right for browsing but
 * wrong for the guest who wants to read the lot before choosing a restaurant.
 * Here every section is printed in full, with a sticky category rail for
 * getting around a document this long.
 *
 * The page opens straight onto the rail and the first dishes — no title block,
 * no standfirst. Anything above the first dish is something the reader has to
 * scroll past to reach what they came for.
 */
export default function FullMenu() {
  const { fullMenu, metadata, spiceLevels } = RESTAURANT_DATA;
  const { sections } = fullMenu;
  const { t } = useLang();
  const reduce = useReducedMotion();
  const revealed = useRevealFallback();

  const [activeId, setActiveId] = useState(sections[0].id);
  const railRef = useRef<HTMLDivElement>(null);

  // How far through the menu you are, drawn as a hairline under the rail.
  // A 140-dish page gives no sense of its own length otherwise.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Scroll-spy: highlight the category whose section is currently in view.
  useEffect(() => {
    const observed = sections
      .map((section) => document.getElementById(sectionDomId(section.id)))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id.replace(/^menu-/, ""));
          }
        }
      },
      // Trips as a section crosses the band just under the sticky rail, so the
      // highlighted chip matches the heading the reader is actually looking at.
      { rootMargin: "-30% 0px -60% 0px" }
    );

    observed.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  // Keep the active chip visible as the reader scrolls the page itself.
  useEffect(() => {
    const rail = railRef.current;
    const chip = rail?.querySelector<HTMLElement>(`[data-chip="${activeId}"]`);
    if (!rail || !chip) return;
    if (rail.scrollWidth <= rail.clientWidth) return;
    rail.scrollTo({
      left: chip.offsetLeft - rail.clientWidth / 2 + chip.offsetWidth / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [activeId, reduce]);

  // One reveal definition for the whole page. `staggerChildren` cascades the
  // dish rows; `useRevealFallback` force-shows anything a screenshot or print
  // pass never scrolls into view.
  const sectionVariants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: EASE,
        staggerChildren: reduce ? 0 : 0.03,
        delayChildren: 0.08,
      },
    },
  };

  const revealProps = {
    variants: sectionVariants,
    initial: "hidden",
    whileInView: "show",
    animate: revealed ? "show" : undefined,
    viewport: { once: true, amount: 0.05 },
  } as const;

  return (
    // Clears the fixed navbar, which the home page's hero would otherwise sit under.
    <main id="top" className="flex-1 pt-18">
      {/* The page's real heading. Kept out of sight rather than deleted: a
          document with no h1 loses both its accessibility outline and the
          strongest on-page ranking signal it has. */}
      <h1 className="sr-only">{t(UI.menuPage.title)}</h1>

      {/* ---------- Sticky category rail ----------
          Sits directly beneath the fixed navbar. One row at every width — it
          used to wrap on desktop and strand the last category on a line of its
          own. Now it centres while it fits and scrolls once it doesn't. */}
      <div className="sticky top-18 z-30 border-b border-white/10 bg-obsidian/85 backdrop-blur-xl">
        <div className="relative mx-auto max-w-7xl">
          {/* Edge fades: the only affordance that a row is scrollable once the
              scrollbar is hidden. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-obsidian to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-obsidian to-transparent"
          />

          <div
            ref={railRef}
            aria-label={t(UI.menuPage.jumpLabel)}
            className="scroll-row overflow-x-auto"
          >
            {/* `w-max` + `mx-auto` is what centres a short row and lets a long
                one scroll — `justify-center` would clip the overflowing start. */}
            <div className="mx-auto flex w-max gap-1.5 px-4 py-2 sm:gap-2 sm:px-6 sm:py-2.5">
              {sections.map((section) => {
                const isActive = section.id === activeId;
                return (
                  <motion.a
                    key={section.id}
                    href={`#${sectionDomId(section.id)}`}
                    data-chip={section.id}
                    aria-current={isActive ? "true" : undefined}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={cn(
                      "relative flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors duration-200",
                      isActive
                        ? "text-obsidian"
                        : "text-stone-400 hover:bg-white/5 hover:text-cream"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="full-menu-chip"
                        className="absolute inset-0 rounded-full bg-saffron shadow-[0_0_24px_-6px_rgba(217,119,6,0.7)]"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    )}
                    <span className="relative z-10">{t(section.name)}</span>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="h-px origin-left bg-saffron/70"
        />
      </div>

      {/* ---------- Every section, in full ---------- */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {sections.map((section) => {
          const midpoint = Math.ceil(section.items.length / 2);
          const columns = [
            section.items.slice(0, midpoint),
            section.items.slice(midpoint),
          ];

          return (
            <section
              key={section.id}
              id={sectionDomId(section.id)}
              // Anchor offset for the navbar + sticky rail comes from the
              // `section[id^="menu-"]` rule in globals.css — a utility class
              // here would lose to that file's `section[id]` selector.
              className="py-8 md:py-14"
            >
              <motion.div {...revealProps}>
                <div className="mb-5 flex items-baseline gap-3 border-b border-white/8 pb-3 md:mb-7 md:pb-4">
                  <h2 className="font-display text-xl leading-tight text-cream sm:text-2xl md:text-3xl">
                    {t(section.name)}
                  </h2>
                  <span className="shrink-0 text-xs tabular-nums text-stone-600">
                    {section.items.length} {t(UI.menuPage.itemCount)}
                  </span>
                </div>

                <div
                  className={cn(
                    "grid items-start gap-8",
                    section.image && "lg:grid-cols-[340px_1fr] lg:gap-12"
                  )}
                >
                  {/* Desktop only. On a phone this is a full-width photo
                      standing between you and the dish list, eleven times over
                      — the row thumbnails already carry the appetite appeal. */}
                  {section.image && (
                    <figure className="hidden overflow-hidden rounded-3xl border border-white/10 bg-obsidian-card lg:sticky lg:top-40 lg:block">
                      <div className="relative aspect-4/3">
                        <Image
                          src={section.image.src}
                          alt={section.image.alt}
                          fill
                          sizes="340px"
                          className="object-cover"
                        />
                      </div>
                      <figcaption className="px-5 py-4 text-xs leading-relaxed text-stone-400">
                        {t(section.image.caption)}
                      </figcaption>
                    </figure>
                  )}

                  <div className="grid gap-x-10 md:grid-cols-2">
                    {columns.map((columnItems, columnIndex) => (
                      <ul key={columnIndex}>
                        {columnItems.map((item) => (
                          <MenuRow key={item.name.en} item={item} animated />
                        ))}
                      </ul>
                    ))}
                  </div>
                </div>
              </motion.div>
            </section>
          );
        })}
      </div>

      {/* ---------- Good to know ----------
          Spice scale and dietary handling, both after the dishes: useful once
          you've picked something, pure friction before you have. */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          <motion.div
            {...revealProps}
            className="rounded-3xl border border-white/10 bg-obsidian-card p-5 sm:p-7"
          >
            <div className="flex items-center gap-2.5">
              <Flame className="size-5 text-saffron-bright" aria-hidden="true" />
              <h2 className="font-display text-lg text-cream">
                {t(UI.menuPage.spiceTitle)}
              </h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-stone-400">
              {t(UI.menuPage.spiceNote)}
            </p>
            {/* Each step is numbered and named, so the scale never depends on
                colour alone to be read. */}
            <ol className="mt-4 flex flex-wrap gap-2">
              {spiceLevels.map((level) => (
                <li
                  key={level.step}
                  className="flex items-center gap-2 rounded-full border border-white/8 bg-white/3 py-1.5 pl-1.5 pr-3"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-5 shrink-0 items-center justify-center rounded-full bg-saffron/15 text-[10px] font-semibold tabular-nums text-saffron-glow"
                  >
                    {level.step}
                  </span>
                  <span className="text-xs font-medium text-cream">
                    {t(level.label)}
                  </span>
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.div
            {...revealProps}
            className="rounded-3xl border border-emerald-deep/30 bg-emerald-deep/[0.07] p-5 sm:p-7"
          >
            <div className="flex items-center gap-2.5">
              <Leaf className="size-5 text-emerald-soft" aria-hidden="true" />
              <h2 className="font-display text-lg text-cream">
                {t(UI.menuPage.dietTitle)}
              </h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-stone-300">
              {t(UI.menuPage.dietNote)}
            </p>
          </motion.div>
        </div>

        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-stone-500">
          {t(UI.menuPage.priceNote)}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={metadata.tabelogMenuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-saffron-glow transition-colors hover:text-saffron-bright"
          >
            {t(UI.menu.tabelogLink)}
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
          <a
            href="#top"
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-cream"
          >
            <ArrowUp className="size-3.5" aria-hidden="true" />
            {t(UI.menuPage.backToTop)}
          </a>
        </div>
      </section>
    </main>
  );
}
