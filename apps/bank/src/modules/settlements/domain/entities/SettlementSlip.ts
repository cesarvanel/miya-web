import { createEntityAdapter } from "@reduxjs/toolkit";

export type SettlementStatus = 'PendingValidation' | 'Validated' | 'Rejected';

export type SettlementLineStatus = 'collected' | 'extra' | 'absent' | 'disputed';

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
