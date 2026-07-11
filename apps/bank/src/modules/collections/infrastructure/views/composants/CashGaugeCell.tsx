import React from 'react';
import { Money } from '@miya/kernel';

interface CashGaugeCellProps {
  cashInHand: number;
  cashHoldingCap: number;
}

const WARN_RATIO = 0.85;

export const CashGaugeCell: React.FC<CashGaugeCellProps> = ({ cashInHand, cashHoldingCap }) => {
  const ratio = cashHoldingCap === 0 ? 0 : cashInHand / cashHoldingCap;
  const isWarning = ratio >= WARN_RATIO;
  const percent = Math.min(100, Math.round(ratio * 100));

  return (
    <div>
      <div className={['num text-[12.5px] font-bold', isWarning ? 'text-amber' : 'text-ink'].join(' ')}>
        {Money.from(cashInHand).format().replace(' FCFA', '')}{' '}
        <span className="text-ink-disabled font-semibold">/{Math.round(cashHoldingCap / 1000)}k</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-cream-100">
        <div
          className={['h-full rounded-full', isWarning ? 'bg-linear-to-r from-amber-strong to-amber-fill-end' : 'bg-primary'].join(' ')}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
