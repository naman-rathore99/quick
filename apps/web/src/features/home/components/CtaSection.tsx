"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Star, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { layoutContainer } from "@/lib/design-system";

import { ctaCopy } from "../data/landing-content";

const trustBadges = [
  {
    icon: Users,
    label: "500+ Happy Customers",
  },
  {
    icon: ShieldCheck,
    label: "100+ Verified Didis",
  },
  {
    icon: Star,
    label: "4.9 Average Rating",
    iconColor: "text-amber-300 fill-amber-300",
  },
];

export function CtaSection() {
  return (
    <section
      className="relative overflow-hidden bg-primary text-primary-foreground py-20 sm:py-24 md:py-28"
      aria-labelledby="cta-heading"
    >
      {/* Decorative ambient background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-black/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_70%)]"
      />

      <div className={`relative z-10 ${layoutContainer}`}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          {/* Subtle Tagline / Pill */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-medium backdrop-blur-sm shadow-inner">
            <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
            <span>Reliable &amp; Verified Home Help</span>
          </div>

          {/* Heading */}
          <h2
            id="cta-heading"
            className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.15]"
          >
            {ctaCopy.title}
          </h2>

          {/* Subtitle */}
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg md:text-xl text-primary-foreground/90 font-normal leading-relaxed">
            {ctaCopy.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto min-w-[13rem] h-12 sm:h-13 px-8 text-base font-semibold bg-white text-neutral-900 hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl shadow-black/10 group"
            >
              <Link href="/services" className="inline-flex items-center justify-center gap-2">
                <span>{ctaCopy.buttonLabel}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto min-w-[13rem] h-12 sm:h-13 px-8 text-base font-semibold border-2 border-white text-white bg-transparent hover:bg-white/15 hover:text-white hover:border-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md backdrop-blur-sm"
            >
              <Link href="/partner" className="inline-flex items-center justify-center">
                Become a Partner
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 sm:mt-16 pt-8 border-t border-white/20">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-12">
              {trustBadges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <motion.div
                    key={badge.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: 0.15 + index * 0.1,
                      ease: "easeOut",
                    }}
                    className="flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-2 text-xs sm:text-sm font-medium text-white backdrop-blur-sm border border-white/15 shadow-sm"
                  >
                    <Icon
                      className={`h-4 w-4 ${badge.iconColor || "text-white"}`}
                    />
                    <span>{badge.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}