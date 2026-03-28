"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useCartStore } from "@/stores/cart-store";
import { useCartView } from "../hooks/use-cart";
import { CartLineRow } from "./CartLineRow";

export function CartSheet() {
  const router = useRouter();

  const { enrichedLines, totals } = useCartView();
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const removeLine = useCartStore((s) => s.removeLine);

  const handleCheckout = () => {
    if (enrichedLines.length === 0) return;
    router.push("/checkout");
  };

  return (
    <Sheet>
      {/* Trigger */}
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="relative h-10 gap-2 px-3"
          aria-label={`Cart, ${totals.itemCount} items`}
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="hidden sm:inline">Cart</span>

          {totals.itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
              {totals.itemCount > 99 ? "99+" : totals.itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      {/* Sheet Content */}
      <SheetContent
        side="right"
        className="flex w-full flex-col border-border/80 sm:max-w-md"
      >
        {/* Header */}
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="text-lg font-semibold tracking-tight">
            Your cart
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 space-y-3 overflow-y-auto py-5">
          {enrichedLines.length === 0 ? (
            <p className="py-14 text-center text-sm leading-relaxed text-muted-foreground">
              No services added yet. Browse below and add what you need.
            </p>
          ) : (
            enrichedLines.map((line) => (
              <CartLineRow
                key={line.serviceId}
                line={line}
                onIncrement={() => increment(line.serviceId)}
                onDecrement={() => decrement(line.serviceId)}
                onRemove={() => removeLine(line.serviceId)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold tabular-nums text-foreground">
              ₹{totals.subtotal}
            </span>
          </div>

          <Button
            type="button"
            size="lg"
            className="w-full"
            disabled={enrichedLines.length === 0}
            onClick={handleCheckout}
          >
            Proceed to checkout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}