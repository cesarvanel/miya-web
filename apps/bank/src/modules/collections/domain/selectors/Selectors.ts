import { createSelector } from '@reduxjs/toolkit';
import type { BankRootState } from '@/config/stores/store';
import { RoundsAdapter, RoundStatus, type CollectionRound } from '../entities/CollectionRound';
import { RoundStopStatus, StopsAdapter, type RoundStop } from '../entities/RoundStop';

const roundsAdapterSelectors = RoundsAdapter.getSelectors(
  (state: BankRootState) => state.collections.rounds,
);
const stopsAdapterSelectors = StopsAdapter.getSelectors(
  (state: BankRootState) => state.collections.stops,
);

export const selectAllRounds = roundsAdapterSelectors.selectAll;
export const selectAllStops = stopsAdapterSelectors.selectAll;

export const selectRoundById = (
  state: BankRootState,
  roundId: string,
): CollectionRound | undefined => roundsAdapterSelectors.selectById(state, roundId);

const progressRatio = (round: CollectionRound): number =>
  round.progress.expected === 0 ? 0 : round.progress.visited / round.progress.expected;

/** Ouvertes d'abord, puis triées par progression croissante (les moins avancées d'abord). */
export const selectRoundsOfDay = createSelector([selectAllRounds], (rounds) =>
  [...rounds].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === RoundStatus.Open ? -1 : 1;
    }
    return progressRatio(a) - progressRatio(b);
  }),
);

export const selectStopsByRound = createSelector(
  [selectAllStops, (_state: BankRootState, roundId: string) => roundId],
  (stops, roundId): Record<string, RoundStop[]> => {
    const grouped: Record<string, RoundStop[]> = {};
    for (const stop of stops) {
      if (stop.roundId !== roundId) {
        continue;
      }
      grouped[stop.zone] = [...(grouped[stop.zone] ?? []), stop];
    }
    return grouped;
  },
);

export interface RoundKpis {
  collectedTotal: number;
  cashInHand: number;
  cashRatio: number;
  progressRatio: number;
}

export const selectRoundKpis = createSelector([selectRoundById], (round): RoundKpis | undefined => {
  if (!round) {
    return undefined;
  }
  return {
    collectedTotal: round.collectedTotal,
    cashInHand: round.cashInHand,
    cashRatio: round.cashHoldingCap === 0 ? 0 : round.cashInHand / round.cashHoldingCap,
    progressRatio: progressRatio(round),
  };
});

export type StopsBreakdown = Record<RoundStopStatus, number>;

export const selectStopsBreakdown = createSelector(
  [selectAllStops, (_state: BankRootState, roundId: string) => roundId],
  (stops, roundId): StopsBreakdown => {
    const breakdown: StopsBreakdown = {
      [RoundStopStatus.ToVisit]: 0,
      [RoundStopStatus.Collected]: 0,
      [RoundStopStatus.Pending]: 0,
      [RoundStopStatus.Absent]: 0,
      [RoundStopStatus.Postponed]: 0,
      [RoundStopStatus.OffRound]: 0,
    };
    for (const stop of stops) {
      if (stop.roundId === roundId) {
        breakdown[stop.status] += 1;
      }
    }
    return breakdown;
  },
);

export const CollectionsSelectors = {
  selectAllRounds,
  selectAllStops,
  selectRoundById,
  selectRoundsOfDay,
  selectStopsByRound,
  selectRoundKpis,
  selectStopsBreakdown,
};
