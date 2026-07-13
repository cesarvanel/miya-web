import React from 'react';
import { DisbursementMethod, WithdrawalStatus, type Withdrawal } from '../../../domain/entities/Withdrawal';
import { formatShortDate, formatTime } from './formatWithdrawalTime';

interface TraceabilityCellProps {
  withdrawal: Withdrawal;
}

const methodLabel = (method: DisbursementMethod): string =>
  method === DisbursementMethod.CashAtBranch ? 'en agence' : "via l'agent";

/** Chaîne de traçabilité complète — demandé/validé/décaissé ou rejeté, qui et quand. */
export const TraceabilityCell: React.FC<TraceabilityCellProps> = ({ withdrawal }) => (
  <div className="flex flex-col gap-1 text-[12px] font-semibold text-ink-muted">
    <span>
      Demandé le {formatShortDate(withdrawal.requestedAt)} à {formatTime(withdrawal.requestedAt)}
    </span>
    {withdrawal.approval && (
      <span>
        Validé par {withdrawal.approval.by} à {formatTime(withdrawal.approval.at)}
      </span>
    )}
    {withdrawal.status === WithdrawalStatus.Disbursed && withdrawal.disbursement && (
      <span className="font-bold text-primary">
        Décaissé par {withdrawal.disbursement.by} à {formatTime(withdrawal.disbursement.at)} ·{' '}
        {methodLabel(withdrawal.disbursement.method)}
      </span>
    )}
    {withdrawal.status === WithdrawalStatus.Rejected && withdrawal.rejection && (
      <span className="font-bold text-danger">
        Refusé par {withdrawal.rejection.by} à {formatTime(withdrawal.rejection.at)} · {withdrawal.rejection.reason}
      </span>
    )}
  </div>
);
