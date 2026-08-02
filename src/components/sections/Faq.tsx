"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";

import { RESTAURANT_DATA } from "@/data/restaurantData";
import { UI } from "@/data/i18n";
import { useLang } from "@/components/LanguageProvider";
import SectionHeading from "@/components/SectionHeading";
import { cn } from "@/lib/utils";
import { useRevealFallback } from "@/lib/reveal";

const easeOut = [0.22, 1, 0.36, 1] as const;

/**
 * Answers to what guests actually ask before they visit — and the visible half
 * of the page's `FAQPage` structured data.
 *
 * Collapsed answers stay mounted and are only clipped to zero height, never
 * unmounted. A crawler that doesn't click anything still reads every answer,
 * which is the entire point of marking them up.
 */
export default function Faq() {
  const { faqs } = RESTAURANT_DATA;
  const { lang, t } = useLang();
  const reduceMotion = useReducedMotion();
  const revealed = useRevealFallback();
  // The first answer starts open so the section reads as content, not as a
  // wall of closed rows.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-label={t(UI.faq.title)}
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8"
    >
      <SectionHeading
        eyebrow={t(UI.faq.eyebrow)}
        title={t(UI.faq.title)}
        description={t(UI.faq.description)}
      />

      {/* Nine questions is a lot of vertical page. The rows are deliberately
          tight — small type, shallow padding — so the section reads as a
          compact reference list rather than another full-height block. */}
      {/* SectionHeading's bottom margin is sized for full-width sections; pull
          the list back up so this one doesn't float away from its title. */}
      <div className="mx-auto -mt-4 flex max-w-2xl flex-col gap-2 sm:-mt-6 md:-mt-8">
        {faqs.map((faq, index) => {
          const open = openIndex === index;
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-question-${index}`;

          return (
            <motion.div
              key={faq.question.en}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              animate={revealed ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.45,
                delay: Math.min(index * 0.04, 0.2),
                ease: easeOut,
              }}
              className={cn(
                "overflow-hidden rounded-2xl border bg-obsidian-card transition-colors",
                open
                  ? "border-saffron/30"
                  : "border-white/10 hover:border-white/20"
              )}
            >
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={open}
                  aria-controls={panelId}
                  // py-3 + a 40px control keeps the row itself compact while
                  // the tap target still clears 44px.
                  className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left sm:px-5"
                  onClick={() => setOpenIndex(open ? null : index)}
                >
                  <span
                    className={cn(
                      "font-display text-sm leading-snug transition-colors sm:text-base",
                      open ? "text-saffron-glow" : "text-cream"
                    )}
                    lang={lang}
                  >
                    {t(faq.question)}
                  </span>
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: 0.25, ease: easeOut }
                    }
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors",
                      open
                        ? "border-saffron/40 bg-saffron/15 text-saffron-glow"
                        : "border-white/10 bg-white/5 text-stone-400"
                    )}
                  >
                    <Plus className="size-3.5" />
                  </motion.span>
                </button>
              </h3>

              {/* Clipped, not unmounted — see the note at the top of the file. */}
              <motion.div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                initial={false}
                animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.28, ease: easeOut }
                }
                className="overflow-hidden"
              >
                <p
                  lang={lang}
                  className="px-4 pb-4 text-[13px] leading-relaxed text-stone-400 sm:px-5 sm:pb-5 sm:text-sm"
                >
                  {t(faq.answer)}
                </p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
