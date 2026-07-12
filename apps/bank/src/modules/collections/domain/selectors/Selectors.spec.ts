import type { BankRootState } from '@/config/stores/store';
import { RoundsAdapter, RoundStatus, type CollectionRound } from '../entities/CollectionRound';
import { RoundStopStatus, StopsAdapter, type RoundStop } from '../entities/RoundStop';
import {
  selectCollectedBreakdown,
  selectRoundKpis,
  selectRoundsOfDay,
  selectRoundsSummary,
  selectStopsBreakdown,
} from './Selectors';

const makeRound = (overrides: Partial<CollectionRound> = {}): CollectionRound => ({
  id: 'round-1',
  date: '2026-07-03',
  agent: { id: 'agent-1', name: 'Agent Un' },
  zone: 'Zone',
  status: RoundStatus.Open,
  progress: { visited: 10, expected: 20 },
  expectedTotal: 20_000,
  collectedTotal: 10_000,
  cashInHand: 10_000,
  cashHoldingCap: 100_000,
  partialDeposits: [],
  openDisputesCount: 0,
  startedAt: '07h00',
  endedAt: null,
  ...overrides,
});

const makeStop = (overrides: Partial<RoundStop> = {}): RoundStop => ({
  id: 'stop-1',
  roundId: 'round-1',
  zone: 'Zone',
  client: { id: 'client-1', name: 'Client Un', activity: 'x', hasSmartphone: false },
  usualAmount: 1_000,
  status: RoundStopStatus.ToVisit,
  ...overrides,
});

const makeState = (rounds: CollectionRound[], stops: RoundStop[] = []): BankRootState =>
  ({
    collections: {
      rounds: RoundsAdapter.setAll(RoundsAdapter.getInitialState(), rounds),
      stops: StopsAdapter.setAll(StopsAdapter.getInitialState(), stops),
    },
  }) as unknown as BankRootState;

describe('collections selectors', () => {
  describe('selectRoundsOfDay', () => {
    it('sorts Open rounds before Closed, then by ascending progress ratio', () => {
      const closed = makeRound({ id: 'a-closed', status: RoundStatus.Closed, progress: { visited: 20, expected: 20 } });
      const openAdvanced = makeRound({ id: 'a-open-90', status: RoundStatus.Open, progress: { visited: 18, expected: 20 } });
      const openEarly = makeRound({ id: 'a-open-10', status: RoundStatus.Open, progress: { visited: 2, expected: 20 } });

      const state = makeState([closed, openAdvanced, openEarly]);

      expect(selectRoundsOfDay(state).map((r) => r.id)).toEqual(['a-open-10', 'a-open-90', 'a-closed']);
    });
  });

  describe('selectRoundKpis', () => {
    it('derives collectedTotal, cashRatio and progressRatio', () => {
      const round = makeRound({ collectedTotal: 34_200, cashInHand: 85_000, cashHoldingCap: 100_000, progress: { visited: 34, expected: 52 } });
      const state = makeState([round]);

      const kpis = selectRoundKpis(state, 'round-1');

      expect(kpis?.collectedTotal).toBe(34_200);
      expect(kpis?.cashRatio).toBeCloseTo(0.85);
      expect(kpis?.progressRatio).toBeCloseTo(34 / 52);
    });
  });

  describe('selectStopsBreakdown', () => {
    it('counts stops per status for the given round only', () => {
      const state = makeState([makeRound()], [
        makeStop({ id: 's1', status: RoundStopStatus.Collected }),
        makeStop({ id: 's2', status: RoundStopStatus.Collected }),
        makeStop({ id: 's3', status: RoundStopStatus.ToVisit }),
        makeStop({ id: 's4', status: RoundStopStatus.Absent }),
        makeStop({ id: 's5', roundId: 'other-round', status: RoundStopStatus.Collected }),
      ]);

      const breakdown = selectStopsBreakdown(state, 'round-1');

      expect(breakdown.Collected).toBe(2);
      expect(breakdown.ToVisit).toBe(1);
      expect(breakdown.Absent).toBe(1);
      expect(breakdown.Postponed).toBe(0);
    });
  });

  describe('selectRoundsSummary', () => {
    it('aggregates open/closed counts, collected total, average progress and the highest cap alert', () => {
      const state = makeState([
        makeRound({
          id: 'r1',
          agent: { id: 'agent-1', name: 'Cédric Nkoulou' },
          status: RoundStatus.Open,
          collectedTotal: 34_200,
          cashInHand: 85_000,
          cashHoldingCap: 100_000,
          progress: { visited: 34, expected: 52 },
        }),
        makeRound({
          id: 'r2',
          agent: { id: 'agent-2', name: 'Rosalie Fotso' },
          status: RoundStatus.Open,
          collectedTotal: 21_000,
          cashInHand: 61_000,
          cashHoldingCap: 100_000,
          progress: { visited: 28, expected: 40 },
        }),
        makeRound({
          id: 'r3',
          status: RoundStatus.Closed,
          collectedTotal: 47_000,
          progress: { visited: 45, expected: 45 },
        }),
      ]);

      const summary = selectRoundsSummary(state);

      expect(summary.openCount).toBe(2);
      expect(summary.closedCount).toBe(1);
      expect(summary.totalCount).toBe(3);
      expect(summary.collectedTotal).toBe(34_200 + 21_000 + 47_000);
      expect(summary.capAlert).toMatchObject({ agentName: 'Cédric Nkoulou', ratio: 0.85 });
    });

    it('returns no cap alert when nobody is near the ceiling', () => {
      const state = makeState([makeRound({ cashInHand: 10_000, cashHoldingCap: 100_000 })]);
      expect(selectRoundsSummary(state).capAlert).toBeNull();
    });
  });

  describe('selectCollectedBreakdown', () => {
    it('splits collected stops into normal vs extra (collected above usual), plus absent', () => {
      const state = makeState([makeRound()], [
        makeStop({ id: 's1', status: RoundStopStatus.Collected, usualAmount: 1_000, collectedAmount: 1_000 }),
        makeStop({ id: 's2', status: RoundStopStatus.Collected, usualAmount: 1_000, collectedAmount: 2_000 }),
        makeStop({ id: 's3', status: RoundStopStatus.Absent }),
        makeStop({ id: 's4', roundId: 'other-round', status: RoundStopStatus.Collected }),
      ]);

      const breakdown = selectCollectedBreakdown(state, 'round-1');

      expect(breakdown).toEqual({ normal: 1, extra: 1, absent: 1 });
    });
  });
});
