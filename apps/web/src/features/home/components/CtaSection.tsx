"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { layoutContainer, sectionPadding } from "@/lib/design-system";

import { ctaCopy } from "../data/landing-content";

export function CtaSection() {
  return (
    <section
      className={`relative overflow-hidden ${sectionPadding} bg-neutral-950 text-neutral-50`}
      aria-labelledby="cta-heading"
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]" />

      <div className={`relative ${layoutContainer}`}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Title */}
          <h2
            id="cta-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
          >
            {ctaCopy.title}
          </h2>

          {/* Subtitle */}
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
            {ctaCopy.subtitle}
          </p>

          {/* CTA Button */}
          <div className="mt-10 flex justify-center">
            <Button
              type="button"
              size="lg"
              className="min-w-[12rem] bg-white text-neutral-950 shadow-xl transition-all duration-300 hover:bg-neutral-200 hover:scale-[1.03] active:scale-[0.98]"
            >
              {ctaCopy.buttonLabel}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}