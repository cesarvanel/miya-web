import { createSelector } from '@reduxjs/toolkit';
import type { PlatformRootState } from '@/config/store';
import { adoptionAdapter } from '../entities/AdoptionStat';
import { auditAdapter, type AuditAction, type AuditEntry } from '../entities/AuditEntry';
import { usageAdapter, type BankUsagePoint } from '../entities/BankUsagePoint';
import { syncHealthAdapter, SYNC_ERROR_ALERT_THRESHOLD, type SyncHealth } from '../entities/SyncHealth';

const usageSelectors = usageAdapter.getSelectors((state: PlatformRootState) => state.activity.usage);
const syncHealthSelectors = syncHealthAdapter.getSelectors((state: PlatformRootState) => state.activity.syncHealth);
const adoptionSelectors = adoptionAdapter.getSelectors((state: PlatformRootState) => state.activity.adoption);
const auditSelectors = auditAdapter.getSelectors((state: PlatformRootState) => state.activity.auditLog);

export const selectAllUsage = usageSelectors.selectAll;

/** Courbe d'usage — toutes les banques chargées si `tenantId` est omis (comparatif), une seule sinon. */
export const usageSeriesByTenant = createSelector(
  [selectAllUsage, (_state: PlatformRootState, tenantId?: string) => tenantId],
  (points, tenantId): BankUsagePoint[] => (tenantId ? points.filter((point) => point.tenantId === tenantId) : points),
);

/** Banques en difficulté d'abord — l'adapter trie déjà par errorRate décroissant. */
export const selectSyncHealthList = syncHealthSelectors.selectAll;

/**
 * Fonction pure (pas un selector Redux) pour être réutilisable telle quelle
 * par `FakeOverviewGateway` — l'alerte "Synchronisations en difficulté" de
 * la vue d'ensemble dérive du même seuil que la coloration rouge de la table
 * de santé, sans dupliquer la règle.
 */
export const computeDegradedSyncHealth = (entries: SyncHealth[]): SyncHealth[] =>
  entries.filter((entry) => entry.errorRate >= SYNC_ERROR_ALERT_THRESHOLD);

export const selectSyncAlertsCount = createSelector(
  [selectSyncHealthList],
  (entries) => computeDegradedSyncHealth(entries).length,
);

/** Banques à accompagner d'abord — l'adapter trie déjà par adoptionRate croissant. */
export const selectAdoptionList = adoptionSelectors.selectAll;

export const selectAllAuditEntries = auditSelectors.selectAll;

export interface AuditLogFilter {
  tenantId?: string;
  action?: AuditAction;
  /** Ne garde que les entrées des `sinceDays` derniers jours. */
  sinceDays?: number;
}

export const selectFilteredAuditLog = createSelector(
  [selectAllAuditEntries, (_state: PlatformRootState, filter: AuditLogFilter) => filter],
  (entries, filter): AuditEntry[] => {
    let result = entries;
    if (filter.tenantId) {
      result = result.filter((entry) => entry.targetTenant?.id === filter.tenantId);
    }
    if (filter.action) {
      result = result.filter((entry) => entry.action === filter.action);
    }
    if (filter.sinceDays !== undefined) {
      const threshold = Date.now() - filter.sinceDays * 24 * 60 * 60 * 1000;
      result = result.filter((entry) => new Date(entry.at).getTime() >= threshold);
    }
    return result;
  },
);

export interface AdoptionSummary {
  averageRate: number;
  belowThresholdCount: number;
}

const ADOPTION_ATTENTION_THRESHOLD = 0.65;

export const selectAdoptionSummary = createSelector([selectAdoptionList], (stats): AdoptionSummary => {
  if (stats.length === 0) {
    return { averageRate: 0, belowThresholdCount: 0 };
  }
  const averageRate = stats.reduce((sum, stat) => sum + stat.adoptionRate, 0) / stats.length;
  const belowThresholdCount = stats.filter((stat) => stat.adoptionRate < ADOPTION_ATTENTION_THRESHOLD).length;
  return { averageRate, belowThresholdCount };
});

export const ActivitySelectors = {
  selectAllUsage,
  usageSeriesByTenant,
  selectSyncHealthList,
  selectSyncAlertsCount,
  selectAdoptionList,
  selectAllAuditEntries,
  selectFilteredAuditLog,
  selectAdoptionSummary,
};
