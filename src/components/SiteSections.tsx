import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import Amenities from "@/components/sections/Amenities";
import MenuShowcase from "@/components/sections/MenuShowcase";
import Gallery from "@/components/sections/Gallery";
import Testimonials from "@/components/sections/Testimonials";
import Faq from "@/components/sections/Faq";

/**
 * The page body, shared by both locale routes (`/` and `/ja`). The sections
 * read the active language from the URL, so the same tree server-renders as
 * English or Japanese depending on which route mounts it.
 */
export default function SiteSections() {
  return (
    <main id="top" className="flex-1">
      <Hero />
      <Story />
      <MenuShowcase />
      <Gallery />
      <Testimonials />
      {/* Practical details sit last, right above the Visit block in the footer. */}
      <Amenities />
      <Faq />
    </main>
  );
}
