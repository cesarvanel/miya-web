import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NotificationItem } from '@miya/ui';
import { useRequestStatus } from '@miya/kernel';
import { disputesSelectors } from '@/modules/disputes';
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

  const [isNotificationsOpen, setNotificationsOpen] = useState(false);

  const agents = useBankSelector(selectSortedAgents);
  const kpis = useBankSelector(selectKpis);
  const alerts = useBankSelector(selectAlerts);
  const activity = useBankSelector(selectActivityFeed);
  const openDisputes = useBankSelector(disputesSelectors.selectOpenDisputes);
  const { isPending } = useRequestStatus(FetchDaySummaryAsync);

  /** Contestation ouverte, plafond bientôt atteint, reversement en retard — mêmes 3 familles que les préférences du profil. */
  const notificationItems: NotificationItem[] = [
    ...openDisputes.map((dispute) => ({
      id: `dispute-${dispute.id}`,
      title: `Nouvelle contestation — ${dispute.agent.name}`,
      meta: `${dispute.client.name} · ${dispute.zone}`,
      tone: 'warning' as const,
      read: false,
    })),
    ...alerts.map((alert) => ({
      id: alert.id,
      title: alert.message,
      meta: alert.detail,
      tone: 'warning' as const,
      read: false,
    })),
  ];

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

  const toggleNotifications = (): void => setNotificationsOpen((open) => !open);
  const closeNotifications = (): void => setNotificationsOpen(false);
  const viewAllNotifications = (): void => {
    closeNotifications();
    goToDisputes();
  };

  return {
    agents: filteredAgents,
    totalAgents: agents.length,
    kpis,
    alerts,
    activity,
    notificationItems,
    isNotificationsOpen,
    toggleNotifications,
    closeNotifications,
    viewAllNotifications,
    isPending,
    filter,
    setFilter,
    handleRowClick,
    goToSlip,
    goToDisputes,
    goToRound,
  };
};
