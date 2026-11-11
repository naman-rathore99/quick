import { useEffect, useState } from "react";
import type { CatalogService } from "../services/catalog";

const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const empty: CatalogService[] = [];
let catalogRequest: Promise<CatalogService[]> | undefined;

function loadCatalog() {
  catalogRequest ??= fetch(`${api}/services`)
    .then(async (response) => {
      if (!response.ok) throw new Error("Services are temporarily unavailable.");
      const { services }: { services: { id: string; name: string }[] } = await response.json();
      return services.map((service): CatalogService => ({
        ...service,
        price: null,
        icon: service.name.toLowerCase() === "cooking" ? "ChefHat" : "Sparkles",
      }));
    })
    .catch((error) => {
      catalogRequest = undefined;
      throw error;
    });
  return catalogRequest;
}

export function useServicesCatalog() {
  const [items, setItems] = useState(empty);
  const [status, setStatus] = useState("Loading services…");

  useEffect(() => {
    let active = true;
    loadCatalog().then((catalog) => {
      if (!active) return;
      setItems(catalog);
      setStatus(catalog.length ? "" : "No services are listed yet.");
    }).catch(() => {
      if (active) setStatus("Services are temporarily unavailable. Reload to try again.");
    });
    return () => { active = false; };
  }, []);

  return { items, status };
}
