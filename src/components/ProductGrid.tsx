import { allProducts, categoryToKey, CustomerCategory } from "@/data/menu";
import { isRushNow } from "@/lib/rush";
import { useEffect, useState } from "react";

interface ProductGridProps {
  category: CustomerCategory;
  selectedProductId: string | null;
  onSelect: (id: string) => void;
}

const ProductGrid = ({ category, selectedProductId, onSelect }: ProductGridProps) => {
  const [rush, setRush] = useState(isRushNow());

  useEffect(() => {
    const t = setInterval(() => setRush(isRushNow()), 30_000);
    return () => clearInterval(t);
  }, []);

  const key = categoryToKey[category];
  const filtered = allProducts
    .filter((p) => p.kundKategori === key)
    .filter((p) => (rush ? p.aktivRusning : true));

  return (
    <div className="grid grid-cols-3 gap-4 p-4 max-w-3xl mx-auto">
      {filtered.map((product) => (
        <button
          key={product.id}
          onClick={() => onSelect(product.id)}
          className={`rounded-lg border-2 p-3 text-left bg-card ${
            selectedProductId === product.id
              ? "border-primary ring-2 ring-primary"
              : "border-border"
          }`}
        >
          <div className="aspect-square rounded-md mb-3 overflow-hidden border border-border bg-muted">
            <img
              src={product.bild}
              alt={product.produkt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="font-medium text-sm text-foreground">{product.produkt}</p>
          <p className="text-sm text-muted-foreground">{product.produktPris} kr</p>
          {product.beskrivning && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.beskrivning}</p>
          )}
          {product.allergener.length > 0 && (
            <p className="text-[10px] text-muted-foreground mt-1">
              Allergener: {product.allergener.join(", ")}
            </p>
          )}
        </button>
      ))}
    </div>
  );
};

export default ProductGrid;
