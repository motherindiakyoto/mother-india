import { cn } from "@/lib/utils";

/**
 * The "MI" monogram from `app/icon.svg` — the same mark the browser tab shows,
 * so the header and the favicon read as one identity.
 *
 * Inlined rather than loaded as an image: it's under a kilobyte, costs no
 * request, stays sharp at any size, and can pick up hover state from the link
 * that wraps it. The gradient id is namespaced so it can't collide with the
 * favicon document or a second instance on the page.
 *
 * Decorative by default — every place it appears, the brand name is written
 * out beside it, so announcing it again would only repeat the same words.
 */
export default function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient
          id="brandmark-tile"
          x1="0"
          y1="0"
          x2="0"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FBBF24" />
          <stop offset=".55" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#brandmark-tile)" />
      {/* Hairline keeps the tile edge defined against a light surface. */}
      <rect
        x=".5"
        y=".5"
        width="63"
        height="63"
        rx="13.5"
        fill="none"
        stroke="#0F0F11"
        strokeOpacity=".2"
      />
      {/* Monogram drawn as strokes, not text: no font dependency, and the
          7-unit weight survives downsampling. 10.7:1 against the tile. */}
      <g
        fill="none"
        stroke="#0F0F11"
        strokeWidth="7"
        strokeLinejoin="miter"
      >
        <path d="M15 44V21l10 12 10-12v23" />
        <path d="M48 21v23" />
      </g>
    </svg>
  );
}
