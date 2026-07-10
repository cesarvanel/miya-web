import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { SettlementsAdapter, type SettlementSlip } from '../entities/SettlementSlip';
import { FetchSettlementQueueAsync } from '../..';


const initialState = SettlementsAdapter.getInitialState();

export type SettlementsState = typeof initialState;

export const settlementsSlice = createSlice({
  name: 'settlements',
  initialState,
  reducers: {
    slipLoaded: (state, action: PayloadAction<SettlementSlip>) => {
      SettlementsAdapter.upsertOne(state, action.payload);
    },
    validate: (state, action: PayloadAction<{ id: string }>) => {
      SettlementsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: { status: 'Validated' },
      });
    },
    reject: (
      state,
      action: PayloadAction<{ id: string; reason: string; receivedAmount: number }>,
    ) => {
      const { id, reason, receivedAmount } = action.payload;
      SettlementsAdapter.updateOne(state, {
        id,
        changes: { status: 'Rejected', rejection: { reason, receivedAmount } },
      });
    },
  },

  extraReducers: (builder) => {
    builder.addCase(FetchSettlementQueueAsync.fulfilled, (state, action) => {
      SettlementsAdapter.upsertMany(state, action.payload.settlements);
    });
  }
});

export const SettlementsActions = settlementsSlice.actions;