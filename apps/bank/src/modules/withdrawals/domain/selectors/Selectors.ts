import { createSelector } from '@reduxjs/toolkit';
import type { BankRootState } from '@/config/stores/store';
import { WithdrawalsAdapter, WithdrawalStatus, type Withdrawal } from '../entities/Withdrawal';

const withdrawalsAdapterSelectors = WithdrawalsAdapter.getSelectors(
  (state: BankRootState) => state.withdrawals.withdrawals,
);

export const selectAllWithdrawals = withdrawalsAdapterSelectors.selectAll;

export const selectWithdrawalById = (state: BankRootState, id: string): Withdrawal | undefined =>
  withdrawalsAdapterSelectors.selectById(state, id);

/** À traiter — premier arrivé, premier servi (plus ancien d'abord). */
export const selectPendingWithdrawals = createSelector([selectAllWithdrawals], (withdrawals) =>
  withdrawals
    .filter((withdrawal) => withdrawal.status === WithdrawalStatus.Pending)
    .sort((a, b) => a.requestedAt.localeCompare(b.requestedAt)),
);

/** À décaisser — validées, en attente de remise des espèces (plus ancienne validation d'abord). */
export const selectApprovedAwaitingDisbursement = createSelector([selectAllWithdrawals], (withdrawals) =>
  withdrawals
    .filter((withdrawal) => withdrawal.status === WithdrawalStatus.Approved)
    .sort((a, b) => (a.approval?.at ?? '').localeCompare(b.approval?.at ?? '')),
);

/** Historique — décaissées ou rejetées, plus récentes d'abord. */
export const selectHistoryList = createSelector([selectAllWithdrawals], (withdrawals) =>
  withdrawals
    .filter(
      (withdrawal) =>
        withdrawal.status === WithdrawalStatus.Disbursed || withdrawal.status === WithdrawalStatus.Rejected,
    )
    .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt)),
);

export const selectPendingCount = createSelector(
  [selectAllWithdrawals],
  (withdrawals) => withdrawals.filter((withdrawal) => withdrawal.status === WithdrawalStatus.Pending).length,
);

/** Demande encore « en cours » (Pending ou Approved) pour un client donné — consommé par la fiche client. */
export const selectPendingByClient = createSelector(
  [selectAllWithdrawals, (_state: BankRootState, clientId: string) => clientId],
  (withdrawals, clientId): Withdrawal | undefined =>
    withdrawals.find(
      (withdrawal) =>
        withdrawal.client.id === clientId &&
        (withdrawal.status === WithdrawalStatus.Pending || withdrawal.status === WithdrawalStatus.Approved),
    ),
);

export const WithdrawalsSelectors = {
  selectAllWithdrawals,
  selectWithdrawalById,
  selectPendingWithdrawals,
  selectApprovedAwaitingDisbursement,
  selectHistoryList,
  selectPendingCount,
  selectPendingByClient,
};
