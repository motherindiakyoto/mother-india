"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { Quote, Star } from "lucide-react";

import { RESTAURANT_DATA, type Testimonial } from "@/data/restaurantData";
import { UI } from "@/data/i18n";
import { useLang } from "@/components/LanguageProvider";
import SectionHeading from "@/components/SectionHeading";
import { useMediaQuery, useMounted } from "@/lib/responsive";
import { cn } from "@/lib/utils";

const MARQUEE_SPEED = 38; // px per second

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`Rated ${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={
            index < rating
              ? "size-4 fill-saffron-bright text-saffron-bright"
              : "size-4 text-stone-600"
          }
        />
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  className,
}: {
  testimonial: Testimonial;
  className?: string;
}) {
  const { t } = useLang();
  return (
    <figure
      className={cn(
        "relative flex h-full w-[min(420px,82vw)] shrink-0 flex-col gap-4 overflow-hidden rounded-2xl border border-white/8 bg-obsidian-card p-6 sm:p-7",
        className
      )}
    >
      <Quote
        aria-hidden="true"
        className="absolute -right-2 -top-2 size-20 text-saffron/10"
      />
      <StarRating rating={testimonial.rating} />
      <blockquote className="flex-1 text-sm leading-relaxed text-stone-300">
        “{t(testimonial.quote)}”
      </blockquote>
      <figcaption>
        <p className="font-medium text-cream">{t(testimonial.author)}</p>
        <p className="mt-0.5 text-xs text-stone-500">{t(testimonial.context)}</p>
      </figcaption>
    </figure>
  );
}

/** Continuous, hover-pausable marquee driven by a motion value. */
function Marquee({ testimonials }: { testimonials: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [loopWidth, setLoopWidth] = useState(0);
  const paused = useRef(false);
  const x = useMotionValue(0);
  // The clone half only exists to make the scroll wrap seamlessly, which is a
  // client-side effect. Keeping it out of the SSR markup stops every quote from
  // being served to crawlers twice; the ResizeObserver below re-measures once
  // it mounts.
  const mounted = useMounted();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setLoopWidth(track.scrollWidth / 2);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (paused.current || loopWidth === 0) return;
    let next = x.get() - (delta / 1000) * MARQUEE_SPEED;
    if (next <= -loopWidth) next += loopWidth;
    x.set(next);
  });

  return (
    <div
      className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-6 py-2">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={`first-${index}`}
            testimonial={testimonial}
          />
        ))}
        {/* Duplicate set for a seamless loop — hidden from assistive tech. */}
        {mounted && (
          <div aria-hidden="true" className="contents">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`clone-${index}`}
                testimonial={testimonial}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function Testimonials() {
  const { testimonials } = RESTAURANT_DATA;
  const { t } = useLang();
  const reduceMotion = useReducedMotion();
  // One variant only — the phone row and the marquee carry the same quotes.
  const wide = useMediaQuery("(min-width: 640px)");

  return (
    <section id="reviews" className="bg-obsidian-soft py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t(UI.reviews.eyebrow)}
          title={t(UI.reviews.title)}
          description={t(UI.reviews.description)}
        />
      </div>

      {reduceMotion ? (
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8 [&_figure]:w-full">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      ) : wide ? (
        <Marquee testimonials={testimonials} />
      ) : (
        /* Phones read at their own pace — a moving marquee can't be paused by touch. */
        <div className="scroll-row flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial}
              className="snap-center"
            />
          ))}
        </div>
      )}
    </section>
  );
}
