import type { ActivityGateway, AuditLogFilters, UsagePeriod } from '../../application/ports/ActivityGateway';
import type { AdoptionStat } from '../../domain/entities/AdoptionStat';
import type { AuditEntry } from '../../domain/entities/AuditEntry';
import type { BankUsagePoint } from '../../domain/entities/BankUsagePoint';
import type { SyncHealth } from '../../domain/entities/SyncHealth';
import { adoptionFixtures, auditLogFixtures, syncHealthFixtures, usageFixtures } from '../fixtures/activityFixtures';

const delay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

/** Gateway en mémoire, lecture seule — le module activity observe, il n'écrit jamais. */
export class FakeActivityGateway implements ActivityGateway {
  async fetchUsage(period: UsagePeriod): Promise<BankUsagePoint[]> {
    await delay();
    const threshold = Date.now() - period * 24 * 60 * 60 * 1000;
    return usageFixtures.filter((point) => new Date(point.date).getTime() >= threshold).map((point) => ({ ...point }));
  }

  async fetchSyncHealth(): Promise<SyncHealth[]> {
    await delay();
    return syncHealthFixtures.map((entry) => ({ ...entry }));
  }

  async fetchAdoption(): Promise<AdoptionStat[]> {
    await delay();
    return adoptionFixtures.map((entry) => ({ ...entry }));
  }

  async fetchAuditLog(filters: AuditLogFilters): Promise<AuditEntry[]> {
    await delay();
    let result = auditLogFixtures;
    if (filters.tenantId) {
      result = result.filter((entry) => entry.targetTenant?.id === filters.tenantId);
    }
    if (filters.action) {
      result = result.filter((entry) => entry.action === filters.action);
    }
    if (filters.sinceDays !== undefined) {
      const threshold = Date.now() - filters.sinceDays * 24 * 60 * 60 * 1000;
      result = result.filter((entry) => new Date(entry.at).getTime() >= threshold);
    }
    return result.map((entry) => ({ ...entry, actor: { ...entry.actor }, targetTenant: entry.targetTenant ? { ...entry.targetTenant } : undefined }));
  }
}
