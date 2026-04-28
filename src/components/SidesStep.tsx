import StepPopup from "./StepPopup";
import { findProduct } from "@/data/menu";
import { isRushNow } from "@/lib/rush";
import { useEffect, useState } from "react";

interface Props {
  availableIds: string[];
  selected: string | null;
  onChange: (id: string | null) => void;
  onContinue: () => void;
  onSkip: () => void;
  onCancel: () => void;
}

const SidesStep = ({ availableIds, selected, onChange, onContinue, onSkip, onCancel }: Props) => {
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
    <StepPopup title="Tillbehör" onContinue={onContinue} onSkip={onSkip} onCancel={onCancel}>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground italic px-3 py-2">Inga tillbehör tillgängliga</p>
      ) : (
        items.map((s) => (
          <button
            key={s.id}
            onClick={() => onChange(selected === s.id ? null : s.id)}
            className={`w-full text-left px-3 py-2 rounded text-sm flex justify-between border-2 ${
              selected === s.id
                ? "border-primary bg-selected text-selected-foreground"
                : "border-border bg-card text-foreground"
            }`}
          >
            <span>{s.produkt}</span>
            <span>+{s.produktPris} kr</span>
          </button>
        ))
      )}
    </StepPopup>
  );
};

export default SidesStep;
