"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Camera, ExternalLink, MoveRight } from "lucide-react";

import { RESTAURANT_DATA, type GalleryImage } from "@/data/restaurantData";
import { UI } from "@/data/i18n";
import { useLang } from "@/components/LanguageProvider";
import SectionHeading from "@/components/SectionHeading";
import { useMediaQuery } from "@/lib/responsive";
import { cn } from "@/lib/utils";

const CARD_WIDTHS: Record<GalleryImage["size"], string> = {
  lg: "w-[400px] xl:w-[460px]",
  wide: "w-[340px] xl:w-[400px]",
  sm: "w-[270px] xl:w-[310px]",
};

function FilmCard({
  photo,
  index,
  className,
}: {
  photo: GalleryImage;
  index: number;
  className?: string;
}) {
  const { t } = useLang();
  return (
    <figure
      className={cn(
        "group relative shrink-0 overflow-hidden rounded-3xl border border-white/8 bg-obsidian-card",
        className
      )}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(min-width: 768px) 460px, 78vw"
        draggable={false}
        className="pointer-events-none select-none object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent"
      />
      <span
        aria-hidden="true"
        className="absolute left-4 top-4 rounded-full border border-white/10 bg-obsidian/60 px-2.5 py-1 text-[10px] font-semibold tabular-nums tracking-[0.2em] text-saffron-glow backdrop-blur-sm"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <figcaption className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-obsidian/60 px-3.5 py-1.5 text-xs font-medium text-cream backdrop-blur-sm">
        {t(photo.caption)}
      </figcaption>
    </figure>
  );
}

/** Desktop: the section pins and the strip glides horizontally with scroll. */
function PinnedFilmstrip({ photos }: { photos: GalleryImage[] }) {
  const { t } = useLang();
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState(0);
  const [sectionHeight, setSectionHeight] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      // Read computed padding-left to account for the large `pl-[max(...)]` used
      // to center content on wide screens. The visible content width should
      // exclude that left padding when computing the horizontal travel.
      const style = window.getComputedStyle(track);
      const padLeft = parseFloat(style.paddingLeft || "0") || 0;
      // Visible content width (viewport minus left padding)
      const visible = Math.max(0, window.innerWidth - padLeft);
      // Ensure we don't over-report visible if track itself is narrower
      const visibleClamped = Math.min(visible, track.clientWidth || visible);
      const r = Math.max(0, track.scrollWidth - visibleClamped);
      setRange(r);

      // Desired section height = viewport + horizontal overflow
      const h = window.innerHeight + r;
      // Tighter cap: avoid taller than 2x viewport + 400px
      const capped = Math.max(window.innerHeight, Math.min(h, window.innerHeight * 2 + 400));

      setSectionHeight(capped);
    };

    // Initial measure and on resize
    measure();
    window.addEventListener("resize", measure);

    // Re-measure when track content changes (images load etc.)
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -range]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={sectionHeight ? { height: `${sectionHeight}px` } : undefined}
    >
      <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t(UI.gallery.eyebrow)}
            title={t(UI.gallery.title)}
            description={t(UI.gallery.scrollDescription)}
          />
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex gap-6 pl-[max(1.5rem,calc((100vw-80rem)/2+2rem))] pr-24"
        >
          {photos.map((photo, index) => (
            <FilmCard
              key={photo.src}
              photo={photo}
              index={index}
              className={cn("h-[min(48vh,440px)]", CARD_WIDTHS[photo.size])}
            />
          ))}
        </motion.div>

        {/* Journey progress */}
        <div className="mx-auto mt-10 h-0.5 w-56 overflow-hidden rounded-full bg-white/10">
          <motion.div
            style={{ scaleX: scrollYProgress }}
            className="h-full origin-left bg-saffron"
          />
        </div>

        {/* Scroll hint — fades out as the journey begins */}
        <motion.p
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.3em] text-stone-500"
        >
          {t(UI.gallery.keepScrolling)}
          <motion.span
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <MoveRight className="size-4 text-saffron-bright" aria-hidden="true" />
          </motion.span>
        </motion.p>
      </div>
    </div>
  );
}

/** Mobile / reduced-motion: a native snap-scroll photo row. */
function SwipeRow({ photos }: { photos: GalleryImage[] }) {
  const { t } = useLang();
  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t(UI.gallery.eyebrow)}
          title={t(UI.gallery.title)}
          description={t(UI.gallery.swipeDescription)}
        />
      </div>
      <div className="scroll-row flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
        {photos.map((photo, index) => (
          <FilmCard
            key={photo.src}
            photo={photo}
            index={index}
            className="h-80 w-[min(78vw,320px)] snap-center"
          />
        ))}
      </div>
    </>
  );
}

export default function Gallery() {
  const { gallery, metadata } = RESTAURANT_DATA;
  const { t } = useLang();
  const reduceMotion = useReducedMotion();
  // Exactly one variant is mounted. Rendering both and hiding one with
  // `hidden md:block` left the section heading and all 23 photo captions in the
  // markup twice over.
  const pinned = useMediaQuery("(min-width: 768px)") && !reduceMotion;

  return (
    // No overflow-hidden on this section — it would break the sticky pinning of the filmstrip.
    <section id="gallery" className="relative">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(21,128,61,0.06),transparent_55%)]"
      />

      <div className={cn("relative", !pinned && "py-20")}>
        {pinned ? (
          <PinnedFilmstrip photos={gallery} />
        ) : (
          <SwipeRow photos={gallery} />
        )}
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 px-4 pb-20 pt-10 sm:flex-row sm:px-6 md:pb-28 lg:px-8">
        <a
          href={metadata.tabelogPhotosUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-cream transition-colors hover:border-saffron/60 hover:text-saffron-glow"
        >
          <Camera className="size-4" aria-hidden="true" />
          {t(UI.gallery.allPhotos)}
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
        <a
          href={metadata.tabelogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-stone-400 transition-colors hover:text-cream"
        >
          {t(UI.gallery.readReviews)}
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
