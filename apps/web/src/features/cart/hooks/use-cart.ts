import { useMemo } from "react";

import { getCatalog } from "@/features/services/services/catalog";
import { useCartStore } from "@/stores/cart-store";

import type { EnrichedCartLine } from "../model/types";
import {
  computeCartTotals,
  resolveCartLines,
  type CartTotals,
} from "../services/cart-totals";

const catalog = getCatalog();

export type CartView = {
  totals: CartTotals;
  enrichedLines: EnrichedCartLine[];
};

/**
 * Single subscription + one memo for cart lines and totals (avoids duplicate store reads).
 */
export function useCartView(): CartView {
  const lines = useCartStore((s) => s.lines);
  return useMemo(
    () => ({
      totals: computeCartTotals(lines, catalog),
      enrichedLines: resolveCartLines(lines, catalog),
    }),
    [lines]
  );
}
