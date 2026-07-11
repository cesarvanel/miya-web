import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequestStatus } from '@miya/kernel';
import { useBankSelector } from '@/config/stores/root-hook/RootHook';
import { FetchDaySummaryAsync } from '../../application/usecases/fetch-day-summary-async/FetchDaySummaryAsync';
import { AgentDayStatus, type AgentDaySummary } from '../../domain/entities/AgentDaySummary';
import {
  selectAlerts,
  selectActivityFeed,
  selectKpis,
  selectSortedAgents,
} from '../../domain/selectors/Selectors';

export type AgentFilter = 'all' | 'onRound' | 'pending';

/** Logique de la page dashboard — sélection, filtre de la table, navigation contextuelle. */
export const useDashboard = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<AgentFilter>('all');

  const agents = useBankSelector(selectSortedAgents);
  const kpis = useBankSelector(selectKpis);
  const alerts = useBankSelector(selectAlerts);
  const activity = useBankSelector(selectActivityFeed);
  const { isPending } = useRequestStatus(FetchDaySummaryAsync);

  const filteredAgents = agents.filter((agent) => {
    if (filter === 'onRound') {
      return agent.status === AgentDayStatus.OnRound;
    }
    if (filter === 'pending') {
      return agent.status === AgentDayStatus.SettlementPending;
    }
    return true;
  });

  const goToSlip = (slipId: string): void => {
    navigate(`/settlements/${slipId}`);
  };
  const goToDisputes = (): void => {
    navigate('/disputes');
  };
  const goToRound = (agentId: string): void => {
    navigate(`/collections/rounds/${agentId}`);
  };

  const handleRowClick = (agent: AgentDaySummary): void => {
    if (agent.status === AgentDayStatus.SettlementPending && agent.slipId) {
      goToSlip(agent.slipId);
      return;
    }
    goToRound(agent.agentId);
  };

  return {
    agents: filteredAgents,
    totalAgents: agents.length,
    kpis,
    alerts,
    activity,
    isPending,
    filter,
    setFilter,
    handleRowClick,
    goToSlip,
    goToDisputes,
    goToRound,
  };
};
