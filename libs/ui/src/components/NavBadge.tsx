import React from 'react';

export type NavBadgeTone = 'amber' | 'red' | 'neutral';

interface NavBadgeProps {
  count: number;
  tone: NavBadgeTone;
  /** Pastille inversée (fond blanc, texte teinté) — item de nav actif. */
  inverted?: boolean;
  className?: string;
}

const toneClasses: Record<NavBadgeTone, string> = {
  amber: 'bg-badge-amber text-badge-amber-ink',
  red: 'bg-danger text-white',
  neutral: 'bg-primary text-white',
};

const invertedToneClasses: Record<NavBadgeTone, string> = {
  amber: 'bg-white text-primary',
  red: 'bg-white text-danger',
  neutral: 'bg-white text-primary',
};

/**
 * Compteur de nav (sidebar) — ne rend rien à zéro (jamais de « 0 » affiché).
 * Remonte sur `count` pour rejouer l'entrée scale-in à chaque changement,
 * même pattern que `FlashValue`.
 */
export const NavBadge: React.FC<NavBadgeProps> = ({
  count,
  tone,
  inverted = false,
  className,
}) => {
  if (count <= 0) {
    return null;
  }

  return (
    <span
      key={count}
      className={[
        'num animate-badge-in inline-flex items-center justify-center rounded-full px-2 py-[2px] text-[11px] font-bold transition-colors',
        inverted ? invertedToneClasses[tone] : toneClasses[tone],
        className ?? '',
      ].join(' ')}
    >
      {count}
    </span>
  );
};
