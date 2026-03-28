import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type StarRatingProps = {
  value: number;
  className?: string;
};

export function StarRating({ value, className }: StarRatingProps) {
  const clamped = Math.min(5, Math.max(0, Math.round(value)));

  return (
    <div
      className={cn("flex gap-0.5", className)}
      role="img"
      aria-label={`${clamped} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4 shrink-0",
            i < clamped
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-muted-foreground/35"
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}
