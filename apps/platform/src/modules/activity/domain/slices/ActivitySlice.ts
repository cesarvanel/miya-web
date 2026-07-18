import { createSlice } from '@reduxjs/toolkit';
import { PlatformUserRole } from '@/modules/auth';
import { invoicePaid, planUpdated, reminderSent } from '@/modules/billing';
import { collaboratorAdded } from '@/modules/settings-platform';
import { tenantCreated, tenantPlanChanged, tenantReactivated, tenantSuspended } from '@/modules/tenants';
import { adoptionAdapter } from '../entities/AdoptionStat';
import { auditAdapter, AuditAction, type AuditEntry } from '../entities/AuditEntry';
import { usageAdapter } from '../entities/BankUsagePoint';
import { syncHealthAdapter } from '../entities/SyncHealth';
import { FetchActivityAsync } from '../../application/usecases/fetch-activity-async/FetchActivityAsync';
import { FetchAuditLogAsync } from '../../application/usecases/fetch-audit-log-async/FetchAuditLogAsync';

const initialState = {
  usage: usageAdapter.getInitialState(),
  syncHealth: syncHealthAdapter.getInitialState(),
  adoption: adoptionAdapter.getInitialState(),
  auditLog: auditAdapter.getInitialState(),
};

export type ActivityState = typeof initialState;

let nextAuditSeq = 1;
const nextAuditId = (): string => `audit-local-${Date.now()}-${nextAuditSeq++}`;

/** "180000" -> "180 000" — même normalisation que tenants/domain/slices/TenantsSlice.ts. */
const formatFcfa = (amount: number): string =>
  Array.from(amount.toLocaleString('fr-FR'))
    .map((char) => (char.charCodeAt(0) === 160 || char.charCodeAt(0) === 8239 ? ' ' : char))
    .join('');

const pushAudit = (state: ActivityState, entry: Omit<AuditEntry, 'id'>): void => {
  auditAdapter.addOne(state.auditLog, { ...entry, id: nextAuditId() });
};

const COLLABORATOR_ROLE_LABEL: Record<PlatformUserRole, string> = {
  [PlatformUserRole.Owner]: 'Complet',
  [PlatformUserRole.ReadOnly]: 'Lecture',
};

/**
 * activity.slice — le journal d'audit est APPEND-ONLY : ce fichier ne
 * déclare AUCUN reducer de mutation/suppression d'une AuditEntry (le seul
 * bloc `reducers` reste vide). Les entrées n'apparaissent que par upsert
 * (fetch) ou par ajout (`pushAudit`, réaction aux events des autres
 * modules) — c'est la piste d'audit du super admin, l'équivalent
 * plateforme du registre immuable côté bank.
 */
export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FetchActivityAsync.fulfilled, (state, action) => {
        usageAdapter.setAll(state.usage, action.payload.usage);
        syncHealthAdapter.setAll(state.syncHealth, action.payload.syncHealth);
        adoptionAdapter.setAll(state.adoption, action.payload.adoption);
      })
      .addCase(FetchAuditLogAsync.fulfilled, (state, action) => {
        auditAdapter.upsertMany(state.auditLog, action.payload);
      })
      .addCase(tenantSuspended, (state, action) => {
        const { tenantId, tenantName, reason, by, byId, at } = action.payload;
        pushAudit(state, {
          at,
          actor: { id: byId, name: by },
          action: AuditAction.TenantSuspended,
          targetTenant: { id: tenantId, name: tenantName },
          summary: `a suspendu ${tenantName} — motif : ${reason}`,
        });
      })
      .addCase(tenantReactivated, (state, action) => {
        const { tenantId, tenantName, by, byId, at } = action.payload;
        pushAudit(state, {
          at,
          actor: { id: byId, name: by },
          action: AuditAction.TenantReactivated,
          targetTenant: { id: tenantId, name: tenantName },
          summary: `a réactivé ${tenantName}`,
        });
      })
      .addCase(tenantPlanChanged, (state, action) => {
        const { tenantId, tenantName, fromPlanName, toPlanName, by, byId, at } = action.payload;
        pushAudit(state, {
          at,
          actor: { id: byId, name: by },
          action: AuditAction.PlanChanged,
          targetTenant: { id: tenantId, name: tenantName },
          summary: `a fait passer ${tenantName} du plan ${fromPlanName} à ${toPlanName}`,
        });
      })
      .addCase(tenantCreated, (state, action) => {
        const { tenantId, tenantName, by, byId, at } = action.payload;
        pushAudit(state, {
          at,
          actor: { id: byId, name: by },
          action: AuditAction.TenantCreated,
          targetTenant: { id: tenantId, name: tenantName },
          summary: `a créé la banque ${tenantName} et invité l'administrateur`,
        });
      })
      .addCase(invoicePaid, (state, action) => {
        const { tenantId, tenantName, amount, recordedBy, recordedById, at } = action.payload;
        pushAudit(state, {
          at,
          actor: { id: recordedById, name: recordedBy },
          action: AuditAction.InvoiceMarkedPaid,
          targetTenant: { id: tenantId, name: tenantName },
          summary: `a enregistré un paiement de ${tenantName} · ${formatFcfa(amount)} FCFA`,
        });
      })
      .addCase(planUpdated, (state, action) => {
        const { planName, previousMonthlyPrice, monthlyPrice, by, byId, at } = action.payload;
        pushAudit(state, {
          at,
          actor: { id: byId, name: by },
          action: AuditAction.PlanUpdated,
          summary: `a modifié le plan ${planName} ${formatFcfa(previousMonthlyPrice)} → ${formatFcfa(monthlyPrice)} FCFA`,
        });
      })
      .addCase(reminderSent, (state, action) => {
        const { tenantId, tenantName, by, byId, at } = action.payload;
        pushAudit(state, {
          at,
          actor: { id: byId, name: by },
          action: AuditAction.ReminderSent,
          targetTenant: { id: tenantId, name: tenantName },
          summary: `a envoyé une relance de facturation à ${tenantName}`,
        });
      })
      .addCase(collaboratorAdded, (state, action) => {
        const { collaboratorName, role, by, byId, at } = action.payload;
        pushAudit(state, {
          at,
          actor: { id: byId, name: by },
          action: AuditAction.CollaboratorAdded,
          summary: `a ajouté ${collaboratorName} comme collaborateur — rôle ${COLLABORATOR_ROLE_LABEL[role]}`,
        });
      });
  },
});
