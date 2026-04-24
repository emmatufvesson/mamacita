import { ReactNode } from "react";

interface StepPopupProps {
  title: string;
  children: ReactNode;
  onContinue: () => void;
  onSkip?: () => void;
  onCancel: () => void;
}

const StepPopup = ({ title, children, onContinue, onSkip, onCancel }: StepPopupProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40">
    <div className="bg-card rounded-lg shadow-lg w-full max-w-md p-6 mx-4">
      <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>
      <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">{children}</div>
      <div className="flex gap-3 justify-end flex-wrap">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded border border-border text-foreground text-sm hover:bg-muted transition-colors"
        >
          Avbryt
        </button>
        {onSkip && (
          <button
            onClick={onSkip}
            className="px-4 py-2 rounded border border-border text-foreground text-sm hover:bg-muted transition-colors"
          >
            Hoppa över
          </button>
        )}
        <button
          onClick={onContinue}
          className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm hover:opacity-80 transition-colors"
        >
          Fortsätt
        </button>
      </div>
    </div>
  </div>
);

export default StepPopup;
