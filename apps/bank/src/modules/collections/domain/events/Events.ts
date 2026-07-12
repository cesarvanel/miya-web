import { createAction } from '@reduxjs/toolkit';

/**
 * Evenements canoniques du domaine collections - un seul event domaine par
 * fait metier. `collectionConfirmed` est consomme aussi par `dashboard`
 * (compteur/activite par agent) et par `clients` (solde d'epargne/regularite
 * du client concerne) via cet index public, jamais redefini localement
 * ailleurs - meme solution deja retenue pour `disputeOpened`/`disputeResolved`
 * du module disputes.
 */
export interface CollectionConfirmedPayload {
  roundId: string;
  agentId: string;
  stopId: string;
  clientId: string;
  clientName: string;
  amount: number;
}
export const collectionConfirmed = createAction<CollectionConfirmedPayload>(
  'collections/collectionConfirmed',
);

export interface RoundClosedPayload {
  roundId: string;
  agentId: string;
}
export const roundClosed = createAction<RoundClosedPayload>('collections/roundClosed');

/**
 * Dispatche aussi par `settlements` (ValidateSettlementAsync) quand un
 * bordereau de type depot partiel est valide - collections decremente le
 * cash en main de la tournee, dashboard fait de meme sur son propre agregat.
 */
export interface PartialDepositValidatedPayload {
  roundId: string;
  agentId: string;
  amount: number;
  validatedBy: string;
}
export const partialDepositValidated = createAction<PartialDepositValidatedPayload>(
  'collections/partialDepositValidated',
);
