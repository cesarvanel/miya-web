import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRequestStatus } from '@miya/kernel';
import type { DateRange, DateRangePreset } from '@miya/ui';
import { authSelectors } from '@/modules/auth';
import { FetchTenantsAsync, tenantsSelectors } from '@/modules/tenants';
import { usePlatformDispatch, usePlatformSelector } from '@/config/root-hook';
import { FetchActivityAsync } from '../../../application/usecases/fetch-activity-async/FetchActivityAsync';
import { FetchAuditLogAsync } from '../../../application/usecases/fetch-audit-log-async/FetchAuditLogAsync';
import { AuditAction } from '../../../domain/entities/AuditEntry';
import { ActivitySelectors } from '../../../domain/selectors/Selectors';

const DAY_MS = 24 * 60 * 60 * 1000;
const startOfDay = (date: Date): Date => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};
const addDays = (date: Date, amount: number): Date => new Date(date.getTime() + amount * DAY_MS);

const defaultRange = (): DateRange => {
  const end = startOfDay(new Date());
  return { start: addDays(end, -29), end };
};

const rangeToPeriod = (range: DateRange): number =>
  Math.max(1, Math.round((startOfDay(range.end).getTime() - startOfDay(range.start).getTime()) / DAY_MS) + 1);

export type AuditActionFilter = AuditAction | 'all';

/** Un seul filtre "banque" global, appliqué à toutes les sections — usage, synchro, adoption, journal. Maquette 4b. */
export const useActivityPage = () => {
  const dispatch = usePlatformDispatch();
  const [searchParams] = useSearchParams();

  const [tenantId, setTenantId] = useState<string | null>(searchParams.get('tenantId'));
  const [actorId, setActorId] = useState<string | null>(searchParams.get('actorId'));
  const [dateRange, setDateRange] = useState<DateRange>(defaultRange());
  const [presetId, setPresetId] = useState<DateRangePreset>('last30');
  const [auditAction, setAuditAction] = useState<AuditActionFilter>('all');
  const currentUser = usePlatformSelector(authSelectors.selectCurrentUser);
  const isFilteredOnMe = actorId !== null && actorId === currentUser?.id;

  const period = useMemo(() => rangeToPeriod(dateRange), [dateRange]);

  useEffect(() => {
    dispatch(FetchTenantsAsync());
    dispatch(FetchAuditLogAsync());
  }, [dispatch]);

  useEffect(() => {
    dispatch(FetchActivityAsync(period));
  }, [dispatch, period]);

  const { isPending: isActivityPending } = useRequestStatus(FetchActivityAsync);
  const { isPending: isAuditPending } = useRequestStatus(FetchAuditLogAsync);

  const tenants = usePlatformSelector(tenantsSelectors.selectAllTenants);
  const selectedTenant = tenants.find((tenant) => tenant.id === tenantId) ?? null;
  const tenantNames = useMemo(() => Object.fromEntries(tenants.map((tenant) => [tenant.id, tenant.name])), [tenants]);

  const usagePoints = usePlatformSelector((state) => ActivitySelectors.usageSeriesByTenant(state, tenantId ?? undefined));
  const allSyncHealth = usePlatformSelector(ActivitySelectors.selectSyncHealthList);
  const allAdoption = usePlatformSelector(ActivitySelectors.selectAdoptionList);
  const syncAlertsCount = usePlatformSelector(ActivitySelectors.selectSyncAlertsCount);
  const adoptionSummary = usePlatformSelector(ActivitySelectors.selectAdoptionSummary);
  const auditLog = usePlatformSelector((state) =>
    ActivitySelectors.selectFilteredAuditLog(state, {
      tenantId: tenantId ?? undefined,
      action: auditAction === 'all' ? undefined : auditAction,
      actorId: actorId ?? undefined,
    }),
  );

  const syncHealth = tenantId ? allSyncHealth.filter((entry) => entry.tenantId === tenantId) : allSyncHealth;
  const adoption = tenantId ? allAdoption.filter((stat) => stat.tenantId === tenantId) : allAdoption;

  const totalSyncs = syncHealth.reduce((sum, entry) => sum + entry.successCount + entry.errorCount, 0);
  const totalErrors = syncHealth.reduce((sum, entry) => sum + entry.errorCount, 0);
  const avgErrorRate = totalSyncs > 0 ? totalErrors / totalSyncs : 0;
  const agentsCreated = adoption.reduce((sum, stat) => sum + stat.agentsCreated, 0);
  const agentsActive = adoption.reduce((sum, stat) => sum + stat.agentsActive30d, 0);

  const applyDateRange = (range: DateRange, nextPresetId: DateRangePreset): void => {
    setDateRange(range);
    setPresetId(nextPresetId);
  };

  return {
    tenants,
    tenantId,
    setTenantId,
    actorId,
    setActorId,
    isFilteredOnMe,
    selectedTenant,
    tenantNames,
    dateRange,
    presetId,
    applyDateRange,
    period,
    usagePoints,
    syncHealth,
    adoption,
    syncAlertsCount,
    adoptionSummary,
    totalSyncs,
    avgErrorRate,
    agentsCreated,
    agentsActive,
    auditLog,
    auditAction,
    setAuditAction,
    isActivityPending,
    isAuditPending,
  };
};
