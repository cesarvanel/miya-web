import React from 'react';
import { formatAmount } from './AmountInput';

interface GaugeProps {
  /** Valeur courante (ex. cash en main, en FCFA). */
  value: number;
  /** Plafond. */
  max: number;
  /** Ratio à partir duquel la jauge passe en ambre (maquette : proche plafond). */
  warnRatio?: number;
  label?: React.ReactNode;
  /** Message affiché sous la jauge (ex. « À 15 000 FCFA du plafond… »). */
  hint?: React.ReactNode;
}

export const gaugeRatio = (value: number, max: number): number => {
  if (max <= 0) {
    return 0;
  }
  return Math.min(Math.max(value / max, 0), 1);
};

export const Gauge: React.FC<GaugeProps> = ({
  value,
  max,
  warnRatio = 0.8,
  label,
  hint,
}) => {
  const ratio = gaugeRatio(value, max);
  const isWarning = ratio >= warnRatio;

  return (
    <div
      data-warning={isWarning}
      className={[
        'rounded-[18px] border px-[18px] py-4',
        isWarning
          ? 'border-amber-border bg-amber-soft'
          : 'border-line bg-cream-50',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={[
            'text-[13px] font-bold',
            isWarning ? 'text-amber-deep' : 'text-ink-muted',
          ].join(' ')}
        >
          {label}
        </span>
        <span
          className={[
            'num text-[13px] font-bold',
            isWarning ? 'text-amber' : 'text-ink',
          ].join(' ')}
        >
          {formatAmount(value)} / {formatAmount(max)}
        </span>
      </div>
      <div
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={[
          'rounded-gauge mt-[9px] h-[10px] overflow-hidden',
          isWarning ? 'bg-amber-track' : 'bg-line',
        ].join(' ')}
      >
        <div
          data-testid="gauge-fill"
          style={{ width: `${ratio * 100}%` }}
          className={[
            'rounded-gauge h-full transition-[width] duration-500 ease-out',
            isWarning
              ? 'bg-linear-to-r from-amber-strong to-amber-fill-end'
              : 'bg-primary',
          ].join(' ')}
        />
      </div>
      {hint && (
        <div
          className={[
            'mt-2 text-xs font-semibold',
            isWarning ? 'text-amber-deep' : 'text-ink-muted',
          ].join(' ')}
        >
          {hint}
        </div>
      )}
    </div>
  );
};
