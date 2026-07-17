import { createEntityAdapter } from '@reduxjs/toolkit';

/** Seuils de coloration de la barre d'erreur — verte < 2%, ambre < 8%, rouge au-delà. Maquette 4a. */
export const SYNC_ERROR_WARN_THRESHOLD = 0.02;
export const SYNC_ERROR_ALERT_THRESHOLD = 0.08;

/** Instantané de santé de synchro d'une banque sur la période — un seul enregistrement par tenant. */
export interface SyncHealth {
  tenantId: string;
  tenantName: string;
  /** ISO date de la période couverte. */
  date: string;
  successCount: number;
  errorCount: number;
  /** Dérivé : errorCount / (successCount + errorCount). */
  errorRate: number;
  /** ISO. */
  lastSyncAt: string;
}

export const computeErrorRate = (successCount: number, errorCount: number): number => {
  const total = successCount + errorCount;
  return total > 0 ? errorCount / total : 0;
};

export const syncHealthAdapter = createEntityAdapter<SyncHealth, string>({
  selectId: (entry) => entry.tenantId,
  sortComparer: (a, b) => b.errorRate - a.errorRate,
});
