import React from 'react';
import { useEscapeToClose } from '../internal/useEscapeToClose';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Largeur du panneau en px (440 dans les maquettes). */
  width?: number;
  ariaLabel?: string;
  /** Fond/texte/padding du panneau — par défaut la carte blanche des maquettes. */
  panelClassName?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  width = 440,
  ariaLabel,
  panelClassName = 'bg-card p-[30px]',
  children,
}) => {
  useEscapeToClose(isOpen, onClose);

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
          className={[
            'animate-modal-in rounded-modal pointer-events-auto max-h-full max-w-full overflow-auto shadow-modal',
            panelClassName,
          ].join(' ')}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
