"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, Clock } from "lucide-react";

import {
  ctaRow,
  layoutContainer,
  sectionPadding,
  textHeroAccent,
  textHeroBody,
  textHeroDisplay,
  trustChip,
} from "@/lib/design-system";

import { useHeroCopy } from "../hooks/use-hero-copy";

export function Hero() {
  const copy = useHeroCopy();

  return (
    <section className="relative isolate overflow-hidden bg-muted/30 border-b border-border/40">
      <div className={`${layoutContainer} ${sectionPadding} lg:py-24`}>
        <div className="mx-auto max-w-4xl text-center">

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl mb-6"
          >
            {copy.titleLead}{" "}
            <span className="text-primary">{copy.titleAccent}</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className={`mx-auto text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed`}
          >
            {copy.description}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className={`mt-10 justify-center flex flex-col sm:flex-row gap-4`}
          >
            <Button
              size="lg"
              className="min-w-[14rem] h-14 text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-transform rounded-full"
            >
              {copy.primaryCta}
            </Button>
            <Button variant="outline" size="lg" className="min-w-[14rem] h-14 text-lg rounded-full bg-background border-border hover:bg-muted">
              {copy.secondaryCta}
            </Button>
          </motion.div>

          {/* Trust Chips */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-6"
          >
            <li className="flex items-center gap-2 text-sm font-medium text-foreground bg-background px-4 py-2 rounded-full shadow-sm border border-border/60"><ShieldCheck className="h-5 w-5 text-primary" />{copy.trust[0].label}</li>
            <li className="flex items-center gap-2 text-sm font-medium text-foreground bg-background px-4 py-2 rounded-full shadow-sm border border-border/60"><Clock className="h-5 w-5 text-primary" />{copy.trust[1].label}</li>
            <li className="flex items-center gap-2 text-sm font-medium text-foreground bg-background px-4 py-2 rounded-full shadow-sm border border-border/60"><Sparkles className="h-5 w-5 text-primary" />{copy.trust[2].label}</li>
          </motion.ul>

        </div>
      </div>
    </section>
  );
}