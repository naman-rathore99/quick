"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  layoutContainer,
  sectionPadding,
  surfaceMutedBand,
  textSectionSubtitle,
  textSectionTitle,
} from "@/lib/design-system";
import { useCartStore } from "@/stores/cart-store";

import { useServicesCatalog } from "../hooks/use-services-catalog";
import { SERVICE_ICON_MAP } from "../services/service-icons";

export function ServicesSection() {
  const { items } = useServicesCatalog();
  const addItem = useCartStore((s) => s.addItem);

  return (
    <section className={`${surfaceMutedBand} ${sectionPadding}`} id="services">
      <div className={layoutContainer}>
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <h2 className={textSectionTitle}>Services You Can Trust</h2>
          <p className={textSectionSubtitle}>
            Choose from a range of verified home services tailored to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((service, index) => {
            const Icon = SERVICE_ICON_MAP[service.icon];

            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-40px" }}
                className="h-full"
              >
                <Card className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/40 bg-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="flex h-full flex-col items-center gap-4 p-8 text-center">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-muted/50 transition-colors duration-300 group-hover:bg-primary/10">
                      <Icon className="h-8 w-8 text-foreground transition-colors duration-300 group-hover:text-primary" />
                    </div>

                    <h3 className="text-xl font-bold leading-snug tracking-tight text-foreground">
                      {service.name}
                    </h3>

                    <p className="text-base font-semibold tabular-nums text-primary/80">
                      <span className="text-muted-foreground font-medium text-sm">Starts at </span>₹{service.price}
                    </p>

                    <div className="mt-auto w-full pt-4">
                      <Button
                        asChild
                        size="lg"
                        className="w-full rounded-xl text-base h-12 shadow-sm transition-all hover:scale-[1.02]"
                      >
                        <Link href={`/services/${service.id}`}>
                          View Services
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
