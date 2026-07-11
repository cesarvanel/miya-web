import { createAction } from '@reduxjs/toolkit';

/**
 * Événements temps réel du dashboard — l'adapter realtime les dispatche tels
 * quels (même `type`), le slice les traite via `extraReducers`. Aucune
 * mutation directe depuis l'infrastructure.
 *
 * `disputeOpened` n'est pas défini ici : le dashboard le consomme depuis le
 * module `disputes`, qui en est le propriétaire canonique (index public).
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
