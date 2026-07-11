import { createEntityAdapter } from '@reduxjs/toolkit';

export const DisputeStatus = { Open: 'Open', Resolved: 'Resolved' } as const;
export type DisputeStatus = (typeof DisputeStatus)[keyof typeof DisputeStatus];

/** En faveur de qui la contestation a été tranchée. */
export const DisputeDecision = { Client: 'Client', Agent: 'Agent' } as const;
export type DisputeDecision = (typeof DisputeDecision)[keyof typeof DisputeDecision];

export interface DisputeAgent {
  id: string;
  name: string;
  /** Montant saisi par l'agent sur l'app, en FCFA. */
  enteredAmount: number;
}

export interface DisputeClient {
  id: string;
  name: string;
  /** Montant déclaré par le client depuis son app, en FCFA. */
  declaredAmount: number;
}

/** Régularité : nombre de jours de collecte honorés sur le total (ex. 29/30). */
export interface ClientRegularity {
  onTime: number;
  total: number;
}

export interface ClientHistory {
  regularity: ClientRegularity;
  disputesLast12Months: number;
  /** Année d'ancienneté client (ex. « 2022 ») — pas de date exacte dans les maquettes. */
  clientSince: string;
}

export interface AgentHistory {
  /** Pourcentage (ex. 98.4). */
  confirmationRate: number;
  disputesLast12Months: number;
  /** Nombre d'écarts constatés au reversement. */
  settlementGaps: number;
}

export interface DisputeResolution {
  decidedInFavorOf: DisputeDecision;
  reason: string;
  decidedBy: string;
  decidedAt: string;
}

export interface Dispute {
  id: string;
  openedAt: string;
  zone: string;
  status: DisputeStatus;
  agent: DisputeAgent;
  client: DisputeClient;
  clientHistory: ClientHistory;
  agentHistory: AgentHistory;
  resolution: DisputeResolution | null;
}

export const DisputesAdapter = createEntityAdapter<Dispute, string>({
  selectId: (dispute) => dispute.id,
  sortComparer: (a, b) => b.openedAt.localeCompare(a.openedAt),
});
