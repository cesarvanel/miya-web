import { createEntityAdapter } from '@reduxjs/toolkit';

export const RoundStatus = { Open: 'Open', Closed: 'Closed' } as const;
export type RoundStatus = (typeof RoundStatus)[keyof typeof RoundStatus];

export interface RoundProgress {
  visited: number;
  expected: number;
}

export interface RoundAgent {
  id: string;
  name: string;
}

export interface PartialDeposit {
  id: string;
  amount: number;
  /** Format maquette (« 11h02 ») — cohérent avec SettlementLine.collectedAt. */
  validatedAt: string;
  validatedBy: string;
}

/**
 * Tournée du jour d'un agent — un agent = une tournée par jour dans ce MVP,
 * donc `id === agent.id` (pas de table de correspondance supplémentaire à
 * maintenir entre modules ; `dashboard` navigue déjà avec l'agentId).
 */
export interface CollectionRound {
  id: string;
  date: string;
  agent: RoundAgent;
  zone: string;
  status: RoundStatus;
  progress: RoundProgress;
  /** Montant total attendu (somme des `usualAmount` des stops), en FCFA. */
  expectedTotal: number;
  /** Montant réellement collecté à date, en FCFA. */
  collectedTotal: number;
  cashInHand: number;
  cashHoldingCap: number;
  partialDeposits: PartialDeposit[];
  openDisputesCount: number;
  startedAt: string;
  endedAt: string | null;
}

export const RoundsAdapter = createEntityAdapter<CollectionRound, string>({
  selectId: (round) => round.id,
});
