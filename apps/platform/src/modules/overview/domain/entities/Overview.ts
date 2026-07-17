export interface PlatformKpis {
  volumeToday: number;
  volumeMonth: number;
  volumeMonthGrowthPct: number;
  activeBanks: number;
  totalBanks: number;
  newBanksThisMonth: number;
  trialBanks: number;
  totalClients: number;
  clientsDeltaThirtyDays: number;
  totalAgents: number;
  agentsActiveToday: number;
  mrr: number;
  mrrGrowthPct: number;
}

export interface VolumePoint {
  monthLabel: string;
  /** En milliards de FCFA (« Md » sur la maquette). */
  volumeMd: number;
}

export type BankColorTone = 'info' | 'primary' | 'orange' | 'olive';

export interface TopBank {
  id: string;
  name: string;
  city: string;
  plan: string;
  initials: string;
  colorTone: BankColorTone;
  volumeThirtyDaysM: number;
  growthPct?: number;
  isNew?: boolean;
}

export const AlertSeverity = { Critical: 'Critical', Warning: 'Warning', Info: 'Info' } as const;
export type AlertSeverity = (typeof AlertSeverity)[keyof typeof AlertSeverity];

export const AlertKind = {
  PaymentOverdue: 'PaymentOverdue',
  PlanLimitApproaching: 'PlanLimitApproaching',
  PendingActivation: 'PendingActivation',
  SyncHealthDegraded: 'SyncHealthDegraded',
} as const;

interface PlatformAlertBase {
  id: string;
  bankId: string;
  bankName: string;
  severity: AlertSeverity;
}

export interface PaymentOverdueAlert extends PlatformAlertBase {
  kind: typeof AlertKind.PaymentOverdue;
  amount: number;
  daysLate: number;
  readOnlyInDays: number;
  planName: string;
}

export interface PlanLimitApproachingAlert extends PlatformAlertBase {
  kind: typeof AlertKind.PlanLimitApproaching;
  currentAgents: number;
  maxAgents: number;
  planName: string;
}

export interface PendingActivationAlert extends PlatformAlertBase {
  kind: typeof AlertKind.PendingActivation;
  planRequested: string;
}

export interface SyncHealthDegradedAlert extends PlatformAlertBase {
  kind: typeof AlertKind.SyncHealthDegraded;
  errorRate: number;
  lastSyncAt: string;
}

export type PlatformAlert = PaymentOverdueAlert | PlanLimitApproachingAlert | PendingActivationAlert | SyncHealthDegradedAlert;
