import { createSelector } from '@reduxjs/toolkit';
import type { PlatformRootState } from '@/config/store';
import { BillingStatus, eventsAdapter, tenantsAdapter, TenantStatus, type Tenant, type TenantPlanName } from '../entities/Tenant';

const tenantsSelectors = tenantsAdapter.getSelectors((state: PlatformRootState) => state.tenants.tenants);
const eventsSelectors = eventsAdapter.getSelectors((state: PlatformRootState) => state.tenants.events);

export const selectAllTenants = tenantsSelectors.selectAll;

export const selectTenantById = (state: PlatformRootState, tenantId: string): Tenant | undefined =>
  tenantsSelectors.selectById(state, tenantId);

export const selectEventsByTenant = createSelector(
  [eventsSelectors.selectAll, (_state: PlatformRootState, tenantId: string) => tenantId],
  (events, tenantId) => events.filter((event) => event.tenantId === tenantId),
);

export type TenantsStatusFilter = 'all' | 'active' | 'trial' | 'overdue' | 'suspended';

export interface TenantsFilter {
  search: string;
  status: TenantsStatusFilter;
}

export const selectTenantsFilterCounts = createSelector([selectAllTenants], (tenants) => ({
  all: tenants.length,
  active: tenants.filter((tenant) => tenant.status === TenantStatus.Active).length,
  trial: tenants.filter((tenant) => tenant.status === TenantStatus.Trial).length,
  overdue: tenants.filter((tenant) => tenant.billingStatus === BillingStatus.Overdue).length,
  suspended: tenants.filter((tenant) => tenant.status === TenantStatus.Suspended).length,
}));

export const selectFilteredTenants = createSelector(
  [selectAllTenants, (_state: PlatformRootState, filter: TenantsFilter) => filter],
  (tenants, filter) => {
    let result = tenants;
    if (filter.status === 'active') {
      result = result.filter((tenant) => tenant.status === TenantStatus.Active);
    } else if (filter.status === 'trial') {
      result = result.filter((tenant) => tenant.status === TenantStatus.Trial);
    } else if (filter.status === 'overdue') {
      result = result.filter((tenant) => tenant.billingStatus === BillingStatus.Overdue);
    } else if (filter.status === 'suspended') {
      result = result.filter((tenant) => tenant.status === TenantStatus.Suspended);
    }
    const search = filter.search.trim().toLowerCase();
    if (search) {
      result = result.filter(
        (tenant) => tenant.name.toLowerCase().includes(search) || tenant.city.toLowerCase().includes(search),
      );
    }
    return result;
  },
);

export type PlanLimitMetric = 'agents' | 'clients' | 'agencies';

export interface PlanLimitAlert {
  tenantId: string;
  tenantName: string;
  metric: PlanLimitMetric;
  used: number;
  limit: number;
  ratio: number;
  planName: TenantPlanName;
}

const METRICS: PlanLimitMetric[] = ['agents', 'clients', 'agencies'];

/**
 * Usage ≥ 85% d'une limite. Fonction pure (pas un selector Redux) pour être
 * réutilisable telle quelle par `FakeOverviewGateway` (pas d'accès au store
 * depuis une gateway) — évite de dupliquer la règle à deux endroits.
 */
export const computePlanLimitAlerts = (tenants: Tenant[]): PlanLimitAlert[] => {
  const alerts: PlanLimitAlert[] = [];
  for (const tenant of tenants) {
    if (tenant.status === TenantStatus.Suspended) {
      continue;
    }
    for (const metric of METRICS) {
      const { used, limit } = tenant.usage[metric];
      const ratio = limit > 0 ? used / limit : 0;
      if (ratio >= 0.85) {
        alerts.push({ tenantId: tenant.id, tenantName: tenant.name, metric, used, limit, ratio, planName: tenant.plan.name });
      }
    }
  }
  return alerts;
};

export const selectPlanLimitAlerts = createSelector([selectAllTenants], computePlanLimitAlerts);

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const selectTrialsEndingSoon = createSelector([selectAllTenants], (tenants) =>
  tenants.filter(
    (tenant) =>
      tenant.status === TenantStatus.Trial &&
      tenant.trialEndsAt !== undefined &&
      new Date(tenant.trialEndsAt).getTime() - Date.now() <= SEVEN_DAYS_MS,
  ),
);

export const TenantsSelectors = {
  selectAllTenants,
  selectTenantById,
  selectEventsByTenant,
  selectTenantsFilterCounts,
  selectFilteredTenants,
  selectPlanLimitAlerts,
  selectTrialsEndingSoon,
};
