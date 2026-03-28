export type CatalogServiceIcon =
  | "Sparkles"
  | "Utensils"
  | "ShowerHead"
  | "ChefHat";

export type CatalogService = {
  id: string;
  name: string;
  price: number;
  icon: CatalogServiceIcon;
};

const catalog: CatalogService[] = [
  { id: "cleaning", name: "House Cleaning", price: 499, icon: "Sparkles" },
  { id: "utensils", name: "Dishwashing", price: 299, icon: "Utensils" },
  {
    id: "bathroom",
    name: "Bathroom Cleaning",
    price: 399,
    icon: "ShowerHead",
  },
  { id: "cooking", name: "Cooking", price: 599, icon: "ChefHat" },
];

export function getCatalog(): CatalogService[] {
  return catalog;
}

export function getServiceById(id: string): CatalogService | undefined {
  return catalog.find((s) => s.id === id);
}
