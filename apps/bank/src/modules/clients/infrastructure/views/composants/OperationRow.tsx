import React from 'react';
import { Money } from '@miya/kernel';
import { ClientOperationKind, ClientOperationStatus, type ClientOperation } from '../../../domain/entities/ClientOperation';
import { formatOperationTime } from './formatClientTime';

interface OperationRowProps {
  operation: ClientOperation;
}

const LABELS: Record<ClientOperationKind, string> = {
  Collection: 'Cotisation journalière',
  Withdrawal: 'Retrait en agence',
  CustodyFee: 'Frais de tenue de compte',
  OpeningDeposit: "Dépôt d'ouverture",
};

const CollectionIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 3v10m0-10L5 6m3-3l3 3" stroke="#0A6B4E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WithdrawalIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 13V3m0 10l3-3m-3 3l-3-3" stroke="#C43B32" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const OperationRow: React.FC<OperationRowProps> = ({ operation }) => {
  const isPositive = operation.amount >= 0;
  const isPending = operation.status === ClientOperationStatus.Pending;
  return (
    <div
      className={[
        'flex items-center gap-3 border-b border-line-faint px-[22px] py-[13px] last:border-b-0',
        isPending ? 'bg-cream-50' : '',
      ].join(' ')}
    >
      <div
        className={[
          'flex size-[34px] flex-none items-center justify-center rounded-[10px]',
          isPositive ? 'bg-primary-soft' : 'bg-amber-soft',
        ].join(' ')}
      >
        {isPositive ? <CollectionIcon /> : <WithdrawalIcon />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-bold text-ink">
          {LABELS[operation.kind]}
          {isPending ? ' · en attente de décaissement' : ''}
        </div>
        <div className="num text-[11.5px] font-medium text-ink-muted">
          {formatOperationTime(operation.occurredAt)}
          {operation.agentName ? ` · ${operation.agentName}` : ''}
        </div>
      </div>
      <span className={['num text-sm font-bold', isPositive ? 'text-primary' : 'text-danger'].join(' ')}>
        {isPositive ? '+' : '−'}
        {Money.from(Math.abs(operation.amount)).format().replace(' FCFA', '')}
      </span>
    </div>
  );
};
