"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useMounted } from "@/lib/responsive";
import { cn } from "@/lib/utils";

const arrowClass =
  "pointer-events-none flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-obsidian/70 text-cream opacity-0 backdrop-blur-md transition-all duration-200 hover:border-saffron/60 hover:text-saffron-glow focus-visible:pointer-events-auto focus-visible:opacity-100 group-hover/slider:pointer-events-auto group-hover/slider:opacity-100";

interface MotionSliderProps {
  /** Slide elements — rendered twice for a seamless infinite loop. */
  children: React.ReactNode[];
  /** Auto-drift speed in px/s. */
  speed?: number;
  /** Pixels each arrow press advances. */
  step?: number;
  label: string;
  className?: string;
}

/**
 * Infinite, draggable, auto-drifting carousel.
 * - Drifts continuously; pauses on hover, drag, or arrow interaction.
 * - Drag is bounded to one full loop so the track never shows a gap.
 * - Falls back to a native snap-scroll row under prefers-reduced-motion.
 */
export default function MotionSlider({
  children,
  speed = 28,
  step = 340,
  label,
  className,
}: MotionSliderProps) {
  const reduceMotion = useReducedMotion();
  // The loop clone is a client-side visual device. Held back until mount so the
  // SSR markup names each dish once rather than twice.
  const mounted = useMounted();
  const trackRef = useRef<HTMLDivElement>(null);
  const [loopWidth, setLoopWidth] = useState(0);
  const x = useMotionValue(0);
  const hovering = useRef(false);
  const dragging = useRef(false);
  const pauseUntil = useRef(0);

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
    if (reduceMotion || loopWidth === 0) return;
    const value = x.get();
    // Seamless wrap — identical content sits exactly one loop away.
    if (!dragging.current) {
      if (value <= -loopWidth) {
        x.set(value + loopWidth);
        return;
      }
      if (value > 0) {
        x.set(value - loopWidth);
        return;
      }
    }
    if (dragging.current || hovering.current || performance.now() < pauseUntil.current) {
      return;
    }
    x.set(value - (delta / 1000) * speed);
  });

  const nudge = (direction: -1 | 1) => {
    pauseUntil.current = performance.now() + 1200;
    animate(x, x.get() + direction * step, {
      type: "spring",
      stiffness: 220,
      damping: 30,
    });
  };

  if (reduceMotion) {
    return (
      <div
        aria-label={label}
        className={cn(
          "scroll-row flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 *:snap-start",
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className={cn("group/slider relative", className)}
    >
      <div
        className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
        onMouseEnter={() => (hovering.current = true)}
        onMouseLeave={() => (hovering.current = false)}
      >
        <motion.div
          ref={trackRef}
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -loopWidth, right: 0 }}
          dragElastic={0.06}
          dragMomentum={false}
          onDragStart={() => (dragging.current = true)}
          onDragEnd={() => {
            dragging.current = false;
            pauseUntil.current = performance.now() + 800;
          }}
          className="flex w-max cursor-grab gap-5 py-2 active:cursor-grabbing"
        >
          {children}
          {/* Duplicate set for the seamless loop — hidden from assistive tech. */}
          {mounted && (
            <div aria-hidden="true" className="contents">
              {children}
            </div>
          )}
        </motion.div>
      </div>

      {/* Arrow controls — pointer-only. On touch the row is swiped directly, and
          leaving invisible buttons tappable would swallow taps on the cards. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between px-1 [@media(hover:hover)]:flex sm:px-2">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => nudge(1)}
          className={arrowClass}
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => nudge(-1)}
          className={arrowClass}
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
