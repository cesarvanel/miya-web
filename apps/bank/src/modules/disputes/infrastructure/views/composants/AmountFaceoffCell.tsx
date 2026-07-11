import React from 'react';
import { formatAmount } from './formatAmount';

interface AmountFaceoffCellProps {
  enteredAmount: number;
  declaredAmount: number;
}

/** « Saisi vs déclaré » — les deux montants, flèche vers la valeur contestée. */
export const AmountFaceoffCell: React.FC<AmountFaceoffCellProps> = ({
  enteredAmount,
  declaredAmount,
}) => (
  <div className="flex items-center gap-2">
    <span className="num text-sm font-bold text-ink">{formatAmount(enteredAmount)}</span>
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 8h7m0 0l-2.5-2.5M11 8l-2.5 2.5"
        stroke="#C43B32"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="num text-sm font-bold text-danger">{formatAmount(declaredAmount)}</span>
  </div>
);
