import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { FetchDisputesAsync } from '../../application/usecases/fetch-disputes-async/FetchDisputesAsync';
import { DisputesAdapter, DisputeDecision, DisputeStatus } from '../entities/Dispute';
import { disputeOpened } from '../events/Events';

const initialState = DisputesAdapter.getInitialState();

export type DisputesState = typeof initialState;

const nextDisputeId = (): string =>
  `CT-${Date.now().toString().slice(-8)}`;

interface ResolvePayload {
  id: string;
  reason: string;
  decidedBy: string;
}

/** Une contestation Resolved est immuable — toute re-résolution est ignorée. */
const resolve = (
  state: DisputesState,
  payload: ResolvePayload,
  decidedInFavorOf: DisputeDecision,
): void => {
  const dispute = state.entities[payload.id];
  if (!dispute || dispute.status === DisputeStatus.Resolved) {
    return;
  }
  DisputesAdapter.updateOne(state, {
    id: payload.id,
    changes: {
      status: DisputeStatus.Resolved,
      resolution: {
        decidedInFavorOf,
        reason: payload.reason,
        decidedBy: payload.decidedBy,
        decidedAt: new Date().toISOString(),
      },
    },
  });
};

export const disputesSlice = createSlice({
  name: 'disputes',
  initialState,
  reducers: {
    resolveForClient: (state, action: PayloadAction<ResolvePayload>) => {
      resolve(state, action.payload, DisputeDecision.Client);
    },
    resolveForAgent: (state, action: PayloadAction<ResolvePayload>) => {
      resolve(state, action.payload, DisputeDecision.Agent);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchDisputesAsync.fulfilled, (state, action) => {
        DisputesAdapter.setAll(state, action.payload.disputes);
      })
      .addCase(disputeOpened, (state, action) => {
        const { zone, agent, client, clientHistory, agentHistory } = action.payload;
        DisputesAdapter.addOne(state, {
          id: nextDisputeId(),
          openedAt: new Date().toISOString(),
          zone,
          status: DisputeStatus.Open,
          agent,
          client,
          clientHistory,
          agentHistory,
          resolution: null,
        });
      });
  },
});

export const DisputesActions = disputesSlice.actions;
