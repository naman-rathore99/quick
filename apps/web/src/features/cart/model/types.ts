export type CartLine = {
  serviceId: string;
  quantity: number;
};

export type EnrichedCartLine = CartLine & {
  name: string;
  unitPrice: number;
  lineTotal: number;
};
