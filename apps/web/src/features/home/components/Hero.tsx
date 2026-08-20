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

          {/* Interactive Booking Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-10 mx-auto max-w-2xl bg-card rounded-2xl shadow-xl border border-border/60 p-2 flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 border-b sm:border-b-0 sm:border-r border-border/60">
              <Sparkles className="h-5 w-5 text-primary" />
              <select className="w-full bg-transparent outline-none text-foreground text-sm font-medium h-10">
                <option value="">What do you need help with?</option>
                <option value="cleaning">Home Cleaning</option>
                <option value="dusting">Dusting & Sweeping</option>
                <option value="cooking">Cooking</option>
              </select>
            </div>
            
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-2">
              <Clock className="h-5 w-5 text-primary" />
              <select className="w-full bg-transparent outline-none text-foreground text-sm font-medium h-10">
                <option value="">When?</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="later">Later this week</option>
              </select>
            </div>

            <Button
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-base shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform rounded-xl"
            >
              See Providers
            </Button>
          </motion.div>

          {/* Trust Chips */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-medium text-muted-foreground"
          >
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Background Checked</li>
            <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> On-time Guarantee</li>
            <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Top Rated Didis</li>
          </motion.ul>

        </div>
      </div>
    </section>
  );
}