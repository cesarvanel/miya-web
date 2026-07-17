import { createEntityAdapter } from '@reduxjs/toolkit';

export const AuditAction = {
  TenantSuspended: 'TenantSuspended',
  TenantReactivated: 'TenantReactivated',
  PlanChanged: 'PlanChanged',
  PlanUpdated: 'PlanUpdated',
  InvoiceMarkedPaid: 'InvoiceMarkedPaid',
  ReminderSent: 'ReminderSent',
  TenantCreated: 'TenantCreated',
  CollaboratorAdded: 'CollaboratorAdded',
} as const;
export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];

/** Le super admin (ou collaborateur console éditeur) auteur de l'action. */
export interface AuditActor {
  id: string;
  name: string;
}

export interface AuditTargetTenant {
  id: string;
  name: string;
}

export interface AuditEntry {
  id: string;
  /** ISO. */
  at: string;
  actor: AuditActor;
  action: AuditAction;
  targetTenant?: AuditTargetTenant;
  /** Ex. "a suspendu COOPEC Sahel — motif : impayé persistant". */
  summary: string;
  ipMasked?: string;
}

/** Le plus récent en tête — piste d'audit immuable, se lit chronologie inversée. */
export const auditAdapter = createEntityAdapter<AuditEntry>({
  sortComparer: (a, b) => b.at.localeCompare(a.at),
});
