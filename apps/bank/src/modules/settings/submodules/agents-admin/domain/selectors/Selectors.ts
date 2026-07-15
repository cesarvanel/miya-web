import { createSelector } from '@reduxjs/toolkit';
import type { BankRootState } from '@/config/stores/store';
import { AgentsAdapter, type Agent, type AgentRole, type AgentStatus } from '../entities/Agent';
import { DayRecordsAdapter, type AgentDayRecord } from '../entities/AgentDayRecord';

const agentsAdapterSelectors = AgentsAdapter.getSelectors((state: BankRootState) => state.agents.agents);
const dayRecordsAdapterSelectors = DayRecordsAdapter.getSelectors((state: BankRootState) => state.agents.dayRecords);

export const selectAllAgents = agentsAdapterSelectors.selectAll;

export const selectAgentById = (state: BankRootState, id: string): Agent | undefined =>
  agentsAdapterSelectors.selectById(state, id);

export interface AgentsListFilters {
  search?: string;
  role?: AgentRole;
  zone?: string;
  status?: AgentStatus;
}

/** Sélecteur composable — filtres combinables, tous optionnels. */
export const selectAgentsList = createSelector(
  [selectAllAgents, (_state: BankRootState, filters: AgentsListFilters = {}) => filters],
  (agents, filters) => {
    const search = filters.search?.trim().toLowerCase();
    return agents.filter((agent) => {
      if (search) {
        const matchesName = agent.fullName.toLowerCase().includes(search);
        const matchesRegistration = agent.registrationNumber.toLowerCase().includes(search);
        if (!matchesName && !matchesRegistration) {
          return false;
        }
      }
      if (filters.role && agent.role !== filters.role) {
        return false;
      }
      if (filters.zone && !agent.zones.includes(filters.zone)) {
        return false;
      }
      if (filters.status && agent.status !== filters.status) {
        return false;
      }
      return true;
    });
  },
);

export const selectAgentsCount = createSelector([selectAllAgents], (agents) => agents.length);

export const selectPendingActivationCount = createSelector(
  [selectAllAgents],
  (agents) => agents.filter((agent) => agent.status === 'PendingActivation').length,
);

/** Journées d'un agent, plus récente d'abord — l'adapter trie déjà par date décroissante. */
export const selectDayRecordsByAgent = createSelector(
  [dayRecordsAdapterSelectors.selectAll, (_state: BankRootState, agentId: string) => agentId],
  (records, agentId): AgentDayRecord[] => records.filter((record) => record.agentId === agentId),
);

/** Collecteurs rattachés à un responsable donné. */
export const selectCollectorsBySupervisor = createSelector(
  [selectAllAgents, (_state: BankRootState, supervisorId: string) => supervisorId],
  (agents, supervisorId): Agent[] => agents.filter((agent) => agent.supervisor?.id === supervisorId),
);

export const AgentsSelectors = {
  selectAllAgents,
  selectAgentById,
  selectAgentsList,
  selectAgentsCount,
  selectPendingActivationCount,
  selectDayRecordsByAgent,
  selectCollectorsBySupervisor,
};
