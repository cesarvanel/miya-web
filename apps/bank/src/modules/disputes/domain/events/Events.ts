import { createAction } from '@reduxjs/toolkit';
import type { AgentHistory, ClientHistory, DisputeDecision } from '../entities/Dispute';

/**
 * Événements canoniques du domaine disputes — owné par ce module, consommés
 * aussi par `dashboard` (compteur par agent) et par la sidebar via cet index
 * public. Le slice traite ces actions telles quelles (même `type`) qu'elles
 * arrivent par un dispatch direct ou via le `RealtimeClient`.
 */
export interface DisputeOpenedPayload {
  zone: string;
  agent: { id: string; name: string; enteredAmount: number };
  client: { id: string; name: string; declaredAmount: number };
  clientHistory: ClientHistory;
  agentHistory: AgentHistory;
}
export const disputeOpened = createAction<DisputeOpenedPayload>('disputes/disputeOpened');

export interface DisputeResolvedPayload {
  disputeId: string;
  agentId: string;
  decidedInFavorOf: DisputeDecision;
}
export const disputeResolved = createAction<DisputeResolvedPayload>('disputes/disputeResolved');
