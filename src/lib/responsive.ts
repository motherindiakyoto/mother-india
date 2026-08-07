"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Live `matchMedia` result, safe to call during a server render.
 *
 * The point is not styling — Tailwind already does that. It is that a pair of
 * responsive variants rendered together and toggled with `hidden md:block` /
 * `md:hidden` puts *both* copies in the markup. Crawlers read the markup, not
 * the computed styles, so every heading, caption and quote in the pair counts
 * twice as duplicated body copy. Mounting one variant keeps the page honest.
 *
 * Server and first hydration pass report `false`, i.e. the narrow variant —
 * the one that works without JavaScript and matches how Googlebot renders.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

const noopSubscribe = () => () => {};

/**
 * `false` while server-rendering and hydrating, `true` afterwards.
 *
 * Guards markup that exists purely for a JS-driven effect — the cloned track
 * halves that make the sliders loop seamlessly. They are meaningless before
 * hydration and, left in the SSR HTML, they duplicate every string they carry.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}
