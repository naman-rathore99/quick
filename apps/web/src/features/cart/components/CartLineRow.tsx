"use client";

import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { EnrichedCartLine } from "../model/types";

type CartLineRowProps = {
  line: EnrichedCartLine;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
};

export function CartLineRow({
  line,
  onIncrement,
  onDecrement,
  onRemove,
}: CartLineRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-muted/30 p-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-snug text-foreground">{line.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">₹{line.unitPrice} each</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <div className="flex items-center gap-0.5 rounded-xl border border-border bg-background p-0.5 shadow-sm">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={onDecrement}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center text-sm font-medium tabular-nums text-foreground">
            {line.quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={onIncrement}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tabular-nums text-foreground">
            ₹{line.lineTotal}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
            aria-label={`Remove ${line.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
