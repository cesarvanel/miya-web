import React from 'react';

interface CashCellProps {
  cashInHand: number;
  cashHoldingCap: number;
}

/** Colonne "Cash en main" pour un agent en tournée — montant + jauge (ambre ≥ 85%). */
export const CashCell: React.FC<CashCellProps> = ({ cashInHand, cashHoldingCap }) => {
  const ratio = cashHoldingCap > 0 ? cashInHand / cashHoldingCap : 0;
  const isWarning = ratio >= 0.85;
  const capK = Math.round(cashHoldingCap / 1000);

  return (
    <div>
      <div className={['num text-[12.5px] font-bold', isWarning ? 'text-amber' : 'text-ink'].join(' ')}>
        {cashInHand.toLocaleString('fr-FR').replace(/\s/g, ' ')}{' '}
        <span className="font-semibold text-ink-disabled">/{capK}k</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-cream-100">
        <div
          className={[
            'h-full rounded-full',
            isWarning ? 'bg-linear-to-r from-amber-strong to-amber-fill-end' : 'bg-primary',
          ].join(' ')}
          style={{ width: `${Math.min(100, ratio * 100)}%` }}
        />
      </div>
    </div>
  );
};
