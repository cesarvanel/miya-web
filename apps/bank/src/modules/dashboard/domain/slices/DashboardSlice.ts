import { createSlice } from '@reduxjs/toolkit';
import { Money } from '@miya/kernel';
import { disputeOpened, disputeResolved } from '@/modules/disputes';
import { FetchDaySummaryAsync } from '../../application/usecases/fetch-day-summary-async/FetchDaySummaryAsync';
import { ActivityEventKind, ActivityEventsAdapter } from '../entities/ActivityEvent';
import { AgentDaySummariesAdapter } from '../entities/AgentDaySummary';
import { collectionConfirmed } from '../events/Events';

const initialState = {
  agents: AgentDaySummariesAdapter.getInitialState(),
  activity: ActivityEventsAdapter.getInitialState(),
};

export type DashboardState = typeof initialState;

const nextEventId = (): string =>
  `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FetchDaySummaryAsync.fulfilled, (state, action) => {
        AgentDaySummariesAdapter.setAll(state.agents, action.payload.agents);
        ActivityEventsAdapter.setAll(state.activity, action.payload.activity);
      })
      .addCase(collectionConfirmed, (state, action) => {
        const { agentId, amount, clientName } = action.payload;
        const agent = state.agents.entities[agentId];
        if (agent) {
          AgentDaySummariesAdapter.updateOne(state.agents, {
            id: agentId,
            changes: {
              collectedAmount: agent.collectedAmount + amount,
              cashInHand: agent.cashInHand + amount,
              roundProgress: {
                ...agent.roundProgress,
                visited: Math.min(agent.roundProgress.total, agent.roundProgress.visited + 1),
              },
            },
          });
        }
        ActivityEventsAdapter.addOne(state.activity, {
          id: nextEventId(),
          occurredAt: new Date().toISOString(),
          kind: ActivityEventKind.CollectionConfirmed,
          message: `${agent?.name ?? 'Un agent'} a collecté ${Money.from(amount).format()} chez ${clientName}`,
          agentId,
        });
      })
      .addCase(disputeOpened, (state, action) => {
        const { agent: disputeAgent, client } = action.payload;
        const agent = state.agents.entities[disputeAgent.id];
        if (agent) {
          AgentDaySummariesAdapter.updateOne(state.agents, {
            id: disputeAgent.id,
            changes: { openDisputesCount: agent.openDisputesCount + 1 },
          });
        }
        const gap = Money.from(Math.abs(client.declaredAmount - disputeAgent.enteredAmount));
        ActivityEventsAdapter.addOne(state.activity, {
          id: nextEventId(),
          occurredAt: new Date().toISOString(),
          kind: ActivityEventKind.DisputeOpened,
          message: `Contestation ouverte — ${agent?.name ?? disputeAgent.name} : le client conteste ${gap.format()}`,
          agentId: disputeAgent.id,
        });
      })
      .addCase(disputeResolved, (state, action) => {
        const { agentId } = action.payload;
        const agent = state.agents.entities[agentId];
        if (agent) {
          AgentDaySummariesAdapter.updateOne(state.agents, {
            id: agentId,
            changes: { openDisputesCount: Math.max(0, agent.openDisputesCount - 1) },
          });
        }
      });
  },
});

export const DashboardActions = dashboardSlice.actions;
