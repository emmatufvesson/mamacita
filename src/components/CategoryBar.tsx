import { categories, CustomerCategory } from "@/data/menu";

interface CategoryBarProps {
  selected: CustomerCategory;
  onSelect: (cat: CustomerCategory) => void;
}

const CategoryBar = ({ selected, onSelect }: CategoryBarProps) => (
  <div className="flex gap-2 p-4 justify-center">
    {categories.map((cat) => (
      <button
        key={cat}
        onClick={() => onSelect(cat)}
        className={`px-6 py-2 rounded font-medium text-sm transition-colors ${
          selected === cat
            ? "bg-category-active text-category-active-foreground"
            : "bg-category-inactive text-category-inactive-foreground hover:opacity-80"
        }`}
      >
        {cat}
      </button>
    ))}
  </div>
);

export default CategoryBar;
