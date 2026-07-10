import { createEntityAdapter } from '@reduxjs/toolkit';

export const SettlementStatus = {
  PendingValidation: 'PendingValidation',
  Validated: 'Validated',
  Rejected: 'Rejected',
} as const;
export type SettlementStatus =
  (typeof SettlementStatus)[keyof typeof SettlementStatus];

export const SettlementLineStatus = {
  Collected: 'collected',
  Extra: 'extra',
  Absent: 'absent',
  Disputed: 'disputed',
} as const;
export type SettlementLineStatus =
  (typeof SettlementLineStatus)[keyof typeof SettlementLineStatus];

export interface SettlementLine {
  clientId: string;
  clientName: string;
  collectedAt: string | null;
  amount: number;
  status: SettlementLineStatus;
}

export interface PartialDeposit {
  amount: number;
  validatedAt: string;
}

export interface SettlementRejection {
  reason: string;
  receivedAmount: number;
}

export interface SettlementSlip {
  id: string;
  slipNumber: string;
  agentId: string;
  agentName: string;
  zone: string;
  clientCount: number;
  closedAt: string | null;
  expectedAmount: number;
  status: SettlementStatus;
  lines: SettlementLine[];
  partialDeposits: PartialDeposit[];
  rejection: SettlementRejection | null;
}

export const SettlementsAdapter = createEntityAdapter<SettlementSlip>();
