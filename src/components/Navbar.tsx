"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { CalendarCheck, Menu, Phone, X } from "lucide-react";

import { RESTAURANT_DATA } from "@/data/restaurantData";
import { UI, langPath, type Lang } from "@/data/i18n";
import { useLang } from "@/components/LanguageProvider";
import { buttonVariants } from "@/components/ui/button";
import { buildBookingUrl, cn, scrollToSection } from "@/lib/utils";

const NAV_IDS = ["story", "menu", "gallery", "reviews", "visit"] as const;

const LANG_LINKS: { code: Lang; label: string; hrefLang: string }[] = [
  { code: "en", label: "EN", hrefLang: "en" },
  { code: "ja", label: "日本語", hrefLang: "ja" },
];

/**
 * Each language is its own URL, so the toggle is a pair of real links. Crawlers
 * follow them, which is how the Japanese page gets discovered and indexed;
 * an onClick-only switch would have left it invisible.
 */
function LangToggle({ className }: { className?: string }) {
  const { lang } = useLang();
  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "flex items-center rounded-full border border-white/10 bg-white/5 p-0.5",
        className
      )}
    >
      {LANG_LINKS.map(({ code, label, hrefLang }) => (
        <Link
          key={code}
          href={langPath(code)}
          hrefLang={hrefLang}
          lang={hrefLang}
          aria-current={lang === code ? "true" : undefined}
          className={cn(
            "relative cursor-pointer whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors",
            lang === code
              ? "text-obsidian"
              : "text-stone-400 hover:text-cream"
          )}
        >
          {lang === code && (
            <motion.span
              layoutId="lang-pill"
              className="absolute inset-0 rounded-full bg-saffron"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )}
          <span className="relative z-10">{label}</span>
        </Link>
      ))}
    </div>
  );
}

export default function Navbar() {
  const { metadata, contact } = RESTAURANT_DATA;
  const { lang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  // Computed post-mount so the visit date (tomorrow) never causes a hydration mismatch.
  const [bookingUrl, setBookingUrl] = useState(
    "https://tabelog.com/en/booking/form_course/new?member=2&rcd=26043494"
  );
  const { scrollY } = useScroll();

  useEffect(() => {
    setBookingUrl(buildBookingUrl(lang));
  }, [lang]);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 16);
    setPastHero(y > 420);
    if (y < 160) setActiveId(null);
  });

  // Scroll-spy: highlight the nav link of the section currently in view.
  useEffect(() => {
    const sections = NAV_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Lock page scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background-color,border-color,box-shadow] duration-300",
          scrolled || open
            ? "border-b border-white/10 bg-obsidian/75 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        >
          {/* Brand */}
          <a
            href="#top"
            className="group shrink-0"
            onClick={(event) => {
              event.preventDefault();
              setOpen(false);
              scrollToSection("top");
            }}
          >
            <span className="block font-display text-xl leading-none text-cream transition-colors group-hover:text-saffron-glow">
              {metadata.brandName}
            </span>
            <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.18em] text-saffron-bright sm:tracking-[0.32em]">
              {t(UI.nav.brandSub)}
            </span>
          </a>

          {/* Desktop links with sliding active pill */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_IDS.map((id) => (
              <li key={id} className="relative">
                {activeId === id && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-white/8"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <a
                  href={`#${id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection(id);
                  }}
                  className={cn(
                    "relative z-10 block rounded-full px-4 py-2 text-sm transition-colors",
                    activeId === id
                      ? "text-cream"
                      : "text-stone-400 hover:text-cream"
                  )}
                >
                  {t(UI.nav[id])}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <LangToggle />
            <a
              href={contact.phone.dial}
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              <Phone aria-hidden="true" />
              <span className="tabular-nums">{contact.phone.display}</span>
            </a>
            <motion.a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={buttonVariants({ variant: "primary", size: "sm" })}
            >
              <CalendarCheck aria-hidden="true" />
              {t(UI.nav.reserve)}
            </motion.a>
          </div>

          {/* Mobile: language toggle + menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <LangToggle />
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-cream transition-colors hover:border-saffron/50"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile sheet */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-white/10 bg-obsidian/95 backdrop-blur-xl lg:hidden"
            >
              {/* Scrolls internally so the sheet still fits in landscape. */}
              <ul className="max-h-[calc(100dvh-4.5rem)] space-y-1 overflow-y-auto px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
                {NAV_IDS.map((id, index) => (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.05 }}
                  >
                    <a
                      href={`#${id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        setOpen(false);
                        scrollToSection(id);
                      }}
                      className="block rounded-xl px-4 py-3 text-base text-stone-300 transition-colors hover:bg-white/5 hover:text-cream"
                    >
                      {t(UI.nav[id])}
                    </a>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + NAV_IDS.length * 0.05 }}
                  className="flex flex-col gap-2 pt-3 sm:flex-row"
                >
                  <a
                    href={contact.phone.dial}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "md" }),
                      "flex-1"
                    )}
                  >
                    <Phone aria-hidden="true" />
                    {t(UI.nav.callNow)}
                  </a>
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "primary", size: "md" }),
                      "flex-1"
                    )}
                  >
                    <CalendarCheck aria-hidden="true" />
                    {t(UI.nav.reserve)}
                  </a>
                </motion.li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Floating quick-action call utility (mobile). Appears only once the hero —
          which carries its own call button — has scrolled away. */}
      <AnimatePresence>
        {pastHero && !open && (
          <motion.a
            href={contact.phone.dial}
            aria-label={`Call ${metadata.brandName} now`}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            whileTap={{ scale: 0.92 }}
            style={{
              bottom: "max(1.25rem, calc(env(safe-area-inset-bottom) + 0.5rem))",
            }}
            className="fixed right-4 z-40 flex size-14 items-center justify-center rounded-full bg-saffron text-obsidian shadow-[0_8px_32px_-8px_rgba(217,119,6,0.8)] sm:right-5 lg:hidden"
          >
            <Phone className="relative size-6" aria-hidden="true" />
          </motion.a>
        )}
      </AnimatePresence>
    </>
  );
}
