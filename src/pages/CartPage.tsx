import { useCart, itemPrice } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { findProduct } from "@/data/menu";
import { Minus, Plus, Trash2 } from "lucide-react";
import Footer from "@/components/Footer";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
          <p className="text-muted-foreground text-lg">Din kundkorg är tom</p>
          <button onClick={() => navigate("/")} className="touch-btn touch-btn--primary">Lägg till produkter</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 p-4 max-w-lg mx-auto w-full">
        <h2 className="text-xl font-bold text-foreground mb-4">Din kundkorg</h2>

        <div className="flex flex-col gap-4 mb-6">
          {cartItems.map((item, index) => {
            const orderSide = findProduct(item.sideId);
            const orderDrink = findProduct(item.drinkId);

            return (
              <div key={index} className="border border-border rounded-lg p-4 bg-card">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-foreground">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">{item.productPrice} kr</p>
                  </div>
                  <button onClick={() => removeFromCart(index)} className="touch-btn touch-btn--destructive !h-7 !w-7 !p-0">
                    <Trash2 size={16} />
                  </button>
                </div>

                {item.customizations.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Anpassningar: {item.customizations.join(", ")}
                  </p>
                )}
                {item.extras.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Tillägg: {item.extras.join(", ")}
                  </p>
                )}
                {orderSide && (
                  <p className="text-xs text-muted-foreground">Tillbehör: {orderSide.produkt} (+{orderSide.produktPris} kr)</p>
                )}
                {orderDrink && (
                  <p className="text-xs text-muted-foreground">
                    Dryck: {orderDrink.produkt} (+{orderDrink.produktPris} kr){item.noIce ? " (utan is)" : ""}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                    className="touch-btn !h-7 !w-7 !p-0"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-medium text-foreground w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                    className="touch-btn !h-7 !w-7 !p-0"
                  >
                    <Plus size={14} />
                  </button>
                  <span className="ml-auto text-sm font-semibold text-foreground">{itemPrice(item) * item.quantity} kr</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border pt-3 mb-4">
          <div className="flex justify-between font-semibold text-foreground text-lg">
            <span>Totalt</span>
            <span>{cartTotal} kr</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button onClick={() => navigate("/checkout")} className="touch-btn touch-btn--primary w-full">
            Gå till betalning
          </button>
          <button onClick={() => navigate("/")} className="touch-btn touch-btn--primary w-full">
            Lägg till fler produkter
          </button>
          <button
            onClick={() => { clearCart(); navigate("/"); }}
            className="touch-btn touch-btn--destructive w-full"
          >
            Avbryt beställning
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
