"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ChevronDown,
  Clock,
  CreditCard,
  MapPin,
  Phone,
  UtensilsCrossed,
} from "lucide-react";

import { RESTAURANT_DATA } from "@/data/restaurantData";
import { UI } from "@/data/i18n";
import { useLang } from "@/components/LanguageProvider";
import { buttonVariants } from "@/components/ui/button";
import { cn, scrollToSection } from "@/lib/utils";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const { metadata, contact, paymentMethods } = RESTAURANT_DATA;
  const { lang, t } = useLang();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Soft background parallax: the glow layers drift and scale as the user scrolls.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Japanese has no spaces — reveal by character instead of by word.
  const tagline = t(metadata.tagline);
  const units = lang === "ja" ? Array.from(tagline) : tagline.split(" ");
  const unitDelay = lang === "ja" ? 0.03 : 0.05;

  const hours = contact.hours.schedule[0];

  return (
    <section
      ref={sectionRef}
      aria-label="Welcome"
      className="relative flex min-h-dvh items-center overflow-hidden pb-24 pt-28 sm:pb-20 sm:pt-24"
    >
      {/* Parallax photo background with obsidian glow overlays */}
      <motion.div
        aria-hidden="true"
        style={reduceMotion ? undefined : { y: backgroundY, scale: backgroundScale }}
        className="absolute inset-0"
      >
        <Image
          src={metadata.heroImage.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35 blur-[2px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,119,6,0.22),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(21,128,61,0.15),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/30 to-obsidian" />
      </motion.div>

      <motion.div
        style={reduceMotion ? undefined : { opacity: contentOpacity }}
        className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-4xl text-center">
          {/* Open-hours alert banner */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="mb-6 inline-flex max-w-full items-center gap-2.5 rounded-full border border-emerald-deep/50 bg-emerald-deep/10 px-4 py-2 text-xs font-medium text-emerald-soft backdrop-blur-sm sm:mb-8 sm:text-sm"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-soft/60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-soft" />
            </span>
            {t(UI.hero.openDaily)} ·{" "}
            <span className="tabular-nums">{hours.time}</span>
          </motion.div>

          {/* Brand title. The kicker sits inside the <h1> so the page's one
              top-level heading names the cuisine and the city, not just us. */}
          <h1 className="font-display text-[clamp(2.75rem,13vw,4rem)] leading-[1.05] text-cream sm:text-7xl md:text-8xl">
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease: easeOut }}
              className="mb-4 block text-[11px] font-sans font-semibold uppercase tracking-[0.28em] text-saffron-bright sm:text-sm sm:tracking-[0.45em]"
            >
              {t(UI.hero.h1Kicker)}
            </motion.span>
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7, ease: easeOut }}
              className="block"
            >
              Mother{" "}
              <span className="bg-gradient-to-r from-saffron-glow via-saffron-bright to-saffron bg-clip-text text-transparent">
                India
              </span>
            </motion.span>
          </h1>

          {/* Tagline — word/character clip reveal */}
          <p
            key={lang}
            className="mx-auto mt-4 max-w-3xl font-display text-lg italic leading-relaxed text-stone-200 sm:mt-6 sm:text-2xl md:text-3xl"
          >
            {units.map((unit, index) => (
              <span
                key={`${unit}-${index}`}
                className="inline-block overflow-hidden pb-1 align-bottom"
              >
                <motion.span
                  className="inline-block"
                  initial={reduceMotion ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    delay: 0.55 + index * unitDelay,
                    duration: 0.55,
                    ease: easeOut,
                  }}
                >
                  {unit}
                  {lang !== "ja" && index < units.length - 1 ? " " : ""}
                </motion.span>
              </span>
            ))}
          </p>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.6, ease: easeOut }}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-stone-400 sm:mt-6 sm:text-base"
          >
            {t(metadata.description)}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.6, ease: easeOut }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row"
          >
            <motion.a
              href="#menu"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("menu");
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full sm:w-auto")}
            >
              <UtensilsCrossed aria-hidden="true" />
              {t(UI.hero.explore)}
            </motion.a>
            <motion.a
              href={contact.phone.dial}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
            >
              <Phone aria-hidden="true" />
              <span className="tabular-nums">{contact.phone.display}</span>
            </motion.a>
          </motion.div>

          {/* Quick info strip */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-stone-500 sm:mt-12 sm:gap-x-8 sm:gap-y-3 sm:text-sm"
          >
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-saffron-bright" aria-hidden="true" />
              {t(UI.hero.location)}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="size-4 text-saffron-bright" aria-hidden="true" />
              {t(hours.days)} · <span className="tabular-nums">{hours.time}</span>
            </span>
          </motion.div>

          {/* One quiet line so overseas guests know payment is sorted before they come up. */}
          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="mx-auto mt-5 inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-white/10 bg-white/3 px-4 py-2 text-[11px] text-stone-400 sm:mt-6 sm:text-xs"
          >
            <CreditCard
              className="size-3.5 shrink-0 text-saffron-bright"
              aria-hidden="true"
            />
            <span className="font-medium text-stone-300">
              {t(UI.hero.payments)}
            </span>
            {/* The separator only reads as one when the line doesn't wrap. */}
            <span aria-hidden="true" className="hidden text-stone-600 sm:inline">
              ·
            </span>
            <span>{t(paymentMethods.cardBrands)}</span>
          </motion.p>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#story"
        aria-label={t(UI.hero.scrollLabel)}
        onClick={(event) => {
          event.preventDefault();
          scrollToSection("story");
        }}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.span
          animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex size-11 items-center justify-center rounded-full border border-white/15 text-stone-400 transition-colors hover:border-saffron/50 hover:text-saffron-glow"
        >
          <ChevronDown className="size-5" aria-hidden="true" />
        </motion.span>
      </motion.a>
    </section>
  );
}
