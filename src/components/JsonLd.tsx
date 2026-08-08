import { jsonLdFor, jsonLdForMenu } from "@/lib/seo";
import type { Lang } from "@/data/i18n";

/**
 * The structured-data graph for one locale, rendered as a plain `<script>` —
 * this is data, not executable code, so `next/script` would only get in the way.
 *
 * `page` picks the graph: the home page emits Restaurant / WebSite / WebPage /
 * FAQPage / Menu, while `/menu` swaps the FAQ node for a page node describing
 * that URL. Each route must describe *itself*, or the two pages compete for
 * the same `@id`.
 */
export default function JsonLd({
  lang,
  page = "home",
  meta,
}: {
  lang: Lang;
  page?: "home" | "menu";
  meta?: { name: string; description: string };
}) {
  const json =
    page === "menu" && meta ? jsonLdForMenu(lang, meta) : jsonLdFor(lang);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
