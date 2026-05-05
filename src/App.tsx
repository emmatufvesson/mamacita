import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OrderProvider } from "@/context/OrderContext";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import RestaurantSelectPage from "@/pages/RestaurantSelectPage";
import Index from "./pages/Index.tsx";
import PickupScreen from "./pages/PickupScreen.tsx";
import CartPage from "./pages/CartPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import SidesStation from "./pages/SidesStation.tsx";
import GrillStation from "./pages/GrillStation.tsx";
import ServingStation from "./pages/ServingStation.tsx";
import NotFound from "./pages/NotFound.tsx";
import {
  bootstrapActiveRestaurant,
  clearSelectedRestaurant,
  RestaurantId,
  restaurantLabels,
  setActiveRestaurant,
} from "@/data/menu";
import { useState } from "react";

const queryClient = new QueryClient();

// App root
const App = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantId | null>(bootstrapActiveRestaurant);

  const handleSelectRestaurant = (restaurant: RestaurantId) => {
    setActiveRestaurant(restaurant);
    setSelectedRestaurant(restaurant);
  };

  const handleChangeRestaurant = () => {
    clearSelectedRestaurant();
    setSelectedRestaurant(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <OrderProvider>
          <CartProvider>
            {!selectedRestaurant ? (
              <RestaurantSelectPage onSelect={handleSelectRestaurant} />
            ) : (
              <BrowserRouter>
                <div className="min-h-screen flex flex-col bg-background">
                  <Header
                    activeRestaurant={restaurantLabels[selectedRestaurant]}
                    onChangeRestaurant={handleChangeRestaurant}
                  />
                  <div className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/pickup" element={<PickupScreen />} />
                      <Route path="/kitchen/sides" element={<SidesStation />} />
                      <Route path="/kitchen/grill" element={<GrillStation />} />
                      <Route path="/kitchen/serving" element={<ServingStation />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </div>
              </BrowserRouter>
            )}
          </CartProvider>
        </OrderProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
