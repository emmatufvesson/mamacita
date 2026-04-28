import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import Footer from "@/components/Footer";

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<"card" | "swish">("card");
  const [discountCode, setDiscountCode] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);

  if (cartItems.length === 0 && !confirmed) {
    navigate("/cart");
    return null;
  }

  const handlePay = () => {
    const num = addOrder(cartItems);
    setOrderNumber(num);
    clearCart();
    setConfirmed(true);
  };

  if (confirmed && orderNumber !== null) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-4">
          <h2 className="text-2xl font-bold text-foreground">Tack för betalning, din order förbereds nu</h2>
          <p className="text-muted-foreground">Din order beräknas ta ca 10 minuter</p>
          <p className="text-xl font-semibold text-foreground">Ditt ordernr är #{orderNumber}</p>
          <p className="text-muted-foreground italic">Smaklig måltid och varmt välkommen åter</p>
          <button onClick={() => navigate("/")} className="touch-btn mt-4">
            Tillbaka till menyn
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 p-4 max-w-md mx-auto w-full">
        <h2 className="text-xl font-bold text-foreground mb-6">Betalning</h2>

        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-2">Totalt att betala</p>
          <p className="text-2xl font-bold text-foreground">{cartTotal} kr</p>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-3">Välj betalsätt</p>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-3 border-2 border-border rounded-lg p-3 cursor-pointer bg-card">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
                className="accent-primary"
              />
              <span className="text-foreground">Kort</span>
            </label>
            <label className="flex items-center gap-3 border-2 border-border rounded-lg p-3 cursor-pointer bg-card">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "swish"}
                onChange={() => setPaymentMethod("swish")}
                className="accent-primary"
              />
              <span className="text-foreground">Swish</span>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-2">Rabattkod</p>
          <Input
            placeholder="Ange rabattkod (valfritt)"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <button onClick={handlePay} className="touch-btn w-full">
            Betala {cartTotal} kr
          </button>
          <button onClick={() => navigate("/cart")} className="touch-btn w-full">
            Tillbaka till kundkorgen
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
