import { NavLink } from "@/components/NavLink";

const navItems = [
  { to: "/", label: "Meny" },
  { to: "/cart", label: "Cart" },
  { to: "/checkout", label: "Kassa" },
  { to: "/kitchen/grill", label: "Grill" },
  { to: "/kitchen/sides", label: "Tillbehör" },
  { to: "/kitchen/serving", label: "Servering" },
  { to: "/pickup", label: "Pickup" },
];

const Header = () => (
  <header className="bg-header text-header-foreground border-b border-white/10">
    <div className="py-6 text-center">
      <h1 className="text-2xl font-bold tracking-wide">BUTCHERS BURGERS</h1>
      <p className="text-sm mt-1 opacity-75">Handgjorda burgare sedan 2024</p>
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
