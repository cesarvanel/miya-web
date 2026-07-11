import type { Money } from '@miya/kernel';

export interface DashboardKpis {
  totalCollectedToday: Money;
  cashInCirculation: Money;
  agentsOnRound: { on: number; total: number };
  dayClosedCount: number;
  openDisputes: number;
}

export type DashboardAlertKind = 'capApproaching' | 'settlementOverdue';

export interface DashboardAlert {
  id: string;
  kind: DashboardAlertKind;
  agentId: string;
  agentName: string;
  message: string;
  detail: string;
  /** Présent uniquement pour settlementOverdue — navigation vers le bordereau. */
  slipId?: string;
}
