import { useState, useMemo, useEffect } from "react";
import Footer from "@/components/Footer";
import CategoryBar from "@/components/CategoryBar";
import ProductGrid from "@/components/ProductGrid";
import ActionButtons from "@/components/ActionButtons";
import CustomizeStep from "@/components/CustomizeStep";
import ExtrasStep from "@/components/ExtrasStep";
import SidesStep from "@/components/SidesStep";
import DrinksStep from "@/components/DrinksStep";
import OrderSummary from "@/components/OrderSummary";
import { findProduct, CustomerCategory } from "@/data/menu";
import { isRushNow } from "@/lib/rush";
import { OrderItem, OrderStep } from "@/types/order";

const Index = () => {
  const [category, setCategory] = useState<CustomerCategory>("Burgare");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [step, setStep] = useState<OrderStep>("select");

  const [customizationNames, setCustomizationNames] = useState<string[]>([]);
  const [extraNames, setExtraNames] = useState<string[]>([]);
  const [sideId, setSideId] = useState<string | null>(null);
  const [drinkId, setDrinkId] = useState<string | null>(null);
  const [noIce, setNoIce] = useState(false);

  const [order, setOrder] = useState<OrderItem | null>(null);
  const [editStep, setEditStep] = useState<OrderStep | null>(null);

  // Live rush flag (för att filtrera tillgängliga anpassningar/tillägg vid bygge av order)
  const [rush, setRush] = useState(isRushNow());
  useEffect(() => {
    const t = setInterval(() => setRush(isRushNow()), 30_000);
    return () => clearInterval(t);
  }, []);

  const selectedProduct = findProduct(selectedProductId);
  const isBurger = selectedProduct?.kundKategori === "burgare";

  const computeTotal = (o: OrderItem): number => {
    const product = findProduct(o.productId);
    const base = product?.produktPris ?? 0;
    const extras = o.extras.reduce(
      (sum, name) => sum + (product?.tillägg.find((t) => t.namn === name)?.pris ?? 0),
      0
    );
    const sidePrice = o.sideId ? (findProduct(o.sideId)?.produktPris ?? 0) : 0;
    const drinkPrice = o.drinkId ? (findProduct(o.drinkId)?.produktPris ?? 0) : 0;
    return base + extras + sidePrice + drinkPrice;
  };

  const totalPrice = useMemo(() => (order ? computeTotal(order) : 0), [order]);

  const livePrice = useMemo(() => {
    if (!selectedProduct) return 0;
    return computeTotal({
      productId: selectedProduct.id,
      productName: selectedProduct.produkt,
      productPrice: selectedProduct.produktPris,
      customizations: customizationNames,
      extras: extraNames,
      sideId,
      drinkId,
      noIce,
    });
  }, [selectedProduct, customizationNames, extraNames, sideId, drinkId, noIce]);

  const resetAll = () => {
    setSelectedProductId(null);
    setStep("select");
    setCustomizationNames([]);
    setExtraNames([]);
    setSideId(null);
    setDrinkId(null);
    setNoIce(false);
    setOrder(null);
    setEditStep(null);
  };

  const buildOrder = (): OrderItem => ({
    productId: selectedProductId!,
    productName: selectedProduct!.produkt,
    productPrice: selectedProduct!.produktPris,
    customizations: customizationNames,
    extras: extraNames,
    sideId,
    drinkId,
    noIce,
  });

  // Decide what comes next after "select"
  const handleContinueFromSelect = () => {
    if (!selectedProduct) return;
    if (isBurger) {
      setStep("extras");
    } else {
      // Tillbehör/dryck: hoppa direkt till summary
      const o: OrderItem = {
        productId: selectedProduct.id,
        productName: selectedProduct.produkt,
        productPrice: selectedProduct.produktPris,
        customizations: [],
        extras: [],
        sideId: null,
        drinkId: null,
        noIce: false,
      };
      setOrder(o);
      setStep("summary");
    }
  };
  const handleCustomize = () => setStep("customize");

  // Continue (or return to summary if editing)
  const continueOrReturn = (nextStep: OrderStep) => {
    if (editStep) {
      setOrder({ ...buildOrder() });
      setStep("summary");
      setEditStep(null);
    } else {
      setStep(nextStep);
    }
  };

  // Skip handlers — clear that step's selection then continue/return
  const skipCustomize = () => {
    setCustomizationNames([]);
    if (editStep) {
      setOrder({ ...buildOrder(), customizations: [] });
      setStep("summary");
      setEditStep(null);
    } else {
      setStep("sides");
    }
  };
  const skipExtras = () => {
    setExtraNames([]);
    if (editStep) {
      setOrder({ ...buildOrder(), extras: [] });
      setStep("summary");
      setEditStep(null);
    } else {
      setStep("sides");
    }
  };
  const skipSides = () => {
    setSideId(null);
    if (editStep) {
      setOrder({ ...buildOrder(), sideId: null });
      setStep("summary");
      setEditStep(null);
    } else {
      setStep("drinks");
    }
  };
  const skipDrinks = () => {
    setDrinkId(null);
    setNoIce(false);
    const o = { ...buildOrder(), drinkId: null, noIce: false };
    setOrder(o);
    setStep("summary");
    setEditStep(null);
  };

  const handleCancelPopup = () => {
    if (editStep) {
      setStep("summary");
      setEditStep(null);
    } else {
      resetAll();
    }
  };

  const handleContinueFromDrinks = () => {
    const o = buildOrder();
    setOrder(o);
    setStep("summary");
    setEditStep(null);
  };

  const handleSubmitOrder = () => resetAll();

  const handleRemoveCustomization = (name: string) => {
    if (!order) return;
    const updated = { ...order, customizations: order.customizations.filter((c) => c !== name) };
    setOrder(updated);
    setCustomizationNames(updated.customizations);
  };

  const handleRemoveExtra = (name: string) => {
    if (!order) return;
    const updated = { ...order, extras: order.extras.filter((e) => e !== name) };
    setOrder(updated);
    setExtraNames(updated.extras);
  };

  const handleRemoveSide = () => {
    if (!order) return;
    setOrder({ ...order, sideId: null });
    setSideId(null);
  };

  const handleRemoveDrink = () => {
    if (!order) return;
    setOrder({ ...order, drinkId: null, noIce: false });
    setDrinkId(null);
    setNoIce(false);
  };

  const openEditStep = (s: OrderStep) => {
    setEditStep(s);
    setStep(s);
  };

  // For sides/drinks popups: which IDs are available depends on selected burger
  const availableSideIds = selectedProduct?.tillvalTillbehor ?? [];
  const availableDrinkIds = selectedProduct?.tillvalDryck ?? [];

  // Filter modifications/addons for the popups (rush-aware happens inside popup, but we pass full lists)
  const modifications = selectedProduct?.anpassningar ?? [];
  const addons = selectedProduct?.tillägg ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CategoryBar selected={category} onSelect={(c) => { setCategory(c); setSelectedProductId(null); }} />

      {rush && step === "select" && (
        <div className="text-center text-xs text-orange-600 -mt-2 mb-1">
          Rusningstid – ett begränsat utbud visas
        </div>
      )}

      {step === "select" && (
        <>
          <ProductGrid category={category} selectedProductId={selectedProductId} onSelect={setSelectedProductId} />
          {selectedProductId && (
            <div className="text-center text-sm text-muted-foreground mb-2">
              Pris: <span className="font-semibold text-foreground">{livePrice} kr</span>
            </div>
          )}
          <ActionButtons
            hasSelection={!!selectedProductId}
            onCustomize={isBurger ? handleCustomize : () => {}}
            onContinue={handleContinueFromSelect}
            onCancel={resetAll}
          />
        </>
      )}

      {step === "customize" && selectedProduct && (
        <CustomizeStep
          modifications={modifications}
          selected={customizationNames}
          onChange={setCustomizationNames}
          onContinue={() => continueOrReturn("extras")}
          onSkip={skipCustomize}
          onCancel={handleCancelPopup}
        />
      )}

      {step === "extras" && selectedProduct && (
        <ExtrasStep
          addons={addons}
          selected={extraNames}
          onChange={setExtraNames}
          onContinue={() => continueOrReturn("sides")}
          onSkip={skipExtras}
          onCancel={handleCancelPopup}
        />
      )}

      {step === "sides" && (
        <SidesStep
          availableIds={availableSideIds}
          selected={sideId}
          onChange={setSideId}
          onContinue={() => continueOrReturn("drinks")}
          onSkip={skipSides}
          onCancel={handleCancelPopup}
        />
      )}

      {step === "drinks" && (
        <DrinksStep
          availableIds={availableDrinkIds}
          selected={drinkId}
          noIce={noIce}
          onChange={setDrinkId}
          onNoIceChange={setNoIce}
          onContinue={handleContinueFromDrinks}
          onSkip={skipDrinks}
          onCancel={handleCancelPopup}
        />
      )}

      {step === "summary" && (
        <div className="flex-1 p-4">
          <OrderSummary
            order={order}
            totalPrice={totalPrice}
            onRemoveCustomization={handleRemoveCustomization}
            onRemoveExtra={handleRemoveExtra}
            onRemoveSide={handleRemoveSide}
            onRemoveDrink={handleRemoveDrink}
            onAddCustomization={() => openEditStep("customize")}
            onAddExtra={() => openEditStep("extras")}
            onAddSide={() => openEditStep("sides")}
            onAddDrink={() => openEditStep("drinks")}
            onSubmit={handleSubmitOrder}
            onCancel={resetAll}
          />
        </div>
      )}

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
