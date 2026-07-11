import { createModalSystem } from '@miya/kernel';

/**
 * Enum des modales de l'app bank — chaque module y ajoute ses types
 * (ex. 'rejectSettlement', 'disputeRuling') et déclare ses props ci-dessous.
 */
export type BankModal =
  | 'rejectSettlement'
  | 'confirmValidation'
  | 'validationSuccess';

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
}

export const { modalsSlice, openModal, closeModal, useModal } =
  createModalSystem<BankModal, BankModalProps>();
