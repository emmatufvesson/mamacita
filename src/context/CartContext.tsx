import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import { OrderItem, CartItem } from "@/types/order";
import { findProduct } from "@/data/menu";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: OrderItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

const itemPrice = (item: OrderItem): number => {
  const product = findProduct(item.productId);
  const base = item.productPrice;
  const extras = item.extras.reduce(
    (sum, name) => sum + (product?.tillägg.find((t) => t.namn === name)?.pris ?? 0),
    0
  );
  const sidePrice = item.sideId ? (findProduct(item.sideId)?.produktPris ?? 0) : 0;
  const drinkPrice = item.drinkId ? (findProduct(item.drinkId)?.produktPris ?? 0) : 0;
  return base + extras + sidePrice + drinkPrice;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((item: OrderItem) => {
    setCartItems((prev) => [...prev, { ...item, quantity: 1 }]);
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = useCallback((index: number, qty: number) => {
    if (qty < 1) return;
    setCartItems((prev) => prev.map((item, i) => (i === index ? { ...item, quantity: qty } : item)));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + itemPrice(item) * item.quantity, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export { itemPrice };
