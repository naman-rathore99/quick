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
  const [showModal, setShowModal] = useState(false);

  // Show modal only once — guarded for SSR (localStorage is browser-only)
  useEffect(() => {
    const seen = localStorage.getItem("seenMaintenanceModal");
    if (!seen) {
      const timer = setTimeout(() => {
        setShowModal(true);
        localStorage.setItem("seenMaintenanceModal", "true");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <section className="relative isolate overflow-hidden">

      {/* Maintenance Modal — AnimatePresence enables exit animations */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              className="relative w-[90%] max-w-md rounded-2xl bg-background p-6 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>

              {/* Content */}
              <div className="text-center space-y-4">
                <h2 className="text-xl font-bold">🚧 We're launching soon!</h2>
                <p className="text-sm text-muted-foreground">
                  QuickDidi is currently under maintenance.
                  We'll be live very soon with trusted home services near you.
                </p>
                <Button onClick={() => setShowModal(false)} className="w-full mt-2">
                  Got it
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Background Glow */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/20 blur-3xl rounded-full"
        />
      </div>

      <div className={`${layoutContainer} ${sectionPadding}`}>
        <div className="mx-auto max-w-3xl text-center">

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={textHeroDisplay}
          >
            {copy.titleLead}
            <span className={textHeroAccent}>{copy.titleAccent}</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className={`mx-auto ${textHeroBody} max-w-xl`}
          >
            {copy.description}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className={`mt-8 justify-center ${ctaRow}`}
          >
            <Button
              size="lg"
              className="min-w-[12rem] shadow-xl hover:scale-[1.04] active:scale-[0.98] transition"
            >
              {copy.primaryCta}
            </Button>
            <Button variant="outline" size="lg" className="min-w-[12rem]">
              {copy.secondaryCta}
            </Button>
          </motion.div>

          {/* Trust Chips */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-10 flex flex-wrap justify-center gap-3"
          >
            <li className={trustChip}><ShieldCheck className="h-4 w-4" />{copy.trust[0].label}</li>
            <li className={trustChip}><Clock className="h-4 w-4" />{copy.trust[1].label}</li>
            <li className={trustChip}><Sparkles className="h-4 w-4" />{copy.trust[2].label}</li>
          </motion.ul>

        </div>
      </div>
    </section>
  );
}