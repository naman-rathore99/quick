"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

import { StarRating } from "@/components/ui/star-rating";
import { layoutContainer } from "@/lib/design-system";

import { testimonials } from "../data/landing-content";

const avatarColors = [
  "bg-primary/10 text-primary border border-primary/20",
  "bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:text-blue-400",
  "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400",
  "bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400",
  "bg-purple-500/10 text-purple-600 border border-purple-500/20 dark:text-purple-400",
  "bg-rose-500/10 text-rose-600 border border-rose-500/20 dark:text-rose-400",
];

export function TestimonialsSection() {
  return (
    <section
      className="border-t border-border/60 bg-background py-16 md:py-24"
      id="testimonials"
      aria-labelledby="testimonials-heading"
    >
      <div className={layoutContainer}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-2xl text-center md:mb-16"
        >
          <h2
            id="testimonials-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            What Our Customers Say
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Real stories from families who trust QuickDidi
          </p>
        </motion.div>

        {/* Testimonials 3-Column Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {testimonials.map((t, index) => {
            const initial = t.name ? t.name.trim().charAt(0).toUpperCase() : "?";
            const avatarColorClass = avatarColors[index % avatarColors.length];

            return (
              <motion.figure
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                viewport={{ once: true }}
                className="group relative flex h-full flex-col justify-between rounded-3xl border border-border/60 bg-card/90 p-7 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl dark:bg-card/50"
              >
                <div>
                  {/* Top Quote Icon & Rating */}
                  <div className="flex items-center justify-between gap-3">
                    <Quote
                      className="h-9 w-9 text-primary/20"
                      aria-hidden="true"
                    />
                    <StarRating value={t.rating} />
                  </div>

                  {/* Quote Text */}
                  <p className="mt-5 text-base italic leading-relaxed text-foreground/90">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                {/* Person Info */}
                <footer className="mt-6 flex items-center gap-3.5 border-t border-border/40 pt-5">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-bold text-sm ${avatarColorClass}`}
                    aria-hidden="true"
                  >
                    {initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <cite className="not-italic">
                      <span className="block truncate font-bold text-foreground">
                        {t.name}
                      </span>
                      <span className="block truncate text-sm text-muted-foreground">
                        {t.role}
                      </span>
                    </cite>
                  </div>
                </footer>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}