import { createSlice } from '@reduxjs/toolkit';
import { FetchRoundDetailAsync } from '../../application/usecases/fetch-round-detail-async/FetchRoundDetailAsync';
import { FetchRoundsAsync } from '../../application/usecases/fetch-rounds-async/FetchRoundsAsync';
import { RoundsAdapter, RoundStatus } from '../entities/CollectionRound';
import { RoundStopStatus, StopsAdapter } from '../entities/RoundStop';
import { collectionConfirmed, partialDepositValidated, roundClosed } from '../events/Events';

const initialState = {
  rounds: RoundsAdapter.getInitialState(),
  stops: StopsAdapter.getInitialState(),
};

export type CollectionsState = typeof initialState;

/** « 08h26 » — format maquette, cohérent avec settlements.SettlementLine.collectedAt. */
const formatNow = (): string => {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, '0')}h${String(date.getMinutes()).padStart(2, '0')}`;
};

const nextDepositId = (): string =>
  `dep-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FetchRoundsAsync.fulfilled, (state, action) => {
        RoundsAdapter.upsertMany(state.rounds, action.payload.rounds);
      })
      .addCase(FetchRoundDetailAsync.fulfilled, (state, action) => {
        RoundsAdapter.upsertOne(state.rounds, action.payload.round);
        StopsAdapter.upsertMany(state.stops, action.payload.stops);
      })
      .addCase(collectionConfirmed, (state, action) => {
        const { roundId, stopId, amount } = action.payload;
        const stop = state.stops.entities[stopId];
        if (stop && stop.status !== RoundStopStatus.Collected) {
          StopsAdapter.updateOne(state.stops, {
            id: stopId,
            changes: {
              status: RoundStopStatus.Collected,
              collectedAmount: amount,
              collectedAt: formatNow(),
            },
          });
        }
        const round = state.rounds.entities[roundId];
        if (round) {
          RoundsAdapter.updateOne(state.rounds, {
            id: roundId,
            changes: {
              collectedTotal: round.collectedTotal + amount,
              cashInHand: round.cashInHand + amount,
              progress: {
                ...round.progress,
                visited: Math.min(round.progress.expected, round.progress.visited + 1),
              },
            },
          });
        }
      })
      .addCase(roundClosed, (state, action) => {
        const round = state.rounds.entities[action.payload.roundId];
        if (round) {
          RoundsAdapter.updateOne(state.rounds, {
            id: action.payload.roundId,
            changes: { status: RoundStatus.Closed, endedAt: formatNow() },
          });
        }
      })
      .addCase(partialDepositValidated, (state, action) => {
        const { roundId, amount, validatedBy } = action.payload;
        const round = state.rounds.entities[roundId];
        if (round) {
          RoundsAdapter.updateOne(state.rounds, {
            id: roundId,
            changes: {
              cashInHand: Math.max(0, round.cashInHand - amount),
              partialDeposits: [
                ...round.partialDeposits,
                { id: nextDepositId(), amount, validatedAt: formatNow(), validatedBy },
              ],
            },
          });
        }
      });
  },
});

export const CollectionsActions = collectionsSlice.actions;
