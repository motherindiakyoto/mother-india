/**
 * Host constants, kept dependency-free so `next.config.ts` can import them
 * without pulling the data modules (and their `@/` aliases) into the config
 * loader. Everything else should import from `@/lib/seo`.
 */

/** The live custom domain — the only host that should ever be indexed. */
export const PRODUCTION_URL = "https://motherindiakyoto.com";

/**
 * The generated Vercel alias. The deployment answers here too, so the whole
 * site is reachable at two hosts; left alone Google indexes both and splits the
 * ranking signals. `next.config.ts` 308s it to `PRODUCTION_URL`.
 */
export const VERCEL_ALIAS = "mother-india-vert.vercel.app";
