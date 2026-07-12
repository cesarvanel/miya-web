import { createEntityAdapter } from '@reduxjs/toolkit';

export const ClientOperationKind = {
  Collection: 'Collection',
  Withdrawal: 'Withdrawal',
  CustodyFee: 'CustodyFee',
} as const;
export type ClientOperationKind = (typeof ClientOperationKind)[keyof typeof ClientOperationKind];

export const ClientOperationStatus = {
  Completed: 'Completed',
  Pending: 'Pending',
} as const;
export type ClientOperationStatus = (typeof ClientOperationStatus)[keyof typeof ClientOperationStatus];

export interface ClientOperation {
  id: string;
  clientId: string;
  kind: ClientOperationKind;
  /** Signé — positif pour une collecte, négatif pour un retrait/frais. */
  amount: number;
  /** ISO — trié par mois puis par date décroissante dans les vues. */
  occurredAt: string;
  agentName?: string;
  status: ClientOperationStatus;
}

export const OperationsAdapter = createEntityAdapter<ClientOperation, string>({
  selectId: (operation) => operation.id,
  sortComparer: (a, b) => b.occurredAt.localeCompare(a.occurredAt),
});
