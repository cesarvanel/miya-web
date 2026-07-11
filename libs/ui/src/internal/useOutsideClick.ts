import { useEffect, useRef } from 'react';

/** Ferme un menu/popover au clic en dehors de son conteneur. Interne à libs/ui. */
export const useOutsideClick = <TElement extends HTMLElement>(
  onOutside: () => void,
  active: boolean,
) => {
  const ref = useRef<TElement>(null);

  useEffect(() => {
    if (!active) {
      return undefined;
    }
    const handlePointerDown = (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutside();
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [active, onOutside]);

  return ref;
};
