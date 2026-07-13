import { createAction } from '@reduxjs/toolkit';
import type { DisbursementMethod } from '../entities/Withdrawal';

/**
 * Événements canoniques du domaine withdrawals — un seul event domaine par
 * fait métier (même solution que `collectionConfirmed`/`disputeOpened`).
 * `withdrawalDisbursed` est consommé aussi par `clients` (débit du solde
 * d'épargne, disparition du bandeau) via l'index public, jamais redéfini
 * localement ailleurs.
 */
export interface WithdrawalApprovedPayload {
  withdrawalId: string;
  clientId: string;
  by: string;
  at: string;
}
export const withdrawalApproved = createAction<WithdrawalApprovedPayload>(
  'withdrawals/withdrawalApproved',
);

export interface WithdrawalDisbursedPayload {
  withdrawalId: string;
  clientId: string;
  amount: number;
  by: string;
  at: string;
  method: DisbursementMethod;
  agentId?: string;
}
export const withdrawalDisbursed = createAction<WithdrawalDisbursedPayload>(
  'withdrawals/withdrawalDisbursed',
);
