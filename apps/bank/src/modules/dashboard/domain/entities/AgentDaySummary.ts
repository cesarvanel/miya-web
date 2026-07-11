import { createEntityAdapter } from '@reduxjs/toolkit';

export const AgentDayStatus = {
  OnRound: 'onRound',
  DayClosed: 'dayClosed',
  SettlementPending: 'settlementPending',
  Validated: 'validated',
} as const;
export type AgentDayStatus = (typeof AgentDayStatus)[keyof typeof AgentDayStatus];

export interface RoundProgress {
  visited: number;
  total: number;
}

export interface AgentDaySummary {
  agentId: string;
  name: string;
  zone: string;
  roundProgress: RoundProgress;
  collectedAmount: number;
  cashInHand: number;
  cashHoldingCap: number;
  status: AgentDayStatus;
  openDisputesCount: number;
  /** Id du bordereau à valider dans settlements — non nul seulement si SettlementPending. */
  slipId: string | null;
  /** Horodatage d'entrée en SettlementPending — sert au calcul "en attente depuis Xh". */
  settlementPendingSince: string | null;
}

export const AgentDaySummariesAdapter = createEntityAdapter<AgentDaySummary, string>({
  selectId: (summary) => summary.agentId,
});
