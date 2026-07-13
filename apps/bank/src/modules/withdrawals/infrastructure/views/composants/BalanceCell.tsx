import React from 'react';
import { Money } from '@miya/kernel';

interface BalanceCellProps {
  availableBalance: number;
  requestedAmount: number;
}

/** Solde disponible — en rouge si insuffisant pour couvrir le montant demandé. */
export const BalanceCell: React.FC<BalanceCellProps> = ({ availableBalance, requestedAmount }) => {
  const isInsufficient = requestedAmount > availableBalance;
  return (
    <div>
      <div className={['num text-[13.5px] font-bold', isInsufficient ? 'text-danger' : 'text-ink'].join(' ')}>
        {Money.from(availableBalance).format()}
      </div>
      {isInsufficient && <div className="text-[11px] font-bold text-danger">Solde insuffisant</div>}
    </div>
  );
};
