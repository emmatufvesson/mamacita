export interface OrderItem {
  productId: string;
  productName: string;
  productPrice: number;
  customizations: string[]; // anpassningar (namn). Skipped/empty arrays NEVER include "Hoppa över".
  extras: string[];         // tillägg (namn)
  sideId: string | null;    // null = hoppade över / inget tillbehör
  drinkId: string | null;   // null = hoppade över / ingen dryck
  noIce: boolean;
}

export interface CartItem extends OrderItem {
  quantity: number;
}

export type OrderStep = "select" | "customize" | "extras" | "sides" | "drinks" | "summary";

export interface Order {
  id: string;
  orderNumber: number;
  items: CartItem[];
  createdAt: number; // Date.now()
  grillDone: boolean;
  sidesDone: boolean;
  servingDone: boolean;
  pickedUp: boolean;
}
