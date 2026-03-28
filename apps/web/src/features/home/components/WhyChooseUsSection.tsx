"use client";

import { motion } from "framer-motion";

import {
  layoutContainer,
  sectionPadding,
  surfaceMutedBand,
  textSectionSubtitle,
  textSectionTitle,
} from "@/lib/design-system";

import { whyChooseUsFeatures } from "../data/landing-content";

export function WhyChooseUsSection() {
  return (
    <section
      className={`${surfaceMutedBand} ${sectionPadding}`}
      id="why-us"
      aria-labelledby="why-us-heading"
    >
      <div className={layoutContainer}>
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <h2 id="why-us-heading" className={textSectionTitle}>
            Why choose QuickDidi
          </h2>
          <p className={textSectionSubtitle}>
            Built for busy homes — quality help without the hassle.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {whyChooseUsFeatures.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                viewport={{ once: true, margin: "-24px" }}
                className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-background ring-1 ring-border/80">
                  <Icon className="h-6 w-6 text-foreground" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
