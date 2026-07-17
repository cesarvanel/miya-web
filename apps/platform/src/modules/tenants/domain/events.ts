import { createAction } from '@reduxjs/toolkit';

/**
 * Events de domaine dispatchés en plus des transitions internes du slice —
 * le module activity s'y abonne (extraReducers, importés via cet index
 * public) pour construire sa piste d'audit en direct, sans que tenants ait
 * besoin de connaître les entrailles d'activity.
 */
export interface TenantAuditContext {
  by: string;
  byId: string;
  /** ISO. */
  at: string;
}

export const tenantSuspended = createAction<
  { tenantId: string; tenantName: string; reason: string } & TenantAuditContext
>('tenants/audit/tenantSuspended');

export const tenantReactivated = createAction<{ tenantId: string; tenantName: string } & TenantAuditContext>(
  'tenants/audit/tenantReactivated',
);

export const tenantPlanChanged = createAction<
  { tenantId: string; tenantName: string; fromPlanName: string; toPlanName: string } & TenantAuditContext
>('tenants/audit/tenantPlanChanged');

export const tenantCreated = createAction<{ tenantId: string; tenantName: string } & TenantAuditContext>(
  'tenants/audit/tenantCreated',
);
