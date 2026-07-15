export interface AgencyReconciliation {
  agencyId: string;
  agencyName: string;
  amount: number;
  /** Pourcentage 0-100 de bordereaux rapprochés. */
  rate: number;
  managerName: string;
}

export interface AgentRanking {
  agentId: string;
  agentName: string;
  agencyName: string;
  regularityRate: number;
  amount: number;
}

export const AttentionSeverity = { Warning: 'Warning', Danger: 'Danger' } as const;
export type AttentionSeverity = (typeof AttentionSeverity)[keyof typeof AttentionSeverity];

export interface AttentionPoint {
  id: string;
  title: string;
  description: string;
  severity: AttentionSeverity;
}

export interface DailyCollectionPoint {
  /** ISO (YYYY-MM-DD). */
  date: string;
  amount: number;
}

export interface AgencyBreakdownEntry {
  agencyName: string;
  amount: number;
  /** Pourcentage 0-100. */
  share: number;
}

/** Vue « jour » — seedée (pas d'historique jour-par-jour réel stocké côté modules opérationnels). */
export interface SupervisionDaySnapshot {
  collectedToday: number;
  collectedTodayDeltaPct: number;
  reconciledRate: number;
  reconciledCount: number;
  reconciledTotal: number;
  cashGapAmount: number;
  cashGapRejections: number;
  reconciliations: AgencyReconciliation[];
  ranking: AgentRanking[];
  attentionPoints: AttentionPoint[];
}

/** Vue « mois » — seedée, hormis les KPIs dérivables en direct des modules clients (régularité, nouveaux clients). */
export interface SupervisionMonthSnapshot {
  /** Ex. « Juin 2026 ». */
  monthLabel: string;
  collectedMonth: number;
  collectedMonthDeltaPct: number;
  settlementRate: number;
  trend: DailyCollectionPoint[];
  trendAverage: number;
  breakdown: AgencyBreakdownEntry[];
  topAgents: AgentRanking[];
}
