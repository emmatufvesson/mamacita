interface ActionButtonsProps {
  onCustomize: () => void;
  onContinue: () => void;
  onCancel: () => void;
  hasSelection: boolean;
}

const ActionButtons = ({ onCustomize, onContinue, onCancel, hasSelection }: ActionButtonsProps) => (
  <div className="flex gap-3 justify-center p-4">
    <button
      onClick={onCancel}
      className="px-5 py-2 rounded border border-border text-foreground text-sm hover:bg-muted transition-colors"
    >
      Avbryt
    </button>
    <button
      disabled={!hasSelection}
      onClick={onCustomize}
      className="px-5 py-2 rounded bg-secondary text-secondary-foreground text-sm disabled:opacity-40 hover:opacity-80 transition-colors"
    >
      Gör anpassningar
    </button>
    <button
      disabled={!hasSelection}
      onClick={onContinue}
      className="px-5 py-2 rounded bg-primary text-primary-foreground text-sm disabled:opacity-40 hover:opacity-80 transition-colors"
    >
      Fortsätt
    </button>
  </div>
);

export default ActionButtons;
