import type { CreateTenantCommand, TenantGateway } from '../../application/ports/TenantGateway';
import { BillingStatus, TenantStatus, type Tenant, type TenantEvent } from '../../domain/entities/Tenant';
import { PLAN_CATALOG, tenantEventFixtures, tenantFixtures } from '../fixtures/tenantFixtures';

const delay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!domain) {
    return `${email.slice(0, 2)}•••`;
  }
  const dotIndex = local.indexOf('.');
  const kept = dotIndex >= 0 ? local.slice(0, dotIndex + 1) : local.slice(0, 1);
  return `${kept}•••@${domain}`;
};

const findIndex = (tenantId: string): number => tenantFixtures.findIndex((candidate) => candidate.id === tenantId);

let nextTenantSeq = tenantFixtures.length + 1;

/**
 * Gateway en mémoire — lit/écrit les fixtures partagées (`tenantFixtures`,
 * `tenantEventFixtures`) importées du même module que `FakeOverviewGateway`,
 * pour que les deux dérivent un état cohérent sans dupliquer les données.
 * Ne renvoie et ne stocke jamais les objets de fixture PAR RÉFÉRENCE (Redux/
 * Immer gèle les objets qui entrent dans le store — les muter ensuite lève
 * une TypeError) : lecture = clone, écriture = remplacement d'élément.
 */
export class FakeTenantGateway implements TenantGateway {
  async fetchAll(): Promise<Tenant[]> {
    await delay();
    return tenantFixtures.map((tenant) => ({ ...tenant }));
  }

  async fetchOne(tenantId: string): Promise<Tenant> {
    await delay();
    const tenant = tenantFixtures.find((candidate) => candidate.id === tenantId);
    if (!tenant) {
      throw new Error('Banque introuvable.');
    }
    return { ...tenant };
  }

  async fetchEvents(tenantId: string): Promise<TenantEvent[]> {
    await delay();
    return (tenantEventFixtures[tenantId] ?? []).map((event) => ({ ...event }));
  }

  async create(command: CreateTenantCommand): Promise<Tenant> {
    await delay();
    const catalogEntry = PLAN_CATALOG[command.planId] ?? PLAN_CATALOG['plan-croissance'];
    const id = `tenant-local-${nextTenantSeq++}`;
    const tenant: Tenant = {
      id,
      name: command.name,
      city: command.city,
      adminContact: command.adminContact,
      plan: catalogEntry.plan,
      usage: {
        agents: { used: 0, limit: catalogEntry.limits.agents.limit },
        clients: { used: 0, limit: catalogEntry.limits.clients.limit },
        agencies: { used: 0, limit: catalogEntry.limits.agencies.limit },
      },
      volumeMonth: 0,
      volumeSeries: [],
      status: TenantStatus.Trial,
      trialEndsAt: new Date(Date.now() + command.trialDays * 24 * 60 * 60 * 1000).toISOString(),
      billingStatus: BillingStatus.UpToDate,
      registeredAt: new Date().toISOString(),
    };
    tenantFixtures.push(tenant);
    tenantEventFixtures[id] = [];
    return { ...tenant };
  }

  async changePlan(tenantId: string, planId: string): Promise<Tenant> {
    await delay();
    const index = findIndex(tenantId);
    if (index === -1) {
      throw new Error('Banque introuvable.');
    }
    const catalogEntry = PLAN_CATALOG[planId];
    if (!catalogEntry) {
      throw new Error('Plan introuvable.');
    }
    const current = tenantFixtures[index];
    const updated: Tenant = {
      ...current,
      plan: catalogEntry.plan,
      usage: {
        agents: { used: current.usage.agents.used, limit: catalogEntry.limits.agents.limit },
        clients: { used: current.usage.clients.used, limit: catalogEntry.limits.clients.limit },
        agencies: { used: current.usage.agencies.used, limit: catalogEntry.limits.agencies.limit },
      },
    };
    tenantFixtures[index] = updated;
    return { ...updated };
  }

  async suspend(tenantId: string, _reason: string): Promise<void> {
    await delay();
    const index = findIndex(tenantId);
    if (index === -1) {
      throw new Error('Banque introuvable.');
    }
    tenantFixtures[index] = { ...tenantFixtures[index], status: TenantStatus.Suspended };
  }

  async reactivate(tenantId: string): Promise<void> {
    await delay();
    const index = findIndex(tenantId);
    if (index === -1) {
      throw new Error('Banque introuvable.');
    }
    const { suspension: _suspension, ...rest } = tenantFixtures[index];
    tenantFixtures[index] = { ...rest, status: TenantStatus.Active };
  }

  async resendInvitation(tenantId: string): Promise<{ maskedEmail: string }> {
    await delay();
    const tenant = tenantFixtures.find((candidate) => candidate.id === tenantId);
    if (!tenant) {
      throw new Error('Banque introuvable.');
    }
    return { maskedEmail: maskEmail(tenant.adminContact.email) };
  }
}
