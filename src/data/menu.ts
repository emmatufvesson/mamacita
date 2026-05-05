import menuData from "./menu.json";
import tacosData from "./tacos.json";

const productImageVersion = __PRODUCT_IMAGE_VERSION__;

export type RestaurantId = "butcher-burgers" | "tacos";

export const restaurantLabels: Record<RestaurantId, string> = {
  "butcher-burgers": "Butcher Burgers",
  tacos: "Tacos",
};

const RESTAURANT_STORAGE_KEY = "mffo_selected_restaurant";
const defaultRestaurant: RestaurantId = "butcher-burgers";

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
  kundKategori: "burgare" | "tacos" | "tillbehör" | "servering" | "dryck";
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

type MenuFile = {
  config: { rushHours: RushHour[] };
  products: Product[];
};

const menuFiles: Record<RestaurantId, MenuFile> = {
  "butcher-burgers": menuData as MenuFile,
  tacos: tacosData as MenuFile,
};

const createLiveArray = <T,>(getItems: () => T[]): T[] =>
  new Proxy([] as T[], {
    get(_target, prop) {
      const items = getItems();

      if (prop === Symbol.iterator) {
        return items[Symbol.iterator].bind(items);
      }

      if (prop === "length") {
        return items.length;
      }

      if (typeof prop === "string" && /^\d+$/.test(prop)) {
        return items[Number(prop)];
      }

      const value = Reflect.get(items, prop, items);
      return typeof value === "function" ? value.bind(items) : value;
    },
  }) as T[];

const readStoredRestaurant = (): RestaurantId | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(RESTAURANT_STORAGE_KEY);
    return stored === "butcher-burgers" || stored === "tacos" ? stored : null;
  } catch {
    return null;
  }
};

let activeRestaurant: RestaurantId = readStoredRestaurant() ?? defaultRestaurant;

export const bootstrapActiveRestaurant = (): RestaurantId | null => {
  const stored = readStoredRestaurant();
  if (stored) {
    activeRestaurant = stored;
  }
  return stored;
};

export const getActiveRestaurant = () => activeRestaurant;

export const setActiveRestaurant = (restaurant: RestaurantId) => {
  activeRestaurant = restaurant;

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(RESTAURANT_STORAGE_KEY, restaurant);
    } catch {
      // Ignore storage failures in demo environments.
    }
  }
};

export const clearSelectedRestaurant = () => {
  activeRestaurant = defaultRestaurant;

  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(RESTAURANT_STORAGE_KEY);
    } catch {
      // Ignore storage failures in demo environments.
    }
  }
};

const getActiveMenu = () => menuFiles[activeRestaurant];

const getActiveProducts = () => {
  const raw = getActiveMenu();
  return raw.products
    .map((product) => ({
      ...product,
      bild: withImageVersion(product.bild),
    }))
    .filter((product) => product.aktiv)
    .sort((a, b) => a.sorteringsordning - b.sorteringsordning);
};

const normalizeCategoryLabel = (categoryKey: Product["kundKategori"]) => {
  switch (categoryKey) {
    case "burgare":
      return "Burgare";
    case "tacos":
      return "Tacos";
    case "tillbehör":
      return "Tillbehör";
    case "servering":
      return "Servering";
    case "dryck":
      return "Dryck";
    default:
      return categoryKey;
  }
};

const getActiveCategories = () => {
  const seen = new Set<string>();
  return getActiveProducts()
    .map((product) => normalizeCategoryLabel(product.kundKategori))
    .filter((category) => {
      if (seen.has(category)) return false;
      seen.add(category);
      return true;
    });
};

const getActiveRushHours = () => getActiveMenu().config?.rushHours ?? [];

// All active products, sorted (regel 2 + 4)
export const allProducts: Product[] = createLiveArray(getActiveProducts);

// Filtered by kundKategori (regel 3)
export const burgers: Product[] = createLiveArray(() => allProducts.filter((p) => p.kundKategori === "burgare"));
export const sides: Product[] = createLiveArray(() => allProducts.filter((p) => p.kundKategori === "tillbehör"));
export const drinks: Product[] = createLiveArray(() => allProducts.filter((p) => p.kundKategori === "dryck"));

// Customer-facing categories (regel 10, 15)
export const categories: string[] = createLiveArray(getActiveCategories);
export type CustomerCategory = string;

export const categoryToKey: Record<string, Product["kundKategori"]> = {
  Burgare: "burgare",
  Tacos: "tacos",
  Tillbehör: "tillbehör",
  Servering: "servering",
  Dryck: "dryck",
};

export const rushHours: RushHour[] = createLiveArray(getActiveRushHours);

// Helper to find any product by id (regel 6)
export const findProduct = (id: string | null | undefined): Product | undefined =>
  id ? allProducts.find((p) => p.id === id) : undefined;
