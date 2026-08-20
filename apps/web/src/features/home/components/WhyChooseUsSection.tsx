"use client";

import { motion } from "framer-motion";
import { layoutContainer } from "@/lib/design-system";
import { whyChooseUsFeatures } from "../data/landing-content";

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

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export function WhyChooseUsSection() {
  return (
    <section
      className="bg-muted/20 py-16 sm:py-20 lg:py-28"
      id="why-us"
      aria-labelledby="why-us-heading"
    >
      <div className={layoutContainer}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto mb-12 max-w-2xl text-center md:mb-16 lg:mb-20"
        >
          <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Trusted Home Care
          </div>
          <h2
            id="why-us-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Why Families Trust QuickDidi
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Built for busy homes — quality help without the hassle.
          </p>
        </motion.div>

        {/* 2x2 Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8"
        >
          {whyChooseUsFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                variants={cardVariants}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 border-l-4 border-l-primary bg-card p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-border"
              >
                <div>
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-7 w-7 transition-colors" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {feature.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
