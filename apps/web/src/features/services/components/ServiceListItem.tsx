"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
import { SubService } from "@/features/services/services/catalog";
import { useCartStore } from "@/stores/cart-store";

interface ServiceListItemProps {
  service: SubService;
}

export function ServiceListItem({ service }: ServiceListItemProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="flex flex-col sm:flex-row items-start justify-between gap-6 py-6 border-b border-border/40 last:border-0">
      {/* Left side: Details */}
      <div className="flex-1 space-y-3">
        <h3 className="text-xl font-bold text-foreground">{service.name}</h3>
        
        {/* Rating and Duration */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1 text-primary">
            <Star className="h-4 w-4 fill-primary" />
            <span className="font-semibold">{service.rating}</span>
            <span className="text-muted-foreground">({service.reviewCount})</span>
          </div>
        </div>

        {/* Price and Time */}
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-foreground">₹{service.price}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{service.durationMins} mins</span>
        </div>

        {/* Bullets */}
        {service.bullets && service.bullets.length > 0 && (
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
            {service.bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        )}

        <button className="text-primary font-medium text-sm hover:underline mt-2">
          View details
        </button>
      </div>

      {/* Right side: Image + Add Button */}
      <div className="w-full sm:w-[200px] shrink-0 flex flex-col items-center gap-4">
        <div className="w-full aspect-square rounded-xl overflow-hidden relative">
          <BeforeAfterSlider 
            beforeImage={service.beforeImage} 
            afterImage={service.afterImage} 
          />
        </div>
        
        <Button 
          variant="outline" 
          className="w-[120px] rounded-lg font-bold text-primary border-primary/20 hover:bg-primary/5 -mt-8 bg-background relative z-20 shadow-sm"
          onClick={() => addItem(service.id)}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
