import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequestStatus } from '@miya/kernel';
import { useBankSelector } from '@/config/stores/root-hook/RootHook';
import { FetchClientsAsync } from '../../../application/usecases/fetch-clients-async/FetchClientsAsync';
import {
  selectAllClients,
  selectClientsList,
  selectLowRegularityCount,
  selectTotalActiveClientsLabel,
} from '../../../domain/selectors/Selectors';
import { ClientsRoutes } from '../../router/ClientsRoutes';

export type ClientsQuickFilter = 'all' | 'withdrawalPending' | 'lowRegularity';

const PAGE_SIZE = 10;

export const useClientsList = () => {
  const navigate = useNavigate();
  const allClients = useBankSelector(selectAllClients);
  const lowRegularityCount = useBankSelector(selectLowRegularityCount);
  const totalActiveClientsLabel = useBankSelector(selectTotalActiveClientsLabel);
  const { isPending } = useRequestStatus(FetchClientsAsync);

  const [search, setSearch] = useState('');
  const [zone, setZone] = useState('');
  const [agentId, setAgentId] = useState('');
  const [quickFilter, setQuickFilter] = useState<ClientsQuickFilter>('all');
  const [page, setPage] = useState(1);

  const filtered = useBankSelector((state) =>
    selectClientsList(state, {
      search: search || undefined,
      zone: zone || undefined,
      agentId: agentId || undefined,
      lowRegularityOnly: quickFilter === 'lowRegularity',
    }),
  );

  const withdrawalPendingCount = allClients.filter((client) => client.pendingWithdrawal).length;

  const totalSavings = allClients.reduce((total, client) => total + client.savingsBalance, 0);
  const averageRegularityRatio =
    allClients.length === 0
      ? 0
      : allClients.reduce(
          (total, client) => total + (client.regularity.expected === 0 ? 1 : client.regularity.contributed / client.regularity.expected),
          0,
        ) / allClients.length;

  const quickFiltered =
    quickFilter === 'withdrawalPending' ? filtered.filter((client) => client.pendingWithdrawal) : filtered;

  const pageCount = Math.max(1, Math.ceil(quickFiltered.length / PAGE_SIZE));
  const pageItems = quickFiltered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const zones = Array.from(new Set(allClients.map((client) => client.zone))).sort();
  const agents = Array.from(
    new Map(allClients.map((client) => [client.assignedAgent.id, client.assignedAgent])).values(),
  );

  const goToClient = (id: string): void => {
    navigate(ClientsRoutes.buildDetailPath(id));
  };
  const goToNewClient = (): void => {
    navigate(ClientsRoutes.newPath);
  };

  return {
    isPending,
    search,
    setSearch: (value: string) => {
      setSearch(value);
      setPage(1);
    },
    zone,
    setZone: (value: string) => {
      setZone(value);
      setPage(1);
    },
    agentId,
    setAgentId: (value: string) => {
      setAgentId(value);
      setPage(1);
    },
    quickFilter,
    setQuickFilter: (value: ClientsQuickFilter) => {
      setQuickFilter(value);
      setPage(1);
    },
    zones,
    agents,
    clients: pageItems,
    totalFiltered: quickFiltered.length,
    page,
    pageCount,
    setPage,
    totalActiveCount: totalActiveClientsLabel,
    withdrawalPendingCount,
    lowRegularityCount,
    totalSavings,
    averageRegularityRatio,
    goToClient,
    goToNewClient,
  };
};
