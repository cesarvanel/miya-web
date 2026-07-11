import { createAction } from '@reduxjs/toolkit';

/**
 * Événements temps réel du dashboard — l'adapter realtime les dispatche tels
 * quels (même `type`), le slice les traite via `extraReducers`. Aucune
 * mutation directe depuis l'infrastructure.
 */
export interface CollectionConfirmedPayload {
  agentId: string;
  /** Montant de cette collecte, en FCFA. */
  amount: number;
  clientName: string;
}
export const collectionConfirmed = createAction<CollectionConfirmedPayload>(
  'dashboard/collectionConfirmed',
);

export interface DisputeOpenedPayload {
  agentId: string;
  clientName: string;
  declaredAmount: number;
  statedAmount: number;
}
export const disputeOpened = createAction<DisputeOpenedPayload>('dashboard/disputeOpened');
