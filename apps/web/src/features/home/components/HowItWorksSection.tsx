"use client";

import { motion } from "framer-motion";

import {
  layoutContainer,
  sectionPadding,
  textSectionSubtitle,
  textSectionTitle,
} from "@/lib/design-system";

import { howItWorksSteps } from "../data/landing-content";

export function HowItWorksSection() {
  return (
    <section
      className={`border-t border-border/60 bg-background ${sectionPadding}`}
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
    >
      <div className={layoutContainer}>
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
          <h2 id="how-it-works-heading" className={textSectionTitle}>
            How it works
          </h2>
          <p className={textSectionSubtitle}>
            Four simple steps from booking to a perfectly done service.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 md:gap-6 lg:gap-10">
          {howItWorksSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.title} className="relative w-full">
                {/* Connector Line (Desktop only) */}
                {index !== howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-7 right-[-50%] w-full h-px bg-border/60" />
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  viewport={{ once: true }}
                  className="group flex flex-col items-center text-center rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30"
                >
                  {/* Icon with Step Badge */}
                  <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary group-hover:ring-primary/40">
                    <span className="absolute -top-2 -right-2 text-[10px] bg-primary text-white rounded-full px-2 py-0.5">
                      {index + 1}
                    </span>
                    <Icon
                      className="h-7 w-7 text-primary transition-colors duration-300 group-hover:text-primary-foreground"
                      aria-hidden
                    />
                  </div>

                  {/* Step Label */}
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Step {index + 1}
                  </p>

                  {/* Title */}
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {step.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}