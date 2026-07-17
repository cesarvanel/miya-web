import React from 'react';
import { DateRangePicker, FilterChips, KpiCard, SearchableSelect, Skeleton } from '@miya/ui';
import { PageShell } from '@/shared/layout/PageShell';
import { AuditAction } from '../../../domain/entities/AuditEntry';
import { AdoptionTable } from '../composants/AdoptionTable';
import { AuditLogTimeline } from '../composants/AuditLogTimeline';
import { SyncHealthTable } from '../composants/SyncHealthTable';
import { UsageChartCard } from '../composants/UsageChartCard';
import { useActivityPage } from './useActivityPage';

interface BankOption {
  id: string | null;
  name: string;
  city?: string;
}

const ALL_BANKS: BankOption = { id: null, name: 'Toutes les banques' };

const ACTION_LABELS: Record<AuditAction, string> = {
  [AuditAction.TenantSuspended]: 'Suspensions',
  [AuditAction.TenantReactivated]: 'Réactivations',
  [AuditAction.PlanChanged]: 'Changements de plan',
  [AuditAction.PlanUpdated]: 'Plans modifiés',
  [AuditAction.InvoiceMarkedPaid]: 'Paiements',
  [AuditAction.ReminderSent]: 'Relances',
  [AuditAction.TenantCreated]: 'Créations',
  [AuditAction.CollaboratorAdded]: 'Équipe',
};

