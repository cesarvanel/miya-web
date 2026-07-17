import { TenantsSelectors } from './domain/selectors/Selectors';
import { tenantsSlice } from './domain/slices/TenantsSlice';

// Types de domaine
export { BillingStatus, TenantEventKind, TenantStatus } from './domain/entities/Tenant';
export type {
  AdminContact,
  Tenant,
  TenantEvent,
  TenantPlan,
  TenantPlanName,
  TenantSuspension,
  TenantUsage,
  UsageMetric,
  VolumePoint,
} from './domain/entities/Tenant';
export { computePlanLimitAlerts } from './domain/selectors/Selectors';
export type { PlanLimitAlert, PlanLimitMetric, TenantsFilter, TenantsStatusFilter } from './domain/selectors/Selectors';

// Events (les modules activity/overview s'y abonnent via cet index)
export { tenantCreated, tenantPlanChanged, tenantReactivated, tenantSuspended } from './domain/events';
export type { TenantAuditContext } from './domain/events';

// Reducer (branché dans root-reducer)
export const tenantsReducer = tenantsSlice.reducer;

// Selectors — groupés, comme prescrit par CLAUDE.md
export const tenantsSelectors = {
  ...TenantsSelectors,
};

// Use cases
export { FetchTenantsAsync } from './application/usecases/fetch-tenants-async/FetchTenantsAsync';
export { FetchTenantAsync } from './application/usecases/fetch-tenant-async/FetchTenantAsync';
export type { FetchTenantResponse } from './application/usecases/fetch-tenant-async/FetchTenantResponse';
export { CreateTenantAsync } from './application/usecases/create-tenant-async/CreateTenantAsync';
export { ChangePlanAsync } from './application/usecases/change-plan-async/ChangePlanAsync';
export type { ChangePlanCommand } from './application/usecases/change-plan-async/ChangePlanCommand';
export { SuspendTenantAsync } from './application/usecases/suspend-tenant-async/SuspendTenantAsync';
export type { SuspendTenantCommand } from './application/usecases/suspend-tenant-async/SuspendTenantCommand';
export { ReactivateTenantAsync } from './application/usecases/reactivate-tenant-async/ReactivateTenantAsync';
export { ResendInvitationAsync } from './application/usecases/resend-invitation-async/ResendInvitationAsync';

// Ports (types utilisés par la composition root)
export type { TenantsDependencies } from './application/ports/TenantsDependencies';
export type { CreateTenantCommand, TenantGateway } from './application/ports/TenantGateway';

// Infrastructure (instanciée par la composition root)
export { FakeTenantGateway } from './infrastructure/gateways/FakeTenantGateway';
export { PLAN_CATALOG, tenantEventFixtures, tenantFixtures } from './infrastructure/fixtures/tenantFixtures';
export type { PlanCatalogEntry } from './infrastructure/fixtures/tenantFixtures';

// Vues (routées par config/router.tsx)
export { TenantsListPage } from './infrastructure/views/index/TenantsListPage';
export { TenantDetailPage } from './infrastructure/views/detail/TenantDetailPage';
export { NewTenantPage } from './infrastructure/views/new/NewTenantPage';

// Modales (montées globalement dans le layout)
export { ChangePlanModal } from './infrastructure/views/modal/ChangePlanModal';
export { SuspendTenantModal } from './infrastructure/views/modal/SuspendTenantModal';
export { ConfirmReactivateModal } from './infrastructure/views/modal/ConfirmReactivateModal';
export { ResendInvitationModal } from './infrastructure/views/modal/ResendInvitationModal';
