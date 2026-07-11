import type { BankRootState } from '@/config/stores/store';
import { AgentDayStatus, type AgentDaySummary } from '../entities/AgentDaySummary';
import { AgentDaySummariesAdapter } from '../entities/AgentDaySummary';
import { ActivityEventsAdapter } from '../entities/ActivityEvent';
import { selectAlerts, selectKpis, selectSortedAgents } from './Selectors';

const makeAgent = (overrides: Partial<AgentDaySummary> = {}): AgentDaySummary => ({
  agentId: 'agent-1',
  name: 'Agent Un',
  zone: 'Zone',
  roundProgress: { visited: 10, total: 20 },
  collectedAmount: 10_000,
  cashInHand: 10_000,
  cashHoldingCap: 100_000,
  status: AgentDayStatus.OnRound,
  openDisputesCount: 0,
  slipId: null,
  settlementPendingSince: null,
  ...overrides,
});

const makeState = (agents: AgentDaySummary[]): BankRootState =>
  ({
    dashboard: {
      agents: AgentDaySummariesAdapter.setAll(AgentDaySummariesAdapter.getInitialState(), agents),
      activity: ActivityEventsAdapter.getInitialState(),
    },
  }) as unknown as BankRootState;

describe('dashboard selectors', () => {
  describe('selectSortedAgents', () => {
    it('sorts SettlementPending first, then open disputes, then OnRound, then the rest', () => {
      const validated = makeAgent({ agentId: 'a-validated', status: AgentDayStatus.Validated });
      const onRound = makeAgent({ agentId: 'a-onround', status: AgentDayStatus.OnRound });
      const disputed = makeAgent({ agentId: 'a-disputed', status: AgentDayStatus.OnRound, openDisputesCount: 1 });
      const pending = makeAgent({ agentId: 'a-pending', status: AgentDayStatus.SettlementPending });

      const state = makeState([validated, onRound, disputed, pending]);

      expect(selectSortedAgents(state).map((agent) => agent.agentId)).toEqual([
        'a-pending',
        'a-disputed',
        'a-onround',
        'a-validated',
      ]);
    });
  });

  describe('selectKpis', () => {
    it('derives totals, agentsOnRound, dayClosedCount and openDisputes', () => {
      const state = makeState([
        makeAgent({
          agentId: 'a1',
          collectedAmount: 34_200,
          cashInHand: 85_000,
          status: AgentDayStatus.OnRound,
          roundProgress: { visited: 34, total: 52 },
        }),
        makeAgent({
          agentId: 'a2',
          collectedAmount: 44_500,
          cashInHand: 44_500,
          status: AgentDayStatus.SettlementPending,
          roundProgress: { visited: 52, total: 52 },
          openDisputesCount: 0,
        }),
        makeAgent({
          agentId: 'a3',
          collectedAmount: 47_000,
          cashInHand: 0,
          status: AgentDayStatus.Validated,
          roundProgress: { visited: 45, total: 45 },
          openDisputesCount: 1,
        }),
      ]);

      const kpis = selectKpis(state);

      expect(kpis.totalCollectedToday.format()).toBe('125 700 FCFA');
      expect(kpis.cashInCirculation.format()).toBe('129 500 FCFA');
      expect(kpis.agentsOnRound).toEqual({ on: 1, total: 3 });
      expect(kpis.dayClosedCount).toBe(2);
      expect(kpis.openDisputes).toBe(1);
    });
  });

  describe('selectAlerts', () => {
    it('flags an OnRound agent at or above 85% of their cash holding cap', () => {
      const state = makeState([
        makeAgent({ agentId: 'a-cap', cashInHand: 85_000, cashHoldingCap: 100_000, status: AgentDayStatus.OnRound }),
        makeAgent({ agentId: 'a-ok', cashInHand: 40_000, cashHoldingCap: 100_000, status: AgentDayStatus.OnRound }),
      ]);

      const alerts = selectAlerts(state);

      expect(alerts).toHaveLength(1);
      expect(alerts[0]).toMatchObject({ kind: 'capApproaching', agentId: 'a-cap' });
    });

    it('flags a SettlementPending agent overdue by more than 2 hours, with the slipId for navigation', () => {
      const overdueSince = new Date(Date.now() - 2.5 * 3_600_000).toISOString();
      const recentSince = new Date(Date.now() - 30 * 60_000).toISOString();

      const state = makeState([
        makeAgent({
          agentId: 'a-overdue',
          status: AgentDayStatus.SettlementPending,
          slipId: 'BRD-2026-0703-01',
          settlementPendingSince: overdueSince,
        }),
        makeAgent({
          agentId: 'a-recent',
          status: AgentDayStatus.SettlementPending,
          slipId: 'BRD-2026-0703-02',
          settlementPendingSince: recentSince,
        }),
      ]);

      const alerts = selectAlerts(state);

      expect(alerts).toHaveLength(1);
      expect(alerts[0]).toMatchObject({
        kind: 'settlementOverdue',
        agentId: 'a-overdue',
        slipId: 'BRD-2026-0703-01',
      });
    });
  });
});
