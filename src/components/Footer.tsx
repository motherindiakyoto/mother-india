"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Banknote,
  CalendarCheck,
  Check,
  Clock,
  Copy,
  CreditCard,
  ExternalLink,
  MapPin,
  Phone,
} from "lucide-react";

import { RESTAURANT_DATA } from "@/data/restaurantData";
import { UI, localePath, routeFromPath } from "@/data/i18n";
import { useLang } from "@/components/LanguageProvider";
import SectionHeading from "@/components/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, scrollToSection } from "@/lib/utils";
import { useBookingUrl } from "@/lib/useBookingUrl";
import { useRevealFallback } from "@/lib/reveal";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.05 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

/** Mirrors the header nav: "Menu" is its own page, the rest are home sections. */
const NAV_ITEMS = [
  { id: "story", kind: "anchor" },
  { id: "menu", kind: "route", segment: "menu" },
  { id: "gallery", kind: "anchor" },
  { id: "reviews", kind: "anchor" },
  { id: "visit", kind: "anchor" },
] as const satisfies readonly {
  id: keyof typeof UI.nav;
  kind: "anchor" | "route";
  segment?: string;
}[];

export default function Footer() {
  const { metadata, contact, paymentMethods } = RESTAURANT_DATA;
  const { lang, t } = useLang();
  const onHome = routeFromPath(usePathname() ?? "/") === "";
  const revealed = useRevealFallback();
  const revealFallback = revealed ? { opacity: 1, y: 0 } : undefined;
  const [copied, setCopied] = useState(false);
  const bookingUrl = useBookingUrl(lang);

  const copyJapaneseAddress = async () => {
    try {
      await navigator.clipboard.writeText(contact.address.japanese);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — leave the address selectable.
    }
  };

  return (
    <footer className="border-t border-white/5 bg-obsidian-soft">
      {/* Visit / Map block */}
      <section id="visit" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <SectionHeading
          eyebrow={t(UI.visit.eyebrow)}
          title={t(UI.visit.title)}
          description={t(contact.address.accessHint)}
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact & hours card */}
          <motion.div
            {...fadeUp}
            animate={revealFallback}
            className="flex flex-col gap-8 rounded-3xl border border-white/10 bg-obsidian-card p-6 sm:p-8"
          >
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-saffron/25 bg-saffron/10">
                <MapPin className="size-5 text-saffron-bright" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-lg text-cream">
                  {t(UI.visit.address)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-300">
                  {contact.address.english}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-stone-400" lang="ja">
                  {contact.address.japanese}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={copyJapaneseAddress}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      copied && "border-emerald-deep/60 text-emerald-soft"
                    )}
                  >
                    {copied ? (
                      <Check aria-hidden="true" />
                    ) : (
                      <Copy aria-hidden="true" />
                    )}
                    {copied ? t(UI.visit.copied) : t(UI.visit.copyAddress)}
                  </button>
                  <a
                    href={metadata.gMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                  >
                    <ExternalLink aria-hidden="true" />
                    {t(UI.visit.openMaps)}
                  </a>
                </div>
                <p className="mt-3 text-xs text-stone-500">{t(UI.visit.taxiTip)}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-emerald-deep/40 bg-emerald-deep/10">
                <Clock className="size-5 text-emerald-soft" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-lg text-cream">
                  {t(UI.visit.hours)}
                </h3>
                {contact.hours.schedule.map((entry) => (
                  <p key={entry.days.en} className="mt-2 text-sm text-stone-300">
                    <span className="font-medium text-cream">{t(entry.days)}</span>
                    <span className="mx-2 text-stone-600">·</span>
                    <span className="tabular-nums">{entry.time}</span>
                  </p>
                ))}
                <p className="mt-2 text-xs leading-relaxed text-stone-500">
                  {t(contact.hours.note)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-saffron/25 bg-saffron/10">
                <Phone className="size-5 text-saffron-bright" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-lg text-cream">
                  {t(UI.visit.reservations)}
                </h3>
                <a
                  href={contact.phone.dial}
                  className="mt-2 inline-block text-lg font-semibold tabular-nums text-saffron-glow transition-colors hover:text-saffron-bright"
                >
                  {contact.phone.display}
                </a>
                <div className="mt-3">
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: "primary", size: "sm" })}
                  >
                    <CalendarCheck aria-hidden="true" />
                    {t(UI.visit.bookOnline)}
                  </a>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs text-stone-400">
                    <CreditCard className="size-3.5" aria-hidden="true" />
                    <Banknote className="size-3.5" aria-hidden="true" />
                  </span>
                  {paymentMethods.modes.map((mode) => (
                    <Badge key={mode.en} tone="neutral">
                      {t(mode)}
                    </Badge>
                  ))}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-stone-500">
                  {t(paymentMethods.note)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Embedded map */}
          <motion.div
            {...fadeUp}
            animate={revealFallback}
            transition={{ ...fadeUp.transition, delay: 0.12 }}
            className="overflow-hidden rounded-3xl border border-white/10 bg-obsidian-card"
          >
            <iframe
              src={metadata.gMapsEmbedUrl}
              title={`Map to ${metadata.legalName}, Kyoto`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-70 w-full border-0 sm:min-h-95 lg:min-h-full"
            />
          </motion.div>
        </div>
      </section>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        {/* Extra bottom room on phones so the floating call button never covers the credits. */}
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 pb-[max(6rem,calc(env(safe-area-inset-bottom)+5.5rem))] pt-10 sm:px-6 md:flex-row lg:px-8 lg:pb-10">
          <div className="text-center md:text-left">
            <p className="font-display text-lg text-cream">{metadata.brandName}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-saffron-bright">
              {metadata.subTitle}
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {NAV_ITEMS.map((item) => {
                const className =
                  "text-sm text-stone-400 transition-colors hover:text-saffron-glow";
                return (
                  <li key={item.id}>
                    {item.kind === "anchor" && onHome ? (
                      <a
                        href={`#${item.id}`}
                        onClick={(event) => {
                          event.preventDefault();
                          scrollToSection(item.id);
                        }}
                        className={className}
                      >
                        {t(UI.nav[item.id])}
                      </a>
                    ) : (
                      <Link
                        href={
                          item.kind === "route"
                            ? localePath(lang, item.segment)
                            : `${localePath(lang)}#${item.id}`
                        }
                        className={className}
                      >
                        {t(UI.nav[item.id])}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {[
                { href: metadata.tabelogUrl, label: t(UI.visit.tabelog) },
                { href: metadata.tabelogMenuUrl, label: t(UI.visit.tabelogMenu) },
                { href: metadata.gMapsLink, label: t(UI.visit.googleMaps) },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-stone-500 transition-colors hover:text-saffron-glow"
                  >
                    {link.label}
                    <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-center text-xs leading-relaxed text-stone-500 md:text-right">
            © {new Date().getFullYear()} {metadata.legalName}
            <span className="block">{t(UI.visit.crafted)}</span>
            <span className="mt-1 block">
              {t(UI.visit.builtBy)}{" "}
              <a
                href="https://www.digistartjp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-stone-400 transition-colors hover:text-saffron-glow"
              >
                DigiStart
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
