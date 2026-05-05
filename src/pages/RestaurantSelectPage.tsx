import { Button } from "@/components/ui/button";
import { RestaurantId, restaurantLabels } from "@/data/menu";

interface RestaurantSelectPageProps {
  onSelect: (restaurant: RestaurantId) => void;
}

const choices: RestaurantId[] = ["butcher-burgers", "tacos"];

const RestaurantSelectPage = ({ onSelect }: RestaurantSelectPageProps) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-6">
    <div className="w-full max-w-3xl rounded-3xl border border-border bg-card p-8 shadow-sm">
      <div className="text-center space-y-3 mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Testmiljö</p>
        <h1 className="text-3xl font-bold text-foreground">Välj restaurang</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Välj vilken JSON-fil som ska användas för att köra samma orderflöde med olika restaurangkoncept.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {choices.map((restaurant) => (
          <div
            key={restaurant}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(restaurant)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(restaurant);
              }
            }}
            className="rounded-2xl border-2 border-border bg-background p-6 text-left transition-all hover:border-primary hover:shadow-md cursor-pointer"
          >
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{restaurant === "butcher-burgers" ? "menu.json" : "tacos.json"}</p>
              <h2 className="text-2xl font-semibold text-foreground">{restaurantLabels[restaurant]}</h2>
              <p className="text-sm text-muted-foreground">
                Starta appen med {restaurantLabels[restaurant].toLowerCase()} som aktiv meny.
              </p>
            </div>
            <div className="mt-6 inline-flex w-full">
              <Button type="button" className="w-full">
                Välj {restaurantLabels[restaurant]}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default RestaurantSelectPage;
