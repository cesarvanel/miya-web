/**
 * Module activity — SEULE API publique du module.
 *
 * RÈGLE DE CONFIDENTIALITÉ — ce module ne manipule QUE des agrégats (volumes,
 * compteurs, taux). JAMAIS de données métier internes des banques : aucun nom
 * de client final, aucun détail de transaction, aucun nom d'agent. Toute
 * entité/fixture/vue ajoutée ici doit respecter cette règle strictement.
 */
import { ActivitySelectors } from './domain/selectors/Selectors';
import { activitySlice } from './domain/slices/ActivitySlice';

// Types de domaine
export type { BankUsagePoint } from './domain/entities/BankUsagePoint';
export { computeErrorRate, SYNC_ERROR_ALERT_THRESHOLD, SYNC_ERROR_WARN_THRESHOLD } from './domain/entities/SyncHealth';
export type { SyncHealth } from './domain/entities/SyncHealth';
export { AdoptionTrend, computeAdoptionRate } from './domain/entities/AdoptionStat';
export type { AdoptionStat } from './domain/entities/AdoptionStat';
export { AuditAction } from './domain/entities/AuditEntry';
export type { AuditActor, AuditEntry, AuditTargetTenant } from './domain/entities/AuditEntry';

// Reducer (branché dans root-reducer)
export const activityReducer = activitySlice.reducer;

// Selectors — groupés, comme prescrit par CLAUDE.md
export const activitySelectors = {
  ...ActivitySelectors,
};
export { computeDegradedSyncHealth } from './domain/selectors/Selectors';

// Use cases
export { FetchActivityAsync } from './application/usecases/fetch-activity-async/FetchActivityAsync';
export type { FetchActivityResponse } from './application/usecases/fetch-activity-async/FetchActivityResponse';
export { FetchAuditLogAsync } from './application/usecases/fetch-audit-log-async/FetchAuditLogAsync';

// Ports (types utilisés par la composition root)
export type { ActivityDependencies } from './application/ports/ActivityDependencies';
export type { ActivityGateway, AuditLogFilters, UsagePeriod } from './application/ports/ActivityGateway';

// Infrastructure (instanciée par la composition root)
export { FakeActivityGateway } from './infrastructure/gateways/FakeActivityGateway';
export { syncHealthFixtures } from './infrastructure/fixtures/activityFixtures';

// Vues (routées par config/router.tsx)
export { ActivityPage } from './infrastructure/views/index/ActivityPage';
