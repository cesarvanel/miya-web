import React from 'react';

export type StatusTileTone = 'neutral' | 'info';

interface StatusTileProps {
  label: string;
  value: string;
  hint?: string;
  tone?: StatusTileTone;
}

const toneClasses: Record<StatusTileTone, { box: string; label: string; value: string; hint: string }> = {
  neutral: {
    box: 'border-line bg-cream',
    label: 'text-ink-muted',
    value: 'text-ink',
    hint: 'text-ink-faint',
  },
  info: {
    box: 'border-info/30 bg-info-soft',
    label: 'text-info',
    value: 'text-info',
    hint: 'text-info',
  },
};

/** Tuile chiffrée réutilisée dans le détail des reversements et des dépôts partiels. */
export const StatusTile: React.FC<StatusTileProps> = ({
  label,
  value,
  hint,
  tone = 'neutral',
}) => {
  const styles = toneClasses[tone];
  return (
    <div className={['rounded-tile border px-3.5 py-3.25', styles.box].join(' ')}>
      <div className={['text-[11.5px] font-semibold', styles.label].join(' ')}>
        {label}
      </div>
      <div className={['num mt-1.5 text-[17px] font-bold', styles.value].join(' ')}>
        {value}
      </div>
      {hint && (
        <div className={['text-[11px] font-semibold', styles.hint].join(' ')}>
          {hint}
        </div>
      )}
    </div>
  );
};
