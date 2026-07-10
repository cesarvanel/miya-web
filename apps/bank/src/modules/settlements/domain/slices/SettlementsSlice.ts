import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { FetchSlipAsync } from '../../application/usecases/fetch-slip-async/FetchSlipAsync';
import { FetchSettlementQueueAsync } from '../../application/usecases/fetch-settlement-queue-async/FetchSettlementQueueAsync';
import { SettlementsAdapter, SettlementStatus } from '../entities/SettlementSlip';

const initialState = SettlementsAdapter.getInitialState();

export type SettlementsState = typeof initialState;

export const settlementsSlice = createSlice({
  name: 'settlements',
  initialState,
  reducers: {
    validate: (state, action: PayloadAction<{ id: string }>) => {
      SettlementsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: { status: SettlementStatus.Validated },
      });
    },
    reject: (
      state,
      action: PayloadAction<{ id: string; reason: string; receivedAmount: number }>,
    ) => {
      const { id, reason, receivedAmount } = action.payload;
      SettlementsAdapter.updateOne(state, {
        id,
        changes: {
          status: SettlementStatus.Rejected,
          rejection: { reason, receivedAmount },
        },
      });
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(FetchSettlementQueueAsync.fulfilled, (state, action) => {
        SettlementsAdapter.upsertMany(state, action.payload.settlements);
      })
      .addCase(FetchSlipAsync.fulfilled, (state, action) => {
        SettlementsAdapter.upsertOne(state, action.payload.settlement);
      });
  },
});

export const SettlementsActions = settlementsSlice.actions;
