interface ActionButtonsProps {
  onCustomize: () => void;
  onContinue: () => void;
  onCancel: () => void;
  hasSelection: boolean;
}

const ActionButtons = ({ onCustomize, onContinue, onCancel, hasSelection }: ActionButtonsProps) => (
  <div className="flex gap-4 justify-center p-4">
    <button
      onClick={onCancel}
      className="touch-btn touch-btn--destructive"
    >
      Avbryt
    </button>
    <button
      disabled={!hasSelection}
      onClick={onCustomize}
      className="touch-btn touch-btn--outline"
    >
      Gör anpassningar
    </button>
    <button
      disabled={!hasSelection}
      onClick={onContinue}
      className="touch-btn touch-btn--primary"
    >
      Fortsätt
    </button>
  </div>
);

export default ActionButtons;
