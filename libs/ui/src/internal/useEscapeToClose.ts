import { useEffect } from 'react';

/** Ferme au clavier (Échap). Partagé par Modal et Drawer. Interne à libs/ui. */
export const useEscapeToClose = (isOpen: boolean, onClose: () => void): void => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
};
