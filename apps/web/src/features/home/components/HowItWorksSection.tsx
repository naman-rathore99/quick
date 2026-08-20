"use client";

import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, CheckCircle2, Star } from "lucide-react";
import { layoutContainer } from "@/lib/design-system";
import { howItWorksSteps } from "../data/landing-content";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="relative overflow-hidden bg-background py-20 sm:py-28 lg:py-32 border-t border-border/50"
    >
      {/* Decorative ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-[300px] h-[200px] bg-primary/[0.03] rounded-full blur-2xl" />
      </div>

      <div className={layoutContainer}>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 shadow-xs mb-4"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Effortless & Transparent</span>
          </motion.div>

          <motion.h2
            id="how-it-works-heading"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground"
          >
            How QuickDidi Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Book your trusted home help in 4 simple steps
          </motion.p>
        </div>

        {/* Desktop Stepper Layout (lg and up) */}
        <div className="hidden lg:block relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-4 gap-8 relative z-10"
          >
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === howItWorksSteps.length - 1;

              return (
                <div key={step.title} className="relative flex flex-col items-center">
                  {/* Dashed connector line to next step */}
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className="absolute top-12 left-1/2 w-full h-0 border-t-2 border-dashed border-primary/30 z-0 pointer-events-none"
                    />
                  )}

                  <motion.div
                    variants={itemVariants}
                    className="group relative z-10 flex flex-col items-center text-center w-full"
                  >
                    {/* Large Numbered Circle with Icon */}
                    <div className="relative mb-6">
                      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-card border-2 border-border/80 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:border-primary group-hover:shadow-xl group-hover:shadow-primary/15 group-hover:bg-primary/[0.03]">
                        <Icon
                          className="h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110"
                          aria-hidden="true"
                        />
                      </div>

                      {/* Floating Number Badge */}
                      <span className="absolute -top-2.5 -right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-md ring-4 ring-background transition-transform duration-300 group-hover:scale-110">
                        {index + 1}
                      </span>
                    </div>

                    {/* Step Label */}
                    <span className="text-xs font-bold uppercase tracking-wider text-primary/80 mb-1.5">
                      Step {index + 1}
                    </span>

                    {/* Title */}
                    <h3 className="text-xl font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2.5 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[260px]">
                      {step.description}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Mobile / Tablet Vertical Stepper Layout (below lg) */}
        <div className="lg:hidden relative max-w-xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col gap-8 relative"
          >
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === howItWorksSteps.length - 1;

              return (
                <motion.div
                  key={step.title}
                  variants={itemVariants}
                  className="relative flex items-start gap-5 sm:gap-6 group"
                >
                  {/* Vertical Timeline Column */}
                  <div className="relative flex flex-col items-center self-stretch shrink-0">
                    {/* Circle Node */}
                    <div className="relative z-10 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-card border-2 border-border shadow-sm transition-all duration-300 group-hover:border-primary group-hover:shadow-md group-hover:scale-105">
                      <Icon
                        className="h-7 w-7 sm:h-8 sm:w-8 text-primary transition-transform duration-300 group-hover:scale-110"
                        aria-hidden="true"
                      />
                      {/* Step Number Badge */}
                      <span className="absolute -top-2 -right-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-bold shadow-md ring-2 ring-background">
                        {index + 1}
                      </span>
                    </div>

                    {/* Vertical Dashed Line */}
                    {!isLast && (
                      <div
                        aria-hidden="true"
                        className="w-0 flex-1 border-l-2 border-dashed border-primary/30 my-2"
                      />
                    )}
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 pb-4 pt-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Step {index + 1}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mt-1 group-hover:text-primary transition-colors duration-200">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom Trust & Feature Pill Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 sm:mt-20 pt-8 border-t border-border/50 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
            <span className="font-medium">100% Background-Verified Helpers</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span className="font-medium">Secure & Cashless Payments</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
            <span className="font-medium">4.9/5 Average Service Rating</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}