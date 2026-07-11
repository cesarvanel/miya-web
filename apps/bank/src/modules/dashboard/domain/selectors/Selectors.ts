import { createSelector } from '@reduxjs/toolkit';
import { Money } from '@miya/kernel';
import type { BankRootState } from '@/config/stores/store';
import { ActivityEventsAdapter } from '../entities/ActivityEvent';
import {
  AgentDaySummariesAdapter,
  AgentDayStatus,
  type AgentDaySummary,
} from '../entities/AgentDaySummary';
import type { DashboardAlert, DashboardKpis } from '../types/Type';

const agentAdapterSelectors = AgentDaySummariesAdapter.getSelectors(
  (state: BankRootState) => state.dashboard.agents,
);
const activityAdapterSelectors = ActivityEventsAdapter.getSelectors(
  (state: BankRootState) => state.dashboard.activity,
);

export const selectAllAgents = agentAdapterSelectors.selectAll;
export const selectAllActivity = activityAdapterSelectors.selectAll;

/** Rang de tri : reversement en attente > contestation ouverte > en tournée > le reste. */
const agentRank = (agent: AgentDaySummary): number => {
  if (agent.status === AgentDayStatus.SettlementPending) {
    return 0;
  }
  if (agent.openDisputesCount > 0) {
    return 1;
  }
  if (agent.status === AgentDayStatus.OnRound) {
    return 2;
  }
  return 3;
};

export const selectSortedAgents = createSelector([selectAllAgents], (agents) =>
  [...agents].sort((a, b) => agentRank(a) - agentRank(b)),
);

export const selectKpis = createSelector([selectAllAgents], (agents): DashboardKpis => {
  const totalCollectedToday = agents.reduce(
    (total, agent) => total.add(Money.from(agent.collectedAmount)),
    Money.from(0),
  );
  const cashInCirculation = agents.reduce(
    (total, agent) => total.add(Money.from(agent.cashInHand)),
    Money.from(0),
  );
  const onRound = agents.filter((agent) => agent.status === AgentDayStatus.OnRound).length;
  const dayClosedCount = agents.filter(
    (agent) => agent.roundProgress.visited >= agent.roundProgress.total,
  ).length;
  const openDisputes = agents.reduce((total, agent) => total + agent.openDisputesCount, 0);

  return {
    totalCollectedToday,
    cashInCirculation,
    agentsOnRound: { on: onRound, total: agents.length },
    dayClosedCount,
    openDisputes,
  };
});

/** 50 derniers événements (déjà triés décroissant par l'adapter). */
export const selectActivityFeed = createSelector([selectAllActivity], (events) =>
  events.slice(0, 50),
);

const CAP_APPROACHING_RATIO = 0.85;
const SETTLEMENT_OVERDUE_HOURS = 2;

export const selectAlerts = createSelector([selectAllAgents], (agents): DashboardAlert[] => {
  const alerts: DashboardAlert[] = [];
  const now = Date.now();

  for (const agent of agents) {
    if (
      agent.status === AgentDayStatus.OnRound &&
      agent.cashHoldingCap > 0 &&
      agent.cashInHand / agent.cashHoldingCap >= CAP_APPROACHING_RATIO
    ) {
      alerts.push({
        id: `cap-${agent.agentId}`,
        kind: 'capApproaching',
        agentId: agent.agentId,
        agentName: agent.name,
        message: `${agent.name} approche du plafond de détention`,
        detail: `Cash en main ${Money.from(agent.cashInHand).format()} / ${Money.from(agent.cashHoldingCap).format()} — recommander un dépôt partiel`,
      });
    }

    if (
      agent.status === AgentDayStatus.SettlementPending &&
      agent.slipId &&
      agent.settlementPendingSince &&
      now - new Date(agent.settlementPendingSince).getTime() >= SETTLEMENT_OVERDUE_HOURS * 3_600_000
    ) {
      const hoursElapsed = (now - new Date(agent.settlementPendingSince).getTime()) / 3_600_000;
      const hours = Math.floor(hoursElapsed);
      const minutes = Math.round((hoursElapsed - hours) * 60);
      alerts.push({
        id: `overdue-${agent.agentId}`,
        kind: 'settlementOverdue',
        agentId: agent.agentId,
        agentName: agent.name,
        message: `Reversement de ${agent.name} en attente depuis ${hours}h${String(minutes).padStart(2, '0')}`,
        detail: `${Money.from(agent.collectedAmount).format()} — à valider`,
        slipId: agent.slipId,
      });
    }
  }

  return alerts;
});
