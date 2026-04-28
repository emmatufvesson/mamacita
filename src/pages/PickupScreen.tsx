import { useOrders } from "@/context/OrderContext";
import { findProduct } from "@/data/menu";
import type { Order } from "@/types/order";

const PickupScreen = () => {
  const { orders } = useOrders();

  const hasGrillItems = (order: Order) =>
    order.items.some((item) => findProduct(item.productId)?.station === "grill");

  const hasSideItems = (order: Order) =>
    order.items.some((item) => {
      const mainProduct = findProduct(item.productId);
      const sideProduct = findProduct(item.sideId);
      return mainProduct?.station === "tillbehör" || sideProduct?.station === "tillbehör";
    });

  const isReadyForPickup = (order: Order) =>
    (!hasGrillItems(order) || order.grillDone) && (!hasSideItems(order) || order.sidesDone);

  const activeOrders = orders.filter((o) => !o.pickedUp);
  const sorted = [...activeOrders].sort((a, b) => a.createdAt - b.createdAt);

  const preparing = sorted.filter((o) => !isReadyForPickup(o) || !o.servingDone);
  const ready = sorted.filter((o) => isReadyForPickup(o) && o.servingDone);

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6 text-center">Beställningar</h1>
      <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
        {/* Tillagas */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Tillagas</h2>
          <div className="flex flex-col gap-3">
            {preparing.length === 0 ? (
              <p className="text-muted-foreground text-sm">Inga ordrar</p>
            ) : (
              preparing.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border-2 border-border bg-card p-4 text-center"
                >
                  <div className="text-2xl font-bold text-foreground">
                    #{order.orderNumber}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Hämtas */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Hämtas</h2>
          <div className="flex flex-col gap-3">
            {ready.length === 0 ? (
              <p className="text-muted-foreground text-sm">Inga ordrar</p>
            ) : (
              ready.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border-2 border-green-500 bg-green-50 p-4 text-center"
                >
                  <div className="text-2xl font-bold text-green-700">
                    #{order.orderNumber}
                  </div>
                  <p className="text-green-600 font-medium text-sm mt-1">Redo för upphämtning!</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupScreen;
