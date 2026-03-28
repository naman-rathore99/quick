import type { CatalogService } from "@/features/services/services/catalog";

import type { CartLine, EnrichedCartLine } from "../model/types";

export type CartTotals = {
  /** Sum of (unit price × quantity) for known catalog items */
  subtotal: number;
  /** Total units across all lines */
  itemCount: number;
  /** Number of distinct services in the cart */
  lineCount: number;
};

function catalogById(catalog: CatalogService[]) {
  return new Map(catalog.map((s) => [s.id, s]));
}

export function resolveCartLines(
  lines: CartLine[],
  catalog: CatalogService[]
): EnrichedCartLine[] {
  const map = catalogById(catalog);
  const out: EnrichedCartLine[] = [];
  for (const line of lines) {
    const svc = map.get(line.serviceId);
    if (!svc) continue;
    out.push({
      ...line,
      name: svc.name,
      unitPrice: svc.price,
      lineTotal: svc.price * line.quantity,
    });
  }
  return out;
}

export function computeCartTotals(
  lines: CartLine[],
  catalog: CatalogService[]
): CartTotals {
  const map = catalogById(catalog);
  let subtotal = 0;
  let itemCount = 0;
  let lineCount = 0;

  for (const line of lines) {
    const svc = map.get(line.serviceId);
    if (!svc) continue;
    lineCount += 1;
    itemCount += line.quantity;
    subtotal += svc.price * line.quantity;
  }

  return { subtotal, itemCount, lineCount };
}
