import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Largeur du panneau en px (440 dans les maquettes). */
  width?: number;
  ariaLabel?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  width = 440,
  ariaLabel,
  children,
}) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40">
      <div
        data-testid="modal-scrim"
        onClick={onClose}
        className="animate-scrim-in absolute inset-0 bg-scrim"
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          style={{ width }}
          className="animate-modal-in rounded-modal pointer-events-auto max-h-full max-w-full overflow-auto bg-card p-[30px] shadow-modal"
        >
          {children}
        </div>
      </div>
    </div>
  );
};
