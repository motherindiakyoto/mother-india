"use client";

import { useEffect, useState } from "react";

/**
 * Safety net for `whileInView` scroll reveals.
 *
 * Those reveals ship their hidden state (`opacity: 0`) in the SSR HTML and
 * only clear it when IntersectionObserver reports the element in view. In any
 * context where that never happens — full-page screenshot and preview tools,
 * print, embedded webviews, JS-disabled crawlers — everything below the first
 * fold stays permanently invisible.
 *
 * This arms a one-shot timer at mount. Whatever has not been scrolled into
 * view by then is revealed anyway, so content can never be stranded. Real
 * visitors who scroll within the window still get the reveal as designed.
 *
 * Pair it with `whileInView` by passing the result to `animate` — Framer
 * Motion lets `whileInView` win while the element is actually in view.
 */
export function useRevealFallback(delayMs = 2500): boolean {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  return revealed;
}
