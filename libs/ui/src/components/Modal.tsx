import React from 'react';
import { useEscapeToClose } from '../internal/useEscapeToClose';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Largeur du panneau en px (440 dans les maquettes). */
  width?: number;
  ariaLabel?: string;
  /** Fond/texte/padding du panneau — par défaut la carte blanche des maquettes. Ignoré si `header`/`footer` sont fournis. */
  panelClassName?: string;
  /**
   * En-tête fixe (titre, sous-titre) — ne scrolle pas avec le corps.
   * Fournir `header` et/ou `footer` bascule le panneau en layout
   * en-tête fixe / corps scrollable / pied fixe ; sans eux, tout le
   * panneau reste scrollable (comportement historique, modales courtes).
   */
  header?: React.ReactNode;
  /** Pied fixe (actions) — ne scrolle pas avec le corps. */
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  width = 440,
  ariaLabel,
  panelClassName = 'bg-card p-[30px]',
  header,
  footer,
  children,
}) => {
  useEscapeToClose(isOpen, onClose);

  if (!isOpen) {
    return null;
  }

  const hasFixedRegions = header !== undefined || footer !== undefined;

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
            'animate-modal-in rounded-modal pointer-events-auto max-h-full max-w-full shadow-modal',
            hasFixedRegions ? 'flex flex-col overflow-hidden bg-card' : ['overflow-auto', panelClassName].join(' '),
          ].join(' ')}
        >
          {hasFixedRegions ? (
            <>
              {header && <div className="flex-none border-b border-line-soft px-7.5 py-5.5">{header}</div>}
              <div className="flex-1 overflow-y-auto px-7.5 py-5">{children}</div>
              {footer && <div className="flex-none border-t border-line-soft px-7.5 py-5">{footer}</div>}
            </>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};
