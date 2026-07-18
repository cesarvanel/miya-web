import React from 'react';
import { Button, InitialsAvatar, SearchInput, Skeleton, Table, Tooltip, type TableColumn } from '@miya/ui';
import { Money } from '@miya/kernel';
import { PageShell } from '@/shared/layout/PageShell';
import { useCanWrite } from '@/shared/guards/useCanWrite';
import { TenantStatus, type Tenant } from '../../../domain/entities/Tenant';
import type { TenantsStatusFilter } from '../../../domain/selectors/Selectors';
import { TenantPlanBadge } from '../composants/TenantPlanBadge';
import { TenantStatusBadge } from '../composants/TenantStatusBadge';
import { useTenantsListPage } from './useTenantsListPage';

const READ_ONLY_TOOLTIP = 'Rôle lecture seule';

const PlusIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 3v10M3 8h10" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);

const EyeIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z" stroke="#16241E" strokeWidth="1.4" />
    <circle cx="8" cy="8" r="2" stroke="#16241E" strokeWidth="1.4" />
  </svg>
);

const SuspendIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="4" y="3.5" width="2.6" height="9" rx="1" fill="#C43B32" />
    <rect x="9.4" y="3.5" width="2.6" height="9" rx="1" fill="#C43B32" />
  </svg>
);

const ReactivateIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4.5 4v8l7-4-7-4z" fill="#0F9E6C" />
  </svg>
);

const CHIPS: { id: TenantsStatusFilter; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'active', label: 'Actives' },
  { id: 'trial', label: 'En essai' },
  { id: 'overdue', label: 'Paiement en retard' },
  { id: 'suspended', label: 'Suspendues' },
];

/** Table des tenants — filtres par statut, tri par volume, drill-down. Maquette 2a. */
export const TenantsListPage: React.FC = () => {
  const {
    search,
    setSearch,
    status,
    setStatus,
    counts,
    tenants,
    totalFiltered,
    isPending,
    page,
    pageCount,
    pageSize,
    setPage,
    goToDetail,
    goToNew,
    openSuspend,
    openReactivate,
  } = useTenantsListPage();
  const canWrite = useCanWrite();

  const columns: TableColumn<Tenant>[] = [
    {
      key: 'name',
      header: 'Banque',
      cell: (tenant) => (
        <div className="flex min-w-0 items-center gap-2.75">
          <InitialsAvatar name={tenant.name} />
          <div className="min-w-0">
            <div className="truncate text-[13.5px] font-bold text-ink">{tenant.name}</div>
            <div className="truncate text-[11.5px] font-medium text-ink-faint">{tenant.city}</div>
          </div>
        </div>
      ),
    },
    { key: 'plan', header: 'Plan', cell: (tenant) => <TenantPlanBadge tenant={tenant} /> },
    {
      key: 'usage',
      header: 'Agents · Clients · Ag.',
      cell: (tenant) => (
        <span className="num text-[13px] font-bold text-ink">
          {tenant.usage.agents.used} · {(tenant.usage.clients.used / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}k · {tenant.usage.agencies.used}
        </span>
      ),
    },
    {
      key: 'volume',
      header: 'Volume · mois',
      sortValue: (tenant) => tenant.volumeMonth,
      cell: (tenant) =>
        tenant.status === TenantStatus.Suspended ? (
          <span className="num text-sm font-bold text-ink-disabled">—</span>
        ) : (
          <span className="num text-sm font-bold text-ink">{Money.from(tenant.volumeMonth).format()}</span>
        ),
    },
    { key: 'status', header: 'Statut', cell: (tenant) => <TenantStatusBadge tenant={tenant} /> },
    {
      key: 'registeredAt',
      header: 'Inscription',
      cell: (tenant) => (
        <span className="num text-[12.5px] font-semibold text-ink-muted">
          {new Date(tenant.registeredAt).toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (tenant) => (
        <div className="flex justify-end gap-1.5">
          <button
            type="button"
            title="Voir"
            onClick={(event) => {
              event.stopPropagation();
              goToDetail(tenant.id);
            }}
            className="flex size-8 cursor-pointer items-center justify-center rounded-[9px] bg-cream-100"
          >
            <EyeIcon />
          </button>
          {(() => {
            const isReactivate = tenant.status === TenantStatus.Suspended;
            const button = (
              <button
                type="button"
                title={isReactivate ? 'Réactiver' : 'Suspendre'}
                disabled={!canWrite}
                onClick={(event) => {
                  event.stopPropagation();
                  if (isReactivate) {
                    openReactivate(tenant.id);
                  } else {
                    openSuspend(tenant.id);
                  }
                }}
                className={[
                  'flex size-8 cursor-pointer items-center justify-center rounded-[9px] disabled:cursor-not-allowed disabled:opacity-40',
                  isReactivate ? 'bg-primary-soft' : 'bg-danger-soft',
                ].join(' ')}
              >
                {isReactivate ? <ReactivateIcon /> : <SuspendIcon />}
              </button>
            );
            return canWrite ? button : <Tooltip label={READ_ONLY_TOOLTIP}>{button}</Tooltip>;
          })()}
        </div>
      ),
    },
  ];

  return (
    <PageShell
      title="Banques clientes"
      subtitle={`${counts.all} tenant${counts.all > 1 ? 's' : ''} · ${counts.active} active${counts.active > 1 ? 's' : ''} · ${counts.trial} en essai · ${counts.suspended} suspendue${counts.suspended > 1 ? 's' : ''}`}
      actions={
        <>
          <SearchInput value={search} onChange={setSearch} placeholder="Rechercher…" aria-label="Rechercher une banque" />
          {canWrite ? (
            <Button variant="primary" onClick={goToNew}>
              <span className="flex items-center gap-2">
                <PlusIcon />
                Nouvelle banque
              </span>
            </Button>
          ) : (
            <Tooltip label={READ_ONLY_TOOLTIP}>
              <Button variant="primary" disabled>
                <span className="flex items-center gap-2">
                  <PlusIcon />
                  Nouvelle banque
                </span>
              </Button>
            </Tooltip>
          )}
        </>
      }
    >
      <div className="mb-4 flex items-center gap-2">
        {CHIPS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => setStatus(chip.id)}
            className={[
              'cursor-pointer rounded-full px-3.5 py-1.75 text-[12.5px] font-bold transition-colors',
              status === chip.id
                ? 'bg-admin-sidebar text-white'
                : 'border border-line bg-card text-ink hover:bg-cream-50',
            ].join(' ')}
          >
            {chip.label} · {counts[chip.id === 'all' ? 'all' : chip.id]}
          </button>
        ))}
      </div>

      {isPending && tenants.length === 0 ? (
        <Skeleton variant="card" />
      ) : (
        <Table
          columns={columns}
          rows={tenants}
          rowKey={(tenant) => tenant.id}
          onRowClick={(tenant) => goToDetail(tenant.id)}
          initialSort={{ key: 'volume', direction: 'desc' }}
          emptyState={<div className="text-center text-sm font-medium text-ink-faint">Aucune banque ne correspond à ces filtres.</div>}
          pagination={{
            page,
            pageCount,
            onChange: setPage,
            totalItems: totalFiltered,
            pageSize,
            itemLabel: 'banques',
          }}
        />
      )}
    </PageShell>
  );
};
