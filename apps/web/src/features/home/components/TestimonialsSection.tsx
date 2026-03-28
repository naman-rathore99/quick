"use client";

import { motion } from "framer-motion";

import { StarRating } from "@/components/ui/star-rating";
import {
  layoutContainer,
  sectionPadding,
  textSectionSubtitle,
  textSectionTitle,
} from "@/lib/design-system";

import { testimonials } from "../data/landing-content";

export function TestimonialsSection() {
  return (
    <section
      className={`border-t border-border/60 bg-background ${sectionPadding}`}
      id="testimonials"
      aria-labelledby="testimonials-heading"
    >
      <div className={layoutContainer}>
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
          <h2 id="testimonials-heading" className={textSectionTitle}>
            Loved by customers
          </h2>
          <p className={textSectionSubtitle}>
            Real stories from people who trust QuickDidi for their home.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {testimonials.map((t, index) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
              className="
                group flex h-full flex-col
                rounded-2xl border border-border/60
                bg-card/80 backdrop-blur-sm
                p-6
                shadow-sm transition-all duration-300
                hover:-translate-y-1 hover:shadow-xl hover:border-primary/30
              "
            >
              {/* Rating */}
              <StarRating value={t.rating} className="mb-4" />

              {/* Quote */}
              <p className="flex-1 text-base leading-relaxed text-foreground/90">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Footer */}
              <footer className="mt-6 pt-4">
                <cite className="not-italic">
                  <span className="block font-semibold text-foreground">
                    {t.name}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {t.role}
                  </span>
                </cite>
              </footer>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}