import { createEntityAdapter } from '@reduxjs/toolkit';

export const AgentSettlementStatus = {
  Settled: 'Settled',
  SettledWithGap: 'SettledWithGap',
  Pending: 'Pending',
} as const;
export type AgentSettlementStatus = (typeof AgentSettlementStatus)[keyof typeof AgentSettlementStatus];

export interface AgentDayRecord {
  id: string;
  agentId: string;
  /** ISO (YYYY-MM-DD). */
  date: string;
  collected: number;
  settlementStatus: AgentSettlementStatus;
  /** Format maquette (« 18h20 »), absent tant que le reversement est en attente. */
  settledAt?: string;
  /** Écart constaté (positif ou négatif), présent uniquement pour SettledWithGap. */
  gapAmount?: number;
  /** Ex. « rejet puis régularisé -500 ». */
  note?: string;
}

export const DayRecordsAdapter = createEntityAdapter<AgentDayRecord, string>({
  selectId: (record) => record.id,
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});
