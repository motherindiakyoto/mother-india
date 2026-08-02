"use client";

import { useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";

import { langFromPath, type L, type Lang } from "@/data/i18n";

/**
 * The active language is derived from the URL, not from state: `/` is English
 * and `/ja` is Japanese. That keeps the language a server-rendered fact, so
 * each locale is a real crawlable document rather than a client-side re-render
 * of the same one. Switching languages is a navigation — see `LangToggle`.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useLang().lang;

  // The root layout can only emit one static `<html lang>`; keep the live DOM
  // honest for screen readers and translation tools on the Japanese route.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return <>{children}</>;
}

/** Access the active language plus a `t` resolver for localized strings. */
export function useLang() {
  const pathname = usePathname();
  const lang: Lang = langFromPath(pathname ?? "/");
  const t = useCallback((value: L) => value[lang], [lang]);
  return { lang, t };
}
