import type { AdminContact, Tenant, TenantEvent } from '../../domain/entities/Tenant';

export interface CreateTenantCommand {
  name: string;
  city: string;
  adminContact: AdminContact;
  planId: string;
  trialDays: number;
}

export interface TenantGateway {
  fetchAll: () => Promise<Tenant[]>;
  fetchOne: (tenantId: string) => Promise<Tenant>;
  fetchEvents: (tenantId: string) => Promise<TenantEvent[]>;
  create: (command: CreateTenantCommand) => Promise<Tenant>;
  changePlan: (tenantId: string, planId: string) => Promise<Tenant>;
  suspend: (tenantId: string, reason: string) => Promise<void>;
  reactivate: (tenantId: string) => Promise<void>;
  resendInvitation: (tenantId: string) => Promise<{ maskedEmail: string }>;
}
