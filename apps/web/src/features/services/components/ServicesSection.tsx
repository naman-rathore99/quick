"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  layoutContainer,
  textSectionSubtitle,
  textSectionTitle,
} from "@/lib/design-system";
import { useCartStore } from "@/stores/cart-store";

import { useServicesCatalog } from "../hooks/use-services-catalog";
import { SERVICE_ICON_MAP } from "../services/service-icons";

export function ServicesSection() {
  const { items, status } = useServicesCatalog();
  const [available, setAvailable] = useState<Set<string> | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    fetch(`${api}/providers`, { signal: controller.signal }).then(async (response) => {
      if (!response.ok) return;
      const { providers }: { providers: { service_id: string; custom_price: number; users: { id: string } | null }[] } = await response.json();
      if (!controller.signal.aborted) {
        setAvailable(new Set(providers.filter((item) => item.users && item.custom_price > 0).map((item) => item.service_id)));
      }
    }).catch(() => {});
    return () => controller.abort();
  }, []);
  const lines = useCartStore((state) => state.lines);
  const addItem = useCartStore((s) => s.addItem);

  return (
    <section className="qd-services border-b bg-card py-12 md:py-16" id="services">
      <div className={layoutContainer}>
        <div className="mb-7 max-w-2xl">
          <h2 className={textSectionTitle}>Home services</h2>
          <p className={textSectionSubtitle}>
            Add a service to your cart. You’ll see the price when you choose a provider.
          </p>
        </div>

        {status && <p role="status">{status}</p>}
        <ul className="grid gap-x-10 border-t md:grid-cols-2">
          {items.map((service) => {
            const Icon = SERVICE_ICON_MAP[service.icon];
            const quantity = lines.find((line) => line.serviceId === service.id)?.quantity ?? 0;

            return (
              <li key={service.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b py-4 sm:gap-4">
                <span className="grid size-10 place-items-center rounded-md bg-muted text-primary">
                  <Icon aria-hidden="true" size={19} />
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold leading-snug">{service.name}</h3>
                  {available && !available.has(service.id) && (
                    <p className="mt-1 text-xs text-muted-foreground">No providers listed yet</p>
                  )}
                  <span aria-live="polite" className="text-xs text-primary">
                    {quantity > 0 ? `${quantity} in cart` : ""}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-label={`Add ${service.name} to booking`}
                  onClick={() => addItem(service.id)}
                >
                  <Plus size={15} aria-hidden="true" /> Add
                </Button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
