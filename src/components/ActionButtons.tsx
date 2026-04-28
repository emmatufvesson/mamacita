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
      className="touch-btn"
    >
      Avbryt
    </button>
    <button
      disabled={!hasSelection}
      onClick={onCustomize}
      className="touch-btn"
    >
      Gör anpassningar
    </button>
    <button
      disabled={!hasSelection}
      onClick={onContinue}
      className="touch-btn"
    >
      Fortsätt
    </button>
  </div>
);

export default ActionButtons;
