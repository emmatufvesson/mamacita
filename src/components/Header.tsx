import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Meny" },
  { to: "/cart", label: "Cart" },
  { to: "/checkout", label: "Kassa" },
  { to: "/kitchen/grill", label: "Grill" },
  { to: "/kitchen/sides", label: "Tillbehör" },
  { to: "/kitchen/serving", label: "Servering" },
  { to: "/pickup", label: "Pickup" },
];

interface HeaderProps {
  activeRestaurant?: string;
  onChangeRestaurant?: () => void;
}

const Header = ({ activeRestaurant, onChangeRestaurant }: HeaderProps) => (
  <header className="bg-header text-header-foreground border-b border-white/10">
    <div className="py-6 text-center space-y-3">
      <div>
        <h1 className="text-2xl font-bold tracking-wide">MFFO</h1>
        <p className="text-sm mt-1 opacity-75">Digital ordering platform</p>
      </div>
      {activeRestaurant && (
        <div className="flex items-center justify-center gap-3">
          <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.2em] opacity-90">
            {activeRestaurant}
          </span>
          {onChangeRestaurant && (
            <Button type="button" variant="outline" size="sm" onClick={onChangeRestaurant} className="text-black">
              Byt restaurang
            </Button>
          )}
        </div>
      )}
    </div>
    <nav className="border-t border-white/10 bg-black/10 px-3 py-3">
      <div className="flex flex-wrap justify-center gap-2 max-w-6xl mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
            activeClassName="bg-white text-black"
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  </header>
);

export default Header;
