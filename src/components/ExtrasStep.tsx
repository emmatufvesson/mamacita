import StepPopup from "./StepPopup";
import { Tillagg } from "@/data/menu";
import { isRushNow } from "@/lib/rush";
import { useEffect, useState } from "react";

interface Props {
  addons: Tillagg[];
  selected: string[];
  onChange: (names: string[]) => void;
  onContinue: () => void;
  onSkip: () => void;
  onCancel: () => void;
}

const ExtrasStep = ({ addons, selected, onChange, onContinue, onSkip, onCancel }: Props) => {
  const [rush, setRush] = useState(isRushNow());

  useEffect(() => {
    const t = setInterval(() => setRush(isRushNow()), 30_000);
    return () => clearInterval(t);
  }, []);

  const visible = addons.filter((a) => (rush ? a.visasVidRusning : true));

  const toggle = (name: string) => {
    onChange(selected.includes(name) ? selected.filter((s) => s !== name) : [...selected, name]);
  };

  return (
    <StepPopup title="Tillägg" onContinue={onContinue} onSkip={onSkip} onCancel={onCancel}>
      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground italic px-3 py-2">Inga tillägg tillgängliga</p>
      ) : (
        visible.map((addon) => (
          <button
            key={addon.namn}
            onClick={() => toggle(addon.namn)}
            className={`w-full text-left px-3 py-2 rounded text-sm flex justify-between transition-colors ${
              selected.includes(addon.namn)
                ? "bg-selected text-selected-foreground"
                : "bg-muted text-foreground hover:bg-accent"
            }`}
          >
            <span>{addon.namn}</span>
            <span>+{addon.pris} kr</span>
          </button>
        ))
      )}
    </StepPopup>
  );
};

export default ExtrasStep;