/** Activité plateforme — supervision agrégée + journal d'audit du super admin. Maquette 4a/4b. */
export const ActivityPage: React.FC = () => {
  const {
    tenants,
    tenantId,
    setTenantId,
    selectedTenant,
    tenantNames,
    dateRange,
    presetId,
    applyDateRange,
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
  } = useActivityPage();

  const bankOptions: BankOption[] = [ALL_BANKS, ...tenants.map((tenant) => ({ id: tenant.id, name: tenant.name, city: tenant.city }))];
  const bankValue = bankOptions.find((option) => option.id === tenantId) ?? ALL_BANKS;

  const auditActionOptions = [...new Set(auditLog.map((entry) => entry.action))];

  return (
    <PageShell
      title="Activité plateforme"
      subtitle={selectedTenant ? `Filtré sur ${selectedTenant.name} · agrégats uniquement` : `Usage & santé technique · ${tenants.length} banques`}
      actions={
        <>
          <div className="w-64">
            <SearchableSelect
              options={bankOptions}
              value={bankValue}
              onChange={(option) => setTenantId(option.id)}
              getId={(option) => option.id ?? 'all'}
              getLabel={(option) => option.name}
              placeholder="Toutes les banques"
              searchPlaceholder="Rechercher une banque…"
            />
          </div>
          <DateRangePicker value={dateRange} presetId={presetId} onApply={applyDateRange} />
        </>
      }
    >
      <div className="mb-5.5 flex items-center gap-2.75 rounded-2xl border border-[#C9E7D8] bg-[#EEF5F1] px-4.5 py-3.25">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-none" aria-hidden="true">
          <path d="M10 2.5l6.5 3v4.5c0 4-2.8 6.3-6.5 7.5-3.7-1.2-6.5-3.5-6.5-7.5V5.5L10 2.5z" stroke="#0F9E6C" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M7.5 10l1.7 1.7L13 8" stroke="#0F9E6C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="text-[12.5px] leading-[1.5] font-medium text-[#2E5344]">
          <b className="text-ink">Vue strictement agrégée.</b> Miya ne voit jamais les clients d&rsquo;une banque ni le détail de ses
          transactions — uniquement des <b>volumes</b> et des indicateurs techniques.
        </div>
      </div>

      {tenantId && selectedTenant && (
        <div className="mb-4">
          <FilterChips
            filters={[{ id: 'tenant', label: `${selectedTenant.name}${selectedTenant.city ? ` · ${selectedTenant.city}` : ''}`, emphasis: true }]}
            onRemove={() => setTenantId(null)}
            onClearAll={() => setTenantId(null)}
          />
        </div>
      )}

      <div className="mb-5.5 grid grid-cols-4 gap-3.5">
        <KpiCard label="Synchros mobiles" value={totalSyncs} hint={<span className="text-ink-faint">sur la période</span>} />
        <KpiCard
          tone={avgErrorRate >= 0.08 ? 'danger' : 'default'}
          label="Taux d'erreur de synchro"
          value={Math.round(avgErrorRate * 1000) / 10}
          formatter={(v) => `${v.toLocaleString('fr-FR')}%`}
          hint={<span className={avgErrorRate >= 0.08 ? 'text-danger' : 'text-primary'}>{avgErrorRate >= 0.08 ? 'Au-dessus du seuil (8%)' : 'Sous le seuil (8%)'}</span>}
        />
        <KpiCard
          label="Agents actifs · 30j"
          value={agentsActive}
          hint={<span className="text-ink-faint">sur {agentsCreated} créés</span>}
        />
        <KpiCard
          label="Taux d'adoption moyen"
          value={Math.round(adoptionSummary.averageRate * 100)}
          formatter={(v) => `${v.toLocaleString('fr-FR')}%`}
          hint={
            adoptionSummary.belowThresholdCount > 0 ? (
              <span className="text-amber">{adoptionSummary.belowThresholdCount} banque{adoptionSummary.belowThresholdCount > 1 ? 's' : ''} &lt; 65%</span>
            ) : (
              <span className="text-primary">Toutes au-dessus de 65%</span>
            )
          }
        />
      </div>

      <div className="mb-2 text-[16px] font-extrabold text-ink">Usage</div>
      {isActivityPending && usagePoints.length === 0 ? (
        <Skeleton variant="chart" className="mb-5.5" />
      ) : (
        <UsageChartCard
          points={usagePoints}
          tenantNames={tenantNames}
          title={selectedTenant ? `Collectes agrégées — ${selectedTenant.name}` : 'Collectes agrégées par banque'}
        />
      )}

      <div className="mt-5.5 mb-2 flex items-center gap-2.5">
        <span className="text-[16px] font-extrabold text-ink">Synchronisations</span>
        {syncAlertsCount > 0 && (
          <span className="rounded-full bg-danger-soft px-2.5 py-1 text-[11.5px] font-bold text-danger">{syncAlertsCount} en difficulté</span>
        )}
      </div>
      {isActivityPending && syncHealth.length === 0 ? (
        <Skeleton variant="card" className="mb-5.5" />
      ) : (
        <div className="mb-5.5">
          <SyncHealthTable entries={syncHealth} />
        </div>
      )}

      <div className="mb-2 text-[16px] font-extrabold text-ink">Adoption</div>
      {isActivityPending && adoption.length === 0 ? (
        <Skeleton variant="card" className="mb-5.5" />
      ) : (
        <div className="mb-5.5">
          <AdoptionTable stats={adoption} />
        </div>
      )}

      <div className="overflow-hidden rounded-card-lg border border-line bg-card">
        <div className="flex items-center justify-between px-5.5 pt-4.5 pb-3">
          <div>
            <div className="text-[15px] font-extrabold text-ink">Journal d&rsquo;audit · super admin</div>
            <div className="mt-0.5 text-xs font-medium text-ink-faint">Actions de l&rsquo;équipe Miya sur les tenants</div>
          </div>
          <span className="rounded-full bg-cream-100 px-2.75 py-1.25 text-[11.5px] font-bold text-ink-muted">Immuable</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 border-t border-line-faint px-5.5 py-2.5">
          <button
            type="button"
            onClick={() => setAuditAction('all')}
            className={[
              'cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold transition-colors',
              auditAction === 'all' ? 'bg-admin-sidebar text-white' : 'bg-cream-100 text-ink hover:bg-cream-50',
            ].join(' ')}
          >
            Toutes
          </button>
          {auditActionOptions.map((action) => (
            <button
              key={action}
              type="button"
              onClick={() => setAuditAction(action)}
              className={[
                'cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold transition-colors',
                auditAction === action ? 'bg-admin-sidebar text-white' : 'bg-cream-100 text-ink hover:bg-cream-50',
              ].join(' ')}
            >
              {ACTION_LABELS[action]}
            </button>
          ))}
        </div>
        {isAuditPending && auditLog.length === 0 ? (
          <div className="p-5.5">
            <Skeleton variant="card" />
          </div>
        ) : (
          <AuditLogTimeline entries={auditLog} />
        )}
      </div>
    </PageShell>
  );
};
