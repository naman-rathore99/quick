"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  cardService,
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
                <Card className={cardService}>
                  <CardContent className="flex h-full flex-col items-center gap-4 p-6 text-center">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-muted ring-1 ring-border/60 transition-colors duration-300 group-hover:bg-primary group-hover:ring-primary/20">
                      <Icon className="h-7 w-7 text-foreground transition-colors duration-300 group-hover:text-primary-foreground" />
                    </div>

                    <h3 className="text-lg font-semibold leading-snug tracking-tight text-foreground">
                      {service.name}
                    </h3>

                    <p className="text-sm font-medium tabular-nums text-muted-foreground">
                      <span className="text-foreground/70">From </span>₹{service.price}
                    </p>

                    <div className="mt-auto w-full pt-1">
                      <Button
                        type="button"
                        size="default"
                        className="w-full"
                        onClick={() => addItem(service.id)}
                      >
                        Add to cart
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
