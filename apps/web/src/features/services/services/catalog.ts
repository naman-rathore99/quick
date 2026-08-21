export type CatalogServiceIcon =
  | "Sparkles"
  | "Utensils"
  | "ShowerHead"
  | "ChefHat";

export type SubService = {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: string;
  durationMins: number;
  bullets: string[];
  beforeImage: string;
  afterImage: string;
};

export type CatalogService = {
  id: string;
  name: string;
  price: number;
  icon: CatalogServiceIcon;
  promise?: string[];
  subServices?: SubService[];
};

const catalog: CatalogService[] = [
  { id: "cleaning", name: "House Cleaning", price: 499, icon: "Sparkles" },
  { id: "utensils", name: "Dishwashing", price: 299, icon: "Utensils" },
  {
    id: "bathroom",
    name: "Bathroom Cleaning",
    price: 399,
    icon: "ShowerHead",
    promise: ["Verified Professionals", "Safe Chemicals", "Superior Stain Removal"],
    subServices: [
      {
        id: "bathroom-exhaust-fan",
        name: "Bathroom exhaust fan cleaning",
        price: 89,
        rating: 4.79,
        reviewCount: "113K reviews",
        durationMins: 15,
        bullets: ["Additional, one fan is already covered in bathroom service"],
        beforeImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400&h=400",
        afterImage: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=400&h=400"
      },
      {
        id: "bathroom-deep-clean",
        name: "Intense Bathroom Cleaning",
        price: 499,
        rating: 4.85,
        reviewCount: "85K reviews",
        durationMins: 60,
        bullets: ["Hard water stains removal", "Floor and wall tile scrubbing", "Cobweb removal"],
        beforeImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400&h=400",
        afterImage: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=400&h=400"
      }
    ]
  },
  { id: "cooking", name: "Cooking", price: 599, icon: "ChefHat" },
];

export function getCatalog(): CatalogService[] {
  return catalog;
}

export function getServiceById(id: string): CatalogService | undefined {
  return catalog.find((s) => s.id === id);
}

