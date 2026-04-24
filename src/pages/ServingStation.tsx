import { useOrders } from "@/context/OrderContext";
import { findProduct } from "@/data/menu";
import OrderTimer from "@/components/OrderTimer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";

const ServingStation = () => {
  const { orders, markServingReady, markPickedUp } = useOrders();

  const activeOrders = orders.filter((o) => !o.pickedUp);
  const sorted = [...activeOrders].sort((a, b) => {
    const aDone = a.grillDone && a.sidesDone ? 1 : 0;
    const bDone = b.grillDone && b.sidesDone ? 1 : 0;
    if (aDone !== bDone) return bDone - aDone;
    return a.createdAt - b.createdAt;
  });

  const StatusIcon = ({ done }: { done: boolean }) =>
    done ? <CheckCircle size={18} className="text-green-600" /> : <Clock size={18} className="text-muted-foreground" />;

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">Serveringsstation/baren</h1>
      {sorted.length === 0 ? (
        <p className="text-muted-foreground">Inga ordrar att hantera</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ordernr</TableHead>
              <TableHead>Dryck</TableHead>
              <TableHead>Produkt</TableHead>
              <TableHead>Tillbehör</TableHead>
              <TableHead>Tid</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((order) => {
              const productNames = order.items.map((item) => {
                const p = findProduct(item.productId);
                return p ? `${item.quantity}× ${p.produkt}` : "—";
              }).join(", ");
              const sideNames = order.items.map((item) => {
                const s = findProduct(item.sideId);
                return s?.produkt ?? null;
              }).filter(Boolean).join(", ") || "—";
              const drinkNames = order.items.map((item) => {
                const d = findProduct(item.drinkId);
                return d ? `${d.produkt}${item.noIce ? " (utan is)" : ""}` : null;
              }).filter(Boolean).join(", ") || "—";
              const allStationsDone = order.grillDone && order.sidesDone;

              return (
                <TableRow key={order.id}>
                  <TableCell className="font-bold">#{order.orderNumber}</TableCell>
                  <TableCell>{drinkNames}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StatusIcon done={order.grillDone} />
                      <span>{productNames}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StatusIcon done={order.sidesDone} />
                      <span>{sideNames}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <OrderTimer createdAt={order.createdAt} />
                  </TableCell>
                  <TableCell>
                    {order.servingDone ? (
                      <Button size="sm" variant="outline" onClick={() => markPickedUp(order.id)}>
                        Order upphämtad
                      </Button>
                    ) : (
                      <Button size="sm" disabled={!allStationsDone} onClick={() => markServingReady(order.id)}>
                        Order klar för upphämtning
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ServingStation;
