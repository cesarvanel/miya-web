import { createEntityAdapter } from '@reduxjs/toolkit';

export const WithdrawalStatus = {
  Pending: 'Pending',
  Approved: 'Approved',
  Disbursed: 'Disbursed',
  Rejected: 'Rejected',
} as const;
export type WithdrawalStatus = (typeof WithdrawalStatus)[keyof typeof WithdrawalStatus];

export const DisbursementMethod = {
  CashAtBranch: 'CashAtBranch',
  ViaAgent: 'ViaAgent',
} as const;
export type DisbursementMethod = (typeof DisbursementMethod)[keyof typeof DisbursementMethod];

export interface WithdrawalClient {
  id: string;
  name: string;
  activity: string;
}

export interface WithdrawalApproval {
  by: string;
  /** ISO. */
  at: string;
}

export interface WithdrawalDisbursement {
  by: string;
  /** ISO. */
  at: string;
  method: DisbursementMethod;
  /** Uniquement pour method === ViaAgent. */
  agentId?: string;
}

export interface WithdrawalRejection {
  by: string;
  /** ISO. */
  at: string;
  reason: string;
}

export interface Withdrawal {
  /** Ex. « WD-0703-12 ». */
  id: string;
  client: WithdrawalClient;
  requestedAmount: number;
  /** Solde d'épargne du client au moment de la demande — sert de garde-fou à l'approbation. */
  availableBalance: number;
  /** ISO. */
  requestedAt: string;
  status: WithdrawalStatus;
  approval: WithdrawalApproval | null;
  disbursement: WithdrawalDisbursement | null;
  rejection: WithdrawalRejection | null;
}

export const WithdrawalsAdapter = createEntityAdapter<Withdrawal, string>({
  selectId: (withdrawal) => withdrawal.id,
});
