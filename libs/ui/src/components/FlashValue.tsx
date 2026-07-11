import React from 'react';

interface FlashValueProps {
  value: React.ReactNode;
  /** Clé de changement — `value` (converti en texte) sert de clé par défaut. */
  flashKey?: string | number;
  className?: string;
}

/**
 * Rejoue la surbrillance ambre fugace (800 ms) à chaque changement de valeur
 * — remonte un `<span>` clé sur `flashKey`/`value`, ce qui relance l'animation.
 */
export const FlashValue: React.FC<FlashValueProps> = ({ value, flashKey, className }) => (
  <span
    key={flashKey ?? String(value)}
    className={['animate-flash-amber -mx-1.5 inline-block rounded-md px-1.5', className ?? ''].join(' ')}
  >
    {value}
  </span>
);
