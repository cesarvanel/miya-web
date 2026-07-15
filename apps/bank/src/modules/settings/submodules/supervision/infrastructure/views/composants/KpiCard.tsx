import React from 'react';

export type KpiTone = 'primary' | 'default' | 'danger';

interface KpiCardProps {
  label: string;
  value: string;
  hint?: string;
  tone?: KpiTone;
}

const toneClasses: Record<KpiTone, { card: string; label: string; value: string; hint: string }> = {
  primary: {
    card: 'bg-primary text-white shadow-primary-glow',
    label: 'text-primary-tint',
    value: 'text-white',
    hint: 'text-primary-tint',
  },
  default: {
    card: 'border border-line bg-card',
    label: 'text-ink-muted',
    value: 'text-ink',
    hint: 'text-ink-faint',
  },
  danger: {
    card: 'border-[1.5px] border-danger/40 bg-card',
    label: 'text-danger',
    value: 'text-danger',
    hint: 'text-danger/80',
  },
};

/** Tuile KPI générique — même gabarit que les stats rows des autres modules admin. */
export const KpiCard: React.FC<KpiCardProps> = ({ label, value, hint, tone = 'default' }) => {
  const classes = toneClasses[tone];
  return (
    <div className={['rounded-card-lg p-4.5', classes.card].join(' ')}>
      <div className={['text-[12.5px] font-semibold', classes.label].join(' ')}>{label}</div>
      <div className={['num mt-2 text-[28px] leading-none font-bold', classes.value].join(' ')}>{value}</div>
      {hint && <div className={['mt-1 text-[11.5px] font-medium', classes.hint].join(' ')}>{hint}</div>}
    </div>
  );
};
