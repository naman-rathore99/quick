import { create } from "zustand";

import type { CartLine } from "@/features/cart/model/types";

function upsertLine(
  lines: CartLine[],
  serviceId: string,
  delta: number
): CartLine[] {
  const idx = lines.findIndex((l) => l.serviceId === serviceId);
  if (idx === -1) {
    if (delta <= 0) return lines;
    return [...lines, { serviceId, quantity: delta }];
  }
  const next = [...lines];
  const q = next[idx].quantity + delta;
  if (q <= 0) {
    next.splice(idx, 1);
    return next;
  }
  next[idx] = { serviceId, quantity: q };
  return next;
}

function setLineQuantity(lines: CartLine[], serviceId: string, quantity: number) {
  if (quantity <= 0) {
    return lines.filter((l) => l.serviceId !== serviceId);
  }
  const idx = lines.findIndex((l) => l.serviceId === serviceId);
  if (idx === -1) {
    return [...lines, { serviceId, quantity }];
  }
  const next = [...lines];
  next[idx] = { serviceId, quantity };
  return next;
}

type CartStore = {
  lines: CartLine[];
  addItem: (serviceId: string, quantity?: number) => void;
  removeLine: (serviceId: string) => void;
  increment: (serviceId: string) => void;
  decrement: (serviceId: string) => void;
  setQuantity: (serviceId: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  lines: [],
  addItem: (serviceId, quantity = 1) =>
    set((s) => ({ lines: upsertLine(s.lines, serviceId, quantity) })),
  removeLine: (serviceId) =>
    set((s) => ({
      lines: s.lines.filter((l) => l.serviceId !== serviceId),
    })),
  increment: (serviceId) =>
    set((s) => ({ lines: upsertLine(s.lines, serviceId, 1) })),
  decrement: (serviceId) =>
    set((s) => ({ lines: upsertLine(s.lines, serviceId, -1) })),
  setQuantity: (serviceId, quantity) =>
    set((s) => ({ lines: setLineQuantity(s.lines, serviceId, quantity) })),
  clear: () => set({ lines: [] }),
}));
