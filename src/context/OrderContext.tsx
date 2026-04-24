import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Order, CartItem } from "@/types/order";

interface OrderContextType {
  orders: Order[];
  addOrder: (items: CartItem[]) => number;
  markGrillDone: (id: string) => void;
  markSidesDone: (id: string) => void;
  markServingReady: (id: string) => void;
  markPickedUp: (id: string) => void;
}

const OrderContext = createContext<OrderContextType | null>(null);

const ORDERS_KEY = "mffo_orders";
const ORDER_NUM_KEY = "mffo_next_order_number";

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadNextOrderNumber(): number {
  try {
    const raw = localStorage.getItem(ORDER_NUM_KEY);
    return raw ? Number(raw) : 1;
  } catch {
    return 1;
  }
}

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(loadOrders);
  const [nextNum, setNextNum] = useState<number>(loadNextOrderNumber);

  // Persist orders whenever they change
  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  // Persist next order number
  useEffect(() => {
    localStorage.setItem(ORDER_NUM_KEY, String(nextNum));
  }, [nextNum]);

  const addOrder = useCallback((items: CartItem[]) => {
    const orderNumber = nextNum;
    const order: Order = {
      id: crypto.randomUUID(),
      orderNumber,
      items,
      createdAt: Date.now(),
      grillDone: false,
      sidesDone: false,
      servingDone: false,
      pickedUp: false,
    };
    setOrders((prev) => [...prev, order]);
    setNextNum((n) => n + 1);
    return orderNumber;
  }, [nextNum]);

  const update = (id: string, patch: Partial<Order>) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));

  const markGrillDone = useCallback((id: string) => update(id, { grillDone: true }), []);
  const markSidesDone = useCallback((id: string) => update(id, { sidesDone: true }), []);
  const markServingReady = useCallback((id: string) => update(id, { servingDone: true }), []);
  const markPickedUp = useCallback((id: string) => update(id, { pickedUp: true }), []);

  return (
    <OrderContext.Provider value={{ orders, addOrder, markGrillDone, markSidesDone, markServingReady, markPickedUp }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};
