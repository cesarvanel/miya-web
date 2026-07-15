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
  | 'editSavingsPlan'
  | 'deactivateClient'
  | 'revokeDevice'
  | 'activationCode'
  | 'suspendAgent'
  | 'confirmReactivate'
  | 'approveWithdrawal'
  | 'rejectWithdrawal'
  | 'disburseWithdrawal'
  | 'editIdentity'
  | 'managePlans'
  | 'editCustodyFees'
  | 'createZone'
  | 'assignZoneAgent'
  | 'changePassword'
  | 'confirmLogout';

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
  editSavingsPlan: { clientId: string };
  deactivateClient: { clientId: string };
  revokeDevice: { agentId: string };
  activationCode: { agentId: string };
  suspendAgent: { agentId: string };
  confirmReactivate: { agentId: string };
  approveWithdrawal: { withdrawalId: string };
  rejectWithdrawal: { withdrawalId: string };
  disburseWithdrawal: { withdrawalId: string };
  editIdentity: undefined;
  managePlans: undefined;
  editCustodyFees: undefined;
  createZone: { agencyId: string };
  assignZoneAgent: { zoneId: string };
  changePassword: undefined;
  confirmLogout: undefined;
}

export const { modalsSlice, openModal, closeModal, useModal } =
  createModalSystem<BankModal, BankModalProps>();
