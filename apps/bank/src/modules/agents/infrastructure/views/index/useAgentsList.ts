import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBankSelector } from '@/config/stores/root-hook/RootHook';
import { useRequestStatus } from '@miya/kernel';
import { AgentRole, type Agent } from '../../../domain/entities/Agent';
import { selectAgentsList, selectAllAgents } from '../../../domain/selectors/Selectors';
import { FetchAgentsAsync } from '../../../application/usecases/fetch-agents-async/FetchAgentsAsync';
import { AgentsRoutes } from '../../router/AgentsRoutes';

export type AgentsQuickFilter = 'all' | 'collectors' | 'supervisors' | 'revokedDevice';

const PAGE_SIZE = 10;

export const useAgentsList = () => {
  const navigate = useNavigate();
  const { isPending } = useRequestStatus(FetchAgentsAsync);

  const [search, setSearch] = useState('');
  const [zone, setZone] = useState('');
  const [quickFilter, setQuickFilter] = useState<AgentsQuickFilter>('all');
  const [page, setPage] = useState(1);

  const allAgents = useBankSelector(selectAllAgents);
  const filtered = useBankSelector((state) =>
    selectAgentsList(state, {
      search: search || undefined,
      zone: zone || undefined,
      role: quickFilter === 'collectors' ? AgentRole.Collector : quickFilter === 'supervisors' ? AgentRole.Supervisor : undefined,
    }),
  );

  const revokedDeviceCount = allAgents.filter((agent) => agent.role === AgentRole.Collector && !agent.device && agent.status !== 'PendingActivation').length;
  const collectorsCount = allAgents.filter((agent) => agent.role === AgentRole.Collector).length;
  const supervisorsCount = allAgents.filter((agent) => agent.role === AgentRole.Supervisor).length;
  const activeCount = allAgents.filter((agent) => agent.status === 'Active').length;
  const totalCollected = allAgents.reduce((sum, agent) => sum + agent.monthStats.collected, 0);
  const confirmationRates = allAgents.filter((agent) => agent.monthStats.confirmationRate > 0).map((agent) => agent.monthStats.confirmationRate);
  const averageConfirmationRate = confirmationRates.length > 0 ? confirmationRates.reduce((sum, rate) => sum + rate, 0) / confirmationRates.length : 0;

  const quickFiltered = useMemo(
    () => (quickFilter === 'revokedDevice' ? filtered.filter((agent) => !agent.device && agent.status !== 'PendingActivation') : filtered),
    [filtered, quickFilter],
  );

  const zones = useMemo(() => Array.from(new Set(allAgents.flatMap((agent) => agent.zones))).sort(), [allAgents]);

  const pageCount = Math.max(1, Math.ceil(quickFiltered.length / PAGE_SIZE));
  const pageItems = quickFiltered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToAgent = (id: string): void => {
    navigate(AgentsRoutes.buildDetailPath(id));
  };
  const goToNewAgent = (): void => {
    navigate(AgentsRoutes.newPath);
  };

  return {
    isPending,
    search,
    setSearch,
    zone,
    setZone,
    zones,
    quickFilter,
    setQuickFilter,
    agents: pageItems as Agent[],
    totalFiltered: quickFiltered.length,
    page,
    pageCount,
    setPage,
    totalCount: allAgents.length,
    collectorsCount,
    supervisorsCount,
    revokedDeviceCount,
    activeCount,
    totalCollected,
    averageConfirmationRate,
    goToAgent,
    goToNewAgent,
  };
};
