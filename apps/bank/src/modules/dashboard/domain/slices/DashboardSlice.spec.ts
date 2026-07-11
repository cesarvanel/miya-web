import { FetchDaySummaryAsync } from '../../application/usecases/fetch-day-summary-async/FetchDaySummaryAsync';
import { AgentDaySummariesAdapter, AgentDayStatus, type AgentDaySummary } from '../entities/AgentDaySummary';
import { collectionConfirmed, disputeOpened } from '../events/Events';
import { dashboardSlice } from './DashboardSlice';

const makeAgent = (overrides: Partial<AgentDaySummary> = {}): AgentDaySummary => ({
  agentId: 'agent-cedric-nkoulou',
  name: 'Cédric Nkoulou',
  zone: 'Marché Mokolo',
  roundProgress: { visited: 34, total: 52 },
  collectedAmount: 34_200,
  cashInHand: 85_000,
  cashHoldingCap: 100_000,
  status: AgentDayStatus.OnRound,
  openDisputesCount: 0,
  slipId: null,
  settlementPendingSince: null,
  ...overrides,
});

const stateWithAgent = (agent: AgentDaySummary) => {
  const initial = dashboardSlice.reducer(undefined, { type: '@@init' });
  return {
    ...initial,
    agents: AgentDaySummariesAdapter.setAll(initial.agents, [agent]),
  };
};

describe('dashboardSlice', () => {
  it('starts with empty agents and activity', () => {
    const state = dashboardSlice.reducer(undefined, { type: '@@init' });
    expect(state.agents.ids).toEqual([]);
    expect(state.activity.ids).toEqual([]);
  });

  describe('FetchDaySummaryAsync.fulfilled', () => {
    it('hydrates both adapters from the response', () => {
      const agent = makeAgent();
      const state = dashboardSlice.reducer(
        undefined,
        FetchDaySummaryAsync.fulfilled(
          {
            agents: [agent],
            activity: [
              { id: 'evt-1', occurredAt: new Date().toISOString(), kind: 'collectionConfirmed' as const, message: 'x' },
            ],
          },
          'requestId',
          {},
        ),
      );
      expect(state.agents.ids).toEqual([agent.agentId]);
      expect(state.activity.ids).toEqual(['evt-1']);
    });
  });

  describe('collectionConfirmed (temps réel)', () => {
    it('increments collectedAmount, cashInHand and roundProgress.visited, and prepends an activity event', () => {
      const state = stateWithAgent(makeAgent());

      const next = dashboardSlice.reducer(
        state,
        collectionConfirmed({ agentId: 'agent-cedric-nkoulou', amount: 1_000, clientName: 'Bernadette Ngo' }),
      );

      const updated = next.agents.entities['agent-cedric-nkoulou'];
      expect(updated?.collectedAmount).toBe(35_200);
      expect(updated?.cashInHand).toBe(86_000);
      expect(updated?.roundProgress.visited).toBe(35);

      expect(next.activity.ids).toHaveLength(1);
      const event = next.activity.entities[next.activity.ids[0] as string];
      expect(event?.kind).toBe('collectionConfirmed');
      expect(event?.message).toContain('Bernadette Ngo');
      expect(event?.message).toContain('1 000 FCFA');
    });

    it('does not exceed the round total when visited is already at total', () => {
      const state = stateWithAgent(makeAgent({ roundProgress: { visited: 52, total: 52 } }));

      const next = dashboardSlice.reducer(
        state,
        collectionConfirmed({ agentId: 'agent-cedric-nkoulou', amount: 500, clientName: 'X' }),
      );

      expect(next.agents.entities['agent-cedric-nkoulou']?.roundProgress.visited).toBe(52);
    });

    it('still records the activity event even if the agent is unknown', () => {
      const state = dashboardSlice.reducer(undefined, { type: '@@init' });
      const next = dashboardSlice.reducer(
        state,
        collectionConfirmed({ agentId: 'unknown-agent', amount: 1_000, clientName: 'X' }),
      );
      expect(next.activity.ids).toHaveLength(1);
      expect(next.agents.ids).toEqual([]);
    });
  });

  describe('disputeOpened (temps réel)', () => {
    it('increments openDisputesCount and records the activity event', () => {
      const state = stateWithAgent(makeAgent({ agentId: 'agent-grace-atangana', openDisputesCount: 0 }));

      const next = dashboardSlice.reducer(
        state,
        disputeOpened({
          agentId: 'agent-grace-atangana',
          clientName: 'Christine Eyenga',
          declaredAmount: 500,
          statedAmount: 1_000,
        }),
      );

      expect(next.agents.entities['agent-grace-atangana']?.openDisputesCount).toBe(1);
      expect(next.activity.ids).toHaveLength(1);
      const event = next.activity.entities[next.activity.ids[0] as string];
      expect(event?.kind).toBe('disputeOpened');
      expect(event?.message).toContain('500 FCFA');
    });
  });
});
