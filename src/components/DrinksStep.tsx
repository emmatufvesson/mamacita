import StepPopup from "./StepPopup";
import { findProduct } from "@/data/menu";
import { isRushNow } from "@/lib/rush";
import { useEffect, useState } from "react";

interface Props {
  availableIds: string[];
  selected: string | null;
  noIce: boolean;
  onChange: (id: string | null) => void;
  onNoIceChange: (v: boolean) => void;
  onContinue: () => void;
  onSkip: () => void;
  onCancel: () => void;
}

const DrinksStep = ({ availableIds, selected, noIce, onChange, onNoIceChange, onContinue, onSkip, onCancel }: Props) => {
  const [rush, setRush] = useState(isRushNow());

  useEffect(() => {
    const t = setInterval(() => setRush(isRushNow()), 30_000);
    return () => clearInterval(t);
  }, []);

  const items = availableIds
    .map((id) => findProduct(id))
    .filter((p): p is NonNullable<ReturnType<typeof findProduct>> => !!p && p.aktiv)
    .filter((p) => (rush ? p.aktivRusning : true))
    .sort((a, b) => a.sorteringsordning - b.sorteringsordning);

  return (
    <StepPopup title="Dryck" onContinue={onContinue} onSkip={onSkip} onCancel={onCancel}>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground italic px-3 py-2">Inga drycker tillgängliga</p>
      ) : (
        items.map((d) => (
          <button
            key={d.id}
            onClick={() => onChange(selected === d.id ? null : d.id)}
            className={`w-full text-left px-3 py-2 rounded text-sm flex justify-between border-2 ${
              selected === d.id
                ? "border-primary bg-selected text-selected-foreground"
                : "border-border bg-card text-foreground"
            }`}
          >
            <span>{d.produkt}</span>
            <span>+{d.produktPris} kr</span>
          </button>
        ))
      )}
      {selected && (
        <label className="flex items-center gap-2 px-3 py-2 text-sm text-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={noIce}
            onChange={(e) => onNoIceChange(e.target.checked)}
            className="rounded"
          />
          Utan is
        </label>
      )}
    </StepPopup>
  );
};

export default DrinksStep;
