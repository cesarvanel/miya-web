import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { WithdrawalsAdapter, WithdrawalStatus } from '../entities/Withdrawal';
import { withdrawalApproved, withdrawalDisbursed } from '../events/Events';
import { FetchWithdrawalsAsync } from '../../application/usecases/fetch-withdrawals-async/FetchWithdrawalsAsync';

const initialState = {
  withdrawals: WithdrawalsAdapter.getInitialState(),
};

export type WithdrawalsState = typeof initialState;

export const withdrawalsSlice = createSlice({
  name: 'withdrawals',
  initialState,
  reducers: {
    /** Rejet — interne au module (pas de consommateur cross-module) : Pending → Rejected uniquement. */
    rejected: (
      state,
      action: PayloadAction<{ id: string; by: string; at: string; reason: string }>,
    ) => {
      const withdrawal = state.withdrawals.entities[action.payload.id];
      if (!withdrawal || withdrawal.status !== WithdrawalStatus.Pending) {
        return;
      }
      WithdrawalsAdapter.updateOne(state.withdrawals, {
        id: action.payload.id,
        changes: {
          status: WithdrawalStatus.Rejected,
          rejection: { by: action.payload.by, at: action.payload.at, reason: action.payload.reason },
        },
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchWithdrawalsAsync.fulfilled, (state, action) => {
        WithdrawalsAdapter.setAll(state.withdrawals, action.payload.withdrawals);
      })
      /** Pending → Approved uniquement, et jamais si le montant dépasse le solde disponible. */
      .addCase(withdrawalApproved, (state, action) => {
        const withdrawal = state.withdrawals.entities[action.payload.withdrawalId];
        if (
          !withdrawal ||
          withdrawal.status !== WithdrawalStatus.Pending ||
          withdrawal.requestedAmount > withdrawal.availableBalance
        ) {
          return;
        }
        WithdrawalsAdapter.updateOne(state.withdrawals, {
          id: action.payload.withdrawalId,
          changes: {
            status: WithdrawalStatus.Approved,
            approval: { by: action.payload.by, at: action.payload.at },
          },
        });
      })
      /** Approved → Disbursed uniquement — pas de décaissement sans approbation, pas de double décaissement. */
      .addCase(withdrawalDisbursed, (state, action) => {
        const withdrawal = state.withdrawals.entities[action.payload.withdrawalId];
        if (!withdrawal || withdrawal.status !== WithdrawalStatus.Approved) {
          return;
        }
        WithdrawalsAdapter.updateOne(state.withdrawals, {
          id: action.payload.withdrawalId,
          changes: {
            status: WithdrawalStatus.Disbursed,
            disbursement: {
              by: action.payload.by,
              at: action.payload.at,
              method: action.payload.method,
              agentId: action.payload.agentId,
            },
          },
        });
      });
  },
});

export const WithdrawalsActions = withdrawalsSlice.actions;
