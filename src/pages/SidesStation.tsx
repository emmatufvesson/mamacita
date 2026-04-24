import { useEffect, useMemo, useState } from "react";
import { useOrders } from "@/context/OrderContext";
import { findProduct } from "@/data/menu";
import OrderTimer from "@/components/OrderTimer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Row {
  key: string;
  orderId: string;
  orderNumber: number;
  createdAt: number;
  sideName: string;
  quantity: number;
  grillDone: boolean;
}

const SidesStation = () => {
  const { orders, markSidesDone } = useOrders();
  const [doneRows, setDoneRows] = useState<Record<string, boolean>>({});

  const rows: Row[] = useMemo(() => {
    const out: Row[] = [];
    orders
      .filter((o) => !o.pickedUp && !o.sidesDone)
      .forEach((order) => {
        order.items.forEach((item, idx) => {
          if (!item.sideId) return;
          const side = findProduct(item.sideId);
          if (side?.station !== "tillbehör") return;
          out.push({
            key: `${order.id}-${idx}`,
            orderId: order.id,
            orderNumber: order.orderNumber,
            createdAt: order.createdAt,
            sideName: side.produkt,
            quantity: item.quantity,
            grillDone: order.grillDone,
          });
        });
      });
    return out.sort((a, b) => a.createdAt - b.createdAt);
  }, [orders]);

  useEffect(() => {
    const byOrder = new Map<string, Row[]>();
    rows.forEach((r) => {
      const arr = byOrder.get(r.orderId) ?? [];
      arr.push(r);
      byOrder.set(r.orderId, arr);
    });
    byOrder.forEach((orderRows, orderId) => {
      if (orderRows.length > 0 && orderRows.every((r) => doneRows[r.key])) {
        markSidesDone(orderId);
      }
    });
  }, [doneRows, rows, markSidesDone]);

  const toggleRow = (key: string) => setDoneRows((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">Tillbehör</h1>
      {rows.length === 0 ? (
        <p className="text-muted-foreground">Inga produkter att hantera</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ordernr</TableHead>
              <TableHead>Tillbehör</TableHead>
              <TableHead>Antal</TableHead>
              <TableHead>Markeringar</TableHead>
              <TableHead>Tid</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const isDone = !!doneRows[row.key];
              const rowClass = [
                row.grillDone ? "bg-red-50 border-l-4 border-l-red-500" : "",
                isDone ? "opacity-50" : "",
              ].join(" ");
              return (
                <TableRow key={row.key} className={rowClass}>
                  <TableCell className="font-bold">#{row.orderNumber}</TableCell>
                  <TableCell>{row.sideName}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>
                    {row.grillDone && (
                      <span className="text-xs font-semibold text-red-600">⚠ Grill klar – väntar på tillbehör</span>
                    )}
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

export default SidesStation;
