import { invoicePaid, planUpdated, reminderSent } from '@/modules/billing';
import { tenantCreated, tenantPlanChanged, tenantReactivated, tenantSuspended } from '@/modules/tenants';
import { activitySlice } from './ActivitySlice';

describe('activitySlice', () => {
  it('starts empty', () => {
    const state = activitySlice.reducer(undefined, { type: '@@init' });
    expect(state.auditLog.ids).toEqual([]);
  });

  it('declares no mutation/deletion reducer for AuditEntry — the piste d’audit is append-only', () => {
    expect(Object.keys(activitySlice.actions)).toEqual([]);
  });

  it('appends a TenantSuspended entry when tenants dispatches tenantSuspended', () => {
    const state = activitySlice.reducer(
      undefined,
      tenantSuspended({
        tenantId: 'coopec-sahel',
        tenantName: 'COOPEC Sahel',
        reason: "Impayé d'abonnement",
        by: 'César Vanel',
        byId: 'super-admin-cesar',
        at: '2026-07-17T10:00:00.000Z',
      }),
    );

    const entries = Object.values(state.auditLog.entities);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      action: 'TenantSuspended',
      actor: { id: 'super-admin-cesar', name: 'César Vanel' },
      targetTenant: { id: 'coopec-sahel', name: 'COOPEC Sahel' },
    });
    expect(entries[0]?.summary).toContain('COOPEC Sahel');
    expect(entries[0]?.summary).toContain("Impayé d'abonnement");
  });

  it('appends both TenantSuspended and TenantReactivated in order, most recent first (append-only journal)', () => {
    let state = activitySlice.reducer(
      undefined,
      tenantSuspended({ tenantId: 't1', tenantName: 'Banque Test', reason: 'Test', by: 'César Vanel', byId: 'super-admin-cesar', at: '2026-07-17T10:00:00.000Z' }),
    );
    state = activitySlice.reducer(
      state,
      tenantReactivated({ tenantId: 't1', tenantName: 'Banque Test', by: 'César Vanel', byId: 'super-admin-cesar', at: '2026-07-17T10:05:00.000Z' }),
    );

    const entries = Object.values(state.auditLog.entities);
    expect(entries).toHaveLength(2);
    const actions = state.auditLog.ids.map((id) => state.auditLog.entities[id]?.action);
    expect(actions).toEqual(['TenantReactivated', 'TenantSuspended']);
  });

  it('appends a PlanChanged entry from tenants and a PlanUpdated entry from billing independently', () => {
    let state = activitySlice.reducer(
      undefined,
      tenantPlanChanged({ tenantId: 't1', tenantName: 'Banque Test', fromPlanName: 'Croissance', toPlanName: 'Élite', by: 'César Vanel', byId: 'super-admin-cesar', at: '2026-07-17T10:00:00.000Z' }),
    );
    state = activitySlice.reducer(
      state,
      planUpdated({ planId: 'plan-croissance', planName: 'Croissance', previousMonthlyPrice: 120_000, monthlyPrice: 135_000, by: 'César Vanel', byId: 'super-admin-cesar', at: '2026-07-17T10:01:00.000Z' }),
    );

    const actions = Object.values(state.auditLog.entities).map((entry) => entry?.action);
    expect(actions).toContain('PlanChanged');
    expect(actions).toContain('PlanUpdated');
  });

  it('appends InvoiceMarkedPaid and ReminderSent entries from billing events', () => {
    let state = activitySlice.reducer(
      undefined,
      invoicePaid({ invoiceId: 'inv-1', tenantId: 't1', tenantName: 'Banque Test', amount: 120_000, at: '2026-07-17T10:00:00.000Z', recordedBy: 'César Vanel', recordedById: 'super-admin-cesar' }),
    );
    state = activitySlice.reducer(
      state,
      reminderSent({ invoiceId: 'inv-2', tenantId: 't1', tenantName: 'Banque Test', by: 'César Vanel', byId: 'super-admin-cesar', at: '2026-07-17T10:01:00.000Z' }),
    );

    const actions = Object.values(state.auditLog.entities).map((entry) => entry?.action);
    expect(actions).toContain('InvoiceMarkedPaid');
    expect(actions).toContain('ReminderSent');
  });

  it('appends a TenantCreated entry from tenants', () => {
    const state = activitySlice.reducer(
      undefined,
      tenantCreated({ tenantId: 't1', tenantName: 'Nouvelle Banque', by: 'César Vanel', byId: 'super-admin-cesar', at: '2026-07-17T10:00:00.000Z' }),
    );

    const entries = Object.values(state.auditLog.entities);
    expect(entries[0]?.action).toBe('TenantCreated');
  });
});
