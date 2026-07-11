import React from 'react';
import { CountUp } from './CountUp';

export type KpiCardTone = 'primary' | 'default' | 'danger';

interface KpiCardProps {
  label: string;
  value: number;
  tone?: KpiCardTone;
  formatter?: (value: number) => string;
  hint?: React.ReactNode;
  /** Pastille rouge pulsante à côté du libellé (ex. compteur qui vient de changer). */
  pulse?: boolean;
  className?: string;
}

const toneClasses: Record<KpiCardTone, { card: string; label: string; value: string }> = {
  primary: { card: 'shadow-primary-glow bg-primary text-white', label: 'text-primary-tint', value: 'text-white' },
  default: { card: 'border border-line bg-card', label: 'text-ink-muted', value: 'text-ink' },
  danger: { card: 'border-[1.5px] border-danger bg-card', label: 'text-danger', value: 'text-danger' },
};

/** Carte KPI — tuile chiffrée du tableau de bord, valeur animée en count-up. */
export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  tone = 'default',
  formatter,
  hint,
  pulse = false,
  className,
}) => {
  const styles = toneClasses[tone];
  return (
    <div className={['rounded-card-lg p-5', styles.card, className ?? ''].join(' ')}>
      <div className="flex items-center justify-between">
        <div className={['text-[13px] font-semibold', styles.label].join(' ')}>{label}</div>
        {pulse && <span className="size-[9px] flex-none animate-pulse-soft rounded-full bg-danger" />}
      </div>
      <div className="mt-3 text-[34px] font-bold tracking-[-0.02em]">
        <CountUp value={value} formatter={formatter} className={styles.value} />
      </div>
      {hint && <div className="mt-2">{hint}</div>}
    </div>
  );
};
