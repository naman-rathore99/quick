import { getCatalog } from "../services/catalog";

const catalogItems = getCatalog();

const catalogView = { items: catalogItems };

export function useServicesCatalog() {
  return catalogView;
}
