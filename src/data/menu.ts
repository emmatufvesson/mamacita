import menuData from "./menu.json";

const productImageVersion = __PRODUCT_IMAGE_VERSION__;

const withImageVersion = (imagePath: string) => {
  if (!imagePath || imagePath.includes("v=")) {
    return imagePath;
  }

  const [pathWithQuery, hash = ""] = imagePath.split("#");
  const [path, existingQuery = ""] = pathWithQuery.split("?");
  const query = existingQuery
    ? `${existingQuery}&v=${encodeURIComponent(productImageVersion)}`
    : `v=${encodeURIComponent(productImageVersion)}`;

  return `${path}?${query}${hash ? `#${hash}` : ""}`;
};

export interface Anpassning {
  namn: string;
  visasVidRusning: boolean;
}

export interface Tillagg {
  namn: string;
  pris: number;
  visasVidRusning: boolean;
}

export interface Product {
  id: string;
  produkt: string;
  produktPris: number;
  kundKategori: "burgare" | "tillbehör" | "dryck";
  station: string;
  tillagningstid: number;
  beskrivning: string;
  sorteringsordning: number;
  bild: string;
  aktiv: boolean;
  aktivRusning: boolean;
  anpassningar: Anpassning[];
  tillägg: Tillagg[];
  tillvalTillbehor: string[];
  tillvalDryck: string[];
  allergener: string[];
  ingredienser: string[];
}

export interface RushHour {
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
}

const raw = menuData as { config: { rushHours: RushHour[] }; products: Product[] };

const productsWithVersionedImages = raw.products.map((product) => ({
  ...product,
  bild: withImageVersion(product.bild),
}));

export const rushHours: RushHour[] = raw.config?.rushHours ?? [];

const sortBySorting = (a: Product, b: Product) => a.sorteringsordning - b.sorteringsordning;

// All active products, sorted (regel 2 + 4)
export const allProducts: Product[] = productsWithVersionedImages
  .filter((p) => p.aktiv)
  .sort(sortBySorting);

// Filtered by kundKategori (regel 3)
export const burgers: Product[] = allProducts.filter((p) => p.kundKategori === "burgare");
export const sides: Product[] = allProducts.filter((p) => p.kundKategori === "tillbehör");
export const drinks: Product[] = allProducts.filter((p) => p.kundKategori === "dryck");

// Customer-facing categories (regel 10, 15)
export const categories = ["Burgare", "Tillbehör", "Dryck"] as const;
export type CustomerCategory = typeof categories[number];

export const categoryToKey: Record<CustomerCategory, Product["kundKategori"]> = {
  Burgare: "burgare",
  Tillbehör: "tillbehör",
  Dryck: "dryck",
};

// Helper to find any product by id (regel 6)
export const findProduct = (id: string | null | undefined): Product | undefined =>
  id ? allProducts.find((p) => p.id === id) : undefined;
