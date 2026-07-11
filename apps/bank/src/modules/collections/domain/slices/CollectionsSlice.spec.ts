import { RoundsAdapter, RoundStatus, type CollectionRound } from '../entities/CollectionRound';
import { RoundStopStatus, StopsAdapter, type RoundStop } from '../entities/RoundStop';
import { collectionConfirmed, partialDepositValidated, roundClosed } from '../events/Events';
import { collectionsSlice } from './CollectionsSlice';

const makeRound = (overrides: Partial<CollectionRound> = {}): CollectionRound => ({
  id: 'agent-cedric-nkoulou',
  date: '2026-07-03',
  agent: { id: 'agent-cedric-nkoulou', name: 'Cédric Nkoulou' },
  zone: 'Marché Mokolo',
  status: RoundStatus.Open,
  progress: { visited: 34, expected: 52 },
  expectedTotal: 60_000,
  collectedTotal: 34_200,
  cashInHand: 85_000,
  cashHoldingCap: 100_000,
  partialDeposits: [],
  openDisputesCount: 0,
  startedAt: '07h12',
  endedAt: null,
  ...overrides,
});

const makeStop = (overrides: Partial<RoundStop> = {}): RoundStop => ({
  id: 'stop-1',
  roundId: 'agent-cedric-nkoulou',
  zone: 'Marché Mokolo',
  client: { id: 'client-1', name: 'Robert Biya', activity: 'Menuisier', hasSmartphone: false },
  usualAmount: 1_100,
  status: RoundStopStatus.ToVisit,
  ...overrides,
});

const stateWith = (round: CollectionRound, stops: RoundStop[]) => {
  const initial = collectionsSlice.reducer(undefined, { type: '@@init' });
  return {
    rounds: RoundsAdapter.setAll(initial.rounds, [round]),
    stops: StopsAdapter.setAll(initial.stops, stops),
  };
};

describe('collectionsSlice', () => {
  it('starts empty', () => {
    const state = collectionsSlice.reducer(undefined, { type: '@@init' });
    expect(state.rounds.ids).toEqual([]);
    expect(state.stops.ids).toEqual([]);
  });

  describe('collectionConfirmed (temps réel)', () => {
    it('marks the stop Collected and updates the round aggregates', () => {
      const state = stateWith(makeRound(), [makeStop()]);

      const next = collectionsSlice.reducer(
        state,
        collectionConfirmed({
          roundId: 'agent-cedric-nkoulou',
          agentId: 'agent-cedric-nkoulou',
          stopId: 'stop-1',
          clientName: 'Robert Biya',
          amount: 1_100,
        }),
      );

      const stop = next.stops.entities['stop-1'];
      expect(stop?.status).toBe(RoundStopStatus.Collected);
      expect(stop?.collectedAmount).toBe(1_100);
      expect(stop?.collectedAt).toBeDefined();

      const round = next.rounds.entities['agent-cedric-nkoulou'];
      expect(round?.collectedTotal).toBe(35_300);
      expect(round?.cashInHand).toBe(86_100);
      expect(round?.progress.visited).toBe(35);
    });

    it('does not exceed progress.expected', () => {
      const state = stateWith(
        makeRound({ progress: { visited: 52, expected: 52 } }),
        [makeStop({ status: RoundStopStatus.ToVisit })],
      );

      const next = collectionsSlice.reducer(
        state,
        collectionConfirmed({
          roundId: 'agent-cedric-nkoulou',
          agentId: 'agent-cedric-nkoulou',
          stopId: 'stop-1',
          clientName: 'Robert Biya',
          amount: 500,
        }),
      );

      expect(next.rounds.entities['agent-cedric-nkoulou']?.progress.visited).toBe(52);
    });

    it('does not re-collect a stop that is already Collected', () => {
      const state = stateWith(makeRound(), [
        makeStop({ status: RoundStopStatus.Collected, collectedAmount: 1_000, collectedAt: '08h00' }),
      ]);

      const next = collectionsSlice.reducer(
        state,
        collectionConfirmed({
          roundId: 'agent-cedric-nkoulou',
          agentId: 'agent-cedric-nkoulou',
          stopId: 'stop-1',
          clientName: 'Robert Biya',
          amount: 1_100,
        }),
      );

      expect(next.stops.entities['stop-1']?.collectedAmount).toBe(1_000);
      // La round, elle, incrémente quand même (fait métier déclaré par l'event).
      expect(next.rounds.entities['agent-cedric-nkoulou']?.collectedTotal).toBe(35_300);
    });
  });

  describe('roundClosed (temps réel)', () => {
    it('sets status Closed', () => {
      const state = stateWith(makeRound(), []);

      const next = collectionsSlice.reducer(
        state,
        roundClosed({ roundId: 'agent-cedric-nkoulou', agentId: 'agent-cedric-nkoulou' }),
      );

      const round = next.rounds.entities['agent-cedric-nkoulou'];
      expect(round?.status).toBe(RoundStatus.Closed);
      expect(round?.endedAt).toBeDefined();
    });
  });

  describe('partialDepositValidated (temps réel)', () => {
    it('decrements cashInHand and records the deposit', () => {
      const state = stateWith(makeRound({ cashInHand: 85_000, partialDeposits: [] }), []);

      const next = collectionsSlice.reducer(
        state,
        partialDepositValidated({
          roundId: 'agent-cedric-nkoulou',
          agentId: 'agent-cedric-nkoulou',
          amount: 20_000,
          validatedBy: 'A. Mbarga',
        }),
      );

      const round = next.rounds.entities['agent-cedric-nkoulou'];
      expect(round?.cashInHand).toBe(65_000);
      expect(round?.partialDeposits).toHaveLength(1);
      expect(round?.partialDeposits[0]).toMatchObject({ amount: 20_000, validatedBy: 'A. Mbarga' });
    });

    it('does not go below zero', () => {
      const state = stateWith(makeRound({ cashInHand: 10_000, partialDeposits: [] }), []);

      const next = collectionsSlice.reducer(
        state,
        partialDepositValidated({
          roundId: 'agent-cedric-nkoulou',
          agentId: 'agent-cedric-nkoulou',
          amount: 20_000,
          validatedBy: 'A. Mbarga',
        }),
      );

      expect(next.rounds.entities['agent-cedric-nkoulou']?.cashInHand).toBe(0);
    });
  });
});
