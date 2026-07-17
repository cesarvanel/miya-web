import type { Tenant, TenantEvent } from '../../../domain/entities/Tenant';

export interface FetchTenantResponse {
  tenant: Tenant;
  events: TenantEvent[];
}
