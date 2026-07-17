import React from 'react';
import { Link } from 'react-router-dom';
import { InitialsAvatar, Table, type TableColumn } from '@miya/ui';
import { SYNC_ERROR_ALERT_THRESHOLD, SYNC_ERROR_WARN_THRESHOLD, type SyncHealth } from '../../../domain/entities/SyncHealth';

interface SyncHealthTableProps {
  entries: SyncHealth[];
}

const barClass = (errorRate: number): string => {
  if (errorRate >= SYNC_ERROR_ALERT_THRESHOLD) {
    return 'bg-danger';
  }
  if (errorRate >= SYNC_ERROR_WARN_THRESHOLD) {
    return 'bg-amber';
  }
  return 'bg-primary';
};

const textClass = (errorRate: number): string => {
  if (errorRate >= SYNC_ERROR_ALERT_THRESHOLD) {
    return 'text-danger';
  }
  if (errorRate >= SYNC_ERROR_WARN_THRESHOLD) {
    return 'text-amber';
  }
  return 'text-primary';
};

const freshnessLabel = (lastSyncAt: string): string => {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(lastSyncAt).getTime()) / 60_000));
  if (minutes < 60) {
    return `il y a ${minutes} min`;
  }
  const hours = Math.round(minutes / 60);
  return `il y a ${hours} h`;
};

/** Table de santé de synchro — barre d'erreur colorée (vert < 2%, ambre < 8%, rouge au-delà). Maquette 4a. */
export const SyncHealthTable: React.FC<SyncHealthTableProps> = ({ entries }) => {
  const columns: TableColumn<SyncHealth>[] = [
    {
      key: 'tenant',
      header: 'Banque',
      cell: (entry) => (
        <Link to={`/tenants/${entry.tenantId}`} className="flex min-w-0 items-center gap-2.75 hover:underline">
          <InitialsAvatar name={entry.tenantName} />
          <span className="truncate text-[13.5px] font-bold text-ink">{entry.tenantName}</span>
        </Link>
      ),
    },
    {
      key: 'errorRate',
      header: "Taux d'erreur",
      sortValue: (entry) => entry.errorRate,
      cell: (entry) => (
        <div className="flex min-w-32 items-center gap-2.5">
          <div className="h-1.75 flex-1 overflow-hidden rounded-full bg-line">
            <div
              className={['h-full rounded-full transition-[width] duration-500 ease-out', barClass(entry.errorRate)].join(' ')}
              style={{ width: `${Math.min(100, entry.errorRate * 100)}%` }}
            />
          </div>
          <span className={['num text-[12.5px] font-bold', textClass(entry.errorRate)].join(' ')}>
            {(entry.errorRate * 100).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}%
          </span>
        </div>
      ),
    },
    {
      key: 'volume',
      header: 'Synchros',
      sortValue: (entry) => entry.successCount + entry.errorCount,
      cell: (entry) => (
        <span className="num text-[13px] font-bold text-ink">{(entry.successCount + entry.errorCount).toLocaleString('fr-FR')}</span>
      ),
    },
    {
      key: 'lastSyncAt',
      header: 'Dernière synchro',
      cell: (entry) => <span className="text-[12.5px] font-semibold text-ink-muted">{freshnessLabel(entry.lastSyncAt)}</span>,
    },
  ];

  return (
    <Table
      columns={columns}
      rows={entries}
      rowKey={(entry) => entry.tenantId}
      initialSort={{ key: 'errorRate', direction: 'desc' }}
      emptyState={<div className="text-center text-sm font-medium text-ink-faint">Aucune donnée de synchro.</div>}
    />
  );
};
