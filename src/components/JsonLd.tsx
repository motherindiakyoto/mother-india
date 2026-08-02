import { jsonLdFor } from "@/lib/seo";
import type { Lang } from "@/data/i18n";

/**
 * The Restaurant / WebSite / WebPage / FAQPage graph for one locale, rendered
 * as a plain `<script>` — this is data, not executable code, so `next/script`
 * would only get in the way.
 */
export default function JsonLd({ lang }: { lang: Lang }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdFor(lang) }}
    />
  );
}
