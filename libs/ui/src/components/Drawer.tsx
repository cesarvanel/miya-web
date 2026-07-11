import React from 'react';
import { useEscapeToClose } from '../internal/useEscapeToClose';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  /** Largeur du panneau en px (360 dans les maquettes). */
  width?: number;
  children: React.ReactNode;
}

/** Panneau latéral (aperçu rapide) — slide-in depuis la droite. */
export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  width = 360,
  children,
}) => {
  useEscapeToClose(isOpen, onClose);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40">
      <div
        data-testid="drawer-scrim"
        onClick={onClose}
        className="animate-scrim-in absolute inset-0 bg-scrim"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ width }}
        className="animate-drawer-in absolute top-0 right-0 bottom-0 flex flex-col bg-cream shadow-[-24px_0_50px_-20px_rgba(0,0,0,.35)]"
      >
        <div className="flex items-center justify-between border-b border-header-line px-5 py-[18px]">
          <span className="text-[15px] font-extrabold text-ink">{title}</span>
          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            className="flex size-[30px] cursor-pointer items-center justify-center rounded-[9px] border border-line bg-card hover:bg-cream-50"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M4 4l6 6M10 4l-6 6" stroke="#6B7069" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
};
