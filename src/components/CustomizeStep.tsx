import StepPopup from "./StepPopup";
import { Anpassning } from "@/data/menu";
import { isRushNow } from "@/lib/rush";
import { useEffect, useState } from "react";

interface Props {
  modifications: Anpassning[];
  selected: string[];
  onChange: (names: string[]) => void;
  onContinue: () => void;
  onSkip: () => void;
  onCancel: () => void;
}

const CustomizeStep = ({ modifications, selected, onChange, onContinue, onSkip, onCancel }: Props) => {
  const [rush, setRush] = useState(isRushNow());

  useEffect(() => {
    const t = setInterval(() => setRush(isRushNow()), 30_000);
    return () => clearInterval(t);
  }, []);

  const visible = modifications.filter((m) => (rush ? m.visasVidRusning : true));

  const toggle = (name: string) => {
    onChange(selected.includes(name) ? selected.filter((s) => s !== name) : [...selected, name]);
  };

  return (
    <StepPopup title="Anpassningar" onContinue={onContinue} onSkip={onSkip} onCancel={onCancel}>
      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground italic px-3 py-2">Inga anpassningar tillgängliga</p>
      ) : (
        visible.map((mod) => (
          <button
            key={mod.namn}
            onClick={() => toggle(mod.namn)}
            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
              selected.includes(mod.namn)
                ? "bg-selected text-selected-foreground"
                : "bg-muted text-foreground hover:bg-accent"
            }`}
          >
            {mod.namn}
          </button>
        ))
      )}
    </StepPopup>
  );
};

export default CustomizeStep;
