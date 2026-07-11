import { createSlice } from '@reduxjs/toolkit';
import { Money } from '@miya/kernel';
import { FetchDaySummaryAsync } from '../../application/usecases/fetch-day-summary-async/FetchDaySummaryAsync';
import { ActivityEventKind, ActivityEventsAdapter } from '../entities/ActivityEvent';
import { AgentDaySummariesAdapter } from '../entities/AgentDaySummary';
import { collectionConfirmed, disputeOpened } from '../events/Events';

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
        const { agentId, declaredAmount, statedAmount } = action.payload;
        const agent = state.agents.entities[agentId];
        if (agent) {
          AgentDaySummariesAdapter.updateOne(state.agents, {
            id: agentId,
            changes: { openDisputesCount: agent.openDisputesCount + 1 },
          });
        }
        const gap = Money.from(Math.abs(statedAmount - declaredAmount));
        ActivityEventsAdapter.addOne(state.activity, {
          id: nextEventId(),
          occurredAt: new Date().toISOString(),
          kind: ActivityEventKind.DisputeOpened,
          message: `Contestation ouverte — ${agent?.name ?? 'un agent'} : le client conteste ${gap.format()}`,
          agentId,
        });
      });
  },
});

export const DashboardActions = dashboardSlice.actions;
