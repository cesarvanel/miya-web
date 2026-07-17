import { createModalSystem } from '@miya/kernel';

/**
 * Enum des modales de la console éditeur — chaque module y ajoute ses types
 * et déclare ses props dans PlatformModalProps.
 */
export type PlatformModal =
  | 'confirmLogout'
  | 'changePlan'
  | 'suspendTenant'
  | 'confirmReactivateTenant'
  | 'resendInvitation'
  | 'editPlan'
  | 'markInvoicePaid'
  | 'sendReminder';

export interface PlatformModalProps {
  confirmLogout: undefined;
  changePlan: { tenantId: string };
  suspendTenant: { tenantId: string };
  confirmReactivateTenant: { tenantId: string };
  resendInvitation: { tenantId: string };
  editPlan: { planId: string };
  markInvoicePaid: { invoiceId: string };
  sendReminder: { invoiceId: string };
}

export const { modalsSlice, openModal, closeModal, useModal } =
  createModalSystem<PlatformModal, PlatformModalProps>();
