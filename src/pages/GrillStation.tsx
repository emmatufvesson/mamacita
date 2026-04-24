import { useEffect, useMemo, useState } from "react";
import { useOrders } from "@/context/OrderContext";
import { findProduct } from "@/data/menu";
import AllergenBadge from "@/components/AllergenBadge";
import OrderTimer from "@/components/OrderTimer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Row {
  key: string;
  orderId: string;
  orderNumber: number;
  createdAt: number;
  productName: string;
  quantity: number;
  customizations: string[];
  extras: string[];
}

const GrillStation = () => {
  const { orders, markGrillDone } = useOrders();
  const [doneRows, setDoneRows] = useState<Record<string, boolean>>({});

  const rows: Row[] = useMemo(() => {
    const out: Row[] = [];
    orders
      .filter((o) => !o.pickedUp && !o.grillDone)
      .forEach((order) => {
        order.items.forEach((item, idx) => {
          const product = findProduct(item.productId);
          if (product?.station !== "grill") return;
          out.push({
            key: `${order.id}-${idx}`,
            orderId: order.id,
            orderNumber: order.orderNumber,
            createdAt: order.createdAt,
            productName: product.produkt,
            quantity: item.quantity,
            customizations: item.customizations,
            extras: item.extras,
          });
        });
      });
    return out.sort((a, b) => a.createdAt - b.createdAt);
  }, [orders]);

  // When all grill-rows for an order are done -> mark order grill done
  useEffect(() => {
    const byOrder = new Map<string, Row[]>();
    rows.forEach((r) => {
      const arr = byOrder.get(r.orderId) ?? [];
      arr.push(r);
      byOrder.set(r.orderId, arr);
    });
    byOrder.forEach((orderRows, orderId) => {
      if (orderRows.length > 0 && orderRows.every((r) => doneRows[r.key])) {
        markGrillDone(orderId);
      }
    });
  }, [doneRows, rows, markGrillDone]);

  const toggleRow = (key: string) => setDoneRows((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">Grillstation</h1>

      {rows.length === 0 ? (
        <p className="text-muted-foreground">Inga produkter att hantera</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ordernr</TableHead>
              <TableHead>Produkt</TableHead>
              <TableHead>Antal</TableHead>
              <TableHead>Markeringar</TableHead>
              <TableHead>Tid</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const isDone = !!doneRows[row.key];
              return (
                <TableRow key={row.key} className={isDone ? "opacity-50" : ""}>
                  <TableCell className="font-bold">#{row.orderNumber}</TableCell>
                  <TableCell>{row.productName}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {row.customizations.map((name) => (
                        <AllergenBadge key={`c-${name}`} type="allergen" label={name} />
                      ))}
                      {row.extras.map((name) => (
                        <AllergenBadge key={`e-${name}`} type="extra" label={name} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <OrderTimer createdAt={row.createdAt} />
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant={isDone ? "secondary" : "default"} onClick={() => toggleRow(row.key)}>
                      {isDone ? "Ångra" : "Markera klar"}
                    </Button>
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

export default GrillStation;
