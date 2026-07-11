import { createAction } from '@reduxjs/toolkit';

/**
 * Événements canoniques du domaine collections — owné par ce module (« un
 * seul event domaine par fait métier »). `collectionConfirmed` est consommé
 * aussi par `dashboard` (compteur/activité par agent) via cet index public,
 * jamais redéfini localement ailleurs — même solution déjà retenue pour
 * `disputeOpened`/`disputeResolved` du module disputes.
 */
export interface CollectionConfirmedPayload {
  roundId: string;
  agentId: string;
  stopId: string;
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
 * Dispatché aussi par `settlements` (ValidateSettlementAsync) quand un
 * bordereau de type dépôt partiel est validé — collections décrémente le
 * cash en main de la tournée, dashboard fait de même sur son propre agrégat.
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
