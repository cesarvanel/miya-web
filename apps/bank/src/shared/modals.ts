import { createModalSystem } from '@miya/kernel';

/**
 * Enum des modales de l'app bank — chaque module y ajoute ses types
 * (ex. 'rejectSettlement', 'disputeRuling') et déclare ses props ci-dessous.
 */
export type BankModal = 'rejectSettlement' | 'confirmValidation';

/** Props par modale : { rejectSettlement: { slipId: string }, ... } */
export interface BankModalProps {
  rejectSettlement: { slipId: string };
  confirmValidation: { slipId: string };
}

export const { modalsSlice, openModal, closeModal, useModal } =
  createModalSystem<BankModal, BankModalProps>();
