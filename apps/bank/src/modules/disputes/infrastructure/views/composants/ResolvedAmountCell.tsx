import React from 'react';
import { DisputeDecision } from '../../../domain/entities/Dispute';
import { formatAmount } from './formatAmount';

interface ResolvedAmountCellProps {
  enteredAmount: number;
  declaredAmount: number;
  decidedInFavorOf: DisputeDecision;
}

/** « 1 000 → 1 500 » (faveur client) ou « 1 000 · maintenu » (faveur agent). */
export const ResolvedAmountCell: React.FC<ResolvedAmountCellProps> = ({
  enteredAmount,
  declaredAmount,
  decidedInFavorOf,
}) => {
  if (decidedInFavorOf === DisputeDecision.Client) {
    return (
      <div className="flex items-center gap-2">
        <span className="num text-sm font-semibold text-ink-faint">{formatAmount(enteredAmount)}</span>
        <span className="text-ink-disabled text-xs">→</span>
        <span className="num text-sm font-bold text-primary">{formatAmount(declaredAmount)}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span className="num text-sm font-bold text-primary">{formatAmount(enteredAmount)}</span>
      <span className="text-ink-disabled text-[11px]">maintenu</span>
    </div>
  );
};
