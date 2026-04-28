import { OrderItem } from "@/types/order";
import { findProduct } from "@/data/menu";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

interface Props {
  order: OrderItem | null;
  onRemoveCustomization: (name: string) => void;
  onRemoveExtra: (name: string) => void;
  onRemoveSide: () => void;
  onRemoveDrink: () => void;
  onAddCustomization: () => void;
  onAddExtra: () => void;
  onAddSide: () => void;
  onAddDrink: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  totalPrice: number;
}

const OrderSummary = ({
  order,
  onRemoveCustomization,
  onRemoveExtra,
  onRemoveSide,
  onRemoveDrink,
  onAddCustomization,
  onAddExtra,
  onAddSide,
  onAddDrink,
  onSubmit,
  onCancel,
  totalPrice,
}: Props) => {
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  if (!order) return null;

  const product = findProduct(order.productId);
  const orderSide = findProduct(order.sideId);
  const orderDrink = findProduct(order.drinkId);

  // Tillägg-priser via produktens egen lista
  const extraPrice = (name: string): number =>
    product?.tillägg.find((t) => t.namn === name)?.pris ?? 0;

  const handleAddToCart = () => {
    addToCart(order);
    onSubmit();
  };

  const handleGoToCart = () => {
    addToCart(order);
    onSubmit();
    navigate("/cart");
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5 max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-foreground mb-4">Din beställning</h2>

      {/* Product */}
      <div className="border-b border-border pb-2 mb-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{product?.produkt}</span>
          <span>{product?.produktPris} kr</span>
        </div>
        {product && product.allergener.length > 0 && (
          <p className="text-[11px] text-muted-foreground mt-1">
            Allergener: {product.allergener.join(", ")}
          </p>
        )}
      </div>

      {/* Customizations */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-muted-foreground">Anpassningar</span>
          <button onClick={onAddCustomization} className="touch-btn px-3 py-1 text-xs">+ Lägg till</button>
        </div>
        {order.customizations.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">Inga anpassningar</p>
        ) : (
          order.customizations.map((name) => (
            <div key={name} className="flex justify-between text-sm">
              <span>{name}</span>
              <button onClick={() => onRemoveCustomization(name)} className="touch-btn px-3 py-1 text-xs">Ta bort</button>
            </div>
          ))
        )}
      </div>

      {/* Extras */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-muted-foreground">Tillägg</span>
          <button onClick={onAddExtra} className="touch-btn px-3 py-1 text-xs">+ Lägg till</button>
        </div>
        {order.extras.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">Inga tillägg</p>
        ) : (
          order.extras.map((name) => (
            <div key={name} className="flex justify-between text-sm">
              <span>{name} (+{extraPrice(name)} kr)</span>
              <button onClick={() => onRemoveExtra(name)} className="touch-btn px-3 py-1 text-xs">Ta bort</button>
            </div>
          ))
        )}
      </div>

      {/* Side */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-muted-foreground">Tillbehör</span>
          <button onClick={onAddSide} className="touch-btn px-3 py-1 text-xs">+ Lägg till</button>
        </div>
        {orderSide ? (
          <div className="flex justify-between text-sm">
            <span>{orderSide.produkt} (+{orderSide.produktPris} kr)</span>
            <button onClick={onRemoveSide} className="touch-btn px-3 py-1 text-xs">Ta bort</button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">Inget tillbehör</p>
        )}
      </div>

      {/* Drink */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-muted-foreground">Dryck</span>
          <button onClick={onAddDrink} className="touch-btn px-3 py-1 text-xs">+ Lägg till</button>
        </div>
        {orderDrink ? (
          <div className="flex justify-between text-sm">
            <span>{orderDrink.produkt} (+{orderDrink.produktPris} kr){order.noIce ? " (utan is)" : ""}</span>
            <button onClick={onRemoveDrink} className="touch-btn px-3 py-1 text-xs">Ta bort</button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">Ingen dryck</p>
        )}
      </div>

      {/* Total */}
      <div className="border-t border-border pt-3 mb-4">
        <div className="flex justify-between font-semibold text-foreground">
          <span>Totalt</span>
          <span>{totalPrice} kr</span>
        </div>
      </div>

      {cartItems.length > 0 && (
        <p className="text-xs text-muted-foreground mb-3">
          Du har redan {cartItems.length} produkt(er) i kundkorgen.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <button onClick={handleGoToCart} className="touch-btn w-full">
          Lägg i kundkorg & gå till kassan
        </button>
        <button onClick={handleAddToCart} className="touch-btn w-full">
          Lägg i kundkorg & lägg till fler
        </button>
        <button onClick={onCancel} className="touch-btn w-full">
          Avbryt
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
