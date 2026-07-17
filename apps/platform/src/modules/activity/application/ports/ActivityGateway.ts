import type { AdoptionStat } from '../../domain/entities/AdoptionStat';
import type { AuditAction, AuditEntry } from '../../domain/entities/AuditEntry';
import type { BankUsagePoint } from '../../domain/entities/BankUsagePoint';
import type { SyncHealth } from '../../domain/entities/SyncHealth';

/** Nombre de jours couverts par la période demandée (7/30/90…). */
export type UsagePeriod = number;

export interface AuditLogFilters {
  tenantId?: string;
  action?: AuditAction;
  /** Ne garde que les entrées des `sinceDays` derniers jours. */
  sinceDays?: number;
}

export interface ActivityGateway {
  fetchUsage: (period: UsagePeriod) => Promise<BankUsagePoint[]>;
  fetchSyncHealth: () => Promise<SyncHealth[]>;
  fetchAdoption: () => Promise<AdoptionStat[]>;
  fetchAuditLog: (filters: AuditLogFilters) => Promise<AuditEntry[]>;
}
