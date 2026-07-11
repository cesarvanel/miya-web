import { createSelector } from '@reduxjs/toolkit';
import type { BankRootState } from '@/config/stores/store';
import { DisputesAdapter, DisputeStatus, type Dispute } from '../entities/Dispute';

const adapterSelectors = DisputesAdapter.getSelectors(
  (state: BankRootState) => state.disputes,
);

export const selectAllDisputes = adapterSelectors.selectAll;

export const selectDisputeById = (
  state: BankRootState,
  id: string,
): Dispute | undefined => adapterSelectors.selectById(state, id);

export const selectOpenDisputes = createSelector([selectAllDisputes], (disputes) =>
  disputes.filter((dispute) => dispute.status === DisputeStatus.Open),
);

export const selectResolvedDisputes = createSelector([selectAllDisputes], (disputes) =>
  disputes.filter((dispute) => dispute.status === DisputeStatus.Resolved),
);

/** Compteur pour la pastille de nav « Contestations ». */
export const selectOpenCount = createSelector([selectOpenDisputes], (disputes) => disputes.length);

/** Garde-fou consommé par settlements : bloque la validation d'un bordereau si l'agent a une contestation ouverte. */
export const selectOpenDisputesForAgent = createSelector(
  [selectOpenDisputes, (_state: BankRootState, agentId: string) => agentId],
  (openDisputes, agentId) => openDisputes.filter((dispute) => dispute.agent.id === agentId),
);

/** Écart entre saisie agent et déclaration client, en FCFA — calculé, jamais stocké. */
export const selectDisputeGap = (dispute: Dispute): number =>
  dispute.client.declaredAmount - dispute.agent.enteredAmount;

export const DisputesSelectors = {
  selectAllDisputes,
  selectDisputeById,
  selectOpenDisputes,
  selectResolvedDisputes,
  selectOpenCount,
  selectOpenDisputesForAgent,
  selectDisputeGap,
};
