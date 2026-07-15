import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AgentsAdapter, AgentStatus, type Agent } from '../entities/Agent';
import { AgentSettlementStatus, DayRecordsAdapter } from '../entities/AgentDayRecord';
import { FetchAgentAsync } from '../../application/usecases/fetch-agent-async/FetchAgentAsync';
import { FetchAgentDayRecordsAsync } from '../../application/usecases/fetch-agent-day-records-async/FetchAgentDayRecordsAsync';
import { FetchAgentsAsync } from '../../application/usecases/fetch-agents-async/FetchAgentsAsync';

const initialState = {
  agents: AgentsAdapter.getInitialState(),
  dayRecords: DayRecordsAdapter.getInitialState(),
};

export type AgentsState = typeof initialState;

/** Statut de reversement du jour le plus récent connu pour l'agent — utilisé pour bloquer la suspension. */
const latestSettlementStatus = (state: AgentsState, agentId: string): AgentSettlementStatus | null => {
  const records = DayRecordsAdapter.getSelectors().selectAll(state.dayRecords).filter((r) => r.agentId === agentId);
  return records[0]?.settlementStatus ?? null;
};

export const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    agentCreated: (state, action: PayloadAction<Agent>) => {
      AgentsAdapter.addOne(state.agents, action.payload);
    },
    /** L'agent ne pourra plus collecter tant qu'un nouvel appareil n'est pas lié — le statut reste inchangé. */
    deviceRevoked: (state, action: PayloadAction<{ id: string }>) => {
      AgentsAdapter.updateOne(state.agents, { id: action.payload.id, changes: { device: null } });
    },
    activationCodeGenerated: (state, action: PayloadAction<{ id: string; generatedAt: string }>) => {
      AgentsAdapter.updateOne(state.agents, {
        id: action.payload.id,
        changes: { lastActivationCodeGeneratedAt: action.payload.generatedAt },
      });
    },
    /** Règle : impossible de suspendre un agent dont le reversement du jour est en attente — transition rejetée. */
    suspended: (state, action: PayloadAction<{ id: string }>) => {
      if (latestSettlementStatus(state, action.payload.id) === AgentSettlementStatus.Pending) {
        return;
      }
      AgentsAdapter.updateOne(state.agents, {
        id: action.payload.id,
        changes: { status: AgentStatus.Suspended },
      });
    },
    reactivated: (state, action: PayloadAction<{ id: string }>) => {
      AgentsAdapter.updateOne(state.agents, {
        id: action.payload.id,
        changes: { status: AgentStatus.Active },
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchAgentsAsync.fulfilled, (state, action) => {
        AgentsAdapter.setAll(state.agents, action.payload.agents);
      })
      .addCase(FetchAgentAsync.fulfilled, (state, action) => {
        AgentsAdapter.upsertOne(state.agents, action.payload.agent);
      })
      .addCase(FetchAgentDayRecordsAsync.fulfilled, (state, action) => {
        DayRecordsAdapter.upsertMany(state.dayRecords, action.payload.records);
      });
  },
});

export const AgentsActions = agentsSlice.actions;
