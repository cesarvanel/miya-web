import { createModalSystem } from '@miya/kernel';
import type { DisputeDecision } from '@/modules/disputes';

/**
 * Enum des modales de l'app bank — chaque module y ajoute ses types
 * (ex. 'rejectSettlement', 'disputeRuling') et déclare ses props ci-dessous.
 */
export type BankModal =
  | 'rejectSettlement'
  | 'confirmValidation'
  | 'validationSuccess'
  | 'confirmResolveDispute'
  | 'editUsualAmount'
  | 'deactivateClient';

/** Props par modale : { rejectSettlement: { slipId: string }, ... } */
export interface BankModalProps {
  rejectSettlement: { slipId: string };
  confirmValidation: { slipId: string };
  validationSuccess: {
    agentName: string;
    slipNumber: string;
    amount: number;
    receiptNumber: string;
  };
  confirmResolveDispute: { disputeId: string; inFavorOf: DisputeDecision; reason: string };
  editUsualAmount: { clientId: string };
  deactivateClient: { clientId: string };
}

export const { modalsSlice, openModal, closeModal, useModal } =
  createModalSystem<BankModal, BankModalProps>();
