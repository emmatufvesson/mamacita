import { AlertTriangle } from "lucide-react";

interface Props {
  type: "allergen" | "extra";
  label: string;
}

const AllergenBadge = ({ type, label }: Props) => {
  const color = type === "allergen" ? "text-red-600" : "text-orange-500";
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${color}`}>
      <AlertTriangle size={14} />
      {label}
    </span>
  );
};

export default AllergenBadge;
