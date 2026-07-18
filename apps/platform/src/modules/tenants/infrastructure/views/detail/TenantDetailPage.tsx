import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Gauge, InitialsAvatar, Skeleton, Tooltip } from '@miya/ui';
import { Money } from '@miya/kernel';
import { useCanWrite } from '@/shared/guards/useCanWrite';
import { TenantStatus } from '../../../domain/entities/Tenant';
import { BillingHistoryTable } from '../composants/BillingHistoryTable';
import { IdentityContactsCard } from '../composants/IdentityContactsCard';
import { TenantEventJournal } from '../composants/TenantEventJournal';
import { TenantPlanBadge } from '../composants/TenantPlanBadge';
import { TenantStatusBadge } from '../composants/TenantStatusBadge';
import { useTenantDetailPage } from './useTenantDetailPage';

const READ_ONLY_TOOLTIP = 'Rôle lecture seule';

const monthYear = (iso: string): string =>
  new Date(iso).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

/** Fiche banque — drill-down plein écran. Maquette 2f (active) / 2d (suspendue). */
export const TenantDetailPage: React.FC = () => {
  const { tenant, events, invoices, isPending, openChangePlan, openSuspend, openReactivate, openResendInvitation } = useTenantDetailPage();
  const canWrite = useCanWrite();

  if (isPending) {
    return (
      <div className="p-8">
        <Skeleton variant="card" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <div className="text-lg font-extrabold text-ink">Banque introuvable</div>
        <Link to="/tenants" className="text-sm font-bold text-admin-primary hover:underline">
          Retour à la liste
        </Link>
      </div>
    );
  }

  const isSuspended = tenant.status === TenantStatus.Suspended;

  return (
    <div className="flex h-full flex-col">
      {isSuspended && tenant.suspension && (
        <div className="flex flex-none items-center gap-2.75 border-b border-[#DED9CF] bg-cream-100 px-8 py-3">
          <span className="flex size-7 flex-none items-center justify-center rounded-[8px] bg-card">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <rect x="4" y="3.5" width="2.4" height="8" rx="1" fill="#6B7069" />
              <rect x="8.6" y="3.5" width="2.4" height="8" rx="1" fill="#6B7069" />
            </svg>
          </span>
          <span className="text-[13px] font-bold text-ink-muted">
            Banque suspendue le {new Date(tenant.suspension.at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} — motif : {tenant.suspension.reason}
          </span>
          <span className="ml-auto text-[12.5px] font-semibold text-ink-faint">Toutes les données sont conservées.</span>
        </div>
      )}

      <div className="flex-none border-b border-line bg-card px-8 py-5">
        <div className="mb-3.5 flex items-center gap-2 text-[12.5px] font-semibold text-ink-faint">
          <Link to="/tenants" className="hover:underline">Banques</Link>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M4.5 3l3 3-3 3" stroke="#B9BAB2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-bold text-ink">{tenant.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <InitialsAvatar name={tenant.name} size="lg" />
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-[24px] font-extrabold tracking-[-0.02em] text-ink">{tenant.name}</span>
                <TenantStatusBadge tenant={tenant} />
                <TenantPlanBadge tenant={tenant} />
              </div>
              <div className="mt-1 text-[13px] font-medium text-ink-muted">
                {tenant.legalName ?? tenant.name} · {tenant.city} · cliente depuis {monthYear(tenant.registeredAt)}
              </div>
            </div>
          </div>
          <div className="flex gap-2.5">
            {!isSuspended &&
              (canWrite ? (
                <button type="button" onClick={openChangePlan} className="cursor-pointer rounded-[12px] bg-cream-100 px-3.75 py-2.5 text-[13px] font-bold text-ink">
                  Changer de plan
                </button>
              ) : (
                <Tooltip label={READ_ONLY_TOOLTIP}>
                  <button type="button" disabled className="cursor-not-allowed rounded-[12px] bg-cream-100 px-3.75 py-2.5 text-[13px] font-bold text-ink opacity-40">
                    Changer de plan
                  </button>
                </Tooltip>
              ))}
            {canWrite ? (
              <button type="button" onClick={openResendInvitation} className="cursor-pointer rounded-[12px] bg-cream-100 px-3.75 py-2.5 text-[13px] font-bold text-ink">
                Renvoyer l&rsquo;invitation
              </button>
            ) : (
              <Tooltip label={READ_ONLY_TOOLTIP}>
                <button type="button" disabled className="cursor-not-allowed rounded-[12px] bg-cream-100 px-3.75 py-2.5 text-[13px] font-bold text-ink opacity-40">
                  Renvoyer l&rsquo;invitation
                </button>
              </Tooltip>
            )}
            {isSuspended ? (
              canWrite ? (
                <button
                  type="button"
                  onClick={openReactivate}
                  className="bg-admin-primary shadow-[0_8px_18px_-8px_rgba(15,158,108,.7)] flex cursor-pointer items-center gap-2 rounded-[12px] px-4.25 py-2.5 text-[13px] font-bold text-white"
                >
                  Réactiver la banque
                </button>
              ) : (
                <Tooltip label={READ_ONLY_TOOLTIP}>
                  <button type="button" disabled className="bg-admin-primary flex cursor-not-allowed items-center gap-2 rounded-[12px] px-4.25 py-2.5 text-[13px] font-bold text-white opacity-40">
                    Réactiver la banque
                  </button>
                </Tooltip>
              )
            ) : canWrite ? (
              <button type="button" onClick={openSuspend} className="flex cursor-pointer items-center gap-1.75 rounded-[12px] bg-danger-soft px-3.75 py-2.5 text-[13px] font-bold text-danger">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <rect x="3.5" y="3" width="2.2" height="8" rx="1" fill="#C43B32" />
                  <rect x="8.3" y="3" width="2.2" height="8" rx="1" fill="#C43B32" />
                </svg>
                Suspendre
              </button>
            ) : (
              <Tooltip label={READ_ONLY_TOOLTIP}>
                <button type="button" disabled className="flex cursor-not-allowed items-center gap-1.75 rounded-[12px] bg-danger-soft px-3.75 py-2.5 text-[13px] font-bold text-danger opacity-40">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <rect x="3.5" y="3" width="2.2" height="8" rx="1" fill="#C43B32" />
                    <rect x="8.3" y="3" width="2.2" height="8" rx="1" fill="#C43B32" />
                  </svg>
                  Suspendre
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="flex items-start gap-5">
          <div className="flex min-w-0 flex-1 flex-col gap-4.5">
            {isSuspended ? (
              <div className="rounded-card-lg border border-line bg-card p-5.5">
                <div className="mb-1.5 text-[16px] font-extrabold text-ink">Données gelées</div>
                <div className="mb-4.5 text-[13px] leading-[1.55] font-medium text-ink-muted">
                  Aucune collecte n&rsquo;est possible pendant la suspension. Les compteurs reflètent l&rsquo;état au moment de la coupure.
                </div>
                <div className="grid grid-cols-3 gap-4.5">
                  <div>
                    <div className="text-xs font-semibold text-ink-faint">Agents préservés</div>
                    <div className="num mt-1 text-2xl font-bold text-ink-muted">{tenant.usage.agents.used}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-ink-faint">Clients préservés</div>
                    <div className="num mt-1 text-2xl font-bold text-ink-muted">{tenant.usage.clients.used.toLocaleString('fr-FR')}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-ink-faint">Agences préservées</div>
                    <div className="num mt-1 text-2xl font-bold text-ink-muted">{tenant.usage.agencies.used}</div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-card-lg border border-line bg-card p-5.5">
                  <div className="mb-4.5 flex items-center justify-between">
                    <div className="text-[16px] font-extrabold text-ink">Plan &amp; consommation</div>
                    <span className="bg-violet-soft text-violet rounded-full px-3 py-1.25 text-xs font-bold">
                      {tenant.plan.name} · {Money.from(tenant.plan.monthlyPrice).format()}/mois
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-5">
                    <Gauge value={tenant.usage.agents.used} max={tenant.usage.agents.limit} warnRatio={0.85} label="Agents" />
                    <Gauge value={tenant.usage.clients.used} max={tenant.usage.clients.limit} warnRatio={0.85} label="Clients cotisants" />
                    <Gauge value={tenant.usage.agencies.used} max={tenant.usage.agencies.limit} warnRatio={0.85} label="Agences" />
                  </div>
                </div>

                <div className="rounded-card-lg border border-line bg-card p-5.5">
                  <div className="mb-4.5 flex items-start justify-between">
                    <div>
                      <div className="text-[16px] font-extrabold text-ink">Volume &amp; activité</div>
                      <div className="mt-0.5 text-[12.5px] font-medium text-ink-faint">Collecte mensuelle · 6 mois · FCFA</div>
                    </div>
                    <div className="text-right">
                      <div className="num text-xl font-bold text-ink">{Money.from(tenant.volumeMonth).format()}</div>
                      <div className="text-admin-primary text-[11.5px] font-semibold">ce mois</div>
                    </div>
                  </div>
                  <BarChart
                    points={tenant.volumeSeries.map((point) => ({ label: point.monthLabel, value: point.volume }))}
                    formatValue={(value) => Money.from(value).format()}
                  />
                </div>
              </>
            )}

            <BillingHistoryTable tenantId={tenant.id} invoices={invoices} />
          </div>

          <div className="flex w-85 flex-none flex-col gap-4.5">
            <IdentityContactsCard tenant={tenant} />
            <TenantEventJournal events={events} />
          </div>
        </div>
      </div>
    </div>
  );
};
