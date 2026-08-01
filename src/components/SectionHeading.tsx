"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useRevealFallback } from "@/lib/reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const revealed = useRevealFallback();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      animate={revealed ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "mb-12 max-w-2xl md:mb-16",
        align === "center" ? "mx-auto text-center" : "text-left"
      )}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-saffron-bright">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl leading-tight text-cream sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-stone-400">
          {description}
        </p>
      )}
    </motion.div>
  );
}
