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
        className={`touch-btn min-w-28 ${
          selected === cat
            ? "touch-btn-selected"
            : "bg-card text-primary"
        }`}
      >
        {cat}
      </button>
    ))}
  </div>
);

export default CategoryBar;
