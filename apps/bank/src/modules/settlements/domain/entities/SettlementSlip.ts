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

/**
 * Reversement du soir (clôture de journée, détail client complet) vs dépôt
 * partiel de mi-journée (plafond de détention atteint, tournée en cours) —
 * maquettes 2a et 2d : même file, thème ambre distinct pour les dépôts.
 */
export const SettlementKind = {
  Settlement: 'settlement',
  PartialDeposit: 'partialDeposit',
} as const;
export type SettlementKind = (typeof SettlementKind)[keyof typeof SettlementKind];

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

/** Contexte propre aux dépôts partiels (plafond, avancement de tournée). */
export interface PartialDepositContext {
  cashOnHand: number;
  ceiling: number;
  tourProgressPercent: number;
  visitedClients: number;
  collectedSoFar: number;
  remainingClients: number;
}

export interface SettlementSlip {
  id: string;
  kind: SettlementKind;
  slipNumber: string;
  agentId: string;
  agentName: string;
  zone: string;
  clientCount: number;
  closedAt: string | null;
  /** Montant à reverser (settlement) ou montant demandé (dépôt partiel), en FCFA. */
  expectedAmount: number;
  status: SettlementStatus;
  lines: SettlementLine[];
  partialDeposits: PartialDeposit[];
  partialDepositContext: PartialDepositContext | null;
  rejection: SettlementRejection | null;
}

export const SettlementsAdapter = createEntityAdapter<SettlementSlip>();
