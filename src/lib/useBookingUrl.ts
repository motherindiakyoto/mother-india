"use client";

import { useSyncExternalStore } from "react";

import { buildBookingUrl } from "@/lib/utils";
import type { Lang } from "@/data/i18n";

/**
 * The Tabelog booking URL, safe to render on the server.
 *
 * `buildBookingUrl` stamps tomorrow's date into the query string, and the
 * server's "tomorrow" can differ from the visitor's — rendering it directly
 * risks a hydration mismatch. `useSyncExternalStore` is the fit: it hands back
 * the dateless fallback during SSR and the real, dated URL on the client, with
 * no effect and no second render pass.
 *
 * The snapshot is a plain string, so React's `Object.is` check settles
 * immediately even though `buildBookingUrl` builds a fresh one each call.
 */

/** Nothing external ever changes, so the subscription is a no-op. */
const subscribe = () => () => {};

function serverSnapshot(lang: Lang): string {
  const base =
    lang === "ja"
      ? "https://tabelog.com/booking/form_course/new"
      : "https://tabelog.com/en/booking/form_course/new";
  return `${base}?member=2&rcd=26043494`;
}

export function useBookingUrl(lang: Lang): string {
  return useSyncExternalStore(
    subscribe,
    () => buildBookingUrl(lang),
    () => serverSnapshot(lang)
  );
}
